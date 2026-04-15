import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "navigation" (
      "id" integer PRIMARY KEY NOT NULL,
      "logo_text" varchar,
      "logo_accent" varchar,
      "logo_href" varchar,
      "cta_label" varchar,
      "cta_href" varchar,
      "updated_at" varchar,
      "created_at" varchar
    );

    CREATE TABLE IF NOT EXISTS "navigation_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar
    );

    CREATE INDEX IF NOT EXISTS "navigation_links_order_idx" ON "navigation_links" ("_order");
    CREATE INDEX IF NOT EXISTS "navigation_links_parent_id_idx" ON "navigation_links" ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "navigation_links";
    DROP TABLE IF EXISTS "navigation";
  `);
}
