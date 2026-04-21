import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * Aligns Services + Case Studies + Blog Posts with the Dastify brand book's
 * canonical section vocabulary. Mirror of src/migrations/20260420_canonical_section_fields.ts.
 *
 * SQLite stores "content" as text either way — richText serializes to a JSON
 * string the Payload adapter parses on read. No column-type change needed
 * (unlike the Postgres side, which moves to jsonb).
 */
export const migration: Migration = {
  id: '20260420_0021_canonical_section_fields',
  name: 'Add canonical section fields (services, case-studies, blog-posts)',
  async up(client) {
    // ─── Services ────────────────────────────────────────────────────────────
    if (await tableExists(client, 'services')) {
      await addColumnIfMissing(client, 'services', { name: 'display_order', type: 'integer DEFAULT 10' });
      await addColumnIfMissing(client, 'services', { name: 'tagline', type: 'text' });
      await addColumnIfMissing(client, 'services', { name: 'outcomes_title', type: "text DEFAULT 'What you get'" });
      await addColumnIfMissing(client, 'services', { name: 'cta_label', type: "text DEFAULT 'Learn more →'" });
      await addColumnIfMissing(client, 'services', { name: 'cta_href', type: "text DEFAULT '/contact'" });
      await addColumnIfMissing(client, 'services', { name: 'hover_image_id', type: 'integer' });
    }

    if (await tableExists(client, '_services_v')) {
      await addColumnIfMissing(client, '_services_v', { name: 'version_display_order', type: 'integer DEFAULT 10' });
      await addColumnIfMissing(client, '_services_v', { name: 'version_tagline', type: 'text' });
      await addColumnIfMissing(client, '_services_v', { name: 'version_outcomes_title', type: "text DEFAULT 'What you get'" });
      await addColumnIfMissing(client, '_services_v', { name: 'version_cta_label', type: "text DEFAULT 'Learn more →'" });
      await addColumnIfMissing(client, '_services_v', { name: 'version_cta_href', type: "text DEFAULT '/contact'" });
      await addColumnIfMissing(client, '_services_v', { name: 'version_hover_image_id', type: 'integer' });
    }

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "services_outcomes" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "text" text NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "_services_v_version_outcomes" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "_uuid" text,
        "text" text NOT NULL
      );
    `);

    // ─── Case Studies ────────────────────────────────────────────────────────
    if (await tableExists(client, 'case_studies')) {
      await addColumnIfMissing(client, 'case_studies', { name: 'featured', type: 'integer DEFAULT 0' });
      await addColumnIfMissing(client, 'case_studies', { name: 'filter_tag', type: 'text' });
    }

    if (await tableExists(client, '_case_studies_v')) {
      await addColumnIfMissing(client, '_case_studies_v', { name: 'version_featured', type: 'integer DEFAULT 0' });
      await addColumnIfMissing(client, '_case_studies_v', { name: 'version_filter_tag', type: 'text' });
    }

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "case_studies_stats" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "value" text NOT NULL,
        "label" text NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "_case_studies_v_version_stats" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "_uuid" text,
        "value" text NOT NULL,
        "label" text NOT NULL
      );
    `);

    // ─── Blog Posts: content text → lexical JSON ─────────────────────────────
    // SQLite is typeless; the column stays `text`. Any existing plain string is
    // wrapped in a minimal Lexical document so the rich-text editor can open it.
    for (const { table, column } of [
      { table: 'blog_posts', column: 'content' },
      { table: '_blog_posts_v', column: 'version_content' },
      { table: 'services', column: 'content' },
      { table: '_services_v', column: 'version_content' },
      { table: 'case_studies', column: 'content' },
      { table: '_case_studies_v', column: 'version_content' },
    ]) {
      if (!(await tableExists(client, table))) continue;
      // Find rows with non-empty plain-string content that are NOT already JSON.
      const rows = await client.execute(`
        SELECT id, "${column}" AS value FROM "${table}"
        WHERE "${column}" IS NOT NULL AND "${column}" != '' AND substr("${column}", 1, 1) != '{'
      `);
      for (const row of rows.rows ?? []) {
        const id = row.id;
        const text = String(row.value ?? '');
        const lexical = {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [{ type: 'text', format: 0, text, version: 1 }],
              },
            ],
          },
        };
        await client.execute({
          sql: `UPDATE "${table}" SET "${column}" = ? WHERE id = ?`,
          args: [JSON.stringify(lexical), id as number | string],
        });
      }
    }
  },
};
