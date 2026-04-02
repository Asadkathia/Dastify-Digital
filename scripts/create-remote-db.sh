#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[remote-db] missing command: $1" >&2
    exit 1
  fi
}

need_cmd turso

DB_NAME="${1:-dastify-digital-prod}"
LOCATION="${2:-}"

WHOAMI_OUTPUT="$(turso auth whoami 2>&1 || true)"
if [[ "$WHOAMI_OUTPUT" == *"not logged in"* ]]; then
  echo "[remote-db] not authenticated with Turso." >&2
  echo "[remote-db] run: turso auth login" >&2
  exit 1
fi

if turso db show "$DB_NAME" >/dev/null 2>&1; then
  echo "[remote-db] db already exists: $DB_NAME"
else
  echo "[remote-db] creating db: $DB_NAME"
  if [[ -n "$LOCATION" ]]; then
    turso db create "$DB_NAME" --location "$LOCATION" --wait
  else
    turso db create "$DB_NAME" --wait
  fi
fi

DB_URL="$(turso db show "$DB_NAME" --url | tr -d '\r')"
DB_TOKEN="$(turso db tokens create "$DB_NAME" | tr -d '\r')"

echo ""
echo "[remote-db] created/verified database"
echo "[remote-db] DATABASE_URI=$DB_URL"
echo "[remote-db] DATABASE_AUTH_TOKEN=$DB_TOKEN"
echo ""
echo "Add to local .env (or .env.local):"
echo "DATABASE_URI=$DB_URL"
echo "DATABASE_AUTH_TOKEN=$DB_TOKEN"
echo ""
echo "Add to Vercel production env:"
echo "vercel env add DATABASE_URI production"
echo "vercel env add DATABASE_AUTH_TOKEN production"
echo ""
echo "Then run migration against remote db:"
echo "DATABASE_URI=$DB_URL DATABASE_AUTH_TOKEN=$DB_TOKEN npm run db:migrate"
