import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { migrations } from './migrations/index.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;

const client = createClient({
  url: dbUri,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const LEGACY_MIGRATION_TABLE = 'schema_migrations';
const APP_MIGRATION_TABLE = 'app_schema_migrations';

async function tableExists(tableName: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'SELECT name FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1;',
    args: ['table', tableName],
  });

  return (result.rows?.length ?? 0) > 0;
}

async function migrateLegacyTableName(): Promise<void> {
  const hasLegacy = await tableExists(LEGACY_MIGRATION_TABLE);
  const hasCurrent = await tableExists(APP_MIGRATION_TABLE);

  if (hasLegacy && !hasCurrent) {
    await client.execute(`ALTER TABLE "${LEGACY_MIGRATION_TABLE}" RENAME TO "${APP_MIGRATION_TABLE}";`);
  }
}

async function dropCustomMigrationTables(): Promise<void> {
  await client.execute(`DROP TABLE IF EXISTS "${LEGACY_MIGRATION_TABLE}";`);
  await client.execute(`DROP TABLE IF EXISTS "${APP_MIGRATION_TABLE}";`);
}

async function main() {
  // Migrations are intentionally idempotent. We run all every time so local SQLite
  // never drifts, while avoiding extra app-owned migration tables that can confuse
  // Drizzle schema push prompts during dev startup.
  await migrateLegacyTableName();
  await dropCustomMigrationTables();

  let appliedNow = 0;

  for (const migration of migrations) {
    await migration.up(client, { dbUri });
    appliedNow += 1;

    console.log(`[db:migrate] applied ${migration.id} - ${migration.name}`);
  }

  console.log(`[db:migrate] done. applied_now=${appliedNow} db=${dbUri}`);
}

main().catch((error) => {
  console.error('[db:migrate] failed', error);
  process.exit(1);
});
