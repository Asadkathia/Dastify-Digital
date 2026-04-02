import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_homepage_brand_acronym_items_word" AS ENUM('DASTIFY', 'DIGITAL');
  CREATE TYPE "public"."enum_homepage_brand_acronym_items_dir" AS ENUM('up', 'down');
  CREATE TYPE "public"."enum_homepage_brand_acronym_items_color" AS ENUM('purple', 'blue');
  CREATE TYPE "public"."enum_homepage_footer_badges_tone" AS ENUM('blue', 'green');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_brand_acronym_items_word" AS ENUM('DASTIFY', 'DIGITAL');
  CREATE TYPE "public"."enum__homepage_v_version_brand_acronym_items_dir" AS ENUM('up', 'down');
  CREATE TYPE "public"."enum__homepage_v_version_brand_acronym_items_color" AS ENUM('purple', 'blue');
  CREATE TYPE "public"."enum__homepage_v_version_footer_badges_tone" AS ENUM('blue', 'green');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "homepage_hero_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color_var" varchar
  );
  
  CREATE TABLE "homepage_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"counter_target" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_hero_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage_brand_acronym_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"l" varchar,
  	"word" "enum_homepage_brand_acronym_items_word",
  	"dir" "enum_homepage_brand_acronym_items_dir",
  	"color" "enum_homepage_brand_acronym_items_color",
  	"t1" varchar,
  	"t2" varchar
  );
  
  CREATE TABLE "homepage_about_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color_var" varchar
  );
  
  CREATE TABLE "homepage_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage_features_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "homepage_case_studies_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_case_studies_minis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"stat" varchar,
  	"stat_label" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "homepage_services_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"name" varchar,
  	"description" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "homepage_mission_checks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "homepage_insights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "homepage_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "homepage_cta_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color" varchar
  );
  
  CREATE TABLE "homepage_footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "homepage_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "homepage_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"button" varchar
  );
  
  CREATE TABLE "homepage_footer_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tone" "enum_homepage_footer_badges_tone"
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nav_logo" varchar,
  	"nav_cta" varchar,
  	"hero_chip" varchar,
  	"hero_description" varchar,
  	"hero_primary_cta" varchar,
  	"hero_secondary_cta" varchar,
  	"hero_image" varchar,
  	"hero_image_media_id" integer,
  	"hero_image_alt" varchar,
  	"hero_badge_value" varchar,
  	"hero_badge_label" varchar,
  	"brand_acronym_chip" varchar,
  	"brand_acronym_title" varchar,
  	"brand_acronym_subtitle" varchar,
  	"about_chip" varchar,
  	"about_cta" varchar,
  	"about_image" varchar,
  	"about_image_media_id" integer,
  	"about_image_alt" varchar,
  	"case_studies_chip" varchar,
  	"case_studies_title" varchar,
  	"case_studies_cta" varchar,
  	"case_studies_main_tag" varchar,
  	"case_studies_main_title" varchar,
  	"case_studies_main_description" varchar,
  	"case_studies_main_stat" varchar,
  	"case_studies_main_stat_label" varchar,
  	"case_studies_main_image" varchar,
  	"case_studies_main_image_media_id" integer,
  	"case_studies_main_alt" varchar,
  	"services_chip" varchar,
  	"services_description" varchar,
  	"mission_chip" varchar,
  	"mission_title" varchar,
  	"mission_description" varchar,
  	"mission_cta" varchar,
  	"mission_image" varchar,
  	"mission_image_media_id" integer,
  	"mission_image_alt" varchar,
  	"insights_chip" varchar,
  	"insights_title" varchar,
  	"insights_cta" varchar,
  	"faq_chip" varchar,
  	"faq_title" varchar,
  	"faq_intro" varchar,
  	"faq_cta" varchar,
  	"cta_chip" varchar,
  	"cta_subtitle" varchar,
  	"cta_input_placeholder" varchar,
  	"cta_button" varchar,
  	"cta_note" varchar,
  	"footer_logo" varchar,
  	"footer_tagline" varchar,
  	"footer_copyright" varchar,
  	"content" jsonb,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_homepage_v_version_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_hero_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color_var" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"counter_target" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_hero_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_brand_acronym_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"l" varchar,
  	"word" "enum__homepage_v_version_brand_acronym_items_word",
  	"dir" "enum__homepage_v_version_brand_acronym_items_dir",
  	"color" "enum__homepage_v_version_brand_acronym_items_color",
  	"t1" varchar,
  	"t2" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_about_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color_var" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_features_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_case_studies_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_homepage_v_version_case_studies_minis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"stat" varchar,
  	"stat_label" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_services_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"name" varchar,
  	"description" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_mission_checks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_insights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"image" varchar,
  	"image_media_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_cta_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"delay" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"button" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_footer_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"tone" "enum__homepage_v_version_footer_badges_tone",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_nav_logo" varchar,
  	"version_nav_cta" varchar,
  	"version_hero_chip" varchar,
  	"version_hero_description" varchar,
  	"version_hero_primary_cta" varchar,
  	"version_hero_secondary_cta" varchar,
  	"version_hero_image" varchar,
  	"version_hero_image_media_id" integer,
  	"version_hero_image_alt" varchar,
  	"version_hero_badge_value" varchar,
  	"version_hero_badge_label" varchar,
  	"version_brand_acronym_chip" varchar,
  	"version_brand_acronym_title" varchar,
  	"version_brand_acronym_subtitle" varchar,
  	"version_about_chip" varchar,
  	"version_about_cta" varchar,
  	"version_about_image" varchar,
  	"version_about_image_media_id" integer,
  	"version_about_image_alt" varchar,
  	"version_case_studies_chip" varchar,
  	"version_case_studies_title" varchar,
  	"version_case_studies_cta" varchar,
  	"version_case_studies_main_tag" varchar,
  	"version_case_studies_main_title" varchar,
  	"version_case_studies_main_description" varchar,
  	"version_case_studies_main_stat" varchar,
  	"version_case_studies_main_stat_label" varchar,
  	"version_case_studies_main_image" varchar,
  	"version_case_studies_main_image_media_id" integer,
  	"version_case_studies_main_alt" varchar,
  	"version_services_chip" varchar,
  	"version_services_description" varchar,
  	"version_mission_chip" varchar,
  	"version_mission_title" varchar,
  	"version_mission_description" varchar,
  	"version_mission_cta" varchar,
  	"version_mission_image" varchar,
  	"version_mission_image_media_id" integer,
  	"version_mission_image_alt" varchar,
  	"version_insights_chip" varchar,
  	"version_insights_title" varchar,
  	"version_insights_cta" varchar,
  	"version_faq_chip" varchar,
  	"version_faq_title" varchar,
  	"version_faq_intro" varchar,
  	"version_faq_cta" varchar,
  	"version_cta_chip" varchar,
  	"version_cta_subtitle" varchar,
  	"version_cta_input_placeholder" varchar,
  	"version_cta_button" varchar,
  	"version_cta_note" varchar,
  	"version_footer_logo" varchar,
  	"version_footer_tagline" varchar,
  	"version_footer_copyright" varchar,
  	"version_content" jsonb,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_nav_links" ADD CONSTRAINT "homepage_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_heading_lines" ADD CONSTRAINT "homepage_hero_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_stats" ADD CONSTRAINT "homepage_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_marquee" ADD CONSTRAINT "homepage_hero_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_brand_acronym_items" ADD CONSTRAINT "homepage_brand_acronym_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_about_heading_lines" ADD CONSTRAINT "homepage_about_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_about_paragraphs" ADD CONSTRAINT "homepage_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_features_cards" ADD CONSTRAINT "homepage_features_cards_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_features_cards" ADD CONSTRAINT "homepage_features_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_case_studies_tabs" ADD CONSTRAINT "homepage_case_studies_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_case_studies_minis" ADD CONSTRAINT "homepage_case_studies_minis_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_case_studies_minis" ADD CONSTRAINT "homepage_case_studies_minis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_title_lines" ADD CONSTRAINT "homepage_services_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_mission_checks" ADD CONSTRAINT "homepage_mission_checks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_insights_items" ADD CONSTRAINT "homepage_insights_items_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_insights_items" ADD CONSTRAINT "homepage_insights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faq_items" ADD CONSTRAINT "homepage_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_cta_heading_lines" ADD CONSTRAINT "homepage_cta_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_footer_socials" ADD CONSTRAINT "homepage_footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_footer_columns_links" ADD CONSTRAINT "homepage_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_footer_columns" ADD CONSTRAINT "homepage_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_footer_badges" ADD CONSTRAINT "homepage_footer_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_media_id_media_id_fk" FOREIGN KEY ("hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_about_image_media_id_media_id_fk" FOREIGN KEY ("about_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_case_studies_main_image_media_id_media_id_fk" FOREIGN KEY ("case_studies_main_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_mission_image_media_id_media_id_fk" FOREIGN KEY ("mission_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_nav_links" ADD CONSTRAINT "_homepage_v_version_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_heading_lines" ADD CONSTRAINT "_homepage_v_version_hero_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_stats" ADD CONSTRAINT "_homepage_v_version_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_marquee" ADD CONSTRAINT "_homepage_v_version_hero_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_brand_acronym_items" ADD CONSTRAINT "_homepage_v_version_brand_acronym_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_about_heading_lines" ADD CONSTRAINT "_homepage_v_version_about_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_about_paragraphs" ADD CONSTRAINT "_homepage_v_version_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_features_cards" ADD CONSTRAINT "_homepage_v_version_features_cards_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_features_cards" ADD CONSTRAINT "_homepage_v_version_features_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_case_studies_tabs" ADD CONSTRAINT "_homepage_v_version_case_studies_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_case_studies_minis" ADD CONSTRAINT "_homepage_v_version_case_studies_minis_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_case_studies_minis" ADD CONSTRAINT "_homepage_v_version_case_studies_minis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_title_lines" ADD CONSTRAINT "_homepage_v_version_services_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items" ADD CONSTRAINT "_homepage_v_version_services_items_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items" ADD CONSTRAINT "_homepage_v_version_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_mission_checks" ADD CONSTRAINT "_homepage_v_version_mission_checks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_insights_items" ADD CONSTRAINT "_homepage_v_version_insights_items_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_insights_items" ADD CONSTRAINT "_homepage_v_version_insights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_faq_items" ADD CONSTRAINT "_homepage_v_version_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_cta_heading_lines" ADD CONSTRAINT "_homepage_v_version_cta_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_footer_socials" ADD CONSTRAINT "_homepage_v_version_footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_footer_columns_links" ADD CONSTRAINT "_homepage_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_footer_columns" ADD CONSTRAINT "_homepage_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_footer_badges" ADD CONSTRAINT "_homepage_v_version_footer_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_media_id_media_id_fk" FOREIGN KEY ("version_hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_about_image_media_id_media_id_fk" FOREIGN KEY ("version_about_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_case_studies_main_image_media_id_media_id_fk" FOREIGN KEY ("version_case_studies_main_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_mission_image_media_id_media_id_fk" FOREIGN KEY ("version_mission_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_nav_links_order_idx" ON "homepage_nav_links" USING btree ("_order");
  CREATE INDEX "homepage_nav_links_parent_id_idx" ON "homepage_nav_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_heading_lines_order_idx" ON "homepage_hero_heading_lines" USING btree ("_order");
  CREATE INDEX "homepage_hero_heading_lines_parent_id_idx" ON "homepage_hero_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_stats_order_idx" ON "homepage_hero_stats" USING btree ("_order");
  CREATE INDEX "homepage_hero_stats_parent_id_idx" ON "homepage_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_marquee_order_idx" ON "homepage_hero_marquee" USING btree ("_order");
  CREATE INDEX "homepage_hero_marquee_parent_id_idx" ON "homepage_hero_marquee" USING btree ("_parent_id");
  CREATE INDEX "homepage_brand_acronym_items_order_idx" ON "homepage_brand_acronym_items" USING btree ("_order");
  CREATE INDEX "homepage_brand_acronym_items_parent_id_idx" ON "homepage_brand_acronym_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_about_heading_lines_order_idx" ON "homepage_about_heading_lines" USING btree ("_order");
  CREATE INDEX "homepage_about_heading_lines_parent_id_idx" ON "homepage_about_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_about_paragraphs_order_idx" ON "homepage_about_paragraphs" USING btree ("_order");
  CREATE INDEX "homepage_about_paragraphs_parent_id_idx" ON "homepage_about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "homepage_features_cards_order_idx" ON "homepage_features_cards" USING btree ("_order");
  CREATE INDEX "homepage_features_cards_parent_id_idx" ON "homepage_features_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_features_cards_image_media_idx" ON "homepage_features_cards" USING btree ("image_media_id");
  CREATE INDEX "homepage_case_studies_tabs_order_idx" ON "homepage_case_studies_tabs" USING btree ("_order");
  CREATE INDEX "homepage_case_studies_tabs_parent_id_idx" ON "homepage_case_studies_tabs" USING btree ("_parent_id");
  CREATE INDEX "homepage_case_studies_minis_order_idx" ON "homepage_case_studies_minis" USING btree ("_order");
  CREATE INDEX "homepage_case_studies_minis_parent_id_idx" ON "homepage_case_studies_minis" USING btree ("_parent_id");
  CREATE INDEX "homepage_case_studies_minis_image_media_idx" ON "homepage_case_studies_minis" USING btree ("image_media_id");
  CREATE INDEX "homepage_services_title_lines_order_idx" ON "homepage_services_title_lines" USING btree ("_order");
  CREATE INDEX "homepage_services_title_lines_parent_id_idx" ON "homepage_services_title_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_items_order_idx" ON "homepage_services_items" USING btree ("_order");
  CREATE INDEX "homepage_services_items_parent_id_idx" ON "homepage_services_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_items_image_media_idx" ON "homepage_services_items" USING btree ("image_media_id");
  CREATE INDEX "homepage_mission_checks_order_idx" ON "homepage_mission_checks" USING btree ("_order");
  CREATE INDEX "homepage_mission_checks_parent_id_idx" ON "homepage_mission_checks" USING btree ("_parent_id");
  CREATE INDEX "homepage_insights_items_order_idx" ON "homepage_insights_items" USING btree ("_order");
  CREATE INDEX "homepage_insights_items_parent_id_idx" ON "homepage_insights_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_insights_items_image_media_idx" ON "homepage_insights_items" USING btree ("image_media_id");
  CREATE INDEX "homepage_faq_items_order_idx" ON "homepage_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_faq_items_parent_id_idx" ON "homepage_faq_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_cta_heading_lines_order_idx" ON "homepage_cta_heading_lines" USING btree ("_order");
  CREATE INDEX "homepage_cta_heading_lines_parent_id_idx" ON "homepage_cta_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "homepage_footer_socials_order_idx" ON "homepage_footer_socials" USING btree ("_order");
  CREATE INDEX "homepage_footer_socials_parent_id_idx" ON "homepage_footer_socials" USING btree ("_parent_id");
  CREATE INDEX "homepage_footer_columns_links_order_idx" ON "homepage_footer_columns_links" USING btree ("_order");
  CREATE INDEX "homepage_footer_columns_links_parent_id_idx" ON "homepage_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_footer_columns_order_idx" ON "homepage_footer_columns" USING btree ("_order");
  CREATE INDEX "homepage_footer_columns_parent_id_idx" ON "homepage_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "homepage_footer_badges_order_idx" ON "homepage_footer_badges" USING btree ("_order");
  CREATE INDEX "homepage_footer_badges_parent_id_idx" ON "homepage_footer_badges" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_hero_image_media_idx" ON "homepage" USING btree ("hero_image_media_id");
  CREATE INDEX "homepage_about_about_image_media_idx" ON "homepage" USING btree ("about_image_media_id");
  CREATE INDEX "homepage_case_studies_main_case_studies_main_image_media_idx" ON "homepage" USING btree ("case_studies_main_image_media_id");
  CREATE INDEX "homepage_mission_mission_image_media_idx" ON "homepage" USING btree ("mission_image_media_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "_homepage_v_version_nav_links_order_idx" ON "_homepage_v_version_nav_links" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_nav_links_parent_id_idx" ON "_homepage_v_version_nav_links" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_heading_lines_order_idx" ON "_homepage_v_version_hero_heading_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_hero_heading_lines_parent_id_idx" ON "_homepage_v_version_hero_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_stats_order_idx" ON "_homepage_v_version_hero_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_hero_stats_parent_id_idx" ON "_homepage_v_version_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_marquee_order_idx" ON "_homepage_v_version_hero_marquee" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_hero_marquee_parent_id_idx" ON "_homepage_v_version_hero_marquee" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_brand_acronym_items_order_idx" ON "_homepage_v_version_brand_acronym_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_brand_acronym_items_parent_id_idx" ON "_homepage_v_version_brand_acronym_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_about_heading_lines_order_idx" ON "_homepage_v_version_about_heading_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_about_heading_lines_parent_id_idx" ON "_homepage_v_version_about_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_about_paragraphs_order_idx" ON "_homepage_v_version_about_paragraphs" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_about_paragraphs_parent_id_idx" ON "_homepage_v_version_about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_features_cards_order_idx" ON "_homepage_v_version_features_cards" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_features_cards_parent_id_idx" ON "_homepage_v_version_features_cards" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_features_cards_image_media_idx" ON "_homepage_v_version_features_cards" USING btree ("image_media_id");
  CREATE INDEX "_homepage_v_version_case_studies_tabs_order_idx" ON "_homepage_v_version_case_studies_tabs" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_case_studies_tabs_parent_id_idx" ON "_homepage_v_version_case_studies_tabs" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_case_studies_minis_order_idx" ON "_homepage_v_version_case_studies_minis" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_case_studies_minis_parent_id_idx" ON "_homepage_v_version_case_studies_minis" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_case_studies_minis_image_media_idx" ON "_homepage_v_version_case_studies_minis" USING btree ("image_media_id");
  CREATE INDEX "_homepage_v_version_services_title_lines_order_idx" ON "_homepage_v_version_services_title_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_services_title_lines_parent_id_idx" ON "_homepage_v_version_services_title_lines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_services_items_order_idx" ON "_homepage_v_version_services_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_services_items_parent_id_idx" ON "_homepage_v_version_services_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_services_items_image_media_idx" ON "_homepage_v_version_services_items" USING btree ("image_media_id");
  CREATE INDEX "_homepage_v_version_mission_checks_order_idx" ON "_homepage_v_version_mission_checks" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_mission_checks_parent_id_idx" ON "_homepage_v_version_mission_checks" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_insights_items_order_idx" ON "_homepage_v_version_insights_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_insights_items_parent_id_idx" ON "_homepage_v_version_insights_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_insights_items_image_media_idx" ON "_homepage_v_version_insights_items" USING btree ("image_media_id");
  CREATE INDEX "_homepage_v_version_faq_items_order_idx" ON "_homepage_v_version_faq_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_faq_items_parent_id_idx" ON "_homepage_v_version_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_cta_heading_lines_order_idx" ON "_homepage_v_version_cta_heading_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_cta_heading_lines_parent_id_idx" ON "_homepage_v_version_cta_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_footer_socials_order_idx" ON "_homepage_v_version_footer_socials" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_footer_socials_parent_id_idx" ON "_homepage_v_version_footer_socials" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_footer_columns_links_order_idx" ON "_homepage_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_footer_columns_links_parent_id_idx" ON "_homepage_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_footer_columns_order_idx" ON "_homepage_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_footer_columns_parent_id_idx" ON "_homepage_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_footer_badges_order_idx" ON "_homepage_v_version_footer_badges" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_footer_badges_parent_id_idx" ON "_homepage_v_version_footer_badges" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_image_media_idx" ON "_homepage_v" USING btree ("version_hero_image_media_id");
  CREATE INDEX "_homepage_v_version_about_version_about_image_media_idx" ON "_homepage_v" USING btree ("version_about_image_media_id");
  CREATE INDEX "_homepage_v_version_case_studies_main_version_case_studi_idx" ON "_homepage_v" USING btree ("version_case_studies_main_image_media_id");
  CREATE INDEX "_homepage_v_version_mission_version_mission_image_media_idx" ON "_homepage_v" USING btree ("version_mission_image_media_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_nav_links" CASCADE;
  DROP TABLE "homepage_hero_heading_lines" CASCADE;
  DROP TABLE "homepage_hero_stats" CASCADE;
  DROP TABLE "homepage_hero_marquee" CASCADE;
  DROP TABLE "homepage_brand_acronym_items" CASCADE;
  DROP TABLE "homepage_about_heading_lines" CASCADE;
  DROP TABLE "homepage_about_paragraphs" CASCADE;
  DROP TABLE "homepage_features_cards" CASCADE;
  DROP TABLE "homepage_case_studies_tabs" CASCADE;
  DROP TABLE "homepage_case_studies_minis" CASCADE;
  DROP TABLE "homepage_services_title_lines" CASCADE;
  DROP TABLE "homepage_services_items" CASCADE;
  DROP TABLE "homepage_mission_checks" CASCADE;
  DROP TABLE "homepage_insights_items" CASCADE;
  DROP TABLE "homepage_faq_items" CASCADE;
  DROP TABLE "homepage_cta_heading_lines" CASCADE;
  DROP TABLE "homepage_footer_socials" CASCADE;
  DROP TABLE "homepage_footer_columns_links" CASCADE;
  DROP TABLE "homepage_footer_columns" CASCADE;
  DROP TABLE "homepage_footer_badges" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "_homepage_v_version_nav_links" CASCADE;
  DROP TABLE "_homepage_v_version_hero_heading_lines" CASCADE;
  DROP TABLE "_homepage_v_version_hero_stats" CASCADE;
  DROP TABLE "_homepage_v_version_hero_marquee" CASCADE;
  DROP TABLE "_homepage_v_version_brand_acronym_items" CASCADE;
  DROP TABLE "_homepage_v_version_about_heading_lines" CASCADE;
  DROP TABLE "_homepage_v_version_about_paragraphs" CASCADE;
  DROP TABLE "_homepage_v_version_features_cards" CASCADE;
  DROP TABLE "_homepage_v_version_case_studies_tabs" CASCADE;
  DROP TABLE "_homepage_v_version_case_studies_minis" CASCADE;
  DROP TABLE "_homepage_v_version_services_title_lines" CASCADE;
  DROP TABLE "_homepage_v_version_services_items" CASCADE;
  DROP TABLE "_homepage_v_version_mission_checks" CASCADE;
  DROP TABLE "_homepage_v_version_insights_items" CASCADE;
  DROP TABLE "_homepage_v_version_faq_items" CASCADE;
  DROP TABLE "_homepage_v_version_cta_heading_lines" CASCADE;
  DROP TABLE "_homepage_v_version_footer_socials" CASCADE;
  DROP TABLE "_homepage_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_homepage_v_version_footer_columns" CASCADE;
  DROP TABLE "_homepage_v_version_footer_badges" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_homepage_brand_acronym_items_word";
  DROP TYPE "public"."enum_homepage_brand_acronym_items_dir";
  DROP TYPE "public"."enum_homepage_brand_acronym_items_color";
  DROP TYPE "public"."enum_homepage_footer_badges_tone";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_brand_acronym_items_word";
  DROP TYPE "public"."enum__homepage_v_version_brand_acronym_items_dir";
  DROP TYPE "public"."enum__homepage_v_version_brand_acronym_items_color";
  DROP TYPE "public"."enum__homepage_v_version_footer_badges_tone";
  DROP TYPE "public"."enum__homepage_v_version_status";`)
}
