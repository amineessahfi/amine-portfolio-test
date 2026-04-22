# AWS Demo Control Plane

The sandbox backend now includes both:

- a token-protected operator control plane for admin use
- a fixed public launcher used by the portfolio AWS demo page

## What it does

- reads allowlisted specs from `sandbox-backend/demo-specs/*.yaml`
- creates a short-lived AWS demo stack with:
  - S3 bucket
  - SQS queue + DLQ
  - Lambda ingest function
  - EventBridge schedule
  - Glue database/table
  - Athena validation query
- stores run state in SQLite on the host
- destroys expired runs automatically on TTL
- supports a public portfolio launcher with a fixed 10-minute self-destruct window

Only the `lowcost-data-platform` template is enabled right now.

## Safety model

- disabled by default until `AWS_DEMO_ENABLED=true`
- every `/sandbox-api/aws-demo/*` endpoint requires `X-Demo-Admin-Token`
- specs are repo-stored and allowlisted; the API does **not** execute arbitrary Terraform or arbitrary uploaded YAML
- region use is limited by `AWS_DEMO_REGION_ALLOWLIST`
- TTL is bounded by both host config and per-spec limits
- the public launcher is more constrained still: one fixed spec, one live public stack, fixed 10-minute TTL, and browser-session-bound destroy control

The admin endpoints are for operator use from `vm2`. The public launcher exists only for the portfolio AWS demo page and does not expose the generic admin surface.

## Spec format

Example: `sandbox-backend/demo-specs/lowcost-data-platform.yaml`

```yaml
name: lowcost-data-platform
description: Short-lived AWS data-platform demo with S3, SQS, Lambda, EventBridge, Glue, and Athena validation.
template: lowcost-data-platform
region: eu-west-3
defaultTtlMinutes: 10
limits:
  minTtlMinutes: 10
  maxTtlMinutes: 30
tags:
  DemoSurface: portfolio
  DemoType: lowcost-data-platform
resources:
  bucket:
    enabled: true
  queue:
    enabled: true
  lambda:
    enabled: true
    scheduleExpression: rate(1 day)
  glue:
    enabled: true
  athena:
    enabled: true
```

## Environment

Add these to `/etc/essahfi-terminal-sandbox.env` on `vm2`:

```bash
AWS_DEMO_ENABLED=true
AWS_DEMO_ADMIN_TOKEN=<strong-random-token>
AWS_DEMO_PUBLIC_ENABLED=true
AWS_DEMO_PUBLIC_SPEC_NAME=lowcost-data-platform
AWS_DEMO_PUBLIC_TTL_MINUTES=10
AWS_DEMO_PUBLIC_MAX_ACTIVE=1
AWS_DEMO_PUBLIC_MAX_LAUNCHES_PER_HOUR=2
AWS_DEMO_REGION_ALLOWLIST=eu-west-3
AWS_DEMO_DEFAULT_TTL_MINUTES=10
AWS_DEMO_TTL_MIN_MINUTES=10
AWS_DEMO_TTL_MAX_MINUTES=30
AWS_DEMO_BASE_PREFIX=ae-demo
AWS_DEMO_SPECS_DIR=/opt/essahfi-terminal-sandbox/demo-specs
AWS_DEMO_STATE_DB_PATH=/opt/essahfi-terminal-sandbox/aws-demo-control.sqlite3
AWS_DEMO_CLEANUP_INTERVAL_SECONDS=300
```

The backend also needs valid AWS credentials on the host. Keep those outside the repo:

- instance profile / role, or
- rotated access keys in the service environment, or
- a restricted shared profile under `~/.aws/credentials`

## API

Base URL: `https://vm2.amineessahfi.xyz/sandbox-api`

### List specs

```bash
curl -s \
  -H "X-Demo-Admin-Token: $AWS_DEMO_ADMIN_TOKEN" \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/specs
```

### Create a run

```bash
curl -s \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Demo-Admin-Token: $AWS_DEMO_ADMIN_TOKEN" \
  -d '{"specName":"lowcost-data-platform","ttlMinutes":10}' \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/runs
```

### Inspect runs

```bash
curl -s \
  -H "X-Demo-Admin-Token: $AWS_DEMO_ADMIN_TOKEN" \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/runs
```

### Destroy a run

```bash
curl -s \
  -X DELETE \
  -H "X-Demo-Admin-Token: $AWS_DEMO_ADMIN_TOKEN" \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/runs/<demo-id>
```

## Public launcher API

These are the endpoints used by the portfolio AWS demo page.

### Read live launcher status

```bash
curl -s \
  -H "Origin: https://amine-portfolio-test.vercel.app" \
  --cookie-jar /tmp/aws-demo.cookies \
  --cookie /tmp/aws-demo.cookies \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/live/status
```

### Launch the fixed 10-minute demo

```bash
curl -s \
  -X POST \
  -H "Origin: https://amine-portfolio-test.vercel.app" \
  --cookie-jar /tmp/aws-demo.cookies \
  --cookie /tmp/aws-demo.cookies \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/live/launch
```

### Destroy the current browser-owned demo

```bash
curl -s \
  -X DELETE \
  -H "Origin: https://amine-portfolio-test.vercel.app" \
  --cookie-jar /tmp/aws-demo.cookies \
  --cookie /tmp/aws-demo.cookies \
  https://vm2.amineessahfi.xyz/sandbox-api/aws-demo/live/destroy
```

## Deploy

Deploy with the existing backend installer:

```bash
cd sandbox-backend/deploy
./install-on-essahfi-instance.sh essahfi_instance
```

After deploy:

1. add rotated AWS credentials to the host
2. set `AWS_DEMO_ENABLED=true`
3. set `AWS_DEMO_PUBLIC_ENABLED=true` when you are ready for the portfolio page to launch real stacks
4. restart `terminal-sandbox.service`
