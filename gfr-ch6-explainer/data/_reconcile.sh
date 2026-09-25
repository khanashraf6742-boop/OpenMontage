#!/usr/bin/env bash
# Reconcile a rewound local branch with the real remote history.
#
# This sandbox restarts rewind the local branch to the base commit while the
# working tree survives, which makes every `git push` fail with "fetch first".
# Force-pushing is NOT an option - it would delete the commits already on the
# remote. Instead: fetch the real tip, reset onto it, then restore the working
# tree (which is always a superset of the remote) and commit the delta.
#
# Usage: bash data/_reconcile.sh [commit message]
set -euo pipefail
cd "$(dirname "$0")/../.."
DELIVER="gfr-ch6-explainer"
MSG="${1:-Reconcile rewound local branch with remote history}"

echo "== 1. backup working tree =="
rm -rf /home/user/_bkp
mkdir -p /home/user/_bkp
cp -a "$DELIVER" /home/user/_bkp/

echo "== 2. fetch the real remote tip =="
git fetch origin arena/01a0d93c-openmontage:refs/heads/_remote_tip 2>&1 | tail -1
git log --oneline -1 _remote_tip

echo "== 3. reset onto it =="
git reset --hard _remote_tip 2>&1 | tail -1

echo "== 4. restore the working tree (superset of remote) =="
cd /home/user/_bkp/$DELIVER
n=0
while IFS= read -r f; do
  rel="${f#./}"
  dst="/home/user/OpenMontage/$DELIVER/$rel"
  if [ ! -e "$dst" ]; then
    mkdir -p "$(dirname "$dst")"; cp -a "$rel" "$dst"; n=$((n+1)); echo "  +NEW $rel"
  elif ! cmp -s "$rel" "$dst"; then
    cp -a "$rel" "$dst"; n=$((n+1)); echo "  ~CHG $rel"
  fi
done < <(find . -type f | sort)
echo "  files restored/changed: $n"

cd /home/user/OpenMontage
git branch -D _remote_tip >/dev/null
echo "== 5. delta to commit =="
git status --short
if [ -z "$(git status --porcelain)" ]; then
  echo "nothing to commit"
  exit 0
fi
git add $DELIVER
git -c user.name="Arena Agent" -c user.email="agent@email" commit -q -m "$MSG"
git log --oneline -2
git push -q origin arena/01a0d93c-openmontage
echo "PUSHED $(git ls-remote origin arena/01a0d93c-openmontage | cut -f1)"
rm -rf /home/user/_bkp
echo "done"
