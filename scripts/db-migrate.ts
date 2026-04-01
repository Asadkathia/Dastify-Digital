import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { migrations } from './migrations/index.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;

const client = createClient({ url: dbUri });

const MIGRATION_TABLE = 'schema_migrations';

async function ensureMigrationTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "${MIGRATION_TABLE}" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "applied_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );
  `);
}

async function getAppliedMigrationIds(): Promise<Set<string>> {
  const result = await client.execute(`SELECT "id" FROM "${MIGRATION_TABLE}";`);
  return new Set((result.rows ?? []).map((row) => String(row.id)));
}

async function markApplied(id: string, name: string): Promise<void> {
  await client.execute({
    sql: `INSERT INTO "${MIGRATION_TABLE}" ("id", "name") VALUES (?, ?);`,
    args: [id, name],
  });
}

async function main() {
  await ensureMigrationTable();
  const applied = await getAppliedMigrationIds();

  let appliedNow = 0;

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      continue;
    }

    await migration.up(client, { dbUri });
    await markApplied(migration.id, migration.name);
    appliedNow += 1;

    console.log(`[db:migrate] applied ${migration.id} - ${migration.name}`);
  }

  console.log(`[db:migrate] done. applied_now=${appliedNow} db=${dbUri}`);
}

main().catch((error) => {
  console.error('[db:migrate] failed', error);
  process.exit(1);
});
