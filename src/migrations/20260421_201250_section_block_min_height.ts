import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "min_height" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "min_height";`)
}
