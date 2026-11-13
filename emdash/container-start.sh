#!/bin/sh
set -eu
umask 077
# The established site recipe preserves existing edits on every later start.
if [ ! -f /app/data/.theme-seeded ]; then
  node ./node_modules/emdash/dist/cli/index.mjs seed ./seed/seed.json --database /app/data/emdash.db --uploads-dir /app/data/uploads --on-conflict skip
  touch /app/data/.theme-seeded
fi
exec node ./dist/server/entry.mjs
