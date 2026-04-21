// One-off: transforms a Payload-generated Postgres migration so each statement
// is idempotent. Fixes the case where migrate:create's snapshot lagged behind
// production and the migration tried to CREATE tables that already exist.
//
// Transforms applied:
//   CREATE TABLE "X" (...)                   → CREATE TABLE IF NOT EXISTS "X" (...)
//   CREATE INDEX "X" ON ...                  → CREATE INDEX IF NOT EXISTS "X" ON ...
//   ALTER TABLE "X" ADD COLUMN "Y" ...       → ALTER TABLE "X" ADD COLUMN IF NOT EXISTS "Y" ...
//   CREATE TYPE "public"."X" AS ENUM(...)    → DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$
//   ALTER TABLE "X" ADD CONSTRAINT "Y" ...   → DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$
//   ALTER TABLE "X" DROP COLUMN "Y"          → ALTER TABLE "X" DROP COLUMN IF EXISTS "Y"
//   ALTER TABLE "X" DROP CONSTRAINT "Y"      → ALTER TABLE "X" DROP CONSTRAINT IF EXISTS "Y"
//   DROP TABLE "X"                           → DROP TABLE IF EXISTS "X"
//   DROP INDEX "X"                           → DROP INDEX IF EXISTS "X"
//   DROP TYPE "public"."X"                   → DROP TYPE IF EXISTS "public"."X"

import { readFileSync, writeFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('usage: node make-migration-idempotent.mjs <migration.ts>');
  process.exit(1);
}

let src = readFileSync(path, 'utf8');

// Simple replacements — statements that Postgres already supports as idempotent.
src = src.replace(/\bCREATE TABLE (?!IF NOT EXISTS)/g, 'CREATE TABLE IF NOT EXISTS ');
src = src.replace(/\bCREATE INDEX (?!IF NOT EXISTS)/g, 'CREATE INDEX IF NOT EXISTS ');
src = src.replace(/\bCREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, 'CREATE UNIQUE INDEX IF NOT EXISTS ');
src = src.replace(/\bADD COLUMN (?!IF NOT EXISTS)/g, 'ADD COLUMN IF NOT EXISTS ');
src = src.replace(/\bDROP COLUMN (?!IF EXISTS)/g, 'DROP COLUMN IF EXISTS ');
src = src.replace(/\bDROP CONSTRAINT (?!IF EXISTS)/g, 'DROP CONSTRAINT IF EXISTS ');
src = src.replace(/\bDROP TABLE (?!IF EXISTS)/g, 'DROP TABLE IF EXISTS ');
src = src.replace(/\bDROP INDEX (?!IF EXISTS)/g, 'DROP INDEX IF EXISTS ');
src = src.replace(/\bDROP TYPE (?!IF EXISTS)/g, 'DROP TYPE IF EXISTS ');

// ALTER COLUMN ... SET DATA TYPE jsonb needs a USING clause when the existing
// column is text. Prod's content columns are empty (verified), so this
// conversion is a no-op on actual data — preserves JSON-looking values and
// maps everything else to NULL. Plain-text bodies would be wiped; none exist.
src = src.replace(
  /ALTER COLUMN "([^"]+)" SET DATA TYPE jsonb;/g,
  (_m, col) =>
    `ALTER COLUMN "${col}" SET DATA TYPE jsonb USING ` +
    `CASE WHEN "${col}" IS NULL OR "${col}" = '' THEN NULL ` +
    `WHEN "${col}" ~ '^\\s*[\\{\\[]' THEN "${col}"::jsonb ` +
    `ELSE NULL END;`,
);

// Wrap CREATE TYPE ... AS ENUM(...) in DO block. The inner statement's `;`
// is inside the dollar-quoted body, so it doesn't terminate the outer DO.
//   DO $IDEMPOTENT$ BEGIN
//     CREATE TYPE "..." AS ENUM(...);
//   EXCEPTION WHEN duplicate_object THEN null;
//   END; $IDEMPOTENT$;
src = src.replace(
  /^(\s*)(CREATE TYPE "[^"]+"\."[^"]+" AS ENUM\([^)]*\);)/gm,
  '$1DO $IDEMPOTENT$ BEGIN $2 EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;',
);

// Wrap ALTER TABLE ... ADD CONSTRAINT ... ;  (may span multiple lines)
src = src.replace(
  /^(\s*)(ALTER TABLE "[^"]+" ADD CONSTRAINT "[^"]+"[\s\S]*?;)/gm,
  '$1DO $IDEMPOTENT$ BEGIN $2 EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;',
);

writeFileSync(path, src);
console.log('rewrote', path);
