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

async function ensurePostgresCustomSchema(): Promise<void> {
  if (!isPostgres) {
    return;
  }

  const client = new Client({
    connectionString: dbUri,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });

  const tableExists = async (tableName: string): Promise<boolean> => {
    const result = await client.query<{ exists: string | null }>(
      `SELECT to_regclass($1) AS exists`,
      [`public.${tableName}`],
    );
    return Boolean(result.rows[0]?.exists);
  };

  const columnExists = async (tableName: string, columnName: string): Promise<boolean> => {
    const result = await client.query(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
       LIMIT 1`,
      [tableName, columnName],
    );
    return result.rowCount > 0;
  };

  const ensureColumn = async (tableName: string, columnName: string, typeSql: string): Promise<void> => {
    if (!(await tableExists(tableName))) return;
    if (await columnExists(tableName, columnName)) return;
    await client.query(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${typeSql}`);
    console.log(`[db:migrate] added column ${tableName}.${columnName}`);
  };

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS "import_reports" (
        "id" bigserial PRIMARY KEY,
        "slug" text NOT NULL,
        "title" text,
        "provider" text NOT NULL,
        "model" text NOT NULL,
        "total_sections" numeric,
        "mapped_sections" numeric,
        "fallback_sections" numeric,
        "warnings" jsonb,
        "external_images" jsonb,
        "seo_title" text,
        "seo_description" text,
        "seo_keywords" text,
        "seo_canonical_u_r_l" text,
        "seo_noindex" boolean DEFAULT false,
        "created_page_id" text,
        "imported_at" timestamptz,
        "updated_at" timestamptz,
        "created_at" timestamptz
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS "import_reports_slug_idx" ON "import_reports" ("slug");`);

    await ensureColumn('payload_locked_documents_rels', 'import_reports_id', 'integer');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "pages_blocks_section_block" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" text PRIMARY KEY,
        "label" text,
        "padding_top" numeric,
        "padding_bottom" numeric,
        "background_color" text,
        "block_name" text
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "pages_blocks_section_block_columns" (
        "_order" integer NOT NULL,
        "_parent_id" text NOT NULL,
        "id" text PRIMARY KEY,
        "width" text DEFAULT '1/1'
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "pages_blocks_two_col_block" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" text PRIMARY KEY,
        "left_title" text,
        "left_text" text,
        "right_title" text,
        "right_text" text,
        "gap" text,
        "block_name" text
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "pages_blocks_three_col_block" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" text PRIMARY KEY,
        "col1_title" text,
        "col1_text" text,
        "col2_title" text,
        "col2_text" text,
        "col3_title" text,
        "col3_text" text,
        "gap" text,
        "block_name" text
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" integer PRIMARY KEY,
        "label" text,
        "padding_top" numeric,
        "padding_bottom" numeric,
        "background_color" text,
        "_uuid" text,
        "block_name" text
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block_columns" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" integer PRIMARY KEY,
        "width" text DEFAULT '1/1',
        "_uuid" text
      );
    `);

    console.log('[db:migrate] postgres custom schema reconciliation complete');
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
    await ensurePostgresCustomSchema();
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
