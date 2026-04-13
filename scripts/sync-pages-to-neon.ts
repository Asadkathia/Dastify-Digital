import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import pg from 'pg';

type PgColumn = {
  column_name: string;
  udt_name: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const sourceDbPath = path.resolve(projectRoot, 'payload.db');
const targetDbUri = process.env.DATABASE_URI;

if (!targetDbUri || !/^postgres(ql)?:\/\//i.test(targetDbUri)) {
  console.error('[sync:pages] DATABASE_URI must point to the target Postgres/Neon database.');
  process.exit(1);
}

function assertSafeIdentifier(identifier: string): void {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }
}

function runSqliteJson<T>(sql: string): T[] {
  const result = spawnSync('sqlite3', ['-json', sourceDbPath, sql], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `sqlite3 failed with status ${result.status}`);
  }

  const output = result.stdout.trim();
  if (!output) return [];
  return JSON.parse(output) as T[];
}

function shouldSyncTable(table: string): boolean {
  return (
    table === 'pages' ||
    table === '_pages_v' ||
    table === 'pages_breadcrumbs' ||
    table === '_pages_v_version_breadcrumbs' ||
    table.startsWith('pages_blocks_') ||
    table.startsWith('_pages_v_blocks_')
  );
}

function tableDepth(table: string): number {
  if (table === 'pages' || table === '_pages_v') return 0;
  return table.split('_').length;
}

function tablePriority(table: string): number {
  if (table === 'pages') return 0;
  if (table === '_pages_v') return 1;
  if (table === 'pages_breadcrumbs') return 2;
  if (table === '_pages_v_version_breadcrumbs') return 3;
  if (table.startsWith('pages_blocks_')) return 4;
  if (table.startsWith('_pages_v_blocks_')) return 5;
  return 10;
}

function orderTablesForInsert(tables: string[]): string[] {
  return [...tables].sort((a, b) => {
    const priorityDiff = tablePriority(a) - tablePriority(b);
    if (priorityDiff !== 0) return priorityDiff;

    const depthDiff = tableDepth(a) - tableDepth(b);
    if (depthDiff !== 0) return depthDiff;
    return a.localeCompare(b);
  });
}

function orderTablesForDelete(tables: string[]): string[] {
  return orderTablesForInsert(tables).reverse();
}

function adaptValue(value: unknown, udtName: string): unknown {
  if (value == null) return null;

  if (udtName === 'bool') {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value !== '0' && value.toLowerCase() !== 'false';
  }

  if (udtName === 'json' || udtName === 'jsonb') {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      return JSON.parse(trimmed);
    }
    return value;
  }

  return value;
}

async function getTargetTables(client: pg.Client): Promise<string[]> {
  const result = await client.query<{ table_name: string }>(
    `select table_name
     from information_schema.tables
     where table_schema = 'public'
     order by table_name`,
  );

  return result.rows.map((row) => row.table_name).filter(shouldSyncTable);
}

async function getTargetColumns(client: pg.Client, table: string): Promise<PgColumn[]> {
  const result = await client.query<PgColumn>(
    `select column_name, udt_name
     from information_schema.columns
     where table_schema = 'public' and table_name = $1
     order by ordinal_position`,
    [table],
  );

  return result.rows;
}

async function resetSequenceIfNeeded(client: pg.Client, table: string): Promise<void> {
  const result = await client.query<{ seq_name: string | null }>(
    `select pg_get_serial_sequence($1, 'id') as seq_name`,
    [`public.${table}`],
  );

  const seqName = result.rows[0]?.seq_name;
  if (!seqName) return;

  await client.query(
    `select setval($1, coalesce((select max(id) from "${table}"), 0), true)`,
    [seqName],
  );
}

async function main(): Promise<void> {
  const sourceTables = runSqliteJson<{ name: string }>(
    `select name from sqlite_master where type = 'table' order by name`,
  )
    .map((row) => row.name)
    .filter(shouldSyncTable);

  const client = new pg.Client({
    connectionString: targetDbUri,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const targetTables = await getTargetTables(client);
    const commonTables = targetTables.filter((table) => sourceTables.includes(table));

    if (commonTables.length === 0) {
      throw new Error('No matching pages tables found between local SQLite and target Postgres.');
    }

    const skippedTables: string[] = [];
    for (const table of sourceTables) {
      if (!targetTables.includes(table)) {
        const count = runSqliteJson<{ c: number }>(`select count(*) as c from "${table}"`)[0]?.c ?? 0;
        if (count > 0) skippedTables.push(`${table} (${count} rows)`);
      }
    }

    await client.query('begin');

    for (const table of orderTablesForDelete(targetTables)) {
      assertSafeIdentifier(table);
      await client.query(`delete from "${table}"`);
    }

    for (const table of orderTablesForInsert(commonTables)) {
      assertSafeIdentifier(table);

      const targetColumns = await getTargetColumns(client, table);
      const targetColumnNames = targetColumns.map((column) => column.column_name);
      const sqliteColumns = runSqliteJson<{ name: string }>(`pragma table_info("${table}")`).map((row) => row.name);
      const sharedColumns = targetColumns.filter((column) => sqliteColumns.includes(column.column_name));

      if (sharedColumns.length === 0) continue;

      const rows = runSqliteJson<Record<string, unknown>>(`select * from "${table}"`);
      if (rows.length === 0) continue;

      const columnList = sharedColumns.map((column) => `"${column.column_name}"`).join(', ');

      for (const row of rows) {
        const values = sharedColumns.map((column) => adaptValue(row[column.column_name], column.udt_name));
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        await client.query(`insert into "${table}" (${columnList}) values (${placeholders})`, values);
      }

      if (targetColumnNames.includes('id')) {
        await resetSequenceIfNeeded(client, table);
      }

      console.log(`[sync:pages] inserted ${rows.length} rows into ${table}`);
    }

    await client.query('commit');

    if (skippedTables.length > 0) {
      console.warn('[sync:pages] skipped local-only tables:');
      for (const table of skippedTables) {
        console.warn(`- ${table}`);
      }
    }

    console.log('[sync:pages] complete');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[sync:pages] failed', error);
  process.exit(1);
});
