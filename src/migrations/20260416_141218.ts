import { sql } from '@payloadcms/db-postgres';
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_text_image_block_layout" AS ENUM('left', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_card_grid_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_button_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_heading_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_form_block_layout" AS ENUM('centered', 'left', 'card');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_quote_block_align" AS ENUM('left', 'center');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_divider_block_width" AS ENUM('full', '75', '50', '25');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_icon_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_feature_list_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_team_grid_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_blog_feed_block_columns" AS ENUM('2', '3');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_countdown_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_text_image_block_layout" AS ENUM('left', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_button_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_heading_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_layout" AS ENUM('centered', 'left', 'card');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_quote_block_align" AS ENUM('left', 'center');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_divider_block_width" AS ENUM('full', '75', '50', '25');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_icon_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_feature_list_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_team_grid_block_columns" AS ENUM('2', '3', '4');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_blog_feed_block_columns" AS ENUM('2', '3');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_countdown_block_align" AS ENUM('left', 'center', 'right');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_blog_categories_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__blog_categories_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_tags_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__tags_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__blog_posts_v_version_status" AS ENUM('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_menus_location" AS ENUM('header', 'footer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__menus_v_version_location" AS ENUM('header', 'footer');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_import_reports_provider" AS ENUM('anthropic', 'openai', 'google', 'openrouter', 'ollama');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_nav_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_hero_primary_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_hero_secondary_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_about_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_case_studies_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_mission_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_insights_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_homepage_faq_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_nav_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_hero_primary_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_hero_secondary_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_about_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_case_studies_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_mission_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_insights_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum__homepage_v_version_faq_cta_href_type" AS ENUM('internal', 'external', 'anchor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  CREATE TYPE "public"."enum_site_settings_robots_policy" AS ENUM('index-follow', 'noindex-nofollow');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  CREATE TABLE IF NOT EXISTS "pages_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum_pages_blocks_text_image_block_layout" DEFAULT 'right',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum_pages_blocks_two_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_three_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"col1_title" varchar,
  	"col1_text" varchar,
  	"col2_title" varchar,
  	"col2_text" varchar,
  	"col3_title" varchar,
  	"col3_text" varchar,
  	"gap" "enum_pages_blocks_three_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_pricing_block_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"features" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"highlighted" boolean DEFAULT false
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_video_embed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_card_grid_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_pages_blocks_card_grid_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum_pages_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum_pages_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum_pages_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum_pages_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum_pages_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum_pages_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"border_radius" numeric DEFAULT 0,
  	"object_position" "enum_pages_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum_pages_blocks_image_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum_pages_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum_pages_blocks_social_icons_block_size" DEFAULT 'md',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_pages_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_section_block_columns_width" DEFAULT '1/1'
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"padding_top" numeric,
  	"padding_bottom" numeric,
  	"background_color" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum_pages_blocks_form_block_background_style" DEFAULT 'none',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum_pages_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum_pages_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum_pages_blocks_divider_block_width" DEFAULT 'full',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum_pages_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum_pages_blocks_icon_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_pages_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_feature_list_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_team_grid_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"linkedin_url" varchar,
  	"email" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_pages_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum_pages_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum_pages_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_pages_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"address" varchar,
  	"embed_url" varchar,
  	"height" numeric DEFAULT 400,
  	"border_radius" numeric DEFAULT 12,
  	"show_address_card" boolean DEFAULT true,
  	"phone" varchar,
  	"hours" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum_pages_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum_pages_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"striped" boolean DEFAULT true,
  	"bordered" boolean DEFAULT false,
  	"responsive" boolean DEFAULT true,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"accent_color" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_pages_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_pages_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum_pages_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"converted_page_name" varchar,
  	"converted_content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_u_r_l" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"primary_cta_label" varchar,
  	"primary_cta_href" varchar,
  	"secondary_cta_label" varchar,
  	"secondary_cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum__pages_v_blocks_text_image_block_layout" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum__pages_v_blocks_two_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_three_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"col1_title" varchar,
  	"col1_text" varchar,
  	"col2_title" varchar,
  	"col2_text" varchar,
  	"col3_title" varchar,
  	"col3_text" varchar,
  	"gap" "enum__pages_v_blocks_three_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pricing_block_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"features" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"highlighted" boolean DEFAULT false,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video_embed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"autoplay" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__pages_v_blocks_card_grid_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum__pages_v_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum__pages_v_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum__pages_v_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum__pages_v_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum__pages_v_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum__pages_v_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"href" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"border_radius" numeric DEFAULT 0,
  	"object_position" "enum__pages_v_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum__pages_v_blocks_image_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum__pages_v_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum__pages_v_blocks_social_icons_block_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__pages_v_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_section_block_columns_width" DEFAULT '1/1',
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_section_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"padding_top" numeric,
  	"padding_bottom" numeric,
  	"background_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum__pages_v_blocks_form_block_background_style" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum__pages_v_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum__pages_v_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum__pages_v_blocks_divider_block_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum__pages_v_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum__pages_v_blocks_icon_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__pages_v_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_feature_list_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_grid_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"linkedin_url" varchar,
  	"email" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__pages_v_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum__pages_v_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum__pages_v_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum__pages_v_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"address" varchar,
  	"embed_url" varchar,
  	"height" numeric DEFAULT 400,
  	"border_radius" numeric DEFAULT 12,
  	"show_address_card" boolean DEFAULT true,
  	"phone" varchar,
  	"hours" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum__pages_v_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum__pages_v_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_table_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"striped" boolean DEFAULT true,
  	"bordered" boolean DEFAULT false,
  	"responsive" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"accent_color" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__pages_v_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__pages_v_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum__pages_v_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_converted_page_name" varchar,
  	"version_converted_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_u_r_l" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  CREATE TABLE IF NOT EXISTS "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"content" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_u_r_l" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_hero_image_id" integer,
  	"version_content" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_u_r_l" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE TABLE IF NOT EXISTS "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"client" varchar,
  	"featured_image_id" integer,
  	"content" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_u_r_l" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_client" varchar,
  	"version_featured_image_id" integer,
  	"version_content" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_u_r_l" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE TABLE IF NOT EXISTS "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_categories_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "_blog_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE TABLE IF NOT EXISTS "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tags_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tags_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE TABLE IF NOT EXISTS "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"published_at" timestamp(3) with time zone,
  	"featured_image_id" integer,
  	"content" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_u_r_l" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_posts_status" DEFAULT 'draft'
  );
  CREATE TABLE IF NOT EXISTS "blog_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"tags_id" integer
  );
  CREATE TABLE IF NOT EXISTS "_blog_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_featured_image_id" integer,
  	"version_content" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_canonical_u_r_l" varchar,
  	"version_meta_noindex" boolean DEFAULT false,
  	"version_meta_keywords" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"tags_id" integer
  );
  CREATE TABLE IF NOT EXISTS "menus_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"location" "enum_menus_location" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "_menus_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  CREATE TABLE IF NOT EXISTS "_menus_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_location" "enum__menus_v_version_location" NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "import_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar,
  	"provider" "enum_import_reports_provider" NOT NULL,
  	"model" varchar NOT NULL,
  	"total_sections" numeric,
  	"mapped_sections" numeric,
  	"fallback_sections" numeric,
  	"warnings" jsonb,
  	"external_images" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"seo_noindex" boolean,
  	"created_page_id" varchar,
  	"imported_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"blog_posts_id" integer
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  CREATE TABLE IF NOT EXISTS "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  CREATE TABLE IF NOT EXISTS "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_text" varchar DEFAULT 'Dastify' NOT NULL,
  	"logo_accent" varchar DEFAULT '.Digital' NOT NULL,
  	"logo_href" varchar DEFAULT '/',
  	"cta_label" varchar DEFAULT 'Book a Call',
  	"cta_href" varchar DEFAULT '/contact',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Dastify Digital' NOT NULL,
  	"site_description" varchar NOT NULL,
  	"organization_name" varchar DEFAULT 'Dastify Digital' NOT NULL,
  	"default_canonical_base" varchar DEFAULT 'http://localhost:3000' NOT NULL,
  	"robots_policy" "enum_site_settings_robots_policy" DEFAULT 'index-follow' NOT NULL,
  	"twitter_handle" varchar,
  	"google_analytics_id" varchar,
  	"default_og_image_id" integer,
  	"organization_logo_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_canonical_u_r_l" varchar,
  	"meta_noindex" boolean DEFAULT false,
  	"meta_keywords" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_categories_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_posts_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menus_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "import_reports_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "nav_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "nav_cta_href_type" "enum_homepage_nav_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "nav_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_primary_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_primary_cta_href_type" "enum_homepage_hero_primary_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_primary_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_secondary_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_secondary_cta_href_type" "enum_homepage_hero_secondary_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "hero_secondary_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "about_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "about_cta_href_type" "enum_homepage_about_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "about_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "case_studies_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "case_studies_cta_href_type" "enum_homepage_case_studies_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "case_studies_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "mission_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "mission_cta_href_type" "enum_homepage_mission_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "mission_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "insights_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "insights_cta_href_type" "enum_homepage_insights_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "insights_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "faq_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "faq_cta_href_type" "enum_homepage_faq_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "faq_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_title" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_description" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_image_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_canonical_u_r_l" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_noindex" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD COLUMN "meta_keywords" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_nav_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_nav_cta_href_type" "enum__homepage_v_version_nav_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_nav_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_primary_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_primary_cta_href_type" "enum__homepage_v_version_hero_primary_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_primary_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_secondary_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_secondary_cta_href_type" "enum__homepage_v_version_hero_secondary_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_secondary_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_about_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_about_cta_href_type" "enum__homepage_v_version_about_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_about_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_case_studies_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_case_studies_cta_href_type" "enum__homepage_v_version_case_studies_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_case_studies_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_mission_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_mission_cta_href_type" "enum__homepage_v_version_mission_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_mission_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_insights_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_insights_cta_href_type" "enum__homepage_v_version_insights_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_insights_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_faq_cta_href_url" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_faq_cta_href_type" "enum__homepage_v_version_faq_cta_href_type" DEFAULT 'internal';
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_faq_cta_href_open_in_new_tab" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_title" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_description" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_image_id" integer;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_canonical_u_r_l" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_noindex" boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD COLUMN "version_meta_keywords" varchar;
EXCEPTION WHEN duplicate_column THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_hero_block" ADD CONSTRAINT "pages_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_hero_block" ADD CONSTRAINT "pages_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_rich_text_block" ADD CONSTRAINT "pages_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_text_image_block" ADD CONSTRAINT "pages_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_text_image_block" ADD CONSTRAINT "pages_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_cta_block" ADD CONSTRAINT "pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_faq_block_items" ADD CONSTRAINT "pages_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_stats_block_items" ADD CONSTRAINT "pages_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_stats_block" ADD CONSTRAINT "pages_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_testimonials_block_items" ADD CONSTRAINT "pages_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_testimonials_block" ADD CONSTRAINT "pages_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_two_col_block" ADD CONSTRAINT "pages_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_three_col_block" ADD CONSTRAINT "pages_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_pricing_block_plans" ADD CONSTRAINT "pages_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_pricing_block" ADD CONSTRAINT "pages_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_logo_carousel_block_logos" ADD CONSTRAINT "pages_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_logo_carousel_block_logos" ADD CONSTRAINT "pages_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_logo_carousel_block" ADD CONSTRAINT "pages_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_video_embed_block" ADD CONSTRAINT "pages_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_spacer_block" ADD CONSTRAINT "pages_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_accordion_block_items" ADD CONSTRAINT "pages_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_accordion_block" ADD CONSTRAINT "pages_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_card_grid_block_cards" ADD CONSTRAINT "pages_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_card_grid_block_cards" ADD CONSTRAINT "pages_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_card_grid_block" ADD CONSTRAINT "pages_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_button_block" ADD CONSTRAINT "pages_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_heading_block" ADD CONSTRAINT "pages_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_alert_block" ADD CONSTRAINT "pages_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_tabs_block_tabs" ADD CONSTRAINT "pages_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_tabs_block" ADD CONSTRAINT "pages_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_social_icons_block_links" ADD CONSTRAINT "pages_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_social_icons_block" ADD CONSTRAINT "pages_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_custom_html_block" ADD CONSTRAINT "pages_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_counter_block_items" ADD CONSTRAINT "pages_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_counter_block" ADD CONSTRAINT "pages_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_progress_bar_block_items" ADD CONSTRAINT "pages_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_progress_bar_block" ADD CONSTRAINT "pages_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_gallery_block_images" ADD CONSTRAINT "pages_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_gallery_block_images" ADD CONSTRAINT "pages_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_image_gallery_block" ADD CONSTRAINT "pages_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_section_block_columns" ADD CONSTRAINT "pages_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_section_block" ADD CONSTRAINT "pages_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_quote_block" ADD CONSTRAINT "pages_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_quote_block" ADD CONSTRAINT "pages_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_divider_block" ADD CONSTRAINT "pages_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_icon_block" ADD CONSTRAINT "pages_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_feature_list_block_items" ADD CONSTRAINT "pages_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_feature_list_block" ADD CONSTRAINT "pages_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_team_grid_block_members" ADD CONSTRAINT "pages_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_team_grid_block_members" ADD CONSTRAINT "pages_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_team_grid_block" ADD CONSTRAINT "pages_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_blog_feed_block" ADD CONSTRAINT "pages_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_map_block" ADD CONSTRAINT "pages_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_countdown_block" ADD CONSTRAINT "pages_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_table_block_headers" ADD CONSTRAINT "pages_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_table_block_rows_cells" ADD CONSTRAINT "pages_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_table_block_rows" ADD CONSTRAINT "pages_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_table_block" ADD CONSTRAINT "pages_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_timeline_block_items" ADD CONSTRAINT "pages_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_timeline_block" ADD CONSTRAINT "pages_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_steps_block_steps" ADD CONSTRAINT "pages_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_steps_block" ADD CONSTRAINT "pages_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages_blocks_announcement_bar_block" ADD CONSTRAINT "pages_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_hero_block" ADD CONSTRAINT "_pages_v_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_hero_block" ADD CONSTRAINT "_pages_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_rich_text_block" ADD CONSTRAINT "_pages_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_text_image_block" ADD CONSTRAINT "_pages_v_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_text_image_block" ADD CONSTRAINT "_pages_v_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_cta_block" ADD CONSTRAINT "_pages_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_faq_block_items" ADD CONSTRAINT "_pages_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_faq_block" ADD CONSTRAINT "_pages_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_stats_block_items" ADD CONSTRAINT "_pages_v_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_stats_block" ADD CONSTRAINT "_pages_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_testimonials_block_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_two_col_block" ADD CONSTRAINT "_pages_v_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_three_col_block" ADD CONSTRAINT "_pages_v_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_pricing_block_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_pricing_block" ADD CONSTRAINT "_pages_v_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" ADD CONSTRAINT "_pages_v_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_video_embed_block" ADD CONSTRAINT "_pages_v_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_spacer_block" ADD CONSTRAINT "_pages_v_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_accordion_block_items" ADD CONSTRAINT "_pages_v_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_accordion_block" ADD CONSTRAINT "_pages_v_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_card_grid_block" ADD CONSTRAINT "_pages_v_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_button_block" ADD CONSTRAINT "_pages_v_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_heading_block" ADD CONSTRAINT "_pages_v_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_alert_block" ADD CONSTRAINT "_pages_v_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_pages_v_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_tabs_block" ADD CONSTRAINT "_pages_v_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_social_icons_block_links" ADD CONSTRAINT "_pages_v_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_social_icons_block" ADD CONSTRAINT "_pages_v_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_custom_html_block" ADD CONSTRAINT "_pages_v_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_counter_block_items" ADD CONSTRAINT "_pages_v_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_counter_block" ADD CONSTRAINT "_pages_v_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_progress_bar_block_items" ADD CONSTRAINT "_pages_v_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_progress_bar_block" ADD CONSTRAINT "_pages_v_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_image_gallery_block" ADD CONSTRAINT "_pages_v_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_section_block_columns" ADD CONSTRAINT "_pages_v_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_section_block" ADD CONSTRAINT "_pages_v_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_quote_block" ADD CONSTRAINT "_pages_v_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_quote_block" ADD CONSTRAINT "_pages_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_divider_block" ADD CONSTRAINT "_pages_v_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_icon_block" ADD CONSTRAINT "_pages_v_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_feature_list_block_items" ADD CONSTRAINT "_pages_v_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_feature_list_block" ADD CONSTRAINT "_pages_v_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_team_grid_block_members" ADD CONSTRAINT "_pages_v_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_team_grid_block_members" ADD CONSTRAINT "_pages_v_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_team_grid_block" ADD CONSTRAINT "_pages_v_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_blog_feed_block" ADD CONSTRAINT "_pages_v_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_map_block" ADD CONSTRAINT "_pages_v_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_countdown_block" ADD CONSTRAINT "_pages_v_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_table_block_headers" ADD CONSTRAINT "_pages_v_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_table_block_rows_cells" ADD CONSTRAINT "_pages_v_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_table_block_rows" ADD CONSTRAINT "_pages_v_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_table_block" ADD CONSTRAINT "_pages_v_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_timeline_block_items" ADD CONSTRAINT "_pages_v_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_timeline_block" ADD CONSTRAINT "_pages_v_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_steps_block_steps" ADD CONSTRAINT "_pages_v_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_steps_block" ADD CONSTRAINT "_pages_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v_blocks_announcement_bar_block" ADD CONSTRAINT "_pages_v_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_categories_v" ADD CONSTRAINT "_blog_categories_v_parent_id_blog_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_parent_id_blog_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v" ADD CONSTRAINT "_blog_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_blog_posts_v_rels" ADD CONSTRAINT "_blog_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "menus_items" ADD CONSTRAINT "menus_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_menus_v_version_items" ADD CONSTRAINT "_menus_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menus_v"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_menus_v" ADD CONSTRAINT "_menus_v_parent_id_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menus"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_block_order_idx" ON "pages_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_block_parent_id_idx" ON "pages_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_block_path_idx" ON "pages_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_block_image_idx" ON "pages_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_order_idx" ON "pages_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_parent_id_idx" ON "pages_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_rich_text_block_path_idx" ON "pages_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_image_block_order_idx" ON "pages_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_image_block_parent_id_idx" ON "pages_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_image_block_path_idx" ON "pages_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_text_image_block_image_idx" ON "pages_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_block_order_idx" ON "pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_block_parent_id_idx" ON "pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_block_path_idx" ON "pages_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_items_order_idx" ON "pages_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_items_parent_id_idx" ON "pages_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_block_items_order_idx" ON "pages_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_block_items_parent_id_idx" ON "pages_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_block_order_idx" ON "pages_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_block_parent_id_idx" ON "pages_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_stats_block_path_idx" ON "pages_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_block_items_order_idx" ON "pages_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_block_items_parent_id_idx" ON "pages_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_block_order_idx" ON "pages_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_block_parent_id_idx" ON "pages_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_block_path_idx" ON "pages_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_col_block_order_idx" ON "pages_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_col_block_parent_id_idx" ON "pages_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_two_col_block_path_idx" ON "pages_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_three_col_block_order_idx" ON "pages_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_three_col_block_parent_id_idx" ON "pages_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_three_col_block_path_idx" ON "pages_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_block_plans_order_idx" ON "pages_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_block_plans_parent_id_idx" ON "pages_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_block_order_idx" ON "pages_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_block_parent_id_idx" ON "pages_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_pricing_block_path_idx" ON "pages_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_logos_order_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_logos_parent_id_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_logos_image_idx" ON "pages_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_order_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_parent_id_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_logo_carousel_block_path_idx" ON "pages_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_block_order_idx" ON "pages_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_block_parent_id_idx" ON "pages_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_video_embed_block_path_idx" ON "pages_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_block_order_idx" ON "pages_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_block_parent_id_idx" ON "pages_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_spacer_block_path_idx" ON "pages_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_block_items_order_idx" ON "pages_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_block_items_parent_id_idx" ON "pages_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_block_order_idx" ON "pages_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_block_parent_id_idx" ON "pages_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_accordion_block_path_idx" ON "pages_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_cards_order_idx" ON "pages_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_cards_parent_id_idx" ON "pages_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_cards_image_idx" ON "pages_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_order_idx" ON "pages_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_parent_id_idx" ON "pages_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_card_grid_block_path_idx" ON "pages_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_order_idx" ON "pages_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_parent_id_idx" ON "pages_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_button_block_path_idx" ON "pages_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_order_idx" ON "pages_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_parent_id_idx" ON "pages_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_heading_block_path_idx" ON "pages_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_order_idx" ON "pages_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_parent_id_idx" ON "pages_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_path_idx" ON "pages_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_block_image_idx" ON "pages_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_alert_block_order_idx" ON "pages_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_alert_block_parent_id_idx" ON "pages_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_alert_block_path_idx" ON "pages_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tabs_block_tabs_order_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tabs_block_tabs_parent_id_idx" ON "pages_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tabs_block_order_idx" ON "pages_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tabs_block_parent_id_idx" ON "pages_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tabs_block_path_idx" ON "pages_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_social_icons_block_links_order_idx" ON "pages_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_social_icons_block_links_parent_id_idx" ON "pages_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_social_icons_block_order_idx" ON "pages_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_social_icons_block_parent_id_idx" ON "pages_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_social_icons_block_path_idx" ON "pages_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_custom_html_block_order_idx" ON "pages_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_custom_html_block_parent_id_idx" ON "pages_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_custom_html_block_path_idx" ON "pages_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_counter_block_items_order_idx" ON "pages_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_counter_block_items_parent_id_idx" ON "pages_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_counter_block_order_idx" ON "pages_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_counter_block_parent_id_idx" ON "pages_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_counter_block_path_idx" ON "pages_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_progress_bar_block_items_order_idx" ON "pages_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_progress_bar_block_items_parent_id_idx" ON "pages_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_progress_bar_block_order_idx" ON "pages_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_progress_bar_block_parent_id_idx" ON "pages_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_progress_bar_block_path_idx" ON "pages_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_images_order_idx" ON "pages_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_images_parent_id_idx" ON "pages_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_images_image_idx" ON "pages_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_order_idx" ON "pages_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_parent_id_idx" ON "pages_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_image_gallery_block_path_idx" ON "pages_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_block_columns_order_idx" ON "pages_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_block_columns_parent_id_idx" ON "pages_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_block_order_idx" ON "pages_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_block_parent_id_idx" ON "pages_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_section_block_path_idx" ON "pages_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_block_order_idx" ON "pages_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_block_parent_id_idx" ON "pages_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_block_path_idx" ON "pages_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_quote_block_avatar_idx" ON "pages_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_divider_block_order_idx" ON "pages_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_divider_block_parent_id_idx" ON "pages_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_divider_block_path_idx" ON "pages_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_icon_block_order_idx" ON "pages_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_icon_block_parent_id_idx" ON "pages_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_icon_block_path_idx" ON "pages_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_feature_list_block_items_order_idx" ON "pages_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_feature_list_block_items_parent_id_idx" ON "pages_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_feature_list_block_order_idx" ON "pages_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_feature_list_block_parent_id_idx" ON "pages_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_feature_list_block_path_idx" ON "pages_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_members_order_idx" ON "pages_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_members_parent_id_idx" ON "pages_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_members_photo_idx" ON "pages_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_order_idx" ON "pages_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_parent_id_idx" ON "pages_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_grid_block_path_idx" ON "pages_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_feed_block_order_idx" ON "pages_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_feed_block_parent_id_idx" ON "pages_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_blog_feed_block_path_idx" ON "pages_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_block_order_idx" ON "pages_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_block_parent_id_idx" ON "pages_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_map_block_path_idx" ON "pages_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_block_order_idx" ON "pages_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_block_parent_id_idx" ON "pages_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_block_path_idx" ON "pages_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_headers_order_idx" ON "pages_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_headers_parent_id_idx" ON "pages_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_rows_cells_order_idx" ON "pages_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_rows_cells_parent_id_idx" ON "pages_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_rows_order_idx" ON "pages_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_rows_parent_id_idx" ON "pages_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_order_idx" ON "pages_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_parent_id_idx" ON "pages_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_table_block_path_idx" ON "pages_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_block_items_order_idx" ON "pages_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_block_items_parent_id_idx" ON "pages_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_block_order_idx" ON "pages_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_block_parent_id_idx" ON "pages_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_block_path_idx" ON "pages_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_steps_block_steps_order_idx" ON "pages_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_steps_block_steps_parent_id_idx" ON "pages_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_steps_block_order_idx" ON "pages_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_steps_block_parent_id_idx" ON "pages_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_steps_block_path_idx" ON "pages_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_announcement_bar_block_order_idx" ON "pages_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_announcement_bar_block_parent_id_idx" ON "pages_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_announcement_bar_block_path_idx" ON "pages_blocks_announcement_bar_block" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_block_order_idx" ON "_pages_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_block_parent_id_idx" ON "_pages_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_block_path_idx" ON "_pages_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_block_image_idx" ON "_pages_v_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_order_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_parent_id_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_rich_text_block_path_idx" ON "_pages_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_image_block_order_idx" ON "_pages_v_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_image_block_parent_id_idx" ON "_pages_v_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_image_block_path_idx" ON "_pages_v_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_text_image_block_image_idx" ON "_pages_v_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_block_order_idx" ON "_pages_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_block_parent_id_idx" ON "_pages_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_block_path_idx" ON "_pages_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_items_order_idx" ON "_pages_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_items_parent_id_idx" ON "_pages_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_order_idx" ON "_pages_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_parent_id_idx" ON "_pages_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_block_path_idx" ON "_pages_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_block_items_order_idx" ON "_pages_v_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_block_items_parent_id_idx" ON "_pages_v_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_block_order_idx" ON "_pages_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_block_parent_id_idx" ON "_pages_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_stats_block_path_idx" ON "_pages_v_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_block_items_order_idx" ON "_pages_v_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_block_items_parent_id_idx" ON "_pages_v_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_block_order_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_block_parent_id_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_block_path_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_col_block_order_idx" ON "_pages_v_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_col_block_parent_id_idx" ON "_pages_v_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_two_col_block_path_idx" ON "_pages_v_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_three_col_block_order_idx" ON "_pages_v_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_three_col_block_parent_id_idx" ON "_pages_v_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_three_col_block_path_idx" ON "_pages_v_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_block_plans_order_idx" ON "_pages_v_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_block_plans_parent_id_idx" ON "_pages_v_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_block_order_idx" ON "_pages_v_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_block_parent_id_idx" ON "_pages_v_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pricing_block_path_idx" ON "_pages_v_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_logos_order_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_logos_parent_id_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_logos_image_idx" ON "_pages_v_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_order_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_parent_id_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_path_idx" ON "_pages_v_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_block_order_idx" ON "_pages_v_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_block_parent_id_idx" ON "_pages_v_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_video_embed_block_path_idx" ON "_pages_v_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_block_order_idx" ON "_pages_v_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_block_parent_id_idx" ON "_pages_v_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_spacer_block_path_idx" ON "_pages_v_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_block_items_order_idx" ON "_pages_v_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_block_items_parent_id_idx" ON "_pages_v_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_block_order_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_block_parent_id_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_accordion_block_path_idx" ON "_pages_v_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_cards_order_idx" ON "_pages_v_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_cards_image_idx" ON "_pages_v_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_order_idx" ON "_pages_v_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_parent_id_idx" ON "_pages_v_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_card_grid_block_path_idx" ON "_pages_v_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_order_idx" ON "_pages_v_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_parent_id_idx" ON "_pages_v_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_button_block_path_idx" ON "_pages_v_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_order_idx" ON "_pages_v_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_parent_id_idx" ON "_pages_v_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_heading_block_path_idx" ON "_pages_v_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_order_idx" ON "_pages_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_parent_id_idx" ON "_pages_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_path_idx" ON "_pages_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_block_image_idx" ON "_pages_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_alert_block_order_idx" ON "_pages_v_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_alert_block_parent_id_idx" ON "_pages_v_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_alert_block_path_idx" ON "_pages_v_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tabs_block_tabs_order_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tabs_block_tabs_parent_id_idx" ON "_pages_v_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tabs_block_order_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tabs_block_parent_id_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tabs_block_path_idx" ON "_pages_v_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_social_icons_block_links_order_idx" ON "_pages_v_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_social_icons_block_links_parent_id_idx" ON "_pages_v_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_social_icons_block_order_idx" ON "_pages_v_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_social_icons_block_parent_id_idx" ON "_pages_v_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_social_icons_block_path_idx" ON "_pages_v_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_custom_html_block_order_idx" ON "_pages_v_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_custom_html_block_parent_id_idx" ON "_pages_v_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_custom_html_block_path_idx" ON "_pages_v_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_counter_block_items_order_idx" ON "_pages_v_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_counter_block_items_parent_id_idx" ON "_pages_v_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_counter_block_order_idx" ON "_pages_v_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_counter_block_parent_id_idx" ON "_pages_v_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_counter_block_path_idx" ON "_pages_v_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_progress_bar_block_items_order_idx" ON "_pages_v_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_progress_bar_block_items_parent_id_idx" ON "_pages_v_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_progress_bar_block_order_idx" ON "_pages_v_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_progress_bar_block_parent_id_idx" ON "_pages_v_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_progress_bar_block_path_idx" ON "_pages_v_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_images_order_idx" ON "_pages_v_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_images_image_idx" ON "_pages_v_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_order_idx" ON "_pages_v_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_parent_id_idx" ON "_pages_v_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_image_gallery_block_path_idx" ON "_pages_v_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_block_columns_order_idx" ON "_pages_v_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_block_columns_parent_id_idx" ON "_pages_v_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_block_order_idx" ON "_pages_v_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_block_parent_id_idx" ON "_pages_v_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_section_block_path_idx" ON "_pages_v_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_block_order_idx" ON "_pages_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_block_parent_id_idx" ON "_pages_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_block_path_idx" ON "_pages_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_quote_block_avatar_idx" ON "_pages_v_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_block_order_idx" ON "_pages_v_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_block_parent_id_idx" ON "_pages_v_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_divider_block_path_idx" ON "_pages_v_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_icon_block_order_idx" ON "_pages_v_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_icon_block_parent_id_idx" ON "_pages_v_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_icon_block_path_idx" ON "_pages_v_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_list_block_items_order_idx" ON "_pages_v_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_list_block_items_parent_id_idx" ON "_pages_v_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_list_block_order_idx" ON "_pages_v_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_list_block_parent_id_idx" ON "_pages_v_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_list_block_path_idx" ON "_pages_v_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_members_order_idx" ON "_pages_v_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_members_parent_id_idx" ON "_pages_v_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_members_photo_idx" ON "_pages_v_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_order_idx" ON "_pages_v_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_parent_id_idx" ON "_pages_v_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_grid_block_path_idx" ON "_pages_v_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_feed_block_order_idx" ON "_pages_v_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_feed_block_parent_id_idx" ON "_pages_v_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_blog_feed_block_path_idx" ON "_pages_v_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_block_order_idx" ON "_pages_v_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_block_parent_id_idx" ON "_pages_v_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_map_block_path_idx" ON "_pages_v_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_countdown_block_order_idx" ON "_pages_v_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_countdown_block_parent_id_idx" ON "_pages_v_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_countdown_block_path_idx" ON "_pages_v_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_headers_order_idx" ON "_pages_v_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_headers_parent_id_idx" ON "_pages_v_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_rows_cells_order_idx" ON "_pages_v_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_rows_cells_parent_id_idx" ON "_pages_v_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_rows_order_idx" ON "_pages_v_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_rows_parent_id_idx" ON "_pages_v_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_order_idx" ON "_pages_v_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_parent_id_idx" ON "_pages_v_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_table_block_path_idx" ON "_pages_v_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_block_items_order_idx" ON "_pages_v_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_block_items_parent_id_idx" ON "_pages_v_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_block_order_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_block_parent_id_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_block_path_idx" ON "_pages_v_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_block_steps_order_idx" ON "_pages_v_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_block_steps_parent_id_idx" ON "_pages_v_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_block_order_idx" ON "_pages_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_block_parent_id_idx" ON "_pages_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_steps_block_path_idx" ON "_pages_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_announcement_bar_block_order_idx" ON "_pages_v_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_announcement_bar_block_parent_id_idx" ON "_pages_v_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_announcement_bar_block_path_idx" ON "_pages_v_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_meta_version_meta_image_idx" ON "_services_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "case_studies_featured_image_idx" ON "case_studies" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_meta_meta_image_idx" ON "case_studies" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_version_featured_image_idx" ON "_case_studies_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_categories__status_idx" ON "blog_categories" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_parent_idx" ON "_blog_categories_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_version_version_slug_idx" ON "_blog_categories_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_version_version_updated_at_idx" ON "_blog_categories_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_version_version_created_at_idx" ON "_blog_categories_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_version_version__status_idx" ON "_blog_categories_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_created_at_idx" ON "_blog_categories_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_updated_at_idx" ON "_blog_categories_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_latest_idx" ON "_blog_categories_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_blog_categories_v_autosave_idx" ON "_blog_categories_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tags__status_idx" ON "tags" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_tags_v_version_version_slug_idx" ON "_tags_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_tags_v_version_version__status_idx" ON "_tags_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_tags_v_latest_idx" ON "_tags_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_tags_v_autosave_idx" ON "_tags_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_meta_meta_image_idx" ON "blog_posts" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_posts__status_idx" ON "blog_posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_blog_categories_id_idx" ON "blog_posts_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_tags_id_idx" ON "blog_posts_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_parent_idx" ON "_blog_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_slug_idx" ON "_blog_posts_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_featured_image_idx" ON "_blog_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_meta_version_meta_image_idx" ON "_blog_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_updated_at_idx" ON "_blog_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version_created_at_idx" ON "_blog_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_version_version__status_idx" ON "_blog_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_created_at_idx" ON "_blog_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_updated_at_idx" ON "_blog_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_latest_idx" ON "_blog_posts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_autosave_idx" ON "_blog_posts_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_order_idx" ON "_blog_posts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_parent_idx" ON "_blog_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_path_idx" ON "_blog_posts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_blog_categories_id_idx" ON "_blog_posts_v_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_rels_tags_id_idx" ON "_blog_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "menus_items_order_idx" ON "menus_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "menus_items_parent_id_idx" ON "menus_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "menus_location_idx" ON "menus" USING btree ("location");
  CREATE INDEX IF NOT EXISTS "menus_updated_at_idx" ON "menus" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "menus_created_at_idx" ON "menus" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_menus_v_version_items_order_idx" ON "_menus_v_version_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_menus_v_version_items_parent_id_idx" ON "_menus_v_version_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_menus_v_parent_idx" ON "_menus_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_menus_v_version_version_location_idx" ON "_menus_v" USING btree ("version_location");
  CREATE INDEX IF NOT EXISTS "_menus_v_version_version_updated_at_idx" ON "_menus_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_menus_v_version_version_created_at_idx" ON "_menus_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_menus_v_created_at_idx" ON "_menus_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_menus_v_updated_at_idx" ON "_menus_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "import_reports_slug_idx" ON "import_reports" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "import_reports_updated_at_idx" ON "import_reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "import_reports_created_at_idx" ON "import_reports" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_case_studies_id_idx" ON "redirects_rels" USING btree ("case_studies_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_blog_posts_id_idx" ON "redirects_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "navigation_links_order_idx" ON "navigation_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navigation_links_parent_id_idx" ON "navigation_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX IF NOT EXISTS "site_settings_organization_logo_idx" ON "site_settings" USING btree ("organization_logo_id");
  CREATE INDEX IF NOT EXISTS "site_settings_meta_meta_image_idx" ON "site_settings" USING btree ("meta_image_id");
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menus_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_import_reports_fk" FOREIGN KEY ("import_reports_id") REFERENCES "public"."import_reports"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  DO $$ BEGIN
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("menus_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_import_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("import_reports_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX IF NOT EXISTS "homepage_meta_meta_image_idx" ON "homepage" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "_homepage_v_version_meta_version_meta_image_idx" ON "_homepage_v" USING btree ("version_meta_image_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tags_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menus_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menus_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menus_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "import_reports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_block" CASCADE;
  DROP TABLE "pages_blocks_rich_text_block" CASCADE;
  DROP TABLE "pages_blocks_text_image_block" CASCADE;
  DROP TABLE "pages_blocks_cta_block" CASCADE;
  DROP TABLE "pages_blocks_faq_block_items" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "pages_blocks_stats_block_items" CASCADE;
  DROP TABLE "pages_blocks_stats_block" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block" CASCADE;
  DROP TABLE "pages_blocks_two_col_block" CASCADE;
  DROP TABLE "pages_blocks_three_col_block" CASCADE;
  DROP TABLE "pages_blocks_pricing_block_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing_block" CASCADE;
  DROP TABLE "pages_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_carousel_block" CASCADE;
  DROP TABLE "pages_blocks_video_embed_block" CASCADE;
  DROP TABLE "pages_blocks_spacer_block" CASCADE;
  DROP TABLE "pages_blocks_accordion_block_items" CASCADE;
  DROP TABLE "pages_blocks_accordion_block" CASCADE;
  DROP TABLE "pages_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid_block" CASCADE;
  DROP TABLE "pages_blocks_button_block" CASCADE;
  DROP TABLE "pages_blocks_heading_block" CASCADE;
  DROP TABLE "pages_blocks_image_block" CASCADE;
  DROP TABLE "pages_blocks_alert_block" CASCADE;
  DROP TABLE "pages_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE "pages_blocks_tabs_block" CASCADE;
  DROP TABLE "pages_blocks_social_icons_block_links" CASCADE;
  DROP TABLE "pages_blocks_social_icons_block" CASCADE;
  DROP TABLE "pages_blocks_custom_html_block" CASCADE;
  DROP TABLE "pages_blocks_counter_block_items" CASCADE;
  DROP TABLE "pages_blocks_counter_block" CASCADE;
  DROP TABLE "pages_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE "pages_blocks_progress_bar_block" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery_block" CASCADE;
  DROP TABLE "pages_blocks_section_block_columns" CASCADE;
  DROP TABLE "pages_blocks_section_block" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_quote_block" CASCADE;
  DROP TABLE "pages_blocks_divider_block" CASCADE;
  DROP TABLE "pages_blocks_icon_block" CASCADE;
  DROP TABLE "pages_blocks_feature_list_block_items" CASCADE;
  DROP TABLE "pages_blocks_feature_list_block" CASCADE;
  DROP TABLE "pages_blocks_team_grid_block_members" CASCADE;
  DROP TABLE "pages_blocks_team_grid_block" CASCADE;
  DROP TABLE "pages_blocks_blog_feed_block" CASCADE;
  DROP TABLE "pages_blocks_map_block" CASCADE;
  DROP TABLE "pages_blocks_countdown_block" CASCADE;
  DROP TABLE "pages_blocks_table_block_headers" CASCADE;
  DROP TABLE "pages_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE "pages_blocks_table_block_rows" CASCADE;
  DROP TABLE "pages_blocks_table_block" CASCADE;
  DROP TABLE "pages_blocks_timeline_block_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_block" CASCADE;
  DROP TABLE "pages_blocks_steps_block_steps" CASCADE;
  DROP TABLE "pages_blocks_steps_block" CASCADE;
  DROP TABLE "pages_blocks_announcement_bar_block" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_block" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_block" CASCADE;
  DROP TABLE "_pages_v_blocks_text_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_block" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_block" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_block" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block" CASCADE;
  DROP TABLE "_pages_v_blocks_two_col_block" CASCADE;
  DROP TABLE "_pages_v_blocks_three_col_block" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_block_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_block" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_carousel_block" CASCADE;
  DROP TABLE "_pages_v_blocks_video_embed_block" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer_block" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_block" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_block" CASCADE;
  DROP TABLE "_pages_v_blocks_button_block" CASCADE;
  DROP TABLE "_pages_v_blocks_heading_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_block" CASCADE;
  DROP TABLE "_pages_v_blocks_alert_block" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_tabs_block" CASCADE;
  DROP TABLE "_pages_v_blocks_social_icons_block_links" CASCADE;
  DROP TABLE "_pages_v_blocks_social_icons_block" CASCADE;
  DROP TABLE "_pages_v_blocks_custom_html_block" CASCADE;
  DROP TABLE "_pages_v_blocks_counter_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_counter_block" CASCADE;
  DROP TABLE "_pages_v_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_progress_bar_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_block" CASCADE;
  DROP TABLE "_pages_v_blocks_section_block_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_section_block" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_block" CASCADE;
  DROP TABLE "_pages_v_blocks_divider_block" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_list_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_list_block" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid_block_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team_grid_block" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_feed_block" CASCADE;
  DROP TABLE "_pages_v_blocks_map_block" CASCADE;
  DROP TABLE "_pages_v_blocks_countdown_block" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_headers" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_table_block" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_block" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_block" CASCADE;
  DROP TABLE "_pages_v_blocks_announcement_bar_block" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "_blog_categories_v" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_rels" CASCADE;
  DROP TABLE "_blog_posts_v" CASCADE;
  DROP TABLE "_blog_posts_v_rels" CASCADE;
  DROP TABLE "menus_items" CASCADE;
  DROP TABLE "menus" CASCADE;
  DROP TABLE "_menus_v_version_items" CASCADE;
  DROP TABLE "_menus_v" CASCADE;
  DROP TABLE "import_reports" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "navigation_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menus_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_import_reports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_meta_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_menus_id_idx";
  DROP INDEX "payload_locked_documents_rels_import_reports_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  DROP INDEX "homepage_meta_meta_image_idx";
  DROP INDEX "_homepage_v_version_meta_version_meta_image_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menus_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "import_reports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  ALTER TABLE "homepage" DROP COLUMN "nav_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "nav_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "nav_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "hero_primary_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "hero_primary_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "hero_primary_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "hero_secondary_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "hero_secondary_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "hero_secondary_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "about_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "about_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "about_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "case_studies_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "case_studies_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "case_studies_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "mission_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "mission_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "mission_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "insights_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "insights_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "insights_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "faq_cta_href_url";
  ALTER TABLE "homepage" DROP COLUMN "faq_cta_href_type";
  ALTER TABLE "homepage" DROP COLUMN "faq_cta_href_open_in_new_tab";
  ALTER TABLE "homepage" DROP COLUMN "meta_title";
  ALTER TABLE "homepage" DROP COLUMN "meta_description";
  ALTER TABLE "homepage" DROP COLUMN "meta_image_id";
  ALTER TABLE "homepage" DROP COLUMN "meta_canonical_u_r_l";
  ALTER TABLE "homepage" DROP COLUMN "meta_noindex";
  ALTER TABLE "homepage" DROP COLUMN "meta_keywords";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_nav_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_nav_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_nav_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_primary_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_primary_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_primary_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_secondary_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_secondary_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_secondary_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_about_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_about_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_about_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_case_studies_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_case_studies_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_case_studies_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_mission_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_mission_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_mission_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_insights_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_insights_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_insights_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_faq_cta_href_url";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_faq_cta_href_type";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_faq_cta_href_open_in_new_tab";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_canonical_u_r_l";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_meta_keywords";
  DROP TYPE "public"."enum_pages_blocks_text_image_block_layout";
  DROP TYPE "public"."enum_pages_blocks_two_col_block_gap";
  DROP TYPE "public"."enum_pages_blocks_three_col_block_gap";
  DROP TYPE "public"."enum_pages_blocks_card_grid_block_columns";
  DROP TYPE "public"."enum_pages_blocks_button_block_variant";
  DROP TYPE "public"."enum_pages_blocks_button_block_size";
  DROP TYPE "public"."enum_pages_blocks_button_block_align";
  DROP TYPE "public"."enum_pages_blocks_heading_block_tag";
  DROP TYPE "public"."enum_pages_blocks_heading_block_size";
  DROP TYPE "public"."enum_pages_blocks_heading_block_align";
  DROP TYPE "public"."enum_pages_blocks_image_block_object_position";
  DROP TYPE "public"."enum_pages_blocks_image_block_align";
  DROP TYPE "public"."enum_pages_blocks_alert_block_variant";
  DROP TYPE "public"."enum_pages_blocks_social_icons_block_align";
  DROP TYPE "public"."enum_pages_blocks_social_icons_block_size";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_block_columns";
  DROP TYPE "public"."enum_pages_blocks_section_block_columns_width";
  DROP TYPE "public"."enum_pages_blocks_form_block_layout";
  DROP TYPE "public"."enum_pages_blocks_form_block_background_style";
  DROP TYPE "public"."enum_pages_blocks_quote_block_size";
  DROP TYPE "public"."enum_pages_blocks_quote_block_align";
  DROP TYPE "public"."enum_pages_blocks_divider_block_style";
  DROP TYPE "public"."enum_pages_blocks_divider_block_width";
  DROP TYPE "public"."enum_pages_blocks_icon_block_size";
  DROP TYPE "public"."enum_pages_blocks_icon_block_align";
  DROP TYPE "public"."enum_pages_blocks_feature_list_block_layout";
  DROP TYPE "public"."enum_pages_blocks_feature_list_block_columns";
  DROP TYPE "public"."enum_pages_blocks_team_grid_block_columns";
  DROP TYPE "public"."enum_pages_blocks_team_grid_block_card_style";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_block_source";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_block_layout";
  DROP TYPE "public"."enum_pages_blocks_blog_feed_block_columns";
  DROP TYPE "public"."enum_pages_blocks_countdown_block_layout";
  DROP TYPE "public"."enum_pages_blocks_countdown_block_align";
  DROP TYPE "public"."enum_pages_blocks_timeline_block_layout";
  DROP TYPE "public"."enum_pages_blocks_steps_block_layout";
  DROP TYPE "public"."enum_pages_blocks_announcement_bar_block_style";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_text_image_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_two_col_block_gap";
  DROP TYPE "public"."enum__pages_v_blocks_three_col_block_gap";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_button_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_heading_block_tag";
  DROP TYPE "public"."enum__pages_v_blocks_heading_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_heading_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_image_block_object_position";
  DROP TYPE "public"."enum__pages_v_blocks_image_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_alert_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_social_icons_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_social_icons_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_section_block_columns_width";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_form_block_background_style";
  DROP TYPE "public"."enum__pages_v_blocks_quote_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_quote_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_divider_block_style";
  DROP TYPE "public"."enum__pages_v_blocks_divider_block_width";
  DROP TYPE "public"."enum__pages_v_blocks_icon_block_size";
  DROP TYPE "public"."enum__pages_v_blocks_icon_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_feature_list_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_feature_list_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_grid_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_grid_block_card_style";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_block_source";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_blog_feed_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_countdown_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_countdown_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_steps_block_layout";
  DROP TYPE "public"."enum__pages_v_blocks_announcement_bar_block_style";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum_blog_categories_status";
  DROP TYPE "public"."enum__blog_categories_v_version_status";
  DROP TYPE "public"."enum_tags_status";
  DROP TYPE "public"."enum__tags_v_version_status";
  DROP TYPE "public"."enum_blog_posts_status";
  DROP TYPE "public"."enum__blog_posts_v_version_status";
  DROP TYPE "public"."enum_menus_location";
  DROP TYPE "public"."enum__menus_v_version_location";
  DROP TYPE "public"."enum_import_reports_provider";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_homepage_nav_cta_href_type";
  DROP TYPE "public"."enum_homepage_hero_primary_cta_href_type";
  DROP TYPE "public"."enum_homepage_hero_secondary_cta_href_type";
  DROP TYPE "public"."enum_homepage_about_cta_href_type";
  DROP TYPE "public"."enum_homepage_case_studies_cta_href_type";
  DROP TYPE "public"."enum_homepage_mission_cta_href_type";
  DROP TYPE "public"."enum_homepage_insights_cta_href_type";
  DROP TYPE "public"."enum_homepage_faq_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_nav_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_hero_primary_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_hero_secondary_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_about_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_case_studies_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_mission_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_insights_cta_href_type";
  DROP TYPE "public"."enum__homepage_v_version_faq_cta_href_type";
  DROP TYPE "public"."enum_site_settings_robots_policy";`)
}
