import type { Migration } from './types.ts';
import { tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260416_0019_footer_global',
  name: 'Create footer global tables (brand, socials, columns, links, cta column, badges)',
  async up(client) {
    if (!(await tableExists(client, 'footer'))) {
      await client.execute(`
        CREATE TABLE "footer" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "brand_name_prefix" text,
          "brand_accent" text,
          "brand_name_suffix" text,
          "brand_tagline" text,
          "cta_column_title" text,
          "cta_column_button_label" text,
          "cta_column_button_href" text,
          "copyright" text,
          "updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
          "created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `);
    }

    if (!(await tableExists(client, 'footer_brand_socials'))) {
      await client.execute(`
        CREATE TABLE "footer_brand_socials" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" text PRIMARY KEY NOT NULL,
          "platform" text,
          "href" text
        );
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_brand_socials_order_idx" ON "footer_brand_socials" ("_order");`);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_brand_socials_parent_id_idx" ON "footer_brand_socials" ("_parent_id");`);
    }

    if (!(await tableExists(client, 'footer_columns'))) {
      await client.execute(`
        CREATE TABLE "footer_columns" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" text PRIMARY KEY NOT NULL,
          "title" text
        );
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_columns_order_idx" ON "footer_columns" ("_order");`);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_columns_parent_id_idx" ON "footer_columns" ("_parent_id");`);
    }

    if (!(await tableExists(client, 'footer_columns_links'))) {
      await client.execute(`
        CREATE TABLE "footer_columns_links" (
          "_order" integer NOT NULL,
          "_parent_id" text NOT NULL,
          "id" text PRIMARY KEY NOT NULL,
          "label" text,
          "href" text,
          "highlight" integer DEFAULT 0
        );
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_columns_links_order_idx" ON "footer_columns_links" ("_order");`);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_columns_links_parent_id_idx" ON "footer_columns_links" ("_parent_id");`);
    }

    if (!(await tableExists(client, 'footer_cta_column_links'))) {
      await client.execute(`
        CREATE TABLE "footer_cta_column_links" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" text PRIMARY KEY NOT NULL,
          "label" text,
          "href" text
        );
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_cta_column_links_order_idx" ON "footer_cta_column_links" ("_order");`);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_cta_column_links_parent_id_idx" ON "footer_cta_column_links" ("_parent_id");`);
    }

    if (!(await tableExists(client, 'footer_badges'))) {
      await client.execute(`
        CREATE TABLE "footer_badges" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" text PRIMARY KEY NOT NULL,
          "label" text,
          "tone" text
        );
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_badges_order_idx" ON "footer_badges" ("_order");`);
      await client.execute(`CREATE INDEX IF NOT EXISTS "footer_badges_parent_id_idx" ON "footer_badges" ("_parent_id");`);
    }
  },
};
