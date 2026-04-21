import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "pages_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "_pages_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "services_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "_services_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "case_studies_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "_case_studies_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "blog_posts_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "_blog_posts_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "homepage_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_left" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "padding_right" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_top" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "margin_bottom" numeric;
  ALTER TABLE "_homepage_v_blocks_section_block" ADD COLUMN IF NOT EXISTS "max_width" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "pages_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "_pages_v_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "services_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "_services_v_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "case_studies_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "_case_studies_v_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "blog_posts_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "_blog_posts_v_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "homepage_blocks_section_block" DROP COLUMN IF EXISTS "max_width";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_left";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "padding_right";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_top";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "margin_bottom";
  ALTER TABLE "_homepage_v_blocks_section_block" DROP COLUMN IF EXISTS "max_width";`)
}
