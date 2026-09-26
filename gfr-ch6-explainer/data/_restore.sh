#!/usr/bin/env bash
# One-command recovery after a sandbox restart.
#
# This sandbox restarts rewind the local branch to the base commit and wipe /tmp,
# which deletes the MP4, the previews and the running server. Everything is in the
# remote, so recovery is: fetch the tip, reset onto it, verify, serve.
#
# Usage: bash gfr-ch6-explainer/data/_restore.sh [port]
set -euo pipefail
cd "$(dirname "$0")/../.."
DELIVER="gfr-ch6-explainer"
PORT="${1:-8080}"
BRANCH="arena/01a0d93c-openmontage"

echo "== 1. fetch the real remote tip =="
git fetch origin "$BRANCH:refs/heads/_remote_tip"
git log --oneline -1 _remote_tip

echo "== 2. reset onto it (the working tree is always a subset of the remote) =="
git reset --hard _remote_tip
git branch -D _remote_tip >/dev/null

echo "== 3. verify the deliverable =="
MP4="$DELIVER/gfr-chapter-6.mp4"
if [ -f "$MP4" ]; then
  echo "  mp4    : $(stat -c%s "$MP4") bytes, md5 $(md5sum "$MP4" | cut -d' ' -f1)"
  echo "  expect : 1884061af95beaee1642ef33182bf374"
else
  echo "  !! $MP4 missing after the reset"
  exit 1
fi
( cd "$DELIVER" && node data/_mp4.js ) || { echo "  !! MP4 FILE CHECK failed"; exit 1; }

echo "== 4. run the whole test suite =="
bash "$DELIVER/data/_check.sh" | tail -3

echo "== 5. serve =="
# SKIP_SERVE=1 leaves the port alone, for when the platform's process manager owns
# the server - starting a second one here would fail to bind anyway.
if [ "${SKIP_SERVE:-0}" = "1" ]; then
  echo "  skipped (SKIP_SERVE=1)"
else
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${PORT}/tcp" 2>/dev/null || true
  else
    pkill -f "node server.js ${PORT}" 2>/dev/null || true
  fi
  sleep 1
  cd "$DELIVER"
  nohup node server.js "$PORT" >/tmp/gfr-server.log 2>&1 &
  sleep 2
  echo "  log    : /tmp/gfr-server.log"
fi
echo "  local  : http://127.0.0.1:${PORT}/watch.html"
echo "  video  : http://127.0.0.1:${PORT}/gfr-chapter-6.mp4"

echo
echo "RESTORED at $(git rev-parse --short HEAD)"
