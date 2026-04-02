#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[deploy:vercel] missing required command: $1" >&2
    exit 1
  fi
}

need_cmd npm
need_cmd vercel

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "[deploy:vercel] missing required env var: $name" >&2
    exit 1
  fi
}

require_env PAYLOAD_SECRET
require_env PREVIEW_SECRET
require_env DATABASE_URI

if [[ "$DATABASE_URI" == file:* ]]; then
  echo "[deploy:vercel] DATABASE_URI cannot be file:* for Vercel production." >&2
  echo "[deploy:vercel] Use remote Postgres/Neon (example: postgres://...)." >&2
  exit 1
fi

if [[ "$DATABASE_URI" != postgres* && "$DATABASE_URI" != postgresql* ]]; then
  echo "[deploy:vercel] DATABASE_URI must be postgres:// or postgresql:// for Neon." >&2
  exit 1
fi

echo "[deploy:vercel] running migrations against DATABASE_URI"
npm run db:migrate

echo "[deploy:vercel] building app"
npm run build

echo "[deploy:vercel] pulling Vercel production project settings"
vercel pull --yes --environment=production

echo "[deploy:vercel] deploying to production"
vercel deploy --prod --yes

echo "[deploy:vercel] done"
