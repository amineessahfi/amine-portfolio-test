#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${1:-essahfi_instance}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$PROJECT_ROOT/sandbox-backend"
REMOTE_DIR="/opt/essahfi-terminal-sandbox"

ssh "$REMOTE_HOST" "sudo mkdir -p '$REMOTE_DIR' && sudo chown ubuntu:ubuntu '$REMOTE_DIR'"
rsync -az --delete "$BACKEND_ROOT/" "$REMOTE_HOST:$REMOTE_DIR/"

ssh "$REMOTE_HOST" "
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

caddyfile = Path('/etc/caddy/Caddyfile')
content = caddyfile.read_text()
handle_block = '''    @sandbox path /sandbox-api/*\n    handle_path /sandbox-api/* {\n        reverse_proxy 127.0.0.1:3020\n    }\n\n'''

if 'handle_path /sandbox-api/*' not in content:
    marker = '    reverse_proxy 127.0.0.1:5678 {\n'
    if marker not in content:
        raise SystemExit('Could not find vm2 reverse proxy block in /etc/caddy/Caddyfile')
    content = content.replace(marker, handle_block + marker, 1)
    caddyfile.write_text(content)
PY
  sudo systemctl daemon-reload
  sudo systemctl enable terminal-sandbox.service
  sudo systemctl restart terminal-sandbox.service
  sudo systemctl reload caddy
"

echo "Sandbox backend deployed to $REMOTE_HOST"
