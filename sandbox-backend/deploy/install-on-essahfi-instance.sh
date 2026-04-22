#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${1:-essahfi_instance}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$PROJECT_ROOT/sandbox-backend"
REMOTE_DIR="/opt/essahfi-terminal-sandbox"

ssh "$REMOTE_HOST" "sudo mkdir -p '$REMOTE_DIR' && sudo chown ubuntu:ubuntu '$REMOTE_DIR'"
rsync -az --delete "$BACKEND_ROOT/" "$REMOTE_HOST:$REMOTE_DIR/"

ssh "$REMOTE_HOST" <<EOF
  set -euo pipefail
  cd '$REMOTE_DIR'
  python3 -m venv .venv
  . .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
  docker build -t essahfi-terminal-sandbox:latest -f sandbox-image/Dockerfile .
  sudo cp deploy/terminal-sandbox.service /etc/systemd/system/terminal-sandbox.service
  sudo python3 - <<'PY'
from pathlib import Path
import secrets
from urllib.parse import urlparse

DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
    'https://amine-portfolio-test.vercel.app',
    'https://amine-portfolio-test-8ggn.vercel.app',
    'https://amine-portfolio-test-cfi3.vercel.app',
    'https://amineessahfi.xyz',
    'https://*.amineessahfi.xyz',
    'https://aessahfi.xyz',
    'https://www.aessahfi.xyz',
    'http://localhost:*',
    'http://127.0.0.1:*',
]

env_file = Path('/etc/essahfi-terminal-sandbox.env')
env_values = {}

if env_file.exists():
    for line in env_file.read_text().splitlines():
        if not line or line.lstrip().startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        env_values[key] = value

env_values.setdefault('AUTH_COOKIE_SECRET', secrets.token_hex(32))
env_values.setdefault('GOOGLE_OAUTH_CLIENT_ID', '')
env_values.setdefault('GOOGLE_OAUTH_CLIENT_SECRET', '')
env_values.setdefault('GOOGLE_OAUTH_SCOPE', 'openid email')
public_base_url = env_values.get('PUBLIC_BASE_URL', 'https://vm2.amineessahfi.xyz/sandbox-api').strip().rstrip('/')
parsed_public_url = urlparse(public_base_url)
public_origin = (
    f'{parsed_public_url.scheme}://{parsed_public_url.netloc}'.rstrip('/')
    if parsed_public_url.scheme and parsed_public_url.netloc
    else 'https://vm2.amineessahfi.xyz'
)
env_values.setdefault('WORKFLOW_STUDIO_ENABLED', 'true')
env_values.setdefault('WORKFLOW_STUDIO_PATH', '/workflow-studio/')
env_values.setdefault('WORKFLOW_STUDIO_URL', f'{public_origin}/workflow-studio/')
env_values.setdefault('WORKFLOW_STUDIO_SESSION_SECONDS', '300')
env_values.setdefault('ALLOWED_ORIGIN_PATTERNS', ','.join(DEFAULT_ALLOWED_ORIGIN_PATTERNS))
env_values.setdefault('AWS_DEMO_ENABLED', 'false')
env_values.setdefault('AWS_DEMO_ADMIN_TOKEN', secrets.token_urlsafe(32))
env_values.setdefault('AWS_DEMO_REGION_ALLOWLIST', 'eu-west-3')
env_values.setdefault('AWS_DEMO_DEFAULT_TTL_MINUTES', '60')
env_values.setdefault('AWS_DEMO_TTL_MIN_MINUTES', '15')
env_values.setdefault('AWS_DEMO_TTL_MAX_MINUTES', '180')
env_values.setdefault('AWS_DEMO_BASE_PREFIX', 'ae-demo')
env_values.setdefault('AWS_DEMO_SPECS_DIR', '/opt/essahfi-terminal-sandbox/demo-specs')
env_values.setdefault('AWS_DEMO_STATE_DB_PATH', '/opt/essahfi-terminal-sandbox/aws-demo-control.sqlite3')
env_values.setdefault('AWS_DEMO_CLEANUP_INTERVAL_SECONDS', '300')
env_values.setdefault('N8N_DEMO_BASIC_AUTH_USER', 'studio')
env_values.setdefault('N8N_DEMO_BASIC_AUTH_PASSWORD', secrets.token_urlsafe(24))
env_values.setdefault('N8N_DEMO_LOGIN_EMAIL', 'studio-demo@local.invalid')
env_values.setdefault('N8N_DEMO_LOGIN_PASSWORD', secrets.token_urlsafe(24))
env_values.setdefault('N8N_DEMO_LOGIN_FIRST_NAME', 'Studio')
env_values.setdefault('N8N_DEMO_LOGIN_LAST_NAME', 'Guest')
allowed_origin_patterns = [
    pattern.strip()
    for pattern in env_values['ALLOWED_ORIGIN_PATTERNS'].split(',')
    if pattern.strip()
]
env_values.pop('N8N_CONTENT_SECURITY_POLICY', None)

