import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { homepageContent } from '../src/lib/homepage-content.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;

// Safety rail: this script is SQLite-only (libsql) and intended for local dev.
// Refuse to run against any Postgres URI unless explicitly forced. Prevents
// "oops I had NEON_DATABASE_URL exported" from torching production data.
if (/^postgres(ql)?:\/\//i.test(dbUri) && process.env.ALLOW_PROD_SEED !== 'true') {
  console.error(
    `[seed-homepage] Refusing to run against Postgres URI.\n` +
      `  DATABASE_URI appears to be a remote database.\n` +
      `  If you truly intend to seed a Postgres instance, set ALLOW_PROD_SEED=true.`,
  );
  process.exit(1);
}

const client = createClient({
  url: dbUri,
});

async function main() {
  await client.execute(`CREATE TABLE IF NOT EXISTS "homepage" (
    "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "content" text,
    "updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
  );`);

  await client.execute({
    sql: `INSERT INTO "homepage" ("content", "updated_at", "created_at")
      SELECT ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (SELECT 1 FROM "homepage" LIMIT 1);`,
    args: [JSON.stringify(homepageContent)],
  });

  await client.execute({
    sql: `UPDATE "homepage"
      SET "content" = ?, "updated_at" = CURRENT_TIMESTAMP
      WHERE "id" = (SELECT "id" FROM "homepage" ORDER BY "id" ASC LIMIT 1);`,
    args: [JSON.stringify(homepageContent)],
  });

  const row = await client.execute(`SELECT COUNT(*) AS count FROM "homepage";`);
  const count = row.rows?.[0]?.count ?? 0;
  console.log(`[seed-homepage] complete. rows=${String(count)} db=${process.env.DATABASE_URI || defaultDbUri}`);
}

main().catch((error) => {
  console.error('[seed-homepage] failed', error);
  process.exit(1);
});
