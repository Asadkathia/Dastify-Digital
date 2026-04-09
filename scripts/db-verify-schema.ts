import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient as createSqliteClient } from '@libsql/client';
import pg from 'pg';

type SchemaCheck = {
  table: string;
  requiredColumns?: string[];
};

const REQUIRED_CHECKS: SchemaCheck[] = [
  {
    table: 'homepage',
    requiredColumns: [
      'meta_title',
      'meta_description',
      'meta_image_id',
      'meta_canonical_u_r_l',
      'meta_noindex',
      'meta_keywords',
    ],
  },
  {
    table: '_homepage_v',
    requiredColumns: [
      'version_meta_title',
      'version_meta_description',
      'version_meta_image_id',
      'version_meta_canonical_u_r_l',
      'version_meta_noindex',
      'version_meta_keywords',
    ],
  },
  {
    table: 'site_settings',
    requiredColumns: ['meta_title', 'meta_description', 'meta_image_id', 'meta_canonical_u_r_l', 'meta_noindex', 'meta_keywords'],
  },
  {
    table: 'pages',
    requiredColumns: ['meta_title', 'meta_description', 'meta_image_id', 'meta_canonical_u_r_l', 'meta_noindex', 'meta_keywords'],
  },
  {
    table: '_pages_v',
    requiredColumns: [
      'version_meta_title',
      'version_meta_description',
      'version_meta_image_id',
      'version_meta_canonical_u_r_l',
      'version_meta_noindex',
      'version_meta_keywords',
    ],
  },
  {
    table: 'services',
    requiredColumns: ['meta_title', 'meta_description', 'meta_image_id', 'meta_canonical_u_r_l', 'meta_noindex', 'meta_keywords'],
  },
  {
    table: '_services_v',
    requiredColumns: [
      'version_meta_title',
      'version_meta_description',
      'version_meta_image_id',
      'version_meta_canonical_u_r_l',
      'version_meta_noindex',
      'version_meta_keywords',
    ],
  },
  {
    table: 'case_studies',
    requiredColumns: ['meta_title', 'meta_description', 'meta_image_id', 'meta_canonical_u_r_l', 'meta_noindex', 'meta_keywords'],
  },
  {
    table: '_case_studies_v',
    requiredColumns: [
      'version_meta_title',
      'version_meta_description',
      'version_meta_image_id',
      'version_meta_canonical_u_r_l',
      'version_meta_noindex',
      'version_meta_keywords',
    ],
  },
  {
    table: 'blog_posts',
    requiredColumns: ['meta_title', 'meta_description', 'meta_image_id', 'meta_canonical_u_r_l', 'meta_noindex', 'meta_keywords'],
  },
  {
    table: '_blog_posts_v',
    requiredColumns: [
      'version_meta_title',
      'version_meta_description',
      'version_meta_image_id',
      'version_meta_canonical_u_r_l',
      'version_meta_noindex',
      'version_meta_keywords',
    ],
  },
  {
    table: 'payload_locked_documents_rels',
    requiredColumns: [
      'users_id',
      'media_id',
      'pages_id',
      'services_id',
      'case_studies_id',
      'blog_categories_id',
      'tags_id',
      'blog_posts_id',
      'menus_id',
      'import_reports_id',
      'redirects_id',
      'forms_id',
      'form_submissions_id',
      'search_id',
    ],
  },
  { table: 'menus' },
  {
    table: 'import_reports',
    requiredColumns: [
      'slug',
      'provider',
      'model',
      'total_sections',
      'mapped_sections',
      'fallback_sections',
      'warnings',
      'external_images',
      'seo_title',
      'seo_description',
      'seo_keywords',
      'seo_canonical_u_r_l',
      'seo_noindex',
      'created_page_id',
      'imported_at',
    ],
  },
  { table: 'redirects' },
  { table: 'pages_blocks_section_block' },
  { table: 'pages_blocks_section_block_columns' },
  { table: 'pages_blocks_two_col_block' },
  { table: 'pages_blocks_three_col_block' },
  { table: '_pages_v_blocks_section_block' },
  { table: '_pages_v_blocks_section_block_columns' },
];

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const defaultDbUri = `file:${path.resolve(projectRoot, 'payload.db')}`;
const dbUri = process.env.DATABASE_URI || defaultDbUri;
const isSqlite = dbUri.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(dbUri);

function assertSafeIdentifier(identifier: string): void {
  if (!/^[A-Za-z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }
}

async function verifySqlite(uri: string): Promise<string[]> {
  const client = createSqliteClient({
    url: uri,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const failures: string[] = [];

  for (const check of REQUIRED_CHECKS) {
    assertSafeIdentifier(check.table);
    const tableExistsResult = await client.execute({
      sql: 'SELECT 1 FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1;',
      args: ['table', check.table],
    });
    const tableExists = (tableExistsResult.rows?.length ?? 0) > 0;

    if (!tableExists) {
      failures.push(`Missing table: ${check.table}`);
      continue;
    }

    for (const column of check.requiredColumns ?? []) {
      assertSafeIdentifier(column);
      const info = await client.execute(`PRAGMA table_info("${check.table}");`);
      const hasColumn = (info.rows ?? []).some((row) => String(row.name) === column);
      if (!hasColumn) {
        failures.push(`Missing column: ${check.table}.${column}`);
      }
    }
  }

  return failures;
}

async function verifyPostgres(uri: string): Promise<string[]> {
  const pool = new pg.Pool({
    connectionString: uri,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });

  const failures: string[] = [];

  try {
    for (const check of REQUIRED_CHECKS) {
      const tableResult = await pool.query(
        `SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1
         LIMIT 1;`,
        [check.table],
      );

      if (tableResult.rowCount === 0) {
        failures.push(`Missing table: ${check.table}`);
        continue;
      }

      for (const column of check.requiredColumns ?? []) {
        const columnResult = await pool.query(
          `SELECT 1
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
           LIMIT 1;`,
          [check.table, column],
        );
        if (columnResult.rowCount === 0) {
          failures.push(`Missing column: ${check.table}.${column}`);
        }
      }
    }
  } finally {
    await pool.end();
  }

  return failures;
}

async function main(): Promise<void> {
  let failures: string[] = [];

  if (isSqlite) {
    failures = await verifySqlite(dbUri);
  } else if (isPostgres) {
    failures = await verifyPostgres(dbUri);
  } else {
    console.error(`[db:verify] unsupported DATABASE_URI scheme: ${dbUri}`);
    process.exit(1);
  }

  if (failures.length > 0) {
    console.error('[db:verify] schema verification failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`[db:verify] ok. checks=${REQUIRED_CHECKS.length} db=${dbUri}`);
}

main().catch((error) => {
  console.error('[db:verify] failed', error);
  process.exit(1);
});
