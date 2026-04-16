import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "footer" (
      "id" integer PRIMARY KEY NOT NULL,
      "brand_name_prefix" varchar,
      "brand_accent" varchar,
      "brand_name_suffix" varchar,
      "brand_tagline" text,
      "cta_column_title" varchar,
      "cta_column_button_label" varchar,
      "cta_column_button_href" varchar,
      "copyright" varchar,
      "updated_at" varchar,
      "created_at" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_brand_socials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" varchar,
      "href" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_columns_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "highlight" boolean DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS "footer_cta_column_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );

    CREATE TABLE IF NOT EXISTS "footer_badges" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "tone" varchar
    );

    CREATE INDEX IF NOT EXISTS "footer_brand_socials_order_idx" ON "footer_brand_socials" ("_order");
    CREATE INDEX IF NOT EXISTS "footer_brand_socials_parent_id_idx" ON "footer_brand_socials" ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_columns_order_idx" ON "footer_columns" ("_order");
    CREATE INDEX IF NOT EXISTS "footer_columns_parent_id_idx" ON "footer_columns" ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_columns_links_order_idx" ON "footer_columns_links" ("_order");
    CREATE INDEX IF NOT EXISTS "footer_columns_links_parent_id_idx" ON "footer_columns_links" ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_cta_column_links_order_idx" ON "footer_cta_column_links" ("_order");
    CREATE INDEX IF NOT EXISTS "footer_cta_column_links_parent_id_idx" ON "footer_cta_column_links" ("_parent_id");

    CREATE INDEX IF NOT EXISTS "footer_badges_order_idx" ON "footer_badges" ("_order");
    CREATE INDEX IF NOT EXISTS "footer_badges_parent_id_idx" ON "footer_badges" ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_badges";
    DROP TABLE IF EXISTS "footer_cta_column_links";
    DROP TABLE IF EXISTS "footer_columns_links";
    DROP TABLE IF EXISTS "footer_columns";
    DROP TABLE IF EXISTS "footer_brand_socials";
    DROP TABLE IF EXISTS "footer";
  `);
}
