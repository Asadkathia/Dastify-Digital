import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Adds a `hide_hero_image` boolean to the Services collection. When true the
 * /services/[slug] hero area renders nothing — when false (default) it renders
 * the uploaded heroImage or the brand `.iph` placeholder.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hide_hero_image" boolean DEFAULT false;
    ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_hide_hero_image" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "hide_hero_image";
    ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_hide_hero_image";
  `)
}
