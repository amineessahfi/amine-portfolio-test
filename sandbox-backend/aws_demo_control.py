import io
import json
import os
import re
import sqlite3
import threading
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import boto3
import yaml
from botocore.exceptions import BotoCoreError, ClientError


class AwsDemoControlError(RuntimeError):
    pass


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {'1', 'true', 'yes', 'on'}


def sanitize_identifier(value: str, *, max_length: int = 48) -> str:
    normalized = re.sub(r'[^a-z0-9-]+', '-', value.strip().lower())
    normalized = re.sub(r'-{2,}', '-', normalized).strip('-')
    return normalized[:max_length].strip('-') or 'demo'


def sanitize_glue_name(value: str, *, max_length: int = 48) -> str:
    normalized = re.sub(r'[^a-z0-9_]+', '_', value.strip().lower())
    normalized = re.sub(r'_{2,}', '_', normalized).strip('_')
    return normalized[:max_length].strip('_') or 'demo'


def now_utc() -> int:
    return int(time.time())


@dataclass(frozen=True)
class DemoControlSettings:
    enabled: bool
    admin_token: str
    specs_dir: Path
    db_path: Path
    cleanup_interval_seconds: int
    default_ttl_minutes: int
    min_ttl_minutes: int
    max_ttl_minutes: int
    base_prefix: str
    region_allowlist: tuple[str, ...]

    @classmethod
    def from_env(cls, *, base_dir: Path) -> 'DemoControlSettings':
        specs_dir = Path(os.getenv('AWS_DEMO_SPECS_DIR', str(base_dir / 'demo-specs'))).expanduser()
        db_path = Path(
            os.getenv('AWS_DEMO_STATE_DB_PATH', str(base_dir / 'aws-demo-control.sqlite3'))
        ).expanduser()
        raw_allowlist = os.getenv('AWS_DEMO_REGION_ALLOWLIST', 'eu-west-3')
        allowlist = tuple(region.strip() for region in raw_allowlist.split(',') if region.strip())
        return cls(
            enabled=env_flag('AWS_DEMO_ENABLED', False),
            admin_token=os.getenv('AWS_DEMO_ADMIN_TOKEN', '').strip(),
            specs_dir=specs_dir,
            db_path=db_path,
            cleanup_interval_seconds=max(30, int(os.getenv('AWS_DEMO_CLEANUP_INTERVAL_SECONDS', '300'))),
            default_ttl_minutes=max(1, int(os.getenv('AWS_DEMO_DEFAULT_TTL_MINUTES', '10'))),
            min_ttl_minutes=max(1, int(os.getenv('AWS_DEMO_TTL_MIN_MINUTES', '10'))),
            max_ttl_minutes=max(1, int(os.getenv('AWS_DEMO_TTL_MAX_MINUTES', '30'))),
            base_prefix=sanitize_identifier(os.getenv('AWS_DEMO_BASE_PREFIX', 'ae-demo'), max_length=18),
            region_allowlist=allowlist,
        )


