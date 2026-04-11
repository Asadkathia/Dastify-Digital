import { sql } from '@payloadcms/db-postgres';
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_two_col_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "left_title" varchar,
      "left_text" varchar,
      "right_title" varchar,
      "right_text" varchar,
      "gap" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_two_col_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "left_title" varchar,
      "left_text" varchar,
      "right_title" varchar,
      "right_text" varchar,
      "gap" varchar,
      "_uuid" varchar,
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
      "gap" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_three_col_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "col1_title" varchar,
      "col1_text" varchar,
      "col2_title" varchar,
      "col2_text" varchar,
      "col3_title" varchar,
      "col3_text" varchar,
      "gap" varchar,
      "_uuid" varchar,
      "block_name" varchar
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pricing_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
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
      "highlighted" boolean
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pricing_block_plans" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "name" varchar,
      "price" varchar,
      "period" varchar,
      "description" varchar,
      "features" varchar,
      "cta_label" varchar,
      "cta_href" varchar,
      "highlighted" boolean,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_logo_carousel_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_carousel_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "_uuid" varchar,
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_carousel_block_logos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_alt" varchar,
      "href" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_video_embed_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "title" varchar,
      "caption" varchar,
      "autoplay" boolean,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_video_embed_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "url" varchar,
      "title" varchar,
      "caption" varchar,
      "autoplay" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_spacer_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "height" numeric,
      "show_divider" boolean,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_spacer_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "height" numeric,
      "show_divider" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_accordion_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_accordion_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar,
      "body" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_accordion_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "heading" varchar,
      "body" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_card_grid_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "subtitle" varchar,
      "columns" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "subtitle" varchar,
      "columns" varchar,
      "_uuid" varchar,
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_card_grid_block_cards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_alt" varchar,
      "eyebrow" varchar,
      "title" varchar,
      "text" varchar,
      "cta_label" varchar,
      "cta_href" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_button_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "variant" varchar,
      "size" varchar,
      "color" varchar,
      "align" varchar,
      "open_in_new_tab" boolean,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_button_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "label" varchar,
      "href" varchar,
      "variant" varchar,
      "size" varchar,
      "color" varchar,
      "align" varchar,
      "open_in_new_tab" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_heading_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "tag" varchar,
      "size" varchar,
      "align" varchar,
      "color" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_heading_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "text" varchar,
      "tag" varchar,
      "size" varchar,
      "align" varchar,
      "color" varchar,
      "_uuid" varchar,
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
      "open_in_new_tab" boolean,
      "border_radius" numeric,
      "object_position" varchar,
      "max_width" numeric,
      "align" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_alt" varchar,
      "caption" varchar,
      "href" varchar,
      "open_in_new_tab" boolean,
      "border_radius" numeric,
      "object_position" varchar,
      "max_width" numeric,
      "align" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_alert_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "variant" varchar,
      "title" varchar,
      "body" varchar,
      "dismissible" boolean,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_alert_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "variant" varchar,
      "title" varchar,
      "body" varchar,
      "dismissible" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_tabs_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tabs_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_tabs_block_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "content" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tabs_block_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "label" varchar,
      "content" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_social_icons_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "align" varchar,
      "size" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_social_icons_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "align" varchar,
      "size" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_social_icons_block_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" varchar,
      "url" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_social_icons_block_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "platform" varchar,
      "url" varchar,
      "_uuid" varchar
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_custom_html_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "label" varchar,
      "html" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_counter_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "duration" numeric,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_counter_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "duration" numeric,
      "_uuid" varchar,
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_counter_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "value" numeric,
      "prefix" varchar,
      "suffix" varchar,
      "label" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_progress_bar_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_progress_bar_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "_uuid" varchar,
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_progress_bar_block_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "label" varchar,
      "value" numeric,
      "color" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_image_gallery_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "columns" varchar,
      "lightbox" boolean,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "title" varchar,
      "columns" varchar,
      "lightbox" boolean,
      "_uuid" varchar,
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

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_image_gallery_block_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer PRIMARY KEY NOT NULL,
      "image_id" integer,
      "image_alt" varchar,
      "caption" varchar,
      "_uuid" varchar
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_image_gallery_block_images";
    DROP TABLE IF EXISTS "pages_blocks_image_gallery_block_images";
    DROP TABLE IF EXISTS "_pages_v_blocks_image_gallery_block";
    DROP TABLE IF EXISTS "pages_blocks_image_gallery_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_progress_bar_block_items";
    DROP TABLE IF EXISTS "pages_blocks_progress_bar_block_items";
    DROP TABLE IF EXISTS "_pages_v_blocks_progress_bar_block";
    DROP TABLE IF EXISTS "pages_blocks_progress_bar_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_counter_block_items";
    DROP TABLE IF EXISTS "pages_blocks_counter_block_items";
    DROP TABLE IF EXISTS "_pages_v_blocks_counter_block";
    DROP TABLE IF EXISTS "pages_blocks_counter_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_custom_html_block";
    DROP TABLE IF EXISTS "pages_blocks_custom_html_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_social_icons_block_links";
    DROP TABLE IF EXISTS "pages_blocks_social_icons_block_links";
    DROP TABLE IF EXISTS "_pages_v_blocks_social_icons_block";
    DROP TABLE IF EXISTS "pages_blocks_social_icons_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_tabs_block_tabs";
    DROP TABLE IF EXISTS "pages_blocks_tabs_block_tabs";
    DROP TABLE IF EXISTS "_pages_v_blocks_tabs_block";
    DROP TABLE IF EXISTS "pages_blocks_tabs_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_alert_block";
    DROP TABLE IF EXISTS "pages_blocks_alert_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_image_block";
    DROP TABLE IF EXISTS "pages_blocks_image_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_heading_block";
    DROP TABLE IF EXISTS "pages_blocks_heading_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_button_block";
    DROP TABLE IF EXISTS "pages_blocks_button_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_card_grid_block_cards";
    DROP TABLE IF EXISTS "pages_blocks_card_grid_block_cards";
    DROP TABLE IF EXISTS "_pages_v_blocks_card_grid_block";
    DROP TABLE IF EXISTS "pages_blocks_card_grid_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_accordion_block_items";
    DROP TABLE IF EXISTS "pages_blocks_accordion_block_items";
    DROP TABLE IF EXISTS "_pages_v_blocks_accordion_block";
    DROP TABLE IF EXISTS "pages_blocks_accordion_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_spacer_block";
    DROP TABLE IF EXISTS "pages_blocks_spacer_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_video_embed_block";
    DROP TABLE IF EXISTS "pages_blocks_video_embed_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_logo_carousel_block_logos";
    DROP TABLE IF EXISTS "pages_blocks_logo_carousel_block_logos";
    DROP TABLE IF EXISTS "_pages_v_blocks_logo_carousel_block";
    DROP TABLE IF EXISTS "pages_blocks_logo_carousel_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_pricing_block_plans";
    DROP TABLE IF EXISTS "pages_blocks_pricing_block_plans";
    DROP TABLE IF EXISTS "_pages_v_blocks_pricing_block";
    DROP TABLE IF EXISTS "pages_blocks_pricing_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_three_col_block";
    DROP TABLE IF EXISTS "_pages_v_blocks_two_col_block";
  `);
}