env_file.write_text('\n'.join(f'{key}={value}' for key, value in env_values.items()) + '\n')
env_file.chmod(0o600)
PY
  sudo mkdir -p /home/ubuntu/n8n-demo/data
  sudo chown ubuntu:ubuntu /home/ubuntu/n8n-demo
  sudo chown 1000:1000 /home/ubuntu/n8n-demo/data
  cp '$REMOTE_DIR/deploy/n8n-demo-compose.yml' /home/ubuntu/n8n-demo/docker-compose.yml
  cd /home/ubuntu/n8n-demo
  sudo docker compose --env-file /etc/essahfi-terminal-sandbox.env up -d
  reset_ready=''
  for attempt in \$(seq 1 30); do
    if sudo docker exec n8n-demo n8n user-management:reset >/tmp/n8n-demo-reset.log 2>&1; then
      reset_ready=1
      break
    fi
    sleep 2
  done
  if [ -z "\$reset_ready" ]; then
    cat /tmp/n8n-demo-reset.log >&2
    exit 1
  fi
  sudo '$REMOTE_DIR/.venv/bin/python' - <<'PY'
from pathlib import Path
import sqlite3
import time

import bcrypt

env_values = {}
env_file = Path('/etc/essahfi-terminal-sandbox.env')
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if not line or line.lstrip().startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        env_values[key] = value

db_path = Path('/home/ubuntu/n8n-demo/data/database.sqlite')
deadline = time.time() + 60
while not db_path.exists():
    if time.time() >= deadline:
        raise SystemExit('n8n demo database was not created in time')
    time.sleep(1)

connection = sqlite3.connect(db_path, timeout=30)
try:
    owner_row = connection.execute(
        "SELECT id FROM user WHERE roleSlug = 'global:owner' ORDER BY createdAt LIMIT 1"
    ).fetchone()
    if not owner_row:
        raise SystemExit('Could not find n8n demo owner after reset')

    password_hash = bcrypt.hashpw(
        env_values['N8N_DEMO_LOGIN_PASSWORD'].encode('utf-8'),
        bcrypt.gensalt(rounds=10),
    ).decode('utf-8')

    connection.execute(
        """
        UPDATE user
        SET email = ?,
            firstName = ?,
            lastName = ?,
            password = ?,
            disabled = 0,
            settings = ?,
            updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')
        WHERE id = ?
        """,
        (
            env_values['N8N_DEMO_LOGIN_EMAIL'],
            env_values['N8N_DEMO_LOGIN_FIRST_NAME'],
            env_values['N8N_DEMO_LOGIN_LAST_NAME'],
            password_hash,
            '{"userActivated":true}',
            owner_row[0],
        ),
    )
    workflow_count = connection.execute(
        "SELECT COUNT(*) FROM workflow_entity"
    ).fetchone()[0]
    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("DELETE FROM workflow_entity")
    connection.commit()
    print(f'Deleted {workflow_count} persisted demo workflows')
