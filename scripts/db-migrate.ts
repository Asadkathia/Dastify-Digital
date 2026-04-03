import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from 'pg';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;
const isLocalSqlite = dbUri.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(dbUri);
const isCiLike = process.env.CI === 'true' || process.env.VERCEL === '1';

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PAYLOAD_MIGRATING: 'true',
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function clearDevModeMigrationMarker(): Promise<void> {
  if (!isPostgres || !isCiLike) {
    return;
  }

  const client = new Client({ connectionString: dbUri });

  try {
    await client.connect();

    // Payload's postgres migration table is typically `payload_migrations`.
    // Keep a fallback check for legacy/hyphenated naming to be defensive.
    const tableNameCandidates = ['payload_migrations', '"payload-migrations"'];

    let removedMarkers = 0;

    for (const tableName of tableNameCandidates) {
      try {
        const existsResult = await client.query<{ exists: string | null }>(
          `SELECT to_regclass('${tableName}') AS exists`,
        );

        if (!existsResult.rows[0]?.exists) {
          continue;
        }

        const deleteResult = await client.query(`DELETE FROM ${tableName} WHERE batch = -1`);
        removedMarkers += deleteResult.rowCount ?? 0;
      } catch {
        // Continue through candidates; table may not exist in this shape.
      }
    }

    if (removedMarkers > 0) {
      console.log(
        `[db:migrate] removed ${removedMarkers} dev-mode migration marker(s) (batch=-1) for CI/Vercel non-interactive migration.`,
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[db:migrate] could not clear dev-mode migration marker: ${message}`);
  } finally {
    await client.end();
  }
}

async function main(): Promise<void> {
  if (isLocalSqlite) {
    run('node', ['--import', 'tsx', './scripts/db-migrate-sqlite.ts']);
    return;
  }

  if (isPostgres) {
    await clearDevModeMigrationMarker();
    run('npm', ['run', 'payload', '--', 'migrate']);
    return;
  }

  console.error(
    `[db:migrate] unsupported DATABASE_URI scheme: ${dbUri}. Use file: for SQLite or postgres:// for Neon/Postgres.`,
  );
  process.exit(1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[db:migrate] failed: ${message}`);
  process.exit(1);
});
