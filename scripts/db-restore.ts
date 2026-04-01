import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type CliOptions = {
  file?: string;
};

function parseOptions(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if ((arg === '--file' || arg === '-f') && args[i + 1]) {
      options.file = args[i + 1];
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
    throw new Error(`db:restore only supports local file SQLite. DATABASE_URI=${uri}`);
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

async function backupCurrentDb(targetDb: string): Promise<void> {
  const backupDir = path.resolve(path.dirname(targetDb), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dbFileName = path.basename(targetDb);
  const backupPath = path.join(backupDir, `${timestamp}-pre-restore-${dbFileName}`);

  if (await fileExists(targetDb)) {
    await fs.copyFile(targetDb, backupPath);
  }

  if (await fileExists(`${targetDb}-wal`)) {
    await fs.copyFile(`${targetDb}-wal`, `${backupPath}-wal`);
  }

  if (await fileExists(`${targetDb}-shm`)) {
    await fs.copyFile(`${targetDb}-shm`, `${backupPath}-shm`);
  }

  console.log(`[db:restore] current DB backup created: ${backupPath}`);
}

async function main() {
  const options = parseOptions();
  if (!options.file) {
    throw new Error('Missing --file <backup-db-path>');
  }

  const sourceFile = path.resolve(options.file);
  const targetDb = resolveDatabasePath();

  if (!(await fileExists(sourceFile))) {
    throw new Error(`Backup file not found: ${sourceFile}`);
  }

  await backupCurrentDb(targetDb);

  await fs.copyFile(sourceFile, targetDb);

  if (await fileExists(`${sourceFile}-wal`)) {
    await fs.copyFile(`${sourceFile}-wal`, `${targetDb}-wal`);
  }

  if (await fileExists(`${sourceFile}-shm`)) {
    await fs.copyFile(`${sourceFile}-shm`, `${targetDb}-shm`);
  }

  console.log(`[db:restore] restored ${sourceFile} -> ${targetDb}`);
}

main().catch((error) => {
  console.error('[db:restore] failed', error);
  process.exit(1);
});
