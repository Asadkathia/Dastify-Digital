import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "breakpoint_styles" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "breakpoint_styles";`)
}
