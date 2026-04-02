import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;
const isLocalSqlite = dbUri.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(dbUri);

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

if (isLocalSqlite) {
  run('node', ['--import', 'tsx', './scripts/db-migrate-sqlite.ts']);
} else if (isPostgres) {
  run('npm', ['run', 'payload', '--', 'migrate']);
} else {
  console.error(
    `[db:migrate] unsupported DATABASE_URI scheme: ${dbUri}. Use file: for SQLite or postgres:// for Neon/Postgres.`,
  );
  process.exit(1);
}
