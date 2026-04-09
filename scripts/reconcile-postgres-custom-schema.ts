import pg from 'pg';

async function main(): Promise<void> {
  const uri = process.env.DATABASE_URI;
  if (!uri) {
    throw new Error('DATABASE_URI is required');
  }

  const client = new pg.Client({
    connectionString: uri,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });

  const statements = [
    `CREATE TABLE IF NOT EXISTS "import_reports" (
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
    );`,
    `CREATE INDEX IF NOT EXISTS "import_reports_slug_idx" ON "import_reports" ("slug");`,
    `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "import_reports_id" integer;`,
    `CREATE TABLE IF NOT EXISTS "pages_blocks_section_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" text PRIMARY KEY,
      "label" text,
      "padding_top" numeric,
      "padding_bottom" numeric,
      "background_color" text,
      "block_name" text
    );`,
    `CREATE TABLE IF NOT EXISTS "pages_blocks_section_block_columns" (
      "_order" integer NOT NULL,
      "_parent_id" text NOT NULL,
      "id" text PRIMARY KEY,
      "width" text DEFAULT '1/1'
    );`,
    `CREATE TABLE IF NOT EXISTS "pages_blocks_two_col_block" (
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
    );`,
    `CREATE TABLE IF NOT EXISTS "pages_blocks_three_col_block" (
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
    );`,
    `CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block" (
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
    );`,
    `CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY,
      "width" text DEFAULT '1/1',
      "_uuid" text
    );`,
  ];

  await client.connect();
  for (const sql of statements) {
    await client.query(sql);
  }
  await client.end();

  console.log('[db:reconcile] postgres custom schema reconciliation complete');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[db:reconcile] failed: ${message}`);
  process.exit(1);
});