class AwsDemoManager:
    def __init__(self, settings: DemoControlSettings):
        self.settings = settings
        self._lock = threading.Lock()
        self.settings.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def authorize(self, token: str | None) -> bool:
        return bool(self.settings.admin_token) and token == self.settings.admin_token

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.settings.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_db(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS demo_runs (
                    id TEXT PRIMARY KEY,
                    spec_name TEXT NOT NULL,
                    region TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at INTEGER NOT NULL,
                    expires_at INTEGER NOT NULL,
                    destroyed_at INTEGER,
                    ttl_minutes INTEGER NOT NULL,
                    resources_json TEXT NOT NULL DEFAULT '{}',
                    outputs_json TEXT NOT NULL DEFAULT '{}',
                    error_message TEXT,
                    destroy_reason TEXT
                )
                """
            )
            connection.commit()

    def _read_yaml_spec(self, spec_name: str) -> dict[str, Any]:
        spec_path = self.settings.specs_dir / f'{sanitize_identifier(spec_name)}.yaml'
        if not spec_path.exists():
            raise AwsDemoControlError(f'Unknown demo spec: {spec_name}')

        try:
            payload = yaml.safe_load(spec_path.read_text(encoding='utf-8'))
        except yaml.YAMLError as exc:
            raise AwsDemoControlError(f'Invalid YAML in {spec_path.name}: {exc}') from exc

        if not isinstance(payload, dict):
            raise AwsDemoControlError(f'Demo spec {spec_path.name} must contain a mapping at the top level.')
        return payload

    def _validated_spec(self, spec_name: str) -> dict[str, Any]:
        payload = self._read_yaml_spec(spec_name)
        template = str(payload.get('template') or '').strip()
        if template != 'lowcost-data-platform':
            raise AwsDemoControlError(
                f'Unsupported demo template {template!r}. Only lowcost-data-platform is enabled.'
            )

        region = str(payload.get('region') or '').strip()
        if not region:
            raise AwsDemoControlError('Demo spec is missing region.')
        if self.settings.region_allowlist and region not in self.settings.region_allowlist:
            raise AwsDemoControlError(
                f'Region {region!r} is not allowed. Allowed regions: {", ".join(self.settings.region_allowlist)}'
            )

        payload['name'] = sanitize_identifier(str(payload.get('name') or spec_name), max_length=32)
        payload['region'] = region
        payload['defaultTtlMinutes'] = int(payload.get('defaultTtlMinutes') or self.settings.default_ttl_minutes)
        payload['limits'] = payload.get('limits') or {}
        payload['tags'] = payload.get('tags') or {}
        payload['resources'] = payload.get('resources') or {}
        return payload

    def list_specs(self) -> list[dict[str, Any]]:
        if not self.settings.specs_dir.exists():
            return []

        specs: list[dict[str, Any]] = []
        for spec_path in sorted(self.settings.specs_dir.glob('*.yaml')):
            payload = self._validated_spec(spec_path.stem)
            specs.append(
                {
                    'name': payload['name'],
                    'description': str(payload.get('description') or '').strip(),
                    'template': payload['template'],
                    'region': payload['region'],
                    'defaultTtlMinutes': int(payload['defaultTtlMinutes']),
                    'limits': {
                        'minTtlMinutes': max(
                            self.settings.min_ttl_minutes,
                            int(payload['limits'].get('minTtlMinutes') or self.settings.min_ttl_minutes),
                        ),
                        'maxTtlMinutes': min(
                            self.settings.max_ttl_minutes,
                            int(payload['limits'].get('maxTtlMinutes') or self.settings.max_ttl_minutes),
                        ),
                    },
                    'tags': payload['tags'],
                    'resources': payload['resources'],
                }
            )
        return specs

    def list_runs(self) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, spec_name, region, status, created_at, expires_at, destroyed_at,
                       ttl_minutes, resources_json, outputs_json, error_message, destroy_reason
                FROM demo_runs
                ORDER BY created_at DESC
                """
            ).fetchall()
        return [self._row_to_dict(row) for row in rows]

    def get_run(self, demo_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT id, spec_name, region, status, created_at, expires_at, destroyed_at,
                       ttl_minutes, resources_json, outputs_json, error_message, destroy_reason
                FROM demo_runs
                WHERE id = ?
                """,
                (demo_id,),
            ).fetchone()
        return self._row_to_dict(row) if row else None

    def inspect_demo_resources(self, demo_id: str) -> dict[str, Any]:
        try:
            run = self.get_run(demo_id)
            if not run:
                raise AwsDemoControlError(f'Unknown demo run: {demo_id}')

            resources = run['resources']
            region = run['region']
            session = self._aws_session(region)
            s3 = session.client('s3')
            sqs = session.client('sqs')
            lambda_client = session.client('lambda')
            events = session.client('events')
            glue = session.client('glue')

            bucket_name = resources.get('bucketName')
            queue_url = resources.get('queueUrl')
            dlq_url = resources.get('deadLetterQueueUrl')
            lambda_name = resources.get('lambdaName')
            rule_name = resources.get('eventRuleName')
            database_name = resources.get('glueDatabase')
            table_name = resources.get('glueTable')
            athena_output_location = resources.get('athenaOutputLocation')

            details: dict[str, Any] = {
                'bucket': {'name': bucket_name, 'objects': [], 'latestObject': None},
                'queue': {'name': resources.get('queueName'), 'approximateMessages': None, 'approximateInFlight': None},
                'deadLetterQueue': {
                    'name': resources.get('deadLetterQueueName'),
                    'approximateMessages': None,
                    'approximateInFlight': None,
                },
                'lambda': {'name': lambda_name, 'runtime': '', 'timeout': None, 'memorySize': None, 'lastModified': ''},
                'eventBridge': {'name': rule_name, 'scheduleExpression': '', 'state': ''},
                'glue': {'database': database_name, 'tables': []},
                'athena': {
                    'database': database_name,
                    'table': table_name,
                    'queryExecutionId': resources.get('athenaQueryExecutionId'),
                    'previewColumns': [],
                    'previewRows': [],
                },
            }

            if bucket_name:
                listing = s3.list_objects_v2(Bucket=bucket_name, MaxKeys=50)
                contents = listing.get('Contents', [])
                sorted_contents = sorted(contents, key=lambda item: item['LastModified'], reverse=True)
                details['bucket']['objects'] = [
                    {
                        'key': item['Key'],
                        'size': item['Size'],
                        'lastModified': int(item['LastModified'].timestamp()),
                    }
                    for item in sorted_contents[:12]
                ]
                if sorted_contents:
                    latest_key = sorted_contents[0]['Key']
                    latest_object = s3.get_object(Bucket=bucket_name, Key=latest_key)
                    preview_text = latest_object['Body'].read(500).decode('utf-8', 'ignore')
                    details['bucket']['latestObject'] = {
                        'key': latest_key,
                        'preview': preview_text,
                    }

            for queue_url_value, key in ((queue_url, 'queue'), (dlq_url, 'deadLetterQueue')):
                if queue_url_value:
                    queue_attributes = sqs.get_queue_attributes(
                        QueueUrl=queue_url_value,
                        AttributeNames=['ApproximateNumberOfMessages', 'ApproximateNumberOfMessagesNotVisible'],
                    )['Attributes']
                    details[key]['approximateMessages'] = int(queue_attributes.get('ApproximateNumberOfMessages', '0'))
                    details[key]['approximateInFlight'] = int(
                        queue_attributes.get('ApproximateNumberOfMessagesNotVisible', '0')
                    )

            if lambda_name:
                function_configuration = lambda_client.get_function_configuration(FunctionName=lambda_name)
                details['lambda'].update(
                    {
                        'runtime': function_configuration.get('Runtime', ''),
                        'timeout': function_configuration.get('Timeout'),
                        'memorySize': function_configuration.get('MemorySize'),
                        'lastModified': function_configuration.get('LastModified', ''),
                    }
                )

            if rule_name:
                rule = events.describe_rule(Name=rule_name)
                details['eventBridge'].update(
                    {
                        'scheduleExpression': rule.get('ScheduleExpression', ''),
                        'state': rule.get('State', ''),
                    }
                )

            if database_name:
                tables = glue.get_tables(DatabaseName=database_name, MaxResults=10).get('TableList', [])
                details['glue']['tables'] = [table.get('Name', '') for table in tables]

            if database_name and table_name and athena_output_location:
                athena_preview = self._athena_preview(
                    region=region,
                    database_name=database_name,
                    table_name=table_name,
                    output_location=athena_output_location,
                )
                details['athena'].update(athena_preview)

            return details
        except AwsDemoControlError:
            raise
        except ClientError as exc:
            code = exc.response.get('Error', {}).get('Code', 'Unknown')
            message = exc.response.get('Error', {}).get('Message', str(exc))
            raise AwsDemoControlError(f'AWS error {code}: {message}') from exc
        except BotoCoreError as exc:
            raise AwsDemoControlError(f'AWS SDK error: {exc}') from exc

    def invoke_demo_lambda(self, demo_id: str, *, source: str = 'manual-ui', payload_text: str = '') -> dict[str, Any]:
        try:
            run = self.get_run(demo_id)
            if not run:
                raise AwsDemoControlError(f'Unknown demo run: {demo_id}')

            lambda_name = run['resources'].get('lambdaName')
            if not lambda_name:
                raise AwsDemoControlError(f'Demo run {demo_id} does not have a Lambda function.')

            session = self._aws_session(run['region'])
            lambda_client = session.client('lambda')
            response = lambda_client.invoke(
                FunctionName=lambda_name,
                InvocationType='RequestResponse',
                Payload=json.dumps({'source': source, 'payloadText': payload_text}).encode('utf-8'),
            )
            payload_text = response['Payload'].read().decode('utf-8', 'ignore')
            payload_json: Any
            try:
                payload_json = json.loads(payload_text) if payload_text else {}
            except json.JSONDecodeError:
                payload_json = {'raw': payload_text}

            return {
                'statusCode': response.get('StatusCode'),
                'functionError': response.get('FunctionError'),
                'payload': payload_json,
            }
        except AwsDemoControlError:
            raise
        except ClientError as exc:
            code = exc.response.get('Error', {}).get('Code', 'Unknown')
            message = exc.response.get('Error', {}).get('Message', str(exc))
            raise AwsDemoControlError(f'AWS error {code}: {message}') from exc
        except BotoCoreError as exc:
            raise AwsDemoControlError(f'AWS SDK error: {exc}') from exc

    def seed_demo_bucket(self, demo_id: str, *, source: str = 'manual-seed', payload_text: str = '') -> dict[str, Any]:
        try:
            run = self.get_run(demo_id)
            if not run:
                raise AwsDemoControlError(f'Unknown demo run: {demo_id}')

            bucket_name = run['resources'].get('bucketName')
            if not bucket_name:
                raise AwsDemoControlError(f'Demo run {demo_id} does not have a bucket.')

            session = self._aws_session(run['region'])
            s3 = session.client('s3')
            event_id = os.urandom(8).hex()
            timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            key = f'curated/events/manual-seed-{int(time.time())}-{event_id}.csv'
            payload_escaped = payload_text.replace('"', '""')
            body = (
                'event_id,event_type,source,ingested_at,payload_text\n'
                f'"{event_id}","demo.manual_insert","{source}","{timestamp}","{payload_escaped}"\n'
            )
            s3.put_object(
                Bucket=bucket_name,
                Key=key,
                Body=body.encode('utf-8'),
                ContentType='text/csv',
            )
            return {
                'bucketName': bucket_name,
                'key': key,
                'eventId': event_id,
                'source': source,
                'payloadText': payload_text,
            }
        except AwsDemoControlError:
            raise
        except ClientError as exc:
            code = exc.response.get('Error', {}).get('Code', 'Unknown')
            message = exc.response.get('Error', {}).get('Message', str(exc))
            raise AwsDemoControlError(f'AWS error {code}: {message}') from exc
        except BotoCoreError as exc:
            raise AwsDemoControlError(f'AWS SDK error: {exc}') from exc

    def create_demo(self, spec_name: str, ttl_minutes: int | None = None) -> dict[str, Any]:
        if not self.settings.enabled:
            raise AwsDemoControlError('AWS demo control plane is disabled on this host.')

        with self._lock:
            spec = self._validated_spec(spec_name)
            limits = spec['limits']
            spec_min_ttl = max(
                self.settings.min_ttl_minutes,
                int(limits.get('minTtlMinutes') or self.settings.min_ttl_minutes),
            )
            spec_max_ttl = min(
                self.settings.max_ttl_minutes,
                int(limits.get('maxTtlMinutes') or self.settings.max_ttl_minutes),
            )
            effective_ttl = ttl_minutes if ttl_minutes is not None else int(spec['defaultTtlMinutes'])
            if effective_ttl < spec_min_ttl or effective_ttl > spec_max_ttl:
                raise AwsDemoControlError(
                    f'TTL must be between {spec_min_ttl} and {spec_max_ttl} minutes for spec {spec["name"]}.'
                )

            demo_suffix = time.strftime('%Y%m%d%H%M%S', time.gmtime())
            demo_id = f'{spec["name"]}-{demo_suffix}-{os.urandom(2).hex()}'
            created_at = now_utc()
            expires_at = created_at + effective_ttl * 60

            with self._connect() as connection:
                connection.execute(
                    """
                    INSERT INTO demo_runs (
                        id, spec_name, region, status, created_at, expires_at, ttl_minutes, resources_json, outputs_json
                    )
                    VALUES (?, ?, ?, 'creating', ?, ?, ?, '{}', '{}')
                    """,
                    (demo_id, spec['name'], spec['region'], created_at, expires_at, effective_ttl),
                )
                connection.commit()

            try:
                result = self._provision_lowcost_data_platform(demo_id=demo_id, spec=spec, expires_at=expires_at)
            except Exception as exc:
                self._mark_failed(demo_id, str(exc))
                raise

            with self._connect() as connection:
                connection.execute(
                    """
                    UPDATE demo_runs
                    SET status = 'ready',
                        resources_json = ?,
                        outputs_json = ?,
                        error_message = NULL
                    WHERE id = ?
                    """,
                    (json.dumps(result['resources']), json.dumps(result['outputs']), demo_id),
                )
                connection.commit()

            run = self.get_run(demo_id)
            if not run:
                raise AwsDemoControlError(f'Created demo {demo_id} but could not reload its state.')
            return run

    def destroy_demo(self, demo_id: str, *, reason: str = 'manual') -> dict[str, Any]:
        if not self.settings.enabled:
            raise AwsDemoControlError('AWS demo control plane is disabled on this host.')

        with self._lock:
            run = self.get_run(demo_id)
            if not run:
                raise AwsDemoControlError(f'Unknown demo run: {demo_id}')

            if run['status'] == 'destroyed':
                return run

            resources = run['resources']
            region = run['region']
            self._destroy_resources(region=region, resources=resources)

            destroyed_at = now_utc()
            with self._connect() as connection:
                connection.execute(
                    """
                    UPDATE demo_runs
                    SET status = 'destroyed',
                        destroyed_at = ?,
                        destroy_reason = ?,
                        error_message = NULL
                    WHERE id = ?
                    """,
                    (destroyed_at, reason, demo_id),
                )
                connection.commit()

            latest = self.get_run(demo_id)
            if not latest:
                raise AwsDemoControlError(f'Destroyed demo {demo_id} but could not reload its state.')
            return latest

    def cleanup_expired(self) -> list[str]:
        if not self.settings.enabled:
            return []

        expired_ids: list[str] = []
        cutoff = now_utc()
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id
                FROM demo_runs
                WHERE status IN ('creating', 'ready', 'failed')
                  AND expires_at <= ?
                ORDER BY expires_at ASC
                """,
                (cutoff,),
            ).fetchall()

        for row in rows:
            demo_id = row['id']
            self.destroy_demo(demo_id, reason='ttl_expired')
            expired_ids.append(demo_id)
        return expired_ids

    def _mark_failed(self, demo_id: str, message: str) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                UPDATE demo_runs
                SET status = 'failed',
                    error_message = ?
                WHERE id = ?
                """,
                (message, demo_id),
            )
            connection.commit()

    def _row_to_dict(self, row: sqlite3.Row) -> dict[str, Any]:
        return {
            'id': row['id'],
            'specName': row['spec_name'],
            'region': row['region'],
            'status': row['status'],
            'createdAt': row['created_at'],
            'expiresAt': row['expires_at'],
            'destroyedAt': row['destroyed_at'],
            'ttlMinutes': row['ttl_minutes'],
            'resources': json.loads(row['resources_json'] or '{}'),
            'outputs': json.loads(row['outputs_json'] or '{}'),
            'error': row['error_message'],
            'destroyReason': row['destroy_reason'],
        }

    def _aws_session(self, region: str):
        return boto3.session.Session(region_name=region)

    def _athena_preview(
        self,
        *,
        region: str,
        database_name: str,
        table_name: str,
        output_location: str,
        limit: int = 10,
    ) -> dict[str, Any]:
        session = self._aws_session(region)
        athena = session.client('athena')
        query = athena.start_query_execution(
            QueryString=(
                f'SELECT * FROM "{database_name}"."{table_name}" '
                f'ORDER BY ingested_at DESC LIMIT {max(1, min(limit, 20))}'
            ),
            ResultConfiguration={'OutputLocation': output_location},
        )['QueryExecutionId']

        state = None
        reason = None
        for _ in range(30):
            execution = athena.get_query_execution(QueryExecutionId=query)['QueryExecution']
            state = execution['Status']['State']
            reason = execution['Status'].get('StateChangeReason')
            if state in {'SUCCEEDED', 'FAILED', 'CANCELLED'}:
                break
            time.sleep(2)

        if state != 'SUCCEEDED':
            raise AwsDemoControlError(
                f'Athena preview query {query} did not succeed: {state} ({reason or "no reason"})'
            )

        rows = athena.get_query_results(QueryExecutionId=query)['ResultSet']['Rows']
        if not rows:
            return {'queryExecutionId': query, 'previewColumns': [], 'previewRows': []}

        columns = [item.get('VarCharValue', '') for item in rows[0].get('Data', [])]
        preview_rows = [
            [item.get('VarCharValue', '') for item in row.get('Data', [])]
            for row in rows[1:]
        ]
        return {
            'queryExecutionId': query,
            'previewColumns': columns,
            'previewRows': preview_rows,
        }

    def _provision_lowcost_data_platform(
        self,
        *,
        demo_id: str,
        spec: dict[str, Any],
        expires_at: int,
    ) -> dict[str, Any]:
        region = spec['region']
        session = self._aws_session(region)
        sts = session.client('sts')
        account_id = sts.get_caller_identity()['Account']

        prefix = sanitize_identifier(f'{self.settings.base_prefix}-{spec["name"]}', max_length=24)
        short_id = sanitize_identifier(demo_id, max_length=36)
        bucket_name = sanitize_identifier(f'{prefix}-{short_id}-{account_id}-{region}', max_length=63)
        role_name = sanitize_identifier(f'{prefix}-{short_id}-lambda-role', max_length=64)
        function_name = sanitize_identifier(f'{prefix}-{short_id}-ingest', max_length=64)
        rule_name = sanitize_identifier(f'{prefix}-{short_id}-schedule', max_length=64)
        dlq_name = sanitize_identifier(f'{prefix}-{short_id}-dlq', max_length=64)
        queue_name = sanitize_identifier(f'{prefix}-{short_id}-queue', max_length=64)
        database_name = sanitize_glue_name(f'{prefix}_{short_id}_db'.replace('-', '_'), max_length=63)
        table_name = 'curated_events'
        tags = {str(key): str(value) for key, value in spec['tags'].items()}
        tags.update({'DemoRunId': demo_id, 'ManagedBy': 'sandbox-backend'})

        s3 = session.client('s3')
        sqs = session.client('sqs')
        iam = session.client('iam')
        lambda_client = session.client('lambda')
        events = session.client('events')
        glue = session.client('glue')
        athena = session.client('athena')

        resources: dict[str, Any] = {'accountId': account_id}
        try:
            create_bucket_kwargs: dict[str, Any] = {'Bucket': bucket_name}
            if region != 'us-east-1':
                create_bucket_kwargs['CreateBucketConfiguration'] = {'LocationConstraint': region}
            s3.create_bucket(**create_bucket_kwargs)
            resources['bucketName'] = bucket_name
            s3.put_public_access_block(
                Bucket=bucket_name,
                PublicAccessBlockConfiguration={
                    'BlockPublicAcls': True,
                    'IgnorePublicAcls': True,
                    'BlockPublicPolicy': True,
                    'RestrictPublicBuckets': True,
                },
            )
            s3.put_bucket_encryption(
                Bucket=bucket_name,
                ServerSideEncryptionConfiguration={
                    'Rules': [{'ApplyServerSideEncryptionByDefault': {'SSEAlgorithm': 'AES256'}}]
                },
            )
            s3.put_bucket_tagging(
                Bucket=bucket_name,
                Tagging={'TagSet': [{'Key': key, 'Value': value} for key, value in tags.items()]},
            )

            dlq_response = sqs.create_queue(
                QueueName=dlq_name,
                tags=tags,
                Attributes={'MessageRetentionPeriod': str(14 * 24 * 60 * 60)},
            )
            dlq_url = dlq_response['QueueUrl']
            dlq_arn = sqs.get_queue_attributes(QueueUrl=dlq_url, AttributeNames=['QueueArn'])['Attributes']['QueueArn']
            resources['deadLetterQueueName'] = dlq_name
            resources['deadLetterQueueUrl'] = dlq_url
            resources['deadLetterQueueArn'] = dlq_arn

            queue_response = sqs.create_queue(
                QueueName=queue_name,
                tags=tags,
                Attributes={
                    'VisibilityTimeout': '60',
                    'RedrivePolicy': json.dumps(
                        {
                            'deadLetterTargetArn': dlq_arn,
                            'maxReceiveCount': '3',
                        }
                    ),
                },
            )
            queue_url = queue_response['QueueUrl']
            queue_arn = sqs.get_queue_attributes(QueueUrl=queue_url, AttributeNames=['QueueArn'])['Attributes']['QueueArn']
            resources['queueName'] = queue_name
            resources['queueUrl'] = queue_url
            resources['queueArn'] = queue_arn

            assume_role_policy = {
                'Version': '2012-10-17',
                'Statement': [
                    {
                        'Effect': 'Allow',
                        'Principal': {'Service': 'lambda.amazonaws.com'},
                        'Action': 'sts:AssumeRole',
                    }
                ],
            }
            role = iam.create_role(
                RoleName=role_name,
                AssumeRolePolicyDocument=json.dumps(assume_role_policy),
                Description=f'Short-lived demo role for {demo_id}',
                Tags=[{'Key': key, 'Value': value} for key, value in tags.items()],
            )['Role']
            resources['roleName'] = role_name
            iam.attach_role_policy(
                RoleName=role_name,
                PolicyArn='arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            )
            inline_policy_name = 'demo-runtime-access'
            resources['inlinePolicyName'] = inline_policy_name
            inline_policy_document = {
                'Version': '2012-10-17',
                'Statement': [
                    {
                        'Effect': 'Allow',
                        'Action': ['s3:PutObject', 's3:GetObject', 's3:ListBucket'],
                        'Resource': [
                            f'arn:aws:s3:::{bucket_name}',
                            f'arn:aws:s3:::{bucket_name}/*',
                        ],
                    },
                    {
                        'Effect': 'Allow',
                        'Action': ['sqs:SendMessage'],
                        'Resource': [queue_arn, dlq_arn],
                    },
                ],
            }
            iam.put_role_policy(
                RoleName=role_name,
                PolicyName=inline_policy_name,
                PolicyDocument=json.dumps(inline_policy_document),
            )

            for _ in range(10):
                try:
                    iam.get_role(RoleName=role_name)
                    break
                except ClientError as exc:
                    if exc.response.get('Error', {}).get('Code') != 'NoSuchEntity':
                        raise
                    time.sleep(2)
            else:
                raise AwsDemoControlError(f'IAM role {role_name} did not become available in time.')

            lambda_zip = self._build_lambda_zip()
            function = None
            for attempt in range(12):
                try:
                    function = lambda_client.create_function(
                        FunctionName=function_name,
                        Runtime='python3.11',
                        Role=role['Arn'],
                        Handler='lambda_function.handler',
                        Timeout=30,
                        MemorySize=128,
                        Environment={
                            'Variables': {
                                'BUCKET_NAME': bucket_name,
                                'OUTPUT_PREFIX': 'curated/events',
                                'QUEUE_URL': queue_url,
                            }
                        },
                        Code={'ZipFile': lambda_zip},
                        Publish=True,
                        Tags=tags,
                    )
                    break
                except ClientError as exc:
                    error_code = exc.response.get('Error', {}).get('Code')
                    error_message = exc.response.get('Error', {}).get('Message', '')
                    role_not_ready = (
                        error_code == 'InvalidParameterValueException'
                        and 'cannot be assumed by Lambda' in error_message
                    )
                    if not role_not_ready or attempt == 11:
                        raise
                    time.sleep(5)

            if not function:
                raise AwsDemoControlError(f'Lambda {function_name} could not be created after IAM propagation retries.')
            resources['lambdaName'] = function_name
            resources['lambdaArn'] = function['FunctionArn']

            for _ in range(20):
                configuration = lambda_client.get_function_configuration(FunctionName=function_name)
                state = configuration.get('State')
                if state == 'Active':
                    break
                if state == 'Failed':
                    raise AwsDemoControlError(
                        f'Lambda {function_name} failed to become active: {configuration.get("StateReason", "unknown")}'
                    )
                time.sleep(2)
            else:
                raise AwsDemoControlError(f'Lambda {function_name} did not become active in time.')

            schedule_expression = (
                spec['resources'].get('lambda', {}) or {}
            ).get('scheduleExpression', 'rate(1 day)')
            rule = events.put_rule(
                Name=rule_name,
                ScheduleExpression=schedule_expression,
                State='ENABLED',
                Description=f'Short-lived scheduled demo trigger for {demo_id}',
                Tags=[{'Key': key, 'Value': value} for key, value in tags.items()],
            )
            resources['eventRuleName'] = rule_name
            resources['eventRuleArn'] = rule['RuleArn']
            lambda_client.add_permission(
                FunctionName=function_name,
                StatementId='allow-eventbridge',
                Action='lambda:InvokeFunction',
                Principal='events.amazonaws.com',
                SourceArn=rule['RuleArn'],
            )
            events.put_targets(
                Rule=rule_name,
                Targets=[
                    {
                        'Id': 'invoke-lambda',
                        'Arn': function['FunctionArn'],
                    }
                ],
            )

            glue.create_database(
                DatabaseInput={
                    'Name': database_name,
                    'Description': f'Short-lived demo catalog for {demo_id}',
                }
            )
            resources['glueDatabase'] = database_name
            glue.create_table(
                DatabaseName=database_name,
                TableInput={
                    'Name': table_name,
                    'TableType': 'EXTERNAL_TABLE',
                    'StorageDescriptor': {
                        'Columns': [
                            {'Name': 'event_id', 'Type': 'string'},
                            {'Name': 'event_type', 'Type': 'string'},
                            {'Name': 'source', 'Type': 'string'},
                            {'Name': 'ingested_at', 'Type': 'string'},
                            {'Name': 'payload_text', 'Type': 'string'},
                        ],
                        'Location': f's3://{bucket_name}/curated/events/',
                        'InputFormat': 'org.apache.hadoop.mapred.TextInputFormat',
                        'OutputFormat': 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
                        'SerdeInfo': {
                            'SerializationLibrary': 'org.apache.hadoop.hive.serde2.OpenCSVSerde',
                            'Parameters': {'separatorChar': ',', 'quoteChar': '"'},
                        },
                    },
                    'Parameters': {
                        'classification': 'csv',
                        'skip.header.line.count': '1',
                    },
                },
            )
            resources['glueTable'] = table_name

            invoke_response = lambda_client.invoke(
                FunctionName=function_name,
                InvocationType='RequestResponse',
                Payload=json.dumps({'source': 'bootstrap'}).encode('utf-8'),
            )
            payload_bytes = invoke_response['Payload'].read()
            if invoke_response['StatusCode'] != 200 or invoke_response.get('FunctionError'):
                raise AwsDemoControlError(
                    f'Lambda bootstrap invoke failed: {payload_bytes.decode("utf-8")}'
                )

            athena_output_prefix = f's3://{bucket_name}/athena-results/'
            query = athena.start_query_execution(
                QueryString=f'SELECT count(*) AS row_count FROM "{database_name}"."{table_name}"',
                ResultConfiguration={'OutputLocation': athena_output_prefix},
            )['QueryExecutionId']
            resources['athenaOutputLocation'] = athena_output_prefix
            resources['athenaQueryExecutionId'] = query

            athena_state = None
            athena_reason = None
            for _ in range(30):
                execution = athena.get_query_execution(QueryExecutionId=query)['QueryExecution']
                athena_state = execution['Status']['State']
                athena_reason = execution['Status'].get('StateChangeReason')
                if athena_state in {'SUCCEEDED', 'FAILED', 'CANCELLED'}:
                    break
                time.sleep(2)

            if athena_state != 'SUCCEEDED':
                raise AwsDemoControlError(
                    f'Athena validation query {query} did not succeed: {athena_state} ({athena_reason or "no reason"})'
                )

            result_rows = athena.get_query_results(QueryExecutionId=query)['ResultSet']['Rows']
            row_count = int(result_rows[1]['Data'][0].get('VarCharValue', '0')) if len(result_rows) > 1 else 0

            outputs = {
                'template': spec['template'],
                'specName': spec['name'],
                'region': region,
                'bucketName': bucket_name,
                'queueUrl': queue_url,
                'deadLetterQueueUrl': dlq_url,
                'lambdaName': function_name,
                'eventRuleName': rule_name,
                'glueDatabase': database_name,
                'glueTable': table_name,
                'athenaQueryExecutionId': query,
                'athenaRowCount': row_count,
                'expiresAt': expires_at,
            }
            return {'resources': resources, 'outputs': outputs}
        except Exception as exc:
            self._destroy_resources(region=region, resources=resources)
            if isinstance(exc, AwsDemoControlError):
                raise
            if isinstance(exc, ClientError):
                code = exc.response.get('Error', {}).get('Code', 'Unknown')
                message = exc.response.get('Error', {}).get('Message', str(exc))
                raise AwsDemoControlError(f'AWS error {code}: {message}') from exc
            if isinstance(exc, BotoCoreError):
                raise AwsDemoControlError(f'AWS SDK error: {exc}') from exc
            raise AwsDemoControlError(str(exc)) from exc

    def _destroy_resources(self, *, region: str, resources: dict[str, Any]) -> None:
        if not resources:
            return

        session = self._aws_session(region)
        s3 = session.client('s3')
        sqs = session.client('sqs')
        iam = session.client('iam')
        lambda_client = session.client('lambda')
        events = session.client('events')
        glue = session.client('glue')

        rule_name = resources.get('eventRuleName')
        lambda_name = resources.get('lambdaName')
        if rule_name:
            with self._ignore_aws_error('ResourceNotFoundException'):
                events.remove_targets(Rule=rule_name, Ids=['invoke-lambda'])
            with self._ignore_aws_error('ResourceNotFoundException'):
                if lambda_name:
                    lambda_client.remove_permission(FunctionName=lambda_name, StatementId='allow-eventbridge')
            with self._ignore_aws_error('ResourceNotFoundException'):
                events.delete_rule(Name=rule_name)

        if lambda_name:
            with self._ignore_aws_error('ResourceNotFoundException'):
                lambda_client.delete_function(FunctionName=lambda_name)

        database_name = resources.get('glueDatabase')
        table_name = resources.get('glueTable')
        if database_name and table_name:
            with self._ignore_aws_error('EntityNotFoundException'):
                glue.delete_table(DatabaseName=database_name, Name=table_name)
        if database_name:
            with self._ignore_aws_error('EntityNotFoundException'):
                glue.delete_database(Name=database_name)

        bucket_name = resources.get('bucketName')
        if bucket_name:
            with self._ignore_aws_error('NoSuchBucket'):
                paginator = s3.get_paginator('list_objects_v2')
                for page in paginator.paginate(Bucket=bucket_name):
                    objects = [{'Key': item['Key']} for item in page.get('Contents', [])]
                    if objects:
                        s3.delete_objects(Bucket=bucket_name, Delete={'Objects': objects})
                s3.delete_bucket(Bucket=bucket_name)

        for queue_url_key in ('queueUrl', 'deadLetterQueueUrl'):
            queue_url = resources.get(queue_url_key)
            if queue_url:
                with self._ignore_aws_error('AWS.SimpleQueueService.NonExistentQueue'):
                    sqs.delete_queue(QueueUrl=queue_url)

        role_name = resources.get('roleName')
        inline_policy_name = resources.get('inlinePolicyName')
        if role_name:
            if inline_policy_name:
                with self._ignore_aws_error('NoSuchEntity'):
                    iam.delete_role_policy(RoleName=role_name, PolicyName=inline_policy_name)
            with self._ignore_aws_error('NoSuchEntity'):
                iam.detach_role_policy(
                    RoleName=role_name,
                    PolicyArn='arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                )
            with self._ignore_aws_error('NoSuchEntity'):
                iam.delete_role(RoleName=role_name)

    def _build_lambda_zip(self) -> bytes:
        source = """
