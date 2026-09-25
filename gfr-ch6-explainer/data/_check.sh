#!/usr/bin/env bash
# Runs every verification test for the GFR 2017 Chapter 6 deliverable.
# _docs and _deploy boot server.js on a scratch port and exercise the whole API.
# Exits non-zero if any test fails.
#   bash gfr-ch6-explainer/data/_check.sh
cd "$(dirname "$0")/.." || exit 1
fail=0
for t in _verify _e2e _content _ref _figures _comics _docs _json _transcript _integrations _deploy; do
  printf '\n===== %s =====\n' "$t"
  if node "data/$t.js"; then
    printf '  -> %s exit 0\n' "$t"
  else
    printf '  -> %s FAILED\n' "$t"
    fail=1
  fi
done
printf '\n===============================\n'
if [ "$fail" = 0 ]; then
  echo 'ALL CHECKS PASSED'
else
  echo 'SOME CHECKS FAILED'
fi
exit $fail
