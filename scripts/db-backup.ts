import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type CliOptions = {
  label?: string;
};

function parseOptions(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--label' && args[i + 1]) {
      options.label = args[i + 1];
      i += 1;
    }
  }

  return options;
}

function resolveDatabasePath(): string {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const projectRoot = path.resolve(dirname, '..');
  const defaultDbPath = path.resolve(projectRoot, 'payload.db');

  const uri = process.env.DATABASE_URI;
  if (!uri) {
    return defaultDbPath;
  }

  if (!uri.startsWith('file:')) {
    throw new Error(`db:backup only supports local file SQLite. DATABASE_URI=${uri}`);
  }

  return uri.slice('file:'.length);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyIfExists(source: string, target: string): Promise<boolean> {
  if (!(await fileExists(source))) {
    return false;
  }

  await fs.copyFile(source, target);
  return true;
}

async function main() {
  const options = parseOptions();
  const sourceDb = resolveDatabasePath();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const suffix = options.label ? `-${options.label}` : '';

  const backupDir = path.resolve(path.dirname(sourceDb), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  const dbFileName = path.basename(sourceDb);
  const dbBackup = path.join(backupDir, `${timestamp}${suffix}-${dbFileName}`);

  await fs.copyFile(sourceDb, dbBackup);

  const copiedWal = await copyIfExists(`${sourceDb}-wal`, `${dbBackup}-wal`);
  const copiedShm = await copyIfExists(`${sourceDb}-shm`, `${dbBackup}-shm`);

  console.log(`[db:backup] created ${dbBackup}`);
  console.log(`[db:backup] copied_wal=${copiedWal} copied_shm=${copiedShm}`);
}

main().catch((error) => {
  console.error('[db:backup] failed', error);
  process.exit(1);
});
