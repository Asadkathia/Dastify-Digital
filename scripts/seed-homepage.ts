import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { homepageContent } from '../src/lib/homepage-content.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;

const client = createClient({
  url: process.env.DATABASE_URI || defaultDbUri,
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
