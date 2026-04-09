import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260408_0015_import_reports_table',
  name: 'Create import_reports table used by HTML import agent',
  async up(client) {
    const exists = await tableExists(client, 'import_reports');

    if (!exists) {
      await client.execute(`
        CREATE TABLE "import_reports" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "slug" text NOT NULL,
          "title" text,
          "provider" text NOT NULL,
          "model" text NOT NULL,
          "total_sections" numeric,
          "mapped_sections" numeric,
          "fallback_sections" numeric,
          "warnings" text,
          "external_images" text,
          "seo_title" text,
          "seo_description" text,
          "seo_keywords" text,
          "seo_canonical_u_r_l" text,
          "seo_noindex" integer DEFAULT 0,
          "created_page_id" text,
          "imported_at" text,
          "updated_at" text,
          "created_at" text
        );
      `);

      await client.execute('CREATE INDEX IF NOT EXISTS "import_reports_slug_idx" ON "import_reports" ("slug");');
    }

    await addColumnsIfMissing(client, 'import_reports', [
      { name: 'slug', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'provider', type: 'text' },
      { name: 'model', type: 'text' },
      { name: 'total_sections', type: 'numeric' },
      { name: 'mapped_sections', type: 'numeric' },
      { name: 'fallback_sections', type: 'numeric' },
      { name: 'warnings', type: 'text' },
      { name: 'external_images', type: 'text' },
      { name: 'seo_title', type: 'text' },
      { name: 'seo_description', type: 'text' },
      { name: 'seo_keywords', type: 'text' },
      { name: 'seo_canonical_u_r_l', type: 'text' },
      { name: 'seo_noindex', type: 'integer' },
      { name: 'created_page_id', type: 'text' },
      { name: 'imported_at', type: 'text' },
      { name: 'updated_at', type: 'text' },
      { name: 'created_at', type: 'text' },
    ]);
  },
};