import csv
import io
import json
import os
import time
import uuid

import boto3


def handler(event, _context):
    bucket_name = os.environ['BUCKET_NAME']
    output_prefix = os.environ.get('OUTPUT_PREFIX', 'curated/events').strip('/')
    queue_url = os.environ.get('QUEUE_URL')
    now_value = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    source = 'bootstrap'
    payload_text = ''
    if isinstance(event, dict):
        source = str(event.get('source') or source)
        payload_text = str(event.get('payloadText') or '')

    row = {
        'event_id': str(uuid.uuid4()),
        'event_type': 'demo.ingested',
        'source': source,
        'ingested_at': now_value,
        'payload_text': payload_text,
    }
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=['event_id', 'event_type', 'source', 'ingested_at', 'payload_text'])
    writer.writeheader()
    writer.writerow(row)

    key = f"{output_prefix}/{int(time.time())}-{row['event_id']}.csv"
    boto3.client('s3').put_object(
        Bucket=bucket_name,
        Key=key,
        Body=buffer.getvalue().encode('utf-8'),
        ContentType='text/csv',
    )

    if queue_url:
        boto3.client('sqs').send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({'event_id': row['event_id'], 's3_key': key, 'source': source, 'payload_text': payload_text}),
        )

    return {'status': 'ok', 'bucket': bucket_name, 'key': key, 'payload_text': payload_text}
"""
        payload = io.BytesIO()
        with zipfile.ZipFile(payload, mode='w', compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('lambda_function.py', source.strip() + '\n')
        return payload.getvalue()

    class _ignore_aws_error:
        def __init__(self, *codes: str):
            self.codes = set(codes)

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, _tb):
            if exc_type is None:
                return False
            if isinstance(exc, ClientError):
                code = exc.response.get('Error', {}).get('Code')
                return code in self.codes
            if isinstance(exc, BotoCoreError):
                return False
            return False
