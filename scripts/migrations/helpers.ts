import type { Client } from '@libsql/client';

export type TableColumn = {
  name: string;
  type: string;
};

export async function tableExists(client: Client, tableName: string): Promise<boolean> {
  const result = await client.execute({
    sql: 'SELECT name FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1;',
    args: ['table', tableName],
  });

  return (result.rows?.length ?? 0) > 0;
}

export async function columnExists(client: Client, tableName: string, columnName: string): Promise<boolean> {
  if (!(await tableExists(client, tableName))) {
    return false;
  }

  const info = await client.execute(`PRAGMA table_info("${tableName}");`);
  return (info.rows ?? []).some((row) => String(row.name) === columnName);
}

export async function addColumnIfMissing(
  client: Client,
  tableName: string,
  column: TableColumn,
): Promise<boolean> {
  if (!(await tableExists(client, tableName))) {
    return false;
  }

  if (await columnExists(client, tableName, column.name)) {
    return false;
  }

  await client.execute(`ALTER TABLE "${tableName}" ADD COLUMN "${column.name}" ${column.type};`);
  return true;
}

export async function addColumnsIfMissing(
  client: Client,
  tableName: string,
  columns: TableColumn[],
): Promise<number> {
  let added = 0;

  for (const column of columns) {
    if (await addColumnIfMissing(client, tableName, column)) {
      added += 1;
    }
  }

  return added;
}
