#!/usr/bin/env bash
set -euo pipefail

cd /home/sandbox

cat > /home/sandbox/README.txt <<'EOF'
Essahfi live sandbox
====================

- This shell expires automatically after 5 minutes.
- Outbound network access is disabled.
- The base filesystem is read-only.
- Your session is destroyed when it ends.

Suggested commands:
  pwd
  ls -la
  cat README.txt
  uname -a
  ps
  tree
EOF

export PS1="${SANDBOX_PS1:-sandbox@essahfi:\w\$ }"
clear
echo "Live sandbox ready."
echo "This environment is ephemeral and expires automatically."
echo

exec /bin/bash --noprofile --norc -i
