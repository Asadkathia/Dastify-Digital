import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "case_studies_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "blog_categories_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "tags_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "blog_posts_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "menus_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "redirects_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "forms_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "form_submissions_id" integer;
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "search_id" integer;
      END IF;

      IF to_regclass('public.homepage') IS NOT NULL THEN
        ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "homepage" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public._homepage_v') IS NOT NULL THEN
        ALTER TABLE "_homepage_v" ADD COLUMN IF NOT EXISTS "version_meta_canonical_u_r_l" varchar;
        ALTER TABLE "_homepage_v" ADD COLUMN IF NOT EXISTS "version_meta_noindex" boolean;
        ALTER TABLE "_homepage_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
      END IF;

      IF to_regclass('public.site_settings') IS NOT NULL THEN
        ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public.pages') IS NOT NULL THEN
        ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public._pages_v') IS NOT NULL THEN
        ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_meta_canonical_u_r_l" varchar;
        ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_meta_noindex" boolean;
        ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
      END IF;

      IF to_regclass('public.services') IS NOT NULL THEN
        ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public._services_v') IS NOT NULL THEN
        ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_meta_canonical_u_r_l" varchar;
        ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_meta_noindex" boolean;
        ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
      END IF;

      IF to_regclass('public.case_studies') IS NOT NULL THEN
        ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public._case_studies_v') IS NOT NULL THEN
        ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_meta_canonical_u_r_l" varchar;
        ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_meta_noindex" boolean;
        ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
      END IF;

      IF to_regclass('public.blog_posts') IS NOT NULL THEN
        ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "meta_canonical_u_r_l" varchar;
        ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "meta_noindex" boolean;
        ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "meta_keywords" varchar;
      END IF;

      IF to_regclass('public._blog_posts_v') IS NOT NULL THEN
        ALTER TABLE "_blog_posts_v" ADD COLUMN IF NOT EXISTS "version_meta_canonical_u_r_l" varchar;
        ALTER TABLE "_blog_posts_v" ADD COLUMN IF NOT EXISTS "version_meta_noindex" boolean;
        ALTER TABLE "_blog_posts_v" ADD COLUMN IF NOT EXISTS "version_meta_keywords" varchar;
      END IF;
    END
    $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.payload_locked_documents_rels') IS NOT NULL THEN
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "services_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "case_studies_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "blog_categories_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "tags_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "blog_posts_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "menus_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "redirects_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "forms_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "form_submissions_id";
        ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "search_id";
      END IF;

      IF to_regclass('public.homepage') IS NOT NULL THEN
        ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "homepage" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public._homepage_v') IS NOT NULL THEN
        ALTER TABLE "_homepage_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
        ALTER TABLE "_homepage_v" DROP COLUMN IF EXISTS "version_meta_noindex";
        ALTER TABLE "_homepage_v" DROP COLUMN IF EXISTS "version_meta_keywords";
      END IF;

      IF to_regclass('public.site_settings') IS NOT NULL THEN
        ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public.pages') IS NOT NULL THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public._pages_v') IS NOT NULL THEN
        ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
        ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_noindex";
        ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_meta_keywords";
      END IF;

      IF to_regclass('public.services') IS NOT NULL THEN
        ALTER TABLE "services" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "services" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "services" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public._services_v') IS NOT NULL THEN
        ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
        ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_meta_noindex";
        ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_meta_keywords";
      END IF;

      IF to_regclass('public.case_studies') IS NOT NULL THEN
        ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public._case_studies_v') IS NOT NULL THEN
        ALTER TABLE "_case_studies_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
        ALTER TABLE "_case_studies_v" DROP COLUMN IF EXISTS "version_meta_noindex";
        ALTER TABLE "_case_studies_v" DROP COLUMN IF EXISTS "version_meta_keywords";
      END IF;

      IF to_regclass('public.blog_posts') IS NOT NULL THEN
        ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "meta_canonical_u_r_l";
        ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "meta_noindex";
        ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "meta_keywords";
      END IF;

      IF to_regclass('public._blog_posts_v') IS NOT NULL THEN
        ALTER TABLE "_blog_posts_v" DROP COLUMN IF EXISTS "version_meta_canonical_u_r_l";
        ALTER TABLE "_blog_posts_v" DROP COLUMN IF EXISTS "version_meta_noindex";
        ALTER TABLE "_blog_posts_v" DROP COLUMN IF EXISTS "version_meta_keywords";
      END IF;
    END
    $$;
  `);
}