finally:
    connection.close()
PY
  sudo docker restart n8n-demo >/dev/null
  sudo python3 - <<'PY'
from base64 import b64encode
from pathlib import Path
import re

caddyfile = Path('/etc/caddy/Caddyfile')
content = caddyfile.read_text()
handle_block = '''    @sandbox path /sandbox-api/*\n    handle_path /sandbox-api/* {\n        reverse_proxy 127.0.0.1:3020\n    }\n\n'''
env_values = {}
env_file = Path('/etc/essahfi-terminal-sandbox.env')
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if not line or line.lstrip().startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        env_values[key] = value

basic_credentials = '{}:{}'.format(
    env_values.get('N8N_DEMO_BASIC_AUTH_USER', 'studio'),
    env_values.get('N8N_DEMO_BASIC_AUTH_PASSWORD', ''),
)
auth_header = b64encode(basic_credentials.encode('utf-8')).decode('ascii')
allowed_origin_patterns = [
    pattern.strip()
    for pattern in env_values.get('ALLOWED_ORIGIN_PATTERNS', '').split(',')
    if pattern.strip()
]
frame_ancestors = "'self'"
if allowed_origin_patterns:
    frame_ancestors = '%s %s' % (frame_ancestors, ' '.join(allowed_origin_patterns))
workflow_studio_block = '''    redir /workflow-studio /workflow-studio/ 308\n    handle_path /workflow-studio/* {\n        forward_auth 127.0.0.1:3020 {\n            uri /auth/studio-access\n        }\n        @workflow_persistence_write {\n            method POST PATCH PUT DELETE\n            path /rest/workflows /rest/workflows/*\n            not path_regexp workflow_run ^/rest/workflows/[^/]+/run$\n        }\n        respond @workflow_persistence_write "Workflow persistence is disabled in this demo." 403\n        reverse_proxy 127.0.0.1:5679 {\n            header_up Authorization "Basic %s"\n            header_up Host {host}\n            header_up X-Real-IP {remote_host}\n            header_up X-Forwarded-For {remote_host}\n            header_up X-Forwarded-Host {host}\n            header_up X-Forwarded-Proto {scheme}\n            header_down -X-Frame-Options\n            header_down Content-Security-Policy "frame-ancestors %s"\n        }\n    }\n\n''' % (auth_header, frame_ancestors)

if 'handle_path /sandbox-api/*' not in content:
    marker = '    reverse_proxy 127.0.0.1:5678 {\n'
    if marker not in content:
        raise SystemExit('Could not find vm2 reverse proxy block in /etc/caddy/Caddyfile')
    content = content.replace(marker, handle_block + marker, 1)

workflow_studio_patterns = [
    re.compile(r'    @workflow_studio path /workflow-studio /workflow-studio/\*\n    handle @workflow_studio \{\n(?:        .*\n)+?    \}\n\n', re.MULTILINE),
    re.compile(r'    redir /workflow-studio /workflow-studio/ 308\n    handle_path /workflow-studio/\* \{\n(?:        .*\n)+?    \}\n\n', re.MULTILINE),
]
for pattern in workflow_studio_patterns:
    content = pattern.sub('', content)

marker = '    reverse_proxy 127.0.0.1:5678 {\n'
if marker not in content:
    raise SystemExit('Could not find vm2 reverse proxy block in /etc/caddy/Caddyfile')
content = content.replace(marker, workflow_studio_block + marker, 1)

caddyfile.write_text(content)
PY
  sudo systemctl daemon-reload
  sudo systemctl enable terminal-sandbox.service
  sudo systemctl restart terminal-sandbox.service
  sudo systemctl reload caddy
EOF

echo "Sandbox backend deployed to $REMOTE_HOST"
