import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_services_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__services_v_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_blog_posts_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_text_image_block_layout" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_two_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_three_col_block_gap" AS ENUM('small', 'medium', 'large'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_card_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_button_block_variant" AS ENUM('solid', 'outline', 'ghost'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_button_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_button_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_heading_block_tag" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_heading_block_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl', '2xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_heading_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_image_block_object_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_image_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_alert_block_variant" AS ENUM('info', 'success', 'warning', 'error'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_social_icons_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_social_icons_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_image_gallery_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_section_block_columns_width" AS ENUM('1/1', '1/2', '1/3', '2/3', '1/4', '3/4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_form_block_layout" AS ENUM('centered', 'left', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_form_block_background_style" AS ENUM('none', 'light', 'dark', 'brand'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_quote_block_size" AS ENUM('sm', 'md', 'lg'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_quote_block_align" AS ENUM('left', 'center'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_divider_block_style" AS ENUM('line', 'dashed', 'dotted', 'wave', 'none'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_divider_block_width" AS ENUM('full', '75', '50', '25'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_icon_block_size" AS ENUM('sm', 'md', 'lg', 'xl'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_icon_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_feature_list_block_layout" AS ENUM('grid', 'list', '2col'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_feature_list_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_team_grid_block_columns" AS ENUM('2', '3', '4'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_team_grid_block_card_style" AS ENUM('default', 'minimal', 'card'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_blog_feed_block_source" AS ENUM('latest', 'category', 'tag', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_blog_feed_block_layout" AS ENUM('grid', 'list', 'featured'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_blog_feed_block_columns" AS ENUM('2', '3'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_countdown_block_layout" AS ENUM('boxes', 'inline', 'minimal'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_countdown_block_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_timeline_block_layout" AS ENUM('vertical', 'horizontal', 'alternating'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_steps_block_layout" AS ENUM('horizontal', 'vertical', 'cards'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum__blog_posts_v_blocks_announcement_bar_block_style" AS ENUM('brand', 'dark', 'warning', 'success', 'info'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_footer_brand_socials_platform" AS ENUM('x', 'linkedin', 'youtube', 'facebook', 'instagram'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN CREATE TYPE "public"."enum_footer_badges_tone" AS ENUM('purple', 'blue', 'green'); EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  CREATE TABLE IF NOT EXISTS "services_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum_services_blocks_text_image_block_layout" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum_services_blocks_two_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_three_col_block" (
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
  	"gap" "enum_services_blocks_three_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_services_blocks_card_grid_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum_services_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum_services_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum_services_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum_services_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum_services_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum_services_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_image_block" (
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
  	"object_position" "enum_services_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum_services_blocks_image_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_services_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum_services_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum_services_blocks_social_icons_block_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_services_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_services_blocks_section_block_columns_width" DEFAULT '1/1'
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum_services_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum_services_blocks_form_block_background_style" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum_services_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum_services_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_services_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum_services_blocks_divider_block_width" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum_services_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum_services_blocks_icon_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_services_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum_services_blocks_feature_list_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_services_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum_services_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum_services_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_services_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum_services_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum_services_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum_services_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "services_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"accent_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_services_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_services_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum_services_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_version_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum__services_v_blocks_text_image_block_layout" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum__services_v_blocks_two_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_three_col_block" (
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
  	"gap" "enum__services_v_blocks_three_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__services_v_blocks_card_grid_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum__services_v_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum__services_v_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum__services_v_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum__services_v_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum__services_v_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum__services_v_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_image_block" (
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
  	"object_position" "enum__services_v_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum__services_v_blocks_image_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__services_v_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum__services_v_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum__services_v_blocks_social_icons_block_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__services_v_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__services_v_blocks_section_block_columns_width" DEFAULT '1/1',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum__services_v_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum__services_v_blocks_form_block_background_style" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum__services_v_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum__services_v_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__services_v_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum__services_v_blocks_divider_block_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum__services_v_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum__services_v_blocks_icon_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__services_v_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum__services_v_blocks_feature_list_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__services_v_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum__services_v_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum__services_v_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum__services_v_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum__services_v_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum__services_v_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum__services_v_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_timeline_block_items" (
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
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__services_v_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__services_v_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_services_v_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum__services_v_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum_case_studies_blocks_text_image_block_layout" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum_case_studies_blocks_two_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_three_col_block" (
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
  	"gap" "enum_case_studies_blocks_three_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_case_studies_blocks_card_grid_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum_case_studies_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum_case_studies_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum_case_studies_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum_case_studies_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum_case_studies_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum_case_studies_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_image_block" (
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
  	"object_position" "enum_case_studies_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum_case_studies_blocks_image_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_case_studies_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum_case_studies_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum_case_studies_blocks_social_icons_block_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_case_studies_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_case_studies_blocks_section_block_columns_width" DEFAULT '1/1'
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum_case_studies_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum_case_studies_blocks_form_block_background_style" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum_case_studies_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum_case_studies_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_case_studies_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum_case_studies_blocks_divider_block_width" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum_case_studies_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum_case_studies_blocks_icon_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_case_studies_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum_case_studies_blocks_feature_list_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_case_studies_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum_case_studies_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum_case_studies_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_case_studies_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum_case_studies_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum_case_studies_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum_case_studies_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"accent_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_case_studies_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_case_studies_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "case_studies_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum_case_studies_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum__case_studies_v_blocks_text_image_block_layout" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum__case_studies_v_blocks_two_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_three_col_block" (
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
  	"gap" "enum__case_studies_v_blocks_three_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__case_studies_v_blocks_card_grid_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum__case_studies_v_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum__case_studies_v_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum__case_studies_v_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum__case_studies_v_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum__case_studies_v_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum__case_studies_v_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_image_block" (
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
  	"object_position" "enum__case_studies_v_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum__case_studies_v_blocks_image_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__case_studies_v_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum__case_studies_v_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum__case_studies_v_blocks_social_icons_block_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__case_studies_v_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__case_studies_v_blocks_section_block_columns_width" DEFAULT '1/1',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum__case_studies_v_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum__case_studies_v_blocks_form_block_background_style" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum__case_studies_v_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum__case_studies_v_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__case_studies_v_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum__case_studies_v_blocks_divider_block_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum__case_studies_v_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum__case_studies_v_blocks_icon_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__case_studies_v_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum__case_studies_v_blocks_feature_list_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__case_studies_v_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum__case_studies_v_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum__case_studies_v_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum__case_studies_v_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum__case_studies_v_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum__case_studies_v_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum__case_studies_v_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_timeline_block_items" (
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
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__case_studies_v_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__case_studies_v_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum__case_studies_v_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum_blog_posts_blocks_text_image_block_layout" DEFAULT 'right',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum_blog_posts_blocks_two_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_three_col_block" (
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
  	"gap" "enum_blog_posts_blocks_three_col_block_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_blog_posts_blocks_card_grid_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum_blog_posts_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum_blog_posts_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum_blog_posts_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum_blog_posts_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum_blog_posts_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum_blog_posts_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_image_block" (
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
  	"object_position" "enum_blog_posts_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum_blog_posts_blocks_image_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_blog_posts_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum_blog_posts_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum_blog_posts_blocks_social_icons_block_size" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum_blog_posts_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_blog_posts_blocks_section_block_columns_width" DEFAULT '1/1'
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum_blog_posts_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum_blog_posts_blocks_form_block_background_style" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum_blog_posts_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum_blog_posts_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_blog_posts_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum_blog_posts_blocks_divider_block_width" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum_blog_posts_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum_blog_posts_blocks_icon_block_align" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_blog_posts_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum_blog_posts_blocks_feature_list_block_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum_blog_posts_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum_blog_posts_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum_blog_posts_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum_blog_posts_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum_blog_posts_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum_blog_posts_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum_blog_posts_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_timeline_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"accent_color" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_blog_posts_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum_blog_posts_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum_blog_posts_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_hero_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_text_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"layout" "enum__blog_posts_v_blocks_text_image_block_layout" DEFAULT 'right',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_cta_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_faq_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_stats_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_two_col_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_title" varchar,
  	"left_text" varchar,
  	"right_title" varchar,
  	"right_text" varchar,
  	"gap" "enum__blog_posts_v_blocks_two_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_three_col_block" (
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
  	"gap" "enum__blog_posts_v_blocks_three_col_block_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_plans" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_pricing_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_video_embed_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_spacer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" numeric DEFAULT 60,
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_accordion_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_cards" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__blog_posts_v_blocks_card_grid_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_button_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'Click Here',
  	"href" varchar DEFAULT '#',
  	"variant" "enum__blog_posts_v_blocks_button_block_variant" DEFAULT 'solid',
  	"size" "enum__blog_posts_v_blocks_button_block_size" DEFAULT 'md',
  	"color" varchar,
  	"align" "enum__blog_posts_v_blocks_button_block_align" DEFAULT 'center',
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_heading_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"tag" "enum__blog_posts_v_blocks_heading_block_tag" DEFAULT 'h2',
  	"size" "enum__blog_posts_v_blocks_heading_block_size" DEFAULT 'lg',
  	"align" "enum__blog_posts_v_blocks_heading_block_align" DEFAULT 'left',
  	"color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_image_block" (
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
  	"object_position" "enum__blog_posts_v_blocks_image_block_object_position" DEFAULT 'center',
  	"max_width" numeric,
  	"align" "enum__blog_posts_v_blocks_image_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_alert_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__blog_posts_v_blocks_alert_block_variant" DEFAULT 'info',
  	"title" varchar,
  	"body" varchar,
  	"dismissible" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"content" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_tabs_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"align" "enum__blog_posts_v_blocks_social_icons_block_align" DEFAULT 'center',
  	"size" "enum__blog_posts_v_blocks_social_icons_block_size" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_custom_html_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_counter_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_counter_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"columns" "enum__blog_posts_v_blocks_image_gallery_block_columns" DEFAULT '3',
  	"lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_section_block_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__blog_posts_v_blocks_section_block_columns_width" DEFAULT '1/1',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_section_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"layout" "enum__blog_posts_v_blocks_form_block_layout" DEFAULT 'centered',
  	"background_style" "enum__blog_posts_v_blocks_form_block_background_style" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"avatar_id" integer,
  	"size" "enum__blog_posts_v_blocks_quote_block_size" DEFAULT 'md',
  	"align" "enum__blog_posts_v_blocks_quote_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_divider_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__blog_posts_v_blocks_divider_block_style" DEFAULT 'line',
  	"color" varchar,
  	"thickness" numeric DEFAULT 1,
  	"spacing" numeric DEFAULT 32,
  	"width" "enum__blog_posts_v_blocks_divider_block_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_icon_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"size" "enum__blog_posts_v_blocks_icon_block_size" DEFAULT 'md',
  	"color" varchar,
  	"label" varchar,
  	"align" "enum__blog_posts_v_blocks_icon_block_align" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__blog_posts_v_blocks_feature_list_block_layout" DEFAULT 'grid',
  	"columns" "enum__blog_posts_v_blocks_feature_list_block_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_members" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"columns" "enum__blog_posts_v_blocks_team_grid_block_columns" DEFAULT '3',
  	"card_style" "enum__blog_posts_v_blocks_team_grid_block_card_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_blog_feed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"source" "enum__blog_posts_v_blocks_blog_feed_block_source" DEFAULT 'latest',
  	"category" varchar,
  	"tag" varchar,
  	"limit" numeric DEFAULT 3,
  	"layout" "enum__blog_posts_v_blocks_blog_feed_block_layout" DEFAULT 'grid',
  	"columns" "enum__blog_posts_v_blocks_blog_feed_block_columns" DEFAULT '3',
  	"show_excerpt" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_category" boolean DEFAULT true,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_map_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_countdown_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"target_date" timestamp(3) with time zone,
  	"expired_message" varchar,
  	"layout" "enum__blog_posts_v_blocks_countdown_block_layout" DEFAULT 'boxes',
  	"align" "enum__blog_posts_v_blocks_countdown_block_align" DEFAULT 'center',
  	"accent_color" varchar,
  	"show_labels" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_table_block_headers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_table_block" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_items" (
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
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_timeline_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__blog_posts_v_blocks_timeline_block_layout" DEFAULT 'vertical',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"layout" "enum__blog_posts_v_blocks_steps_block_layout" DEFAULT 'horizontal',
  	"accent_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_blog_posts_v_blocks_announcement_bar_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"style" "enum__blog_posts_v_blocks_announcement_bar_block_style" DEFAULT 'brand',
  	"dismissible" boolean DEFAULT true,
  	"icon" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "footer_brand_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_brand_socials_platform" NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
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
  	"label" varchar NOT NULL,
  	"tone" "enum_footer_badges_tone"
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_logo_image_id" integer,
  	"brand_name_prefix" varchar DEFAULT 'Dastify' NOT NULL,
  	"brand_accent" varchar DEFAULT '.' NOT NULL,
  	"brand_name_suffix" varchar DEFAULT 'Digital' NOT NULL,
  	"brand_tagline" varchar DEFAULT 'The creative authority for healthcare growth. HIPAA-compliant campaigns that fill your calendar.',
  	"cta_column_title" varchar,
  	"cta_column_button_label" varchar,
  	"cta_column_button_href" varchar,
  	"copyright" varchar DEFAULT '© 2026 Dastify Digital. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "services" ALTER COLUMN "content" SET DATA TYPE jsonb USING CASE WHEN "content" IS NULL OR "content" = '' THEN NULL WHEN "content" ~ '^\s*[\{\[]' THEN "content"::jsonb ELSE NULL END;
  ALTER TABLE "_services_v" ALTER COLUMN "version_content" SET DATA TYPE jsonb USING CASE WHEN "version_content" IS NULL OR "version_content" = '' THEN NULL WHEN "version_content" ~ '^\s*[\{\[]' THEN "version_content"::jsonb ELSE NULL END;
  ALTER TABLE "case_studies" ALTER COLUMN "content" SET DATA TYPE jsonb USING CASE WHEN "content" IS NULL OR "content" = '' THEN NULL WHEN "content" ~ '^\s*[\{\[]' THEN "content"::jsonb ELSE NULL END;
  ALTER TABLE "_case_studies_v" ALTER COLUMN "version_content" SET DATA TYPE jsonb USING CASE WHEN "version_content" IS NULL OR "version_content" = '' THEN NULL WHEN "version_content" ~ '^\s*[\{\[]' THEN "version_content"::jsonb ELSE NULL END;
  ALTER TABLE "blog_posts" ALTER COLUMN "content" SET DATA TYPE jsonb USING CASE WHEN "content" IS NULL OR "content" = '' THEN NULL WHEN "content" ~ '^\s*[\{\[]' THEN "content"::jsonb ELSE NULL END;
  ALTER TABLE "_blog_posts_v" ALTER COLUMN "version_content" SET DATA TYPE jsonb USING CASE WHEN "version_content" IS NULL OR "version_content" = '' THEN NULL WHEN "version_content" ~ '^\s*[\{\[]' THEN "version_content"::jsonb ELSE NULL END;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "display_order" numeric DEFAULT 10;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "tagline" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "outcomes_title" varchar DEFAULT 'What you get';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_label" varchar DEFAULT 'Learn more →';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "cta_href" varchar DEFAULT '/contact';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "hover_image_id" integer;
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_display_order" numeric DEFAULT 10;
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_tagline" varchar;
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_outcomes_title" varchar DEFAULT 'What you get';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_cta_label" varchar DEFAULT 'Learn more →';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_cta_href" varchar DEFAULT '/contact';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_hover_image_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;
  ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "filter_tag" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_featured" boolean DEFAULT false;
  ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_filter_tag" varchar;
  ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "logo_image_id" integer;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_outcomes" ADD CONSTRAINT "services_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_hero_block" ADD CONSTRAINT "services_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_hero_block" ADD CONSTRAINT "services_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_rich_text_block" ADD CONSTRAINT "services_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_text_image_block" ADD CONSTRAINT "services_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_text_image_block" ADD CONSTRAINT "services_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_cta_block" ADD CONSTRAINT "services_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_faq_block_items" ADD CONSTRAINT "services_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_faq_block" ADD CONSTRAINT "services_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_stats_block_items" ADD CONSTRAINT "services_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_stats_block" ADD CONSTRAINT "services_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_testimonials_block_items" ADD CONSTRAINT "services_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_testimonials_block" ADD CONSTRAINT "services_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_two_col_block" ADD CONSTRAINT "services_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_three_col_block" ADD CONSTRAINT "services_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_pricing_block_plans" ADD CONSTRAINT "services_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_pricing_block" ADD CONSTRAINT "services_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_logo_carousel_block_logos" ADD CONSTRAINT "services_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_logo_carousel_block_logos" ADD CONSTRAINT "services_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_logo_carousel_block" ADD CONSTRAINT "services_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_video_embed_block" ADD CONSTRAINT "services_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_spacer_block" ADD CONSTRAINT "services_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_accordion_block_items" ADD CONSTRAINT "services_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_accordion_block" ADD CONSTRAINT "services_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_card_grid_block_cards" ADD CONSTRAINT "services_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_card_grid_block_cards" ADD CONSTRAINT "services_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_card_grid_block" ADD CONSTRAINT "services_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_button_block" ADD CONSTRAINT "services_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_heading_block" ADD CONSTRAINT "services_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_image_block" ADD CONSTRAINT "services_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_image_block" ADD CONSTRAINT "services_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_alert_block" ADD CONSTRAINT "services_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_tabs_block_tabs" ADD CONSTRAINT "services_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_tabs_block" ADD CONSTRAINT "services_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_social_icons_block_links" ADD CONSTRAINT "services_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_social_icons_block" ADD CONSTRAINT "services_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_custom_html_block" ADD CONSTRAINT "services_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_counter_block_items" ADD CONSTRAINT "services_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_counter_block" ADD CONSTRAINT "services_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_progress_bar_block_items" ADD CONSTRAINT "services_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_progress_bar_block" ADD CONSTRAINT "services_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_image_gallery_block_images" ADD CONSTRAINT "services_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_image_gallery_block_images" ADD CONSTRAINT "services_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_image_gallery_block" ADD CONSTRAINT "services_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_section_block_columns" ADD CONSTRAINT "services_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_section_block" ADD CONSTRAINT "services_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_form_block" ADD CONSTRAINT "services_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_form_block" ADD CONSTRAINT "services_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_quote_block" ADD CONSTRAINT "services_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_quote_block" ADD CONSTRAINT "services_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_divider_block" ADD CONSTRAINT "services_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_icon_block" ADD CONSTRAINT "services_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_feature_list_block_items" ADD CONSTRAINT "services_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_feature_list_block" ADD CONSTRAINT "services_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_team_grid_block_members" ADD CONSTRAINT "services_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_team_grid_block_members" ADD CONSTRAINT "services_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_team_grid_block" ADD CONSTRAINT "services_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_blog_feed_block" ADD CONSTRAINT "services_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_map_block" ADD CONSTRAINT "services_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_countdown_block" ADD CONSTRAINT "services_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_table_block_headers" ADD CONSTRAINT "services_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_table_block_rows_cells" ADD CONSTRAINT "services_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_table_block_rows" ADD CONSTRAINT "services_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_table_block" ADD CONSTRAINT "services_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_timeline_block_items" ADD CONSTRAINT "services_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_timeline_block" ADD CONSTRAINT "services_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_steps_block_steps" ADD CONSTRAINT "services_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_steps_block" ADD CONSTRAINT "services_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services_blocks_announcement_bar_block" ADD CONSTRAINT "services_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_version_outcomes" ADD CONSTRAINT "_services_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_hero_block" ADD CONSTRAINT "_services_v_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_hero_block" ADD CONSTRAINT "_services_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_rich_text_block" ADD CONSTRAINT "_services_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_text_image_block" ADD CONSTRAINT "_services_v_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_text_image_block" ADD CONSTRAINT "_services_v_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_cta_block" ADD CONSTRAINT "_services_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_faq_block_items" ADD CONSTRAINT "_services_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_faq_block" ADD CONSTRAINT "_services_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_stats_block_items" ADD CONSTRAINT "_services_v_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_stats_block" ADD CONSTRAINT "_services_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_testimonials_block_items" ADD CONSTRAINT "_services_v_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_testimonials_block" ADD CONSTRAINT "_services_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_two_col_block" ADD CONSTRAINT "_services_v_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_three_col_block" ADD CONSTRAINT "_services_v_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_pricing_block_plans" ADD CONSTRAINT "_services_v_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_pricing_block" ADD CONSTRAINT "_services_v_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_services_v_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_services_v_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_logo_carousel_block" ADD CONSTRAINT "_services_v_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_video_embed_block" ADD CONSTRAINT "_services_v_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_spacer_block" ADD CONSTRAINT "_services_v_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_accordion_block_items" ADD CONSTRAINT "_services_v_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_accordion_block" ADD CONSTRAINT "_services_v_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_services_v_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_services_v_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_card_grid_block" ADD CONSTRAINT "_services_v_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_button_block" ADD CONSTRAINT "_services_v_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_heading_block" ADD CONSTRAINT "_services_v_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_image_block" ADD CONSTRAINT "_services_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_image_block" ADD CONSTRAINT "_services_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_alert_block" ADD CONSTRAINT "_services_v_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_services_v_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_tabs_block" ADD CONSTRAINT "_services_v_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_social_icons_block_links" ADD CONSTRAINT "_services_v_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_social_icons_block" ADD CONSTRAINT "_services_v_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_custom_html_block" ADD CONSTRAINT "_services_v_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_counter_block_items" ADD CONSTRAINT "_services_v_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_counter_block" ADD CONSTRAINT "_services_v_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_progress_bar_block_items" ADD CONSTRAINT "_services_v_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_progress_bar_block" ADD CONSTRAINT "_services_v_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_services_v_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_services_v_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_image_gallery_block" ADD CONSTRAINT "_services_v_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_section_block_columns" ADD CONSTRAINT "_services_v_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_section_block" ADD CONSTRAINT "_services_v_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_form_block" ADD CONSTRAINT "_services_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_form_block" ADD CONSTRAINT "_services_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_quote_block" ADD CONSTRAINT "_services_v_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_quote_block" ADD CONSTRAINT "_services_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_divider_block" ADD CONSTRAINT "_services_v_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_icon_block" ADD CONSTRAINT "_services_v_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_feature_list_block_items" ADD CONSTRAINT "_services_v_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_feature_list_block" ADD CONSTRAINT "_services_v_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_team_grid_block_members" ADD CONSTRAINT "_services_v_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_team_grid_block_members" ADD CONSTRAINT "_services_v_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_team_grid_block" ADD CONSTRAINT "_services_v_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_blog_feed_block" ADD CONSTRAINT "_services_v_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_map_block" ADD CONSTRAINT "_services_v_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_countdown_block" ADD CONSTRAINT "_services_v_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_table_block_headers" ADD CONSTRAINT "_services_v_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_table_block_rows_cells" ADD CONSTRAINT "_services_v_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_table_block_rows" ADD CONSTRAINT "_services_v_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_table_block" ADD CONSTRAINT "_services_v_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_timeline_block_items" ADD CONSTRAINT "_services_v_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_timeline_block" ADD CONSTRAINT "_services_v_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_steps_block_steps" ADD CONSTRAINT "_services_v_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_steps_block" ADD CONSTRAINT "_services_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v_blocks_announcement_bar_block" ADD CONSTRAINT "_services_v_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_stats" ADD CONSTRAINT "case_studies_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_hero_block" ADD CONSTRAINT "case_studies_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_hero_block" ADD CONSTRAINT "case_studies_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_rich_text_block" ADD CONSTRAINT "case_studies_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_text_image_block" ADD CONSTRAINT "case_studies_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_text_image_block" ADD CONSTRAINT "case_studies_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_cta_block" ADD CONSTRAINT "case_studies_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_faq_block_items" ADD CONSTRAINT "case_studies_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_faq_block" ADD CONSTRAINT "case_studies_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_stats_block_items" ADD CONSTRAINT "case_studies_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_stats_block" ADD CONSTRAINT "case_studies_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_testimonials_block_items" ADD CONSTRAINT "case_studies_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_testimonials_block" ADD CONSTRAINT "case_studies_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_two_col_block" ADD CONSTRAINT "case_studies_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_three_col_block" ADD CONSTRAINT "case_studies_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_pricing_block_plans" ADD CONSTRAINT "case_studies_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_pricing_block" ADD CONSTRAINT "case_studies_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_logo_carousel_block_logos" ADD CONSTRAINT "case_studies_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_logo_carousel_block_logos" ADD CONSTRAINT "case_studies_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_logo_carousel_block" ADD CONSTRAINT "case_studies_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_video_embed_block" ADD CONSTRAINT "case_studies_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_spacer_block" ADD CONSTRAINT "case_studies_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_accordion_block_items" ADD CONSTRAINT "case_studies_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_accordion_block" ADD CONSTRAINT "case_studies_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_card_grid_block_cards" ADD CONSTRAINT "case_studies_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_card_grid_block_cards" ADD CONSTRAINT "case_studies_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_card_grid_block" ADD CONSTRAINT "case_studies_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_button_block" ADD CONSTRAINT "case_studies_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_heading_block" ADD CONSTRAINT "case_studies_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_image_block" ADD CONSTRAINT "case_studies_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_image_block" ADD CONSTRAINT "case_studies_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_alert_block" ADD CONSTRAINT "case_studies_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_tabs_block_tabs" ADD CONSTRAINT "case_studies_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_tabs_block" ADD CONSTRAINT "case_studies_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_social_icons_block_links" ADD CONSTRAINT "case_studies_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_social_icons_block" ADD CONSTRAINT "case_studies_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_custom_html_block" ADD CONSTRAINT "case_studies_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_counter_block_items" ADD CONSTRAINT "case_studies_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_counter_block" ADD CONSTRAINT "case_studies_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_progress_bar_block_items" ADD CONSTRAINT "case_studies_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_progress_bar_block" ADD CONSTRAINT "case_studies_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_image_gallery_block_images" ADD CONSTRAINT "case_studies_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_image_gallery_block_images" ADD CONSTRAINT "case_studies_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_image_gallery_block" ADD CONSTRAINT "case_studies_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_section_block_columns" ADD CONSTRAINT "case_studies_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_section_block" ADD CONSTRAINT "case_studies_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_form_block" ADD CONSTRAINT "case_studies_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_form_block" ADD CONSTRAINT "case_studies_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_quote_block" ADD CONSTRAINT "case_studies_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_quote_block" ADD CONSTRAINT "case_studies_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_divider_block" ADD CONSTRAINT "case_studies_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_icon_block" ADD CONSTRAINT "case_studies_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_feature_list_block_items" ADD CONSTRAINT "case_studies_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_feature_list_block" ADD CONSTRAINT "case_studies_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_team_grid_block_members" ADD CONSTRAINT "case_studies_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_team_grid_block_members" ADD CONSTRAINT "case_studies_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_team_grid_block" ADD CONSTRAINT "case_studies_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_blog_feed_block" ADD CONSTRAINT "case_studies_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_map_block" ADD CONSTRAINT "case_studies_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_countdown_block" ADD CONSTRAINT "case_studies_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_table_block_headers" ADD CONSTRAINT "case_studies_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_table_block_rows_cells" ADD CONSTRAINT "case_studies_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_table_block_rows" ADD CONSTRAINT "case_studies_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_table_block" ADD CONSTRAINT "case_studies_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_timeline_block_items" ADD CONSTRAINT "case_studies_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_timeline_block" ADD CONSTRAINT "case_studies_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_steps_block_steps" ADD CONSTRAINT "case_studies_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_steps_block" ADD CONSTRAINT "case_studies_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "case_studies_blocks_announcement_bar_block" ADD CONSTRAINT "case_studies_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_version_stats" ADD CONSTRAINT "_case_studies_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_hero_block" ADD CONSTRAINT "_case_studies_v_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_hero_block" ADD CONSTRAINT "_case_studies_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_rich_text_block" ADD CONSTRAINT "_case_studies_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_text_image_block" ADD CONSTRAINT "_case_studies_v_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_text_image_block" ADD CONSTRAINT "_case_studies_v_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_cta_block" ADD CONSTRAINT "_case_studies_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_faq_block_items" ADD CONSTRAINT "_case_studies_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_faq_block" ADD CONSTRAINT "_case_studies_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_stats_block_items" ADD CONSTRAINT "_case_studies_v_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_stats_block" ADD CONSTRAINT "_case_studies_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_testimonials_block_items" ADD CONSTRAINT "_case_studies_v_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_testimonials_block" ADD CONSTRAINT "_case_studies_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_two_col_block" ADD CONSTRAINT "_case_studies_v_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_three_col_block" ADD CONSTRAINT "_case_studies_v_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_pricing_block_plans" ADD CONSTRAINT "_case_studies_v_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_pricing_block" ADD CONSTRAINT "_case_studies_v_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_case_studies_v_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_case_studies_v_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_logo_carousel_block" ADD CONSTRAINT "_case_studies_v_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_video_embed_block" ADD CONSTRAINT "_case_studies_v_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_spacer_block" ADD CONSTRAINT "_case_studies_v_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_accordion_block_items" ADD CONSTRAINT "_case_studies_v_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_accordion_block" ADD CONSTRAINT "_case_studies_v_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_case_studies_v_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_case_studies_v_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_card_grid_block" ADD CONSTRAINT "_case_studies_v_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_button_block" ADD CONSTRAINT "_case_studies_v_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_heading_block" ADD CONSTRAINT "_case_studies_v_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_image_block" ADD CONSTRAINT "_case_studies_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_image_block" ADD CONSTRAINT "_case_studies_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_alert_block" ADD CONSTRAINT "_case_studies_v_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_case_studies_v_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_tabs_block" ADD CONSTRAINT "_case_studies_v_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_social_icons_block_links" ADD CONSTRAINT "_case_studies_v_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_social_icons_block" ADD CONSTRAINT "_case_studies_v_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_custom_html_block" ADD CONSTRAINT "_case_studies_v_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_counter_block_items" ADD CONSTRAINT "_case_studies_v_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_counter_block" ADD CONSTRAINT "_case_studies_v_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_progress_bar_block_items" ADD CONSTRAINT "_case_studies_v_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_progress_bar_block" ADD CONSTRAINT "_case_studies_v_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_case_studies_v_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_case_studies_v_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_image_gallery_block" ADD CONSTRAINT "_case_studies_v_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_section_block_columns" ADD CONSTRAINT "_case_studies_v_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_section_block" ADD CONSTRAINT "_case_studies_v_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_form_block" ADD CONSTRAINT "_case_studies_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_form_block" ADD CONSTRAINT "_case_studies_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_quote_block" ADD CONSTRAINT "_case_studies_v_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_quote_block" ADD CONSTRAINT "_case_studies_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_divider_block" ADD CONSTRAINT "_case_studies_v_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_icon_block" ADD CONSTRAINT "_case_studies_v_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_feature_list_block_items" ADD CONSTRAINT "_case_studies_v_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_feature_list_block" ADD CONSTRAINT "_case_studies_v_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_team_grid_block_members" ADD CONSTRAINT "_case_studies_v_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_team_grid_block_members" ADD CONSTRAINT "_case_studies_v_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_team_grid_block" ADD CONSTRAINT "_case_studies_v_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_blog_feed_block" ADD CONSTRAINT "_case_studies_v_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_map_block" ADD CONSTRAINT "_case_studies_v_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_countdown_block" ADD CONSTRAINT "_case_studies_v_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_table_block_headers" ADD CONSTRAINT "_case_studies_v_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_table_block_rows_cells" ADD CONSTRAINT "_case_studies_v_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_table_block_rows" ADD CONSTRAINT "_case_studies_v_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_table_block" ADD CONSTRAINT "_case_studies_v_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_timeline_block_items" ADD CONSTRAINT "_case_studies_v_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_timeline_block" ADD CONSTRAINT "_case_studies_v_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_steps_block_steps" ADD CONSTRAINT "_case_studies_v_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_steps_block" ADD CONSTRAINT "_case_studies_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_case_studies_v_blocks_announcement_bar_block" ADD CONSTRAINT "_case_studies_v_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_hero_block" ADD CONSTRAINT "blog_posts_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_hero_block" ADD CONSTRAINT "blog_posts_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_rich_text_block" ADD CONSTRAINT "blog_posts_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_text_image_block" ADD CONSTRAINT "blog_posts_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_text_image_block" ADD CONSTRAINT "blog_posts_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_cta_block" ADD CONSTRAINT "blog_posts_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_faq_block_items" ADD CONSTRAINT "blog_posts_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_faq_block" ADD CONSTRAINT "blog_posts_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_stats_block_items" ADD CONSTRAINT "blog_posts_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_stats_block" ADD CONSTRAINT "blog_posts_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_testimonials_block_items" ADD CONSTRAINT "blog_posts_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_testimonials_block" ADD CONSTRAINT "blog_posts_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_two_col_block" ADD CONSTRAINT "blog_posts_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_three_col_block" ADD CONSTRAINT "blog_posts_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_pricing_block_plans" ADD CONSTRAINT "blog_posts_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_pricing_block" ADD CONSTRAINT "blog_posts_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_logo_carousel_block_logos" ADD CONSTRAINT "blog_posts_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_logo_carousel_block_logos" ADD CONSTRAINT "blog_posts_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_logo_carousel_block" ADD CONSTRAINT "blog_posts_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_video_embed_block" ADD CONSTRAINT "blog_posts_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_spacer_block" ADD CONSTRAINT "blog_posts_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_accordion_block_items" ADD CONSTRAINT "blog_posts_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_accordion_block" ADD CONSTRAINT "blog_posts_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_card_grid_block_cards" ADD CONSTRAINT "blog_posts_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_card_grid_block_cards" ADD CONSTRAINT "blog_posts_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_card_grid_block" ADD CONSTRAINT "blog_posts_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_button_block" ADD CONSTRAINT "blog_posts_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_heading_block" ADD CONSTRAINT "blog_posts_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_image_block" ADD CONSTRAINT "blog_posts_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_image_block" ADD CONSTRAINT "blog_posts_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_alert_block" ADD CONSTRAINT "blog_posts_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_tabs_block_tabs" ADD CONSTRAINT "blog_posts_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_tabs_block" ADD CONSTRAINT "blog_posts_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_social_icons_block_links" ADD CONSTRAINT "blog_posts_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_social_icons_block" ADD CONSTRAINT "blog_posts_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_custom_html_block" ADD CONSTRAINT "blog_posts_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_counter_block_items" ADD CONSTRAINT "blog_posts_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_counter_block" ADD CONSTRAINT "blog_posts_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_progress_bar_block_items" ADD CONSTRAINT "blog_posts_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_progress_bar_block" ADD CONSTRAINT "blog_posts_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_image_gallery_block_images" ADD CONSTRAINT "blog_posts_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_image_gallery_block_images" ADD CONSTRAINT "blog_posts_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_image_gallery_block" ADD CONSTRAINT "blog_posts_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_section_block_columns" ADD CONSTRAINT "blog_posts_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_section_block" ADD CONSTRAINT "blog_posts_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_form_block" ADD CONSTRAINT "blog_posts_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_form_block" ADD CONSTRAINT "blog_posts_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_quote_block" ADD CONSTRAINT "blog_posts_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_quote_block" ADD CONSTRAINT "blog_posts_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_divider_block" ADD CONSTRAINT "blog_posts_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_icon_block" ADD CONSTRAINT "blog_posts_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_feature_list_block_items" ADD CONSTRAINT "blog_posts_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_feature_list_block" ADD CONSTRAINT "blog_posts_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_team_grid_block_members" ADD CONSTRAINT "blog_posts_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_team_grid_block_members" ADD CONSTRAINT "blog_posts_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_team_grid_block" ADD CONSTRAINT "blog_posts_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_blog_feed_block" ADD CONSTRAINT "blog_posts_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_map_block" ADD CONSTRAINT "blog_posts_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_countdown_block" ADD CONSTRAINT "blog_posts_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_table_block_headers" ADD CONSTRAINT "blog_posts_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_table_block_rows_cells" ADD CONSTRAINT "blog_posts_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_table_block_rows" ADD CONSTRAINT "blog_posts_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_table_block" ADD CONSTRAINT "blog_posts_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_timeline_block_items" ADD CONSTRAINT "blog_posts_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_timeline_block" ADD CONSTRAINT "blog_posts_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_steps_block_steps" ADD CONSTRAINT "blog_posts_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_steps_block" ADD CONSTRAINT "blog_posts_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "blog_posts_blocks_announcement_bar_block" ADD CONSTRAINT "blog_posts_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_hero_block" ADD CONSTRAINT "_blog_posts_v_blocks_hero_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_hero_block" ADD CONSTRAINT "_blog_posts_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_rich_text_block" ADD CONSTRAINT "_blog_posts_v_blocks_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_text_image_block" ADD CONSTRAINT "_blog_posts_v_blocks_text_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_text_image_block" ADD CONSTRAINT "_blog_posts_v_blocks_text_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_cta_block" ADD CONSTRAINT "_blog_posts_v_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_faq_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_faq_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_faq_block" ADD CONSTRAINT "_blog_posts_v_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_stats_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_stats_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_stats_block" ADD CONSTRAINT "_blog_posts_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_testimonials_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_testimonials_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_testimonials_block" ADD CONSTRAINT "_blog_posts_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_two_col_block" ADD CONSTRAINT "_blog_posts_v_blocks_two_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_three_col_block" ADD CONSTRAINT "_blog_posts_v_blocks_three_col_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_pricing_block_plans" ADD CONSTRAINT "_blog_posts_v_blocks_pricing_block_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_pricing_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_pricing_block" ADD CONSTRAINT "_blog_posts_v_blocks_pricing_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_blog_posts_v_blocks_logo_carousel_block_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_logo_carousel_block_logos" ADD CONSTRAINT "_blog_posts_v_blocks_logo_carousel_block_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_logo_carousel_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_logo_carousel_block" ADD CONSTRAINT "_blog_posts_v_blocks_logo_carousel_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_video_embed_block" ADD CONSTRAINT "_blog_posts_v_blocks_video_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_spacer_block" ADD CONSTRAINT "_blog_posts_v_blocks_spacer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_accordion_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_accordion_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_accordion_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_accordion_block" ADD CONSTRAINT "_blog_posts_v_blocks_accordion_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_blog_posts_v_blocks_card_grid_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_card_grid_block_cards" ADD CONSTRAINT "_blog_posts_v_blocks_card_grid_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_card_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_card_grid_block" ADD CONSTRAINT "_blog_posts_v_blocks_card_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_button_block" ADD CONSTRAINT "_blog_posts_v_blocks_button_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_heading_block" ADD CONSTRAINT "_blog_posts_v_blocks_heading_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_image_block" ADD CONSTRAINT "_blog_posts_v_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_image_block" ADD CONSTRAINT "_blog_posts_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_alert_block" ADD CONSTRAINT "_blog_posts_v_blocks_alert_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_tabs_block_tabs" ADD CONSTRAINT "_blog_posts_v_blocks_tabs_block_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_tabs_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_tabs_block" ADD CONSTRAINT "_blog_posts_v_blocks_tabs_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_social_icons_block_links" ADD CONSTRAINT "_blog_posts_v_blocks_social_icons_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_social_icons_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_social_icons_block" ADD CONSTRAINT "_blog_posts_v_blocks_social_icons_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_custom_html_block" ADD CONSTRAINT "_blog_posts_v_blocks_custom_html_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_counter_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_counter_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_counter_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_counter_block" ADD CONSTRAINT "_blog_posts_v_blocks_counter_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_progress_bar_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_progress_bar_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_progress_bar_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_progress_bar_block" ADD CONSTRAINT "_blog_posts_v_blocks_progress_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_blog_posts_v_blocks_image_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_image_gallery_block_images" ADD CONSTRAINT "_blog_posts_v_blocks_image_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_image_gallery_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_image_gallery_block" ADD CONSTRAINT "_blog_posts_v_blocks_image_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_section_block_columns" ADD CONSTRAINT "_blog_posts_v_blocks_section_block_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_section_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_section_block" ADD CONSTRAINT "_blog_posts_v_blocks_section_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_form_block" ADD CONSTRAINT "_blog_posts_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_form_block" ADD CONSTRAINT "_blog_posts_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_quote_block" ADD CONSTRAINT "_blog_posts_v_blocks_quote_block_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_quote_block" ADD CONSTRAINT "_blog_posts_v_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_divider_block" ADD CONSTRAINT "_blog_posts_v_blocks_divider_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_icon_block" ADD CONSTRAINT "_blog_posts_v_blocks_icon_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_feature_list_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_feature_list_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_feature_list_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_feature_list_block" ADD CONSTRAINT "_blog_posts_v_blocks_feature_list_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_team_grid_block_members" ADD CONSTRAINT "_blog_posts_v_blocks_team_grid_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_team_grid_block_members" ADD CONSTRAINT "_blog_posts_v_blocks_team_grid_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_team_grid_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_team_grid_block" ADD CONSTRAINT "_blog_posts_v_blocks_team_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_blog_feed_block" ADD CONSTRAINT "_blog_posts_v_blocks_blog_feed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_map_block" ADD CONSTRAINT "_blog_posts_v_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_countdown_block" ADD CONSTRAINT "_blog_posts_v_blocks_countdown_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_table_block_headers" ADD CONSTRAINT "_blog_posts_v_blocks_table_block_headers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_table_block_rows_cells" ADD CONSTRAINT "_blog_posts_v_blocks_table_block_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_table_block_rows"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_table_block_rows" ADD CONSTRAINT "_blog_posts_v_blocks_table_block_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_table_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_table_block" ADD CONSTRAINT "_blog_posts_v_blocks_table_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_timeline_block_items" ADD CONSTRAINT "_blog_posts_v_blocks_timeline_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_timeline_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_timeline_block" ADD CONSTRAINT "_blog_posts_v_blocks_timeline_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_steps_block_steps" ADD CONSTRAINT "_blog_posts_v_blocks_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v_blocks_steps_block"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_steps_block" ADD CONSTRAINT "_blog_posts_v_blocks_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_blog_posts_v_blocks_announcement_bar_block" ADD CONSTRAINT "_blog_posts_v_blocks_announcement_bar_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_posts_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer_brand_socials" ADD CONSTRAINT "footer_brand_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer_cta_column_links" ADD CONSTRAINT "footer_cta_column_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer_badges" ADD CONSTRAINT "footer_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "footer" ADD CONSTRAINT "footer_brand_logo_image_id_media_id_fk" FOREIGN KEY ("brand_logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  CREATE INDEX IF NOT EXISTS "services_outcomes_order_idx" ON "services_outcomes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_outcomes_parent_id_idx" ON "services_outcomes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_hero_block_order_idx" ON "services_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_hero_block_parent_id_idx" ON "services_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_hero_block_path_idx" ON "services_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_hero_block_image_idx" ON "services_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_rich_text_block_order_idx" ON "services_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_rich_text_block_parent_id_idx" ON "services_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_rich_text_block_path_idx" ON "services_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_text_image_block_order_idx" ON "services_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_text_image_block_parent_id_idx" ON "services_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_text_image_block_path_idx" ON "services_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_text_image_block_image_idx" ON "services_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_cta_block_order_idx" ON "services_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_cta_block_parent_id_idx" ON "services_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_cta_block_path_idx" ON "services_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_faq_block_items_order_idx" ON "services_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_faq_block_items_parent_id_idx" ON "services_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_faq_block_order_idx" ON "services_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_faq_block_parent_id_idx" ON "services_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_faq_block_path_idx" ON "services_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_stats_block_items_order_idx" ON "services_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_stats_block_items_parent_id_idx" ON "services_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_stats_block_order_idx" ON "services_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_stats_block_parent_id_idx" ON "services_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_stats_block_path_idx" ON "services_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_testimonials_block_items_order_idx" ON "services_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_testimonials_block_items_parent_id_idx" ON "services_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_testimonials_block_order_idx" ON "services_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_testimonials_block_parent_id_idx" ON "services_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_testimonials_block_path_idx" ON "services_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_two_col_block_order_idx" ON "services_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_two_col_block_parent_id_idx" ON "services_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_two_col_block_path_idx" ON "services_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_three_col_block_order_idx" ON "services_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_three_col_block_parent_id_idx" ON "services_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_three_col_block_path_idx" ON "services_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_pricing_block_plans_order_idx" ON "services_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_pricing_block_plans_parent_id_idx" ON "services_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_pricing_block_order_idx" ON "services_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_pricing_block_parent_id_idx" ON "services_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_pricing_block_path_idx" ON "services_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_logos_order_idx" ON "services_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_logos_parent_id_idx" ON "services_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_logos_image_idx" ON "services_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_order_idx" ON "services_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_parent_id_idx" ON "services_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_logo_carousel_block_path_idx" ON "services_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_video_embed_block_order_idx" ON "services_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_video_embed_block_parent_id_idx" ON "services_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_video_embed_block_path_idx" ON "services_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_spacer_block_order_idx" ON "services_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_spacer_block_parent_id_idx" ON "services_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_spacer_block_path_idx" ON "services_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_accordion_block_items_order_idx" ON "services_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_accordion_block_items_parent_id_idx" ON "services_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_accordion_block_order_idx" ON "services_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_accordion_block_parent_id_idx" ON "services_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_accordion_block_path_idx" ON "services_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_cards_order_idx" ON "services_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_cards_parent_id_idx" ON "services_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_cards_image_idx" ON "services_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_order_idx" ON "services_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_parent_id_idx" ON "services_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_card_grid_block_path_idx" ON "services_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_button_block_order_idx" ON "services_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_button_block_parent_id_idx" ON "services_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_button_block_path_idx" ON "services_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_heading_block_order_idx" ON "services_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_heading_block_parent_id_idx" ON "services_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_heading_block_path_idx" ON "services_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_block_order_idx" ON "services_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_block_parent_id_idx" ON "services_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_block_path_idx" ON "services_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_block_image_idx" ON "services_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_alert_block_order_idx" ON "services_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_alert_block_parent_id_idx" ON "services_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_alert_block_path_idx" ON "services_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_tabs_block_tabs_order_idx" ON "services_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_tabs_block_tabs_parent_id_idx" ON "services_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_tabs_block_order_idx" ON "services_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_tabs_block_parent_id_idx" ON "services_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_tabs_block_path_idx" ON "services_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_social_icons_block_links_order_idx" ON "services_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_social_icons_block_links_parent_id_idx" ON "services_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_social_icons_block_order_idx" ON "services_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_social_icons_block_parent_id_idx" ON "services_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_social_icons_block_path_idx" ON "services_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_custom_html_block_order_idx" ON "services_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_custom_html_block_parent_id_idx" ON "services_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_custom_html_block_path_idx" ON "services_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_counter_block_items_order_idx" ON "services_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_counter_block_items_parent_id_idx" ON "services_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_counter_block_order_idx" ON "services_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_counter_block_parent_id_idx" ON "services_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_counter_block_path_idx" ON "services_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_progress_bar_block_items_order_idx" ON "services_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_progress_bar_block_items_parent_id_idx" ON "services_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_progress_bar_block_order_idx" ON "services_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_progress_bar_block_parent_id_idx" ON "services_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_progress_bar_block_path_idx" ON "services_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_images_order_idx" ON "services_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_images_parent_id_idx" ON "services_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_images_image_idx" ON "services_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_order_idx" ON "services_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_parent_id_idx" ON "services_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_image_gallery_block_path_idx" ON "services_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_section_block_columns_order_idx" ON "services_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_section_block_columns_parent_id_idx" ON "services_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_section_block_order_idx" ON "services_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_section_block_parent_id_idx" ON "services_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_section_block_path_idx" ON "services_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_form_block_order_idx" ON "services_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_form_block_parent_id_idx" ON "services_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_form_block_path_idx" ON "services_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_form_block_form_idx" ON "services_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_quote_block_order_idx" ON "services_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_quote_block_parent_id_idx" ON "services_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_quote_block_path_idx" ON "services_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_quote_block_avatar_idx" ON "services_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_divider_block_order_idx" ON "services_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_divider_block_parent_id_idx" ON "services_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_divider_block_path_idx" ON "services_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_icon_block_order_idx" ON "services_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_icon_block_parent_id_idx" ON "services_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_icon_block_path_idx" ON "services_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_feature_list_block_items_order_idx" ON "services_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_feature_list_block_items_parent_id_idx" ON "services_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_feature_list_block_order_idx" ON "services_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_feature_list_block_parent_id_idx" ON "services_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_feature_list_block_path_idx" ON "services_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_members_order_idx" ON "services_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_members_parent_id_idx" ON "services_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_members_photo_idx" ON "services_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_order_idx" ON "services_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_parent_id_idx" ON "services_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_team_grid_block_path_idx" ON "services_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_blog_feed_block_order_idx" ON "services_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_blog_feed_block_parent_id_idx" ON "services_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_blog_feed_block_path_idx" ON "services_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_map_block_order_idx" ON "services_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_map_block_parent_id_idx" ON "services_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_map_block_path_idx" ON "services_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_countdown_block_order_idx" ON "services_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_countdown_block_parent_id_idx" ON "services_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_countdown_block_path_idx" ON "services_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_headers_order_idx" ON "services_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_headers_parent_id_idx" ON "services_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_rows_cells_order_idx" ON "services_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_rows_cells_parent_id_idx" ON "services_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_rows_order_idx" ON "services_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_rows_parent_id_idx" ON "services_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_order_idx" ON "services_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_parent_id_idx" ON "services_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_table_block_path_idx" ON "services_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_timeline_block_items_order_idx" ON "services_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_timeline_block_items_parent_id_idx" ON "services_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_timeline_block_order_idx" ON "services_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_timeline_block_parent_id_idx" ON "services_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_timeline_block_path_idx" ON "services_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_steps_block_steps_order_idx" ON "services_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_steps_block_steps_parent_id_idx" ON "services_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_steps_block_order_idx" ON "services_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_steps_block_parent_id_idx" ON "services_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_steps_block_path_idx" ON "services_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "services_blocks_announcement_bar_block_order_idx" ON "services_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_blocks_announcement_bar_block_parent_id_idx" ON "services_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_blocks_announcement_bar_block_path_idx" ON "services_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_version_outcomes_order_idx" ON "_services_v_version_outcomes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_version_outcomes_parent_id_idx" ON "_services_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_hero_block_order_idx" ON "_services_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_hero_block_parent_id_idx" ON "_services_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_hero_block_path_idx" ON "_services_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_hero_block_image_idx" ON "_services_v_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_rich_text_block_order_idx" ON "_services_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_rich_text_block_parent_id_idx" ON "_services_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_rich_text_block_path_idx" ON "_services_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_text_image_block_order_idx" ON "_services_v_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_text_image_block_parent_id_idx" ON "_services_v_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_text_image_block_path_idx" ON "_services_v_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_text_image_block_image_idx" ON "_services_v_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_cta_block_order_idx" ON "_services_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_cta_block_parent_id_idx" ON "_services_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_cta_block_path_idx" ON "_services_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_faq_block_items_order_idx" ON "_services_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_faq_block_items_parent_id_idx" ON "_services_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_faq_block_order_idx" ON "_services_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_faq_block_parent_id_idx" ON "_services_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_faq_block_path_idx" ON "_services_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_stats_block_items_order_idx" ON "_services_v_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_stats_block_items_parent_id_idx" ON "_services_v_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_stats_block_order_idx" ON "_services_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_stats_block_parent_id_idx" ON "_services_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_stats_block_path_idx" ON "_services_v_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_testimonials_block_items_order_idx" ON "_services_v_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_testimonials_block_items_parent_id_idx" ON "_services_v_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_testimonials_block_order_idx" ON "_services_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_testimonials_block_parent_id_idx" ON "_services_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_testimonials_block_path_idx" ON "_services_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_two_col_block_order_idx" ON "_services_v_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_two_col_block_parent_id_idx" ON "_services_v_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_two_col_block_path_idx" ON "_services_v_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_three_col_block_order_idx" ON "_services_v_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_three_col_block_parent_id_idx" ON "_services_v_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_three_col_block_path_idx" ON "_services_v_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_pricing_block_plans_order_idx" ON "_services_v_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_pricing_block_plans_parent_id_idx" ON "_services_v_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_pricing_block_order_idx" ON "_services_v_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_pricing_block_parent_id_idx" ON "_services_v_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_pricing_block_path_idx" ON "_services_v_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_logos_order_idx" ON "_services_v_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_logos_parent_id_idx" ON "_services_v_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_logos_image_idx" ON "_services_v_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_order_idx" ON "_services_v_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_parent_id_idx" ON "_services_v_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_logo_carousel_block_path_idx" ON "_services_v_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_video_embed_block_order_idx" ON "_services_v_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_video_embed_block_parent_id_idx" ON "_services_v_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_video_embed_block_path_idx" ON "_services_v_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_spacer_block_order_idx" ON "_services_v_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_spacer_block_parent_id_idx" ON "_services_v_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_spacer_block_path_idx" ON "_services_v_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_accordion_block_items_order_idx" ON "_services_v_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_accordion_block_items_parent_id_idx" ON "_services_v_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_accordion_block_order_idx" ON "_services_v_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_accordion_block_parent_id_idx" ON "_services_v_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_accordion_block_path_idx" ON "_services_v_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_cards_order_idx" ON "_services_v_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_cards_parent_id_idx" ON "_services_v_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_cards_image_idx" ON "_services_v_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_order_idx" ON "_services_v_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_parent_id_idx" ON "_services_v_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_card_grid_block_path_idx" ON "_services_v_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_button_block_order_idx" ON "_services_v_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_button_block_parent_id_idx" ON "_services_v_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_button_block_path_idx" ON "_services_v_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_heading_block_order_idx" ON "_services_v_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_heading_block_parent_id_idx" ON "_services_v_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_heading_block_path_idx" ON "_services_v_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_block_order_idx" ON "_services_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_block_parent_id_idx" ON "_services_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_block_path_idx" ON "_services_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_block_image_idx" ON "_services_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_alert_block_order_idx" ON "_services_v_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_alert_block_parent_id_idx" ON "_services_v_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_alert_block_path_idx" ON "_services_v_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_tabs_block_tabs_order_idx" ON "_services_v_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_tabs_block_tabs_parent_id_idx" ON "_services_v_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_tabs_block_order_idx" ON "_services_v_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_tabs_block_parent_id_idx" ON "_services_v_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_tabs_block_path_idx" ON "_services_v_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_social_icons_block_links_order_idx" ON "_services_v_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_social_icons_block_links_parent_id_idx" ON "_services_v_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_social_icons_block_order_idx" ON "_services_v_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_social_icons_block_parent_id_idx" ON "_services_v_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_social_icons_block_path_idx" ON "_services_v_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_custom_html_block_order_idx" ON "_services_v_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_custom_html_block_parent_id_idx" ON "_services_v_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_custom_html_block_path_idx" ON "_services_v_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_counter_block_items_order_idx" ON "_services_v_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_counter_block_items_parent_id_idx" ON "_services_v_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_counter_block_order_idx" ON "_services_v_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_counter_block_parent_id_idx" ON "_services_v_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_counter_block_path_idx" ON "_services_v_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_progress_bar_block_items_order_idx" ON "_services_v_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_progress_bar_block_items_parent_id_idx" ON "_services_v_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_progress_bar_block_order_idx" ON "_services_v_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_progress_bar_block_parent_id_idx" ON "_services_v_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_progress_bar_block_path_idx" ON "_services_v_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_images_order_idx" ON "_services_v_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_images_parent_id_idx" ON "_services_v_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_images_image_idx" ON "_services_v_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_order_idx" ON "_services_v_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_parent_id_idx" ON "_services_v_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_image_gallery_block_path_idx" ON "_services_v_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_section_block_columns_order_idx" ON "_services_v_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_section_block_columns_parent_id_idx" ON "_services_v_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_section_block_order_idx" ON "_services_v_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_section_block_parent_id_idx" ON "_services_v_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_section_block_path_idx" ON "_services_v_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_form_block_order_idx" ON "_services_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_form_block_parent_id_idx" ON "_services_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_form_block_path_idx" ON "_services_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_form_block_form_idx" ON "_services_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_quote_block_order_idx" ON "_services_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_quote_block_parent_id_idx" ON "_services_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_quote_block_path_idx" ON "_services_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_quote_block_avatar_idx" ON "_services_v_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_divider_block_order_idx" ON "_services_v_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_divider_block_parent_id_idx" ON "_services_v_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_divider_block_path_idx" ON "_services_v_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_icon_block_order_idx" ON "_services_v_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_icon_block_parent_id_idx" ON "_services_v_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_icon_block_path_idx" ON "_services_v_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_feature_list_block_items_order_idx" ON "_services_v_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_feature_list_block_items_parent_id_idx" ON "_services_v_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_feature_list_block_order_idx" ON "_services_v_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_feature_list_block_parent_id_idx" ON "_services_v_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_feature_list_block_path_idx" ON "_services_v_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_members_order_idx" ON "_services_v_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_members_parent_id_idx" ON "_services_v_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_members_photo_idx" ON "_services_v_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_order_idx" ON "_services_v_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_parent_id_idx" ON "_services_v_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_team_grid_block_path_idx" ON "_services_v_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_blog_feed_block_order_idx" ON "_services_v_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_blog_feed_block_parent_id_idx" ON "_services_v_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_blog_feed_block_path_idx" ON "_services_v_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_map_block_order_idx" ON "_services_v_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_map_block_parent_id_idx" ON "_services_v_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_map_block_path_idx" ON "_services_v_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_countdown_block_order_idx" ON "_services_v_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_countdown_block_parent_id_idx" ON "_services_v_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_countdown_block_path_idx" ON "_services_v_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_headers_order_idx" ON "_services_v_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_headers_parent_id_idx" ON "_services_v_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_rows_cells_order_idx" ON "_services_v_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_rows_cells_parent_id_idx" ON "_services_v_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_rows_order_idx" ON "_services_v_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_rows_parent_id_idx" ON "_services_v_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_order_idx" ON "_services_v_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_parent_id_idx" ON "_services_v_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_table_block_path_idx" ON "_services_v_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_timeline_block_items_order_idx" ON "_services_v_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_timeline_block_items_parent_id_idx" ON "_services_v_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_timeline_block_order_idx" ON "_services_v_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_timeline_block_parent_id_idx" ON "_services_v_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_timeline_block_path_idx" ON "_services_v_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_steps_block_steps_order_idx" ON "_services_v_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_steps_block_steps_parent_id_idx" ON "_services_v_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_steps_block_order_idx" ON "_services_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_steps_block_parent_id_idx" ON "_services_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_steps_block_path_idx" ON "_services_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_announcement_bar_block_order_idx" ON "_services_v_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_announcement_bar_block_parent_id_idx" ON "_services_v_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_services_v_blocks_announcement_bar_block_path_idx" ON "_services_v_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_stats_order_idx" ON "case_studies_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_stats_parent_id_idx" ON "case_studies_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_hero_block_order_idx" ON "case_studies_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_hero_block_parent_id_idx" ON "case_studies_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_hero_block_path_idx" ON "case_studies_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_hero_block_image_idx" ON "case_studies_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_rich_text_block_order_idx" ON "case_studies_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_rich_text_block_parent_id_idx" ON "case_studies_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_rich_text_block_path_idx" ON "case_studies_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_text_image_block_order_idx" ON "case_studies_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_text_image_block_parent_id_idx" ON "case_studies_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_text_image_block_path_idx" ON "case_studies_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_text_image_block_image_idx" ON "case_studies_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_cta_block_order_idx" ON "case_studies_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_cta_block_parent_id_idx" ON "case_studies_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_cta_block_path_idx" ON "case_studies_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_faq_block_items_order_idx" ON "case_studies_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_faq_block_items_parent_id_idx" ON "case_studies_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_faq_block_order_idx" ON "case_studies_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_faq_block_parent_id_idx" ON "case_studies_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_faq_block_path_idx" ON "case_studies_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_stats_block_items_order_idx" ON "case_studies_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_stats_block_items_parent_id_idx" ON "case_studies_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_stats_block_order_idx" ON "case_studies_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_stats_block_parent_id_idx" ON "case_studies_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_stats_block_path_idx" ON "case_studies_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_testimonials_block_items_order_idx" ON "case_studies_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_testimonials_block_items_parent_id_idx" ON "case_studies_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_testimonials_block_order_idx" ON "case_studies_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_testimonials_block_parent_id_idx" ON "case_studies_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_testimonials_block_path_idx" ON "case_studies_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_two_col_block_order_idx" ON "case_studies_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_two_col_block_parent_id_idx" ON "case_studies_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_two_col_block_path_idx" ON "case_studies_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_three_col_block_order_idx" ON "case_studies_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_three_col_block_parent_id_idx" ON "case_studies_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_three_col_block_path_idx" ON "case_studies_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_pricing_block_plans_order_idx" ON "case_studies_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_pricing_block_plans_parent_id_idx" ON "case_studies_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_pricing_block_order_idx" ON "case_studies_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_pricing_block_parent_id_idx" ON "case_studies_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_pricing_block_path_idx" ON "case_studies_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_logos_order_idx" ON "case_studies_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_logos_parent_id_idx" ON "case_studies_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_logos_image_idx" ON "case_studies_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_order_idx" ON "case_studies_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_parent_id_idx" ON "case_studies_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_logo_carousel_block_path_idx" ON "case_studies_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_video_embed_block_order_idx" ON "case_studies_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_video_embed_block_parent_id_idx" ON "case_studies_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_video_embed_block_path_idx" ON "case_studies_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_spacer_block_order_idx" ON "case_studies_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_spacer_block_parent_id_idx" ON "case_studies_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_spacer_block_path_idx" ON "case_studies_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_accordion_block_items_order_idx" ON "case_studies_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_accordion_block_items_parent_id_idx" ON "case_studies_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_accordion_block_order_idx" ON "case_studies_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_accordion_block_parent_id_idx" ON "case_studies_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_accordion_block_path_idx" ON "case_studies_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_cards_order_idx" ON "case_studies_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_cards_parent_id_idx" ON "case_studies_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_cards_image_idx" ON "case_studies_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_order_idx" ON "case_studies_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_parent_id_idx" ON "case_studies_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_card_grid_block_path_idx" ON "case_studies_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_button_block_order_idx" ON "case_studies_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_button_block_parent_id_idx" ON "case_studies_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_button_block_path_idx" ON "case_studies_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_heading_block_order_idx" ON "case_studies_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_heading_block_parent_id_idx" ON "case_studies_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_heading_block_path_idx" ON "case_studies_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_block_order_idx" ON "case_studies_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_block_parent_id_idx" ON "case_studies_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_block_path_idx" ON "case_studies_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_block_image_idx" ON "case_studies_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_alert_block_order_idx" ON "case_studies_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_alert_block_parent_id_idx" ON "case_studies_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_alert_block_path_idx" ON "case_studies_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_tabs_block_tabs_order_idx" ON "case_studies_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_tabs_block_tabs_parent_id_idx" ON "case_studies_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_tabs_block_order_idx" ON "case_studies_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_tabs_block_parent_id_idx" ON "case_studies_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_tabs_block_path_idx" ON "case_studies_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_social_icons_block_links_order_idx" ON "case_studies_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_social_icons_block_links_parent_id_idx" ON "case_studies_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_social_icons_block_order_idx" ON "case_studies_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_social_icons_block_parent_id_idx" ON "case_studies_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_social_icons_block_path_idx" ON "case_studies_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_custom_html_block_order_idx" ON "case_studies_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_custom_html_block_parent_id_idx" ON "case_studies_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_custom_html_block_path_idx" ON "case_studies_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_counter_block_items_order_idx" ON "case_studies_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_counter_block_items_parent_id_idx" ON "case_studies_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_counter_block_order_idx" ON "case_studies_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_counter_block_parent_id_idx" ON "case_studies_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_counter_block_path_idx" ON "case_studies_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_progress_bar_block_items_order_idx" ON "case_studies_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_progress_bar_block_items_parent_id_idx" ON "case_studies_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_progress_bar_block_order_idx" ON "case_studies_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_progress_bar_block_parent_id_idx" ON "case_studies_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_progress_bar_block_path_idx" ON "case_studies_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_images_order_idx" ON "case_studies_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_images_parent_id_idx" ON "case_studies_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_images_image_idx" ON "case_studies_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_order_idx" ON "case_studies_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_parent_id_idx" ON "case_studies_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_image_gallery_block_path_idx" ON "case_studies_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_section_block_columns_order_idx" ON "case_studies_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_section_block_columns_parent_id_idx" ON "case_studies_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_section_block_order_idx" ON "case_studies_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_section_block_parent_id_idx" ON "case_studies_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_section_block_path_idx" ON "case_studies_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_form_block_order_idx" ON "case_studies_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_form_block_parent_id_idx" ON "case_studies_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_form_block_path_idx" ON "case_studies_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_form_block_form_idx" ON "case_studies_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_quote_block_order_idx" ON "case_studies_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_quote_block_parent_id_idx" ON "case_studies_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_quote_block_path_idx" ON "case_studies_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_quote_block_avatar_idx" ON "case_studies_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_divider_block_order_idx" ON "case_studies_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_divider_block_parent_id_idx" ON "case_studies_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_divider_block_path_idx" ON "case_studies_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_icon_block_order_idx" ON "case_studies_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_icon_block_parent_id_idx" ON "case_studies_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_icon_block_path_idx" ON "case_studies_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_feature_list_block_items_order_idx" ON "case_studies_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_feature_list_block_items_parent_id_idx" ON "case_studies_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_feature_list_block_order_idx" ON "case_studies_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_feature_list_block_parent_id_idx" ON "case_studies_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_feature_list_block_path_idx" ON "case_studies_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_members_order_idx" ON "case_studies_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_members_parent_id_idx" ON "case_studies_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_members_photo_idx" ON "case_studies_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_order_idx" ON "case_studies_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_parent_id_idx" ON "case_studies_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_team_grid_block_path_idx" ON "case_studies_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_blog_feed_block_order_idx" ON "case_studies_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_blog_feed_block_parent_id_idx" ON "case_studies_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_blog_feed_block_path_idx" ON "case_studies_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_map_block_order_idx" ON "case_studies_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_map_block_parent_id_idx" ON "case_studies_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_map_block_path_idx" ON "case_studies_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_countdown_block_order_idx" ON "case_studies_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_countdown_block_parent_id_idx" ON "case_studies_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_countdown_block_path_idx" ON "case_studies_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_headers_order_idx" ON "case_studies_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_headers_parent_id_idx" ON "case_studies_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_rows_cells_order_idx" ON "case_studies_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_rows_cells_parent_id_idx" ON "case_studies_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_rows_order_idx" ON "case_studies_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_rows_parent_id_idx" ON "case_studies_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_order_idx" ON "case_studies_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_parent_id_idx" ON "case_studies_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_table_block_path_idx" ON "case_studies_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_timeline_block_items_order_idx" ON "case_studies_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_timeline_block_items_parent_id_idx" ON "case_studies_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_timeline_block_order_idx" ON "case_studies_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_timeline_block_parent_id_idx" ON "case_studies_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_timeline_block_path_idx" ON "case_studies_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_steps_block_steps_order_idx" ON "case_studies_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_steps_block_steps_parent_id_idx" ON "case_studies_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_steps_block_order_idx" ON "case_studies_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_steps_block_parent_id_idx" ON "case_studies_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_steps_block_path_idx" ON "case_studies_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_announcement_bar_block_order_idx" ON "case_studies_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_announcement_bar_block_parent_id_idx" ON "case_studies_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "case_studies_blocks_announcement_bar_block_path_idx" ON "case_studies_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_stats_order_idx" ON "_case_studies_v_version_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_version_stats_parent_id_idx" ON "_case_studies_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_hero_block_order_idx" ON "_case_studies_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_hero_block_parent_id_idx" ON "_case_studies_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_hero_block_path_idx" ON "_case_studies_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_hero_block_image_idx" ON "_case_studies_v_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_rich_text_block_order_idx" ON "_case_studies_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_rich_text_block_parent_id_idx" ON "_case_studies_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_rich_text_block_path_idx" ON "_case_studies_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_text_image_block_order_idx" ON "_case_studies_v_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_text_image_block_parent_id_idx" ON "_case_studies_v_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_text_image_block_path_idx" ON "_case_studies_v_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_text_image_block_image_idx" ON "_case_studies_v_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_cta_block_order_idx" ON "_case_studies_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_cta_block_parent_id_idx" ON "_case_studies_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_cta_block_path_idx" ON "_case_studies_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_faq_block_items_order_idx" ON "_case_studies_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_faq_block_items_parent_id_idx" ON "_case_studies_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_faq_block_order_idx" ON "_case_studies_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_faq_block_parent_id_idx" ON "_case_studies_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_faq_block_path_idx" ON "_case_studies_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_stats_block_items_order_idx" ON "_case_studies_v_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_stats_block_items_parent_id_idx" ON "_case_studies_v_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_stats_block_order_idx" ON "_case_studies_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_stats_block_parent_id_idx" ON "_case_studies_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_stats_block_path_idx" ON "_case_studies_v_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_items_order_idx" ON "_case_studies_v_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_items_parent_id_idx" ON "_case_studies_v_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_order_idx" ON "_case_studies_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_parent_id_idx" ON "_case_studies_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_testimonials_block_path_idx" ON "_case_studies_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_two_col_block_order_idx" ON "_case_studies_v_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_two_col_block_parent_id_idx" ON "_case_studies_v_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_two_col_block_path_idx" ON "_case_studies_v_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_three_col_block_order_idx" ON "_case_studies_v_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_three_col_block_parent_id_idx" ON "_case_studies_v_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_three_col_block_path_idx" ON "_case_studies_v_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_pricing_block_plans_order_idx" ON "_case_studies_v_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_pricing_block_plans_parent_id_idx" ON "_case_studies_v_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_pricing_block_order_idx" ON "_case_studies_v_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_pricing_block_parent_id_idx" ON "_case_studies_v_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_pricing_block_path_idx" ON "_case_studies_v_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_logos_order_idx" ON "_case_studies_v_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_logos_parent_id_idx" ON "_case_studies_v_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_logos_image_idx" ON "_case_studies_v_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_order_idx" ON "_case_studies_v_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_parent_id_idx" ON "_case_studies_v_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_logo_carousel_block_path_idx" ON "_case_studies_v_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_video_embed_block_order_idx" ON "_case_studies_v_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_video_embed_block_parent_id_idx" ON "_case_studies_v_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_video_embed_block_path_idx" ON "_case_studies_v_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_spacer_block_order_idx" ON "_case_studies_v_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_spacer_block_parent_id_idx" ON "_case_studies_v_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_spacer_block_path_idx" ON "_case_studies_v_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_accordion_block_items_order_idx" ON "_case_studies_v_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_accordion_block_items_parent_id_idx" ON "_case_studies_v_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_accordion_block_order_idx" ON "_case_studies_v_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_accordion_block_parent_id_idx" ON "_case_studies_v_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_accordion_block_path_idx" ON "_case_studies_v_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_cards_order_idx" ON "_case_studies_v_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_cards_parent_id_idx" ON "_case_studies_v_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_cards_image_idx" ON "_case_studies_v_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_order_idx" ON "_case_studies_v_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_parent_id_idx" ON "_case_studies_v_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_card_grid_block_path_idx" ON "_case_studies_v_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_button_block_order_idx" ON "_case_studies_v_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_button_block_parent_id_idx" ON "_case_studies_v_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_button_block_path_idx" ON "_case_studies_v_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_heading_block_order_idx" ON "_case_studies_v_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_heading_block_parent_id_idx" ON "_case_studies_v_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_heading_block_path_idx" ON "_case_studies_v_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_block_order_idx" ON "_case_studies_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_block_parent_id_idx" ON "_case_studies_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_block_path_idx" ON "_case_studies_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_block_image_idx" ON "_case_studies_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_alert_block_order_idx" ON "_case_studies_v_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_alert_block_parent_id_idx" ON "_case_studies_v_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_alert_block_path_idx" ON "_case_studies_v_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_tabs_block_tabs_order_idx" ON "_case_studies_v_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_tabs_block_tabs_parent_id_idx" ON "_case_studies_v_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_tabs_block_order_idx" ON "_case_studies_v_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_tabs_block_parent_id_idx" ON "_case_studies_v_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_tabs_block_path_idx" ON "_case_studies_v_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_links_order_idx" ON "_case_studies_v_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_links_parent_id_idx" ON "_case_studies_v_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_order_idx" ON "_case_studies_v_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_parent_id_idx" ON "_case_studies_v_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_social_icons_block_path_idx" ON "_case_studies_v_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_custom_html_block_order_idx" ON "_case_studies_v_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_custom_html_block_parent_id_idx" ON "_case_studies_v_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_custom_html_block_path_idx" ON "_case_studies_v_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_counter_block_items_order_idx" ON "_case_studies_v_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_counter_block_items_parent_id_idx" ON "_case_studies_v_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_counter_block_order_idx" ON "_case_studies_v_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_counter_block_parent_id_idx" ON "_case_studies_v_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_counter_block_path_idx" ON "_case_studies_v_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_items_order_idx" ON "_case_studies_v_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_items_parent_id_idx" ON "_case_studies_v_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_order_idx" ON "_case_studies_v_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_parent_id_idx" ON "_case_studies_v_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_progress_bar_block_path_idx" ON "_case_studies_v_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_images_order_idx" ON "_case_studies_v_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_images_parent_id_idx" ON "_case_studies_v_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_images_image_idx" ON "_case_studies_v_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_order_idx" ON "_case_studies_v_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_parent_id_idx" ON "_case_studies_v_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_image_gallery_block_path_idx" ON "_case_studies_v_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_section_block_columns_order_idx" ON "_case_studies_v_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_section_block_columns_parent_id_idx" ON "_case_studies_v_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_section_block_order_idx" ON "_case_studies_v_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_section_block_parent_id_idx" ON "_case_studies_v_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_section_block_path_idx" ON "_case_studies_v_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_form_block_order_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_form_block_parent_id_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_form_block_path_idx" ON "_case_studies_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_form_block_form_idx" ON "_case_studies_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_quote_block_order_idx" ON "_case_studies_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_quote_block_parent_id_idx" ON "_case_studies_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_quote_block_path_idx" ON "_case_studies_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_quote_block_avatar_idx" ON "_case_studies_v_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_divider_block_order_idx" ON "_case_studies_v_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_divider_block_parent_id_idx" ON "_case_studies_v_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_divider_block_path_idx" ON "_case_studies_v_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_icon_block_order_idx" ON "_case_studies_v_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_icon_block_parent_id_idx" ON "_case_studies_v_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_icon_block_path_idx" ON "_case_studies_v_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_items_order_idx" ON "_case_studies_v_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_items_parent_id_idx" ON "_case_studies_v_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_order_idx" ON "_case_studies_v_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_parent_id_idx" ON "_case_studies_v_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_feature_list_block_path_idx" ON "_case_studies_v_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_members_order_idx" ON "_case_studies_v_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_members_parent_id_idx" ON "_case_studies_v_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_members_photo_idx" ON "_case_studies_v_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_order_idx" ON "_case_studies_v_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_parent_id_idx" ON "_case_studies_v_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_team_grid_block_path_idx" ON "_case_studies_v_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_blog_feed_block_order_idx" ON "_case_studies_v_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_blog_feed_block_parent_id_idx" ON "_case_studies_v_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_blog_feed_block_path_idx" ON "_case_studies_v_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_map_block_order_idx" ON "_case_studies_v_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_map_block_parent_id_idx" ON "_case_studies_v_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_map_block_path_idx" ON "_case_studies_v_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_countdown_block_order_idx" ON "_case_studies_v_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_countdown_block_parent_id_idx" ON "_case_studies_v_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_countdown_block_path_idx" ON "_case_studies_v_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_headers_order_idx" ON "_case_studies_v_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_headers_parent_id_idx" ON "_case_studies_v_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_rows_cells_order_idx" ON "_case_studies_v_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_rows_cells_parent_id_idx" ON "_case_studies_v_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_rows_order_idx" ON "_case_studies_v_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_rows_parent_id_idx" ON "_case_studies_v_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_order_idx" ON "_case_studies_v_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_parent_id_idx" ON "_case_studies_v_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_table_block_path_idx" ON "_case_studies_v_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_timeline_block_items_order_idx" ON "_case_studies_v_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_timeline_block_items_parent_id_idx" ON "_case_studies_v_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_timeline_block_order_idx" ON "_case_studies_v_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_timeline_block_parent_id_idx" ON "_case_studies_v_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_timeline_block_path_idx" ON "_case_studies_v_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_steps_block_steps_order_idx" ON "_case_studies_v_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_steps_block_steps_parent_id_idx" ON "_case_studies_v_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_steps_block_order_idx" ON "_case_studies_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_steps_block_parent_id_idx" ON "_case_studies_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_steps_block_path_idx" ON "_case_studies_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_announcement_bar_block_order_idx" ON "_case_studies_v_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_announcement_bar_block_parent_id_idx" ON "_case_studies_v_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_case_studies_v_blocks_announcement_bar_block_path_idx" ON "_case_studies_v_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_hero_block_order_idx" ON "blog_posts_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_hero_block_parent_id_idx" ON "blog_posts_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_hero_block_path_idx" ON "blog_posts_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_hero_block_image_idx" ON "blog_posts_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_rich_text_block_order_idx" ON "blog_posts_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_rich_text_block_parent_id_idx" ON "blog_posts_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_rich_text_block_path_idx" ON "blog_posts_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_text_image_block_order_idx" ON "blog_posts_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_text_image_block_parent_id_idx" ON "blog_posts_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_text_image_block_path_idx" ON "blog_posts_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_text_image_block_image_idx" ON "blog_posts_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_cta_block_order_idx" ON "blog_posts_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_cta_block_parent_id_idx" ON "blog_posts_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_cta_block_path_idx" ON "blog_posts_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_faq_block_items_order_idx" ON "blog_posts_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_faq_block_items_parent_id_idx" ON "blog_posts_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_faq_block_order_idx" ON "blog_posts_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_faq_block_parent_id_idx" ON "blog_posts_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_faq_block_path_idx" ON "blog_posts_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_stats_block_items_order_idx" ON "blog_posts_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_stats_block_items_parent_id_idx" ON "blog_posts_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_stats_block_order_idx" ON "blog_posts_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_stats_block_parent_id_idx" ON "blog_posts_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_stats_block_path_idx" ON "blog_posts_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_testimonials_block_items_order_idx" ON "blog_posts_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_testimonials_block_items_parent_id_idx" ON "blog_posts_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_testimonials_block_order_idx" ON "blog_posts_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_testimonials_block_parent_id_idx" ON "blog_posts_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_testimonials_block_path_idx" ON "blog_posts_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_two_col_block_order_idx" ON "blog_posts_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_two_col_block_parent_id_idx" ON "blog_posts_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_two_col_block_path_idx" ON "blog_posts_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_three_col_block_order_idx" ON "blog_posts_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_three_col_block_parent_id_idx" ON "blog_posts_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_three_col_block_path_idx" ON "blog_posts_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_pricing_block_plans_order_idx" ON "blog_posts_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_pricing_block_plans_parent_id_idx" ON "blog_posts_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_pricing_block_order_idx" ON "blog_posts_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_pricing_block_parent_id_idx" ON "blog_posts_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_pricing_block_path_idx" ON "blog_posts_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_logos_order_idx" ON "blog_posts_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_logos_parent_id_idx" ON "blog_posts_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_logos_image_idx" ON "blog_posts_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_order_idx" ON "blog_posts_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_parent_id_idx" ON "blog_posts_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_logo_carousel_block_path_idx" ON "blog_posts_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_video_embed_block_order_idx" ON "blog_posts_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_video_embed_block_parent_id_idx" ON "blog_posts_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_video_embed_block_path_idx" ON "blog_posts_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_spacer_block_order_idx" ON "blog_posts_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_spacer_block_parent_id_idx" ON "blog_posts_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_spacer_block_path_idx" ON "blog_posts_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_accordion_block_items_order_idx" ON "blog_posts_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_accordion_block_items_parent_id_idx" ON "blog_posts_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_accordion_block_order_idx" ON "blog_posts_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_accordion_block_parent_id_idx" ON "blog_posts_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_accordion_block_path_idx" ON "blog_posts_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_cards_order_idx" ON "blog_posts_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_cards_parent_id_idx" ON "blog_posts_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_cards_image_idx" ON "blog_posts_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_order_idx" ON "blog_posts_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_parent_id_idx" ON "blog_posts_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_card_grid_block_path_idx" ON "blog_posts_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_button_block_order_idx" ON "blog_posts_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_button_block_parent_id_idx" ON "blog_posts_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_button_block_path_idx" ON "blog_posts_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_heading_block_order_idx" ON "blog_posts_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_heading_block_parent_id_idx" ON "blog_posts_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_heading_block_path_idx" ON "blog_posts_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_block_order_idx" ON "blog_posts_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_block_parent_id_idx" ON "blog_posts_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_block_path_idx" ON "blog_posts_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_block_image_idx" ON "blog_posts_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_alert_block_order_idx" ON "blog_posts_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_alert_block_parent_id_idx" ON "blog_posts_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_alert_block_path_idx" ON "blog_posts_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_tabs_block_tabs_order_idx" ON "blog_posts_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_tabs_block_tabs_parent_id_idx" ON "blog_posts_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_tabs_block_order_idx" ON "blog_posts_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_tabs_block_parent_id_idx" ON "blog_posts_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_tabs_block_path_idx" ON "blog_posts_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_social_icons_block_links_order_idx" ON "blog_posts_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_social_icons_block_links_parent_id_idx" ON "blog_posts_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_social_icons_block_order_idx" ON "blog_posts_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_social_icons_block_parent_id_idx" ON "blog_posts_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_social_icons_block_path_idx" ON "blog_posts_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_custom_html_block_order_idx" ON "blog_posts_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_custom_html_block_parent_id_idx" ON "blog_posts_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_custom_html_block_path_idx" ON "blog_posts_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_counter_block_items_order_idx" ON "blog_posts_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_counter_block_items_parent_id_idx" ON "blog_posts_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_counter_block_order_idx" ON "blog_posts_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_counter_block_parent_id_idx" ON "blog_posts_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_counter_block_path_idx" ON "blog_posts_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_progress_bar_block_items_order_idx" ON "blog_posts_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_progress_bar_block_items_parent_id_idx" ON "blog_posts_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_progress_bar_block_order_idx" ON "blog_posts_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_progress_bar_block_parent_id_idx" ON "blog_posts_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_progress_bar_block_path_idx" ON "blog_posts_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_images_order_idx" ON "blog_posts_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_images_parent_id_idx" ON "blog_posts_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_images_image_idx" ON "blog_posts_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_order_idx" ON "blog_posts_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_parent_id_idx" ON "blog_posts_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_image_gallery_block_path_idx" ON "blog_posts_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_section_block_columns_order_idx" ON "blog_posts_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_section_block_columns_parent_id_idx" ON "blog_posts_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_section_block_order_idx" ON "blog_posts_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_section_block_parent_id_idx" ON "blog_posts_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_section_block_path_idx" ON "blog_posts_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_form_block_order_idx" ON "blog_posts_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_form_block_parent_id_idx" ON "blog_posts_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_form_block_path_idx" ON "blog_posts_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_form_block_form_idx" ON "blog_posts_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_quote_block_order_idx" ON "blog_posts_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_quote_block_parent_id_idx" ON "blog_posts_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_quote_block_path_idx" ON "blog_posts_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_quote_block_avatar_idx" ON "blog_posts_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_divider_block_order_idx" ON "blog_posts_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_divider_block_parent_id_idx" ON "blog_posts_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_divider_block_path_idx" ON "blog_posts_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_icon_block_order_idx" ON "blog_posts_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_icon_block_parent_id_idx" ON "blog_posts_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_icon_block_path_idx" ON "blog_posts_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_feature_list_block_items_order_idx" ON "blog_posts_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_feature_list_block_items_parent_id_idx" ON "blog_posts_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_feature_list_block_order_idx" ON "blog_posts_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_feature_list_block_parent_id_idx" ON "blog_posts_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_feature_list_block_path_idx" ON "blog_posts_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_members_order_idx" ON "blog_posts_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_members_parent_id_idx" ON "blog_posts_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_members_photo_idx" ON "blog_posts_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_order_idx" ON "blog_posts_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_parent_id_idx" ON "blog_posts_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_team_grid_block_path_idx" ON "blog_posts_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_blog_feed_block_order_idx" ON "blog_posts_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_blog_feed_block_parent_id_idx" ON "blog_posts_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_blog_feed_block_path_idx" ON "blog_posts_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_map_block_order_idx" ON "blog_posts_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_map_block_parent_id_idx" ON "blog_posts_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_map_block_path_idx" ON "blog_posts_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_countdown_block_order_idx" ON "blog_posts_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_countdown_block_parent_id_idx" ON "blog_posts_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_countdown_block_path_idx" ON "blog_posts_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_headers_order_idx" ON "blog_posts_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_headers_parent_id_idx" ON "blog_posts_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_rows_cells_order_idx" ON "blog_posts_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_rows_cells_parent_id_idx" ON "blog_posts_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_rows_order_idx" ON "blog_posts_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_rows_parent_id_idx" ON "blog_posts_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_order_idx" ON "blog_posts_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_parent_id_idx" ON "blog_posts_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_table_block_path_idx" ON "blog_posts_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_timeline_block_items_order_idx" ON "blog_posts_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_timeline_block_items_parent_id_idx" ON "blog_posts_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_timeline_block_order_idx" ON "blog_posts_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_timeline_block_parent_id_idx" ON "blog_posts_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_timeline_block_path_idx" ON "blog_posts_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_steps_block_steps_order_idx" ON "blog_posts_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_steps_block_steps_parent_id_idx" ON "blog_posts_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_steps_block_order_idx" ON "blog_posts_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_steps_block_parent_id_idx" ON "blog_posts_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_steps_block_path_idx" ON "blog_posts_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_announcement_bar_block_order_idx" ON "blog_posts_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_announcement_bar_block_parent_id_idx" ON "blog_posts_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_blocks_announcement_bar_block_path_idx" ON "blog_posts_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_hero_block_order_idx" ON "_blog_posts_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_hero_block_parent_id_idx" ON "_blog_posts_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_hero_block_path_idx" ON "_blog_posts_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_hero_block_image_idx" ON "_blog_posts_v_blocks_hero_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_rich_text_block_order_idx" ON "_blog_posts_v_blocks_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_rich_text_block_parent_id_idx" ON "_blog_posts_v_blocks_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_rich_text_block_path_idx" ON "_blog_posts_v_blocks_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_text_image_block_order_idx" ON "_blog_posts_v_blocks_text_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_text_image_block_parent_id_idx" ON "_blog_posts_v_blocks_text_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_text_image_block_path_idx" ON "_blog_posts_v_blocks_text_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_text_image_block_image_idx" ON "_blog_posts_v_blocks_text_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_cta_block_order_idx" ON "_blog_posts_v_blocks_cta_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_cta_block_parent_id_idx" ON "_blog_posts_v_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_cta_block_path_idx" ON "_blog_posts_v_blocks_cta_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_faq_block_items_order_idx" ON "_blog_posts_v_blocks_faq_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_faq_block_items_parent_id_idx" ON "_blog_posts_v_blocks_faq_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_faq_block_order_idx" ON "_blog_posts_v_blocks_faq_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_faq_block_parent_id_idx" ON "_blog_posts_v_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_faq_block_path_idx" ON "_blog_posts_v_blocks_faq_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_stats_block_items_order_idx" ON "_blog_posts_v_blocks_stats_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_stats_block_items_parent_id_idx" ON "_blog_posts_v_blocks_stats_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_stats_block_order_idx" ON "_blog_posts_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_stats_block_parent_id_idx" ON "_blog_posts_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_stats_block_path_idx" ON "_blog_posts_v_blocks_stats_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_items_order_idx" ON "_blog_posts_v_blocks_testimonials_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_items_parent_id_idx" ON "_blog_posts_v_blocks_testimonials_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_order_idx" ON "_blog_posts_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_parent_id_idx" ON "_blog_posts_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_testimonials_block_path_idx" ON "_blog_posts_v_blocks_testimonials_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_two_col_block_order_idx" ON "_blog_posts_v_blocks_two_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_two_col_block_parent_id_idx" ON "_blog_posts_v_blocks_two_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_two_col_block_path_idx" ON "_blog_posts_v_blocks_two_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_three_col_block_order_idx" ON "_blog_posts_v_blocks_three_col_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_three_col_block_parent_id_idx" ON "_blog_posts_v_blocks_three_col_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_three_col_block_path_idx" ON "_blog_posts_v_blocks_three_col_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_plans_order_idx" ON "_blog_posts_v_blocks_pricing_block_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_plans_parent_id_idx" ON "_blog_posts_v_blocks_pricing_block_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_order_idx" ON "_blog_posts_v_blocks_pricing_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_parent_id_idx" ON "_blog_posts_v_blocks_pricing_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_pricing_block_path_idx" ON "_blog_posts_v_blocks_pricing_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_logos_order_idx" ON "_blog_posts_v_blocks_logo_carousel_block_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_logos_parent_id_idx" ON "_blog_posts_v_blocks_logo_carousel_block_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_logos_image_idx" ON "_blog_posts_v_blocks_logo_carousel_block_logos" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_order_idx" ON "_blog_posts_v_blocks_logo_carousel_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_parent_id_idx" ON "_blog_posts_v_blocks_logo_carousel_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_logo_carousel_block_path_idx" ON "_blog_posts_v_blocks_logo_carousel_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_video_embed_block_order_idx" ON "_blog_posts_v_blocks_video_embed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_video_embed_block_parent_id_idx" ON "_blog_posts_v_blocks_video_embed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_video_embed_block_path_idx" ON "_blog_posts_v_blocks_video_embed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_spacer_block_order_idx" ON "_blog_posts_v_blocks_spacer_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_spacer_block_parent_id_idx" ON "_blog_posts_v_blocks_spacer_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_spacer_block_path_idx" ON "_blog_posts_v_blocks_spacer_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_items_order_idx" ON "_blog_posts_v_blocks_accordion_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_items_parent_id_idx" ON "_blog_posts_v_blocks_accordion_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_order_idx" ON "_blog_posts_v_blocks_accordion_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_parent_id_idx" ON "_blog_posts_v_blocks_accordion_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_accordion_block_path_idx" ON "_blog_posts_v_blocks_accordion_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_cards_order_idx" ON "_blog_posts_v_blocks_card_grid_block_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_cards_parent_id_idx" ON "_blog_posts_v_blocks_card_grid_block_cards" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_cards_image_idx" ON "_blog_posts_v_blocks_card_grid_block_cards" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_order_idx" ON "_blog_posts_v_blocks_card_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_parent_id_idx" ON "_blog_posts_v_blocks_card_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_card_grid_block_path_idx" ON "_blog_posts_v_blocks_card_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_button_block_order_idx" ON "_blog_posts_v_blocks_button_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_button_block_parent_id_idx" ON "_blog_posts_v_blocks_button_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_button_block_path_idx" ON "_blog_posts_v_blocks_button_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_heading_block_order_idx" ON "_blog_posts_v_blocks_heading_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_heading_block_parent_id_idx" ON "_blog_posts_v_blocks_heading_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_heading_block_path_idx" ON "_blog_posts_v_blocks_heading_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_block_order_idx" ON "_blog_posts_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_block_parent_id_idx" ON "_blog_posts_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_block_path_idx" ON "_blog_posts_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_block_image_idx" ON "_blog_posts_v_blocks_image_block" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_alert_block_order_idx" ON "_blog_posts_v_blocks_alert_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_alert_block_parent_id_idx" ON "_blog_posts_v_blocks_alert_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_alert_block_path_idx" ON "_blog_posts_v_blocks_alert_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_tabs_order_idx" ON "_blog_posts_v_blocks_tabs_block_tabs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_tabs_parent_id_idx" ON "_blog_posts_v_blocks_tabs_block_tabs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_order_idx" ON "_blog_posts_v_blocks_tabs_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_parent_id_idx" ON "_blog_posts_v_blocks_tabs_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_tabs_block_path_idx" ON "_blog_posts_v_blocks_tabs_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_links_order_idx" ON "_blog_posts_v_blocks_social_icons_block_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_links_parent_id_idx" ON "_blog_posts_v_blocks_social_icons_block_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_order_idx" ON "_blog_posts_v_blocks_social_icons_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_parent_id_idx" ON "_blog_posts_v_blocks_social_icons_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_social_icons_block_path_idx" ON "_blog_posts_v_blocks_social_icons_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_custom_html_block_order_idx" ON "_blog_posts_v_blocks_custom_html_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_custom_html_block_parent_id_idx" ON "_blog_posts_v_blocks_custom_html_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_custom_html_block_path_idx" ON "_blog_posts_v_blocks_custom_html_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_counter_block_items_order_idx" ON "_blog_posts_v_blocks_counter_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_counter_block_items_parent_id_idx" ON "_blog_posts_v_blocks_counter_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_counter_block_order_idx" ON "_blog_posts_v_blocks_counter_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_counter_block_parent_id_idx" ON "_blog_posts_v_blocks_counter_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_counter_block_path_idx" ON "_blog_posts_v_blocks_counter_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_items_order_idx" ON "_blog_posts_v_blocks_progress_bar_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_items_parent_id_idx" ON "_blog_posts_v_blocks_progress_bar_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_order_idx" ON "_blog_posts_v_blocks_progress_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_parent_id_idx" ON "_blog_posts_v_blocks_progress_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_progress_bar_block_path_idx" ON "_blog_posts_v_blocks_progress_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_images_order_idx" ON "_blog_posts_v_blocks_image_gallery_block_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_images_parent_id_idx" ON "_blog_posts_v_blocks_image_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_images_image_idx" ON "_blog_posts_v_blocks_image_gallery_block_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_order_idx" ON "_blog_posts_v_blocks_image_gallery_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_parent_id_idx" ON "_blog_posts_v_blocks_image_gallery_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_image_gallery_block_path_idx" ON "_blog_posts_v_blocks_image_gallery_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_section_block_columns_order_idx" ON "_blog_posts_v_blocks_section_block_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_section_block_columns_parent_id_idx" ON "_blog_posts_v_blocks_section_block_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_section_block_order_idx" ON "_blog_posts_v_blocks_section_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_section_block_parent_id_idx" ON "_blog_posts_v_blocks_section_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_section_block_path_idx" ON "_blog_posts_v_blocks_section_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_form_block_order_idx" ON "_blog_posts_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_form_block_parent_id_idx" ON "_blog_posts_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_form_block_path_idx" ON "_blog_posts_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_form_block_form_idx" ON "_blog_posts_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_quote_block_order_idx" ON "_blog_posts_v_blocks_quote_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_quote_block_parent_id_idx" ON "_blog_posts_v_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_quote_block_path_idx" ON "_blog_posts_v_blocks_quote_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_quote_block_avatar_idx" ON "_blog_posts_v_blocks_quote_block" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_divider_block_order_idx" ON "_blog_posts_v_blocks_divider_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_divider_block_parent_id_idx" ON "_blog_posts_v_blocks_divider_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_divider_block_path_idx" ON "_blog_posts_v_blocks_divider_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_icon_block_order_idx" ON "_blog_posts_v_blocks_icon_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_icon_block_parent_id_idx" ON "_blog_posts_v_blocks_icon_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_icon_block_path_idx" ON "_blog_posts_v_blocks_icon_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_items_order_idx" ON "_blog_posts_v_blocks_feature_list_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_items_parent_id_idx" ON "_blog_posts_v_blocks_feature_list_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_order_idx" ON "_blog_posts_v_blocks_feature_list_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_parent_id_idx" ON "_blog_posts_v_blocks_feature_list_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_feature_list_block_path_idx" ON "_blog_posts_v_blocks_feature_list_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_members_order_idx" ON "_blog_posts_v_blocks_team_grid_block_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_members_parent_id_idx" ON "_blog_posts_v_blocks_team_grid_block_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_members_photo_idx" ON "_blog_posts_v_blocks_team_grid_block_members" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_order_idx" ON "_blog_posts_v_blocks_team_grid_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_parent_id_idx" ON "_blog_posts_v_blocks_team_grid_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_team_grid_block_path_idx" ON "_blog_posts_v_blocks_team_grid_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_blog_feed_block_order_idx" ON "_blog_posts_v_blocks_blog_feed_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_blog_feed_block_parent_id_idx" ON "_blog_posts_v_blocks_blog_feed_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_blog_feed_block_path_idx" ON "_blog_posts_v_blocks_blog_feed_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_map_block_order_idx" ON "_blog_posts_v_blocks_map_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_map_block_parent_id_idx" ON "_blog_posts_v_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_map_block_path_idx" ON "_blog_posts_v_blocks_map_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_countdown_block_order_idx" ON "_blog_posts_v_blocks_countdown_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_countdown_block_parent_id_idx" ON "_blog_posts_v_blocks_countdown_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_countdown_block_path_idx" ON "_blog_posts_v_blocks_countdown_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_headers_order_idx" ON "_blog_posts_v_blocks_table_block_headers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_headers_parent_id_idx" ON "_blog_posts_v_blocks_table_block_headers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows_cells_order_idx" ON "_blog_posts_v_blocks_table_block_rows_cells" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows_cells_parent_id_idx" ON "_blog_posts_v_blocks_table_block_rows_cells" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows_order_idx" ON "_blog_posts_v_blocks_table_block_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_rows_parent_id_idx" ON "_blog_posts_v_blocks_table_block_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_order_idx" ON "_blog_posts_v_blocks_table_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_parent_id_idx" ON "_blog_posts_v_blocks_table_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_table_block_path_idx" ON "_blog_posts_v_blocks_table_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_items_order_idx" ON "_blog_posts_v_blocks_timeline_block_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_items_parent_id_idx" ON "_blog_posts_v_blocks_timeline_block_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_order_idx" ON "_blog_posts_v_blocks_timeline_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_parent_id_idx" ON "_blog_posts_v_blocks_timeline_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_timeline_block_path_idx" ON "_blog_posts_v_blocks_timeline_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_steps_block_steps_order_idx" ON "_blog_posts_v_blocks_steps_block_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_steps_block_steps_parent_id_idx" ON "_blog_posts_v_blocks_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_steps_block_order_idx" ON "_blog_posts_v_blocks_steps_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_steps_block_parent_id_idx" ON "_blog_posts_v_blocks_steps_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_steps_block_path_idx" ON "_blog_posts_v_blocks_steps_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_announcement_bar_block_order_idx" ON "_blog_posts_v_blocks_announcement_bar_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_announcement_bar_block_parent_id_idx" ON "_blog_posts_v_blocks_announcement_bar_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_blog_posts_v_blocks_announcement_bar_block_path_idx" ON "_blog_posts_v_blocks_announcement_bar_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "footer_brand_socials_order_idx" ON "footer_brand_socials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_brand_socials_parent_id_idx" ON "footer_brand_socials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_cta_column_links_order_idx" ON "footer_cta_column_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_cta_column_links_parent_id_idx" ON "footer_cta_column_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_badges_order_idx" ON "footer_badges" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_badges_parent_id_idx" ON "footer_badges" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_brand_brand_logo_image_idx" ON "footer" USING btree ("brand_logo_image_id");
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_hover_image_id_media_id_fk" FOREIGN KEY ("hover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hover_image_id_media_id_fk" FOREIGN KEY ("version_hover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  DO $IDEMPOTENT$ BEGIN ALTER TABLE "navigation" ADD CONSTRAINT "navigation_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END; $IDEMPOTENT$;
  CREATE INDEX IF NOT EXISTS "services_hover_image_idx" ON "services" USING btree ("hover_image_id");
  CREATE INDEX IF NOT EXISTS "_services_v_version_version_hover_image_idx" ON "_services_v" USING btree ("version_hover_image_id");
  CREATE INDEX IF NOT EXISTS "navigation_logo_image_idx" ON "navigation" USING btree ("logo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_text_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_faq_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_stats_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_testimonials_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_testimonials_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_two_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_three_col_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_pricing_block_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_pricing_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_logo_carousel_block_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_logo_carousel_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_video_embed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_spacer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_accordion_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_accordion_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_card_grid_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_card_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_button_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_heading_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_alert_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_tabs_block_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_tabs_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_social_icons_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_social_icons_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_custom_html_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_counter_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_counter_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_progress_bar_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_progress_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_image_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_image_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_section_block_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_section_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_divider_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_icon_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_feature_list_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_feature_list_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_team_grid_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_team_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_blog_feed_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_countdown_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_table_block_headers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_table_block_rows_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_table_block_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_table_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_timeline_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_timeline_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blog_posts_v_blocks_announcement_bar_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_brand_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_cta_column_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "services_outcomes" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "services_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_version_outcomes" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "_services_v_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_stats" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "case_studies_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_version_stats" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "_case_studies_v_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "blog_posts_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_hero_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_rich_text_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_text_image_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_cta_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_faq_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_faq_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_stats_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_stats_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_testimonials_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_testimonials_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_two_col_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_three_col_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_pricing_block_plans" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_pricing_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_logo_carousel_block_logos" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_logo_carousel_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_video_embed_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_spacer_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_accordion_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_accordion_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_card_grid_block_cards" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_card_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_button_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_heading_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_image_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_alert_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_tabs_block_tabs" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_tabs_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_social_icons_block_links" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_social_icons_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_custom_html_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_counter_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_counter_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_progress_bar_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_progress_bar_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_image_gallery_block_images" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_image_gallery_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_section_block_columns" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_section_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_form_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_quote_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_divider_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_icon_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_feature_list_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_feature_list_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_team_grid_block_members" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_team_grid_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_blog_feed_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_map_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_countdown_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_table_block_headers" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_table_block_rows_cells" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_table_block_rows" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_table_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_timeline_block_items" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_timeline_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_steps_block_steps" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_steps_block" CASCADE;
  DROP TABLE IF EXISTS "_blog_posts_v_blocks_announcement_bar_block" CASCADE;
  DROP TABLE IF EXISTS "footer_brand_socials" CASCADE;
  DROP TABLE IF EXISTS "footer_columns_links" CASCADE;
  DROP TABLE IF EXISTS "footer_columns" CASCADE;
  DROP TABLE IF EXISTS "footer_cta_column_links" CASCADE;
  DROP TABLE IF EXISTS "footer_badges" CASCADE;
  DROP TABLE IF EXISTS "footer" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_hover_image_id_media_id_fk";
  
  ALTER TABLE "_services_v" DROP CONSTRAINT IF EXISTS "_services_v_version_hover_image_id_media_id_fk";
  
  ALTER TABLE "navigation" DROP CONSTRAINT IF EXISTS "navigation_logo_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "services_hover_image_idx";
  DROP INDEX IF EXISTS "_services_v_version_version_hover_image_idx";
  DROP INDEX IF EXISTS "navigation_logo_image_idx";
  ALTER TABLE "services" ALTER COLUMN "content" SET DATA TYPE varchar;
  ALTER TABLE "_services_v" ALTER COLUMN "version_content" SET DATA TYPE varchar;
  ALTER TABLE "case_studies" ALTER COLUMN "content" SET DATA TYPE varchar;
  ALTER TABLE "_case_studies_v" ALTER COLUMN "version_content" SET DATA TYPE varchar;
  ALTER TABLE "blog_posts" ALTER COLUMN "content" SET DATA TYPE varchar;
  ALTER TABLE "_blog_posts_v" ALTER COLUMN "version_content" SET DATA TYPE varchar;
  ALTER TABLE "services" DROP COLUMN IF EXISTS "display_order";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "tagline";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "outcomes_title";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_label";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "cta_href";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "hover_image_id";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_display_order";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_tagline";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_outcomes_title";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_label";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_cta_href";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_hover_image_id";
  ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "featured";
  ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "filter_tag";
  ALTER TABLE "_case_studies_v" DROP COLUMN IF EXISTS "version_featured";
  ALTER TABLE "_case_studies_v" DROP COLUMN IF EXISTS "version_filter_tag";
  ALTER TABLE "navigation" DROP COLUMN IF EXISTS "logo_image_id";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum_services_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum__services_v_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum_blog_posts_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_text_image_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_two_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_three_col_block_gap";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_card_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_button_block_variant";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_button_block_size";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_button_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_heading_block_tag";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_heading_block_size";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_heading_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_image_block_object_position";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_image_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_alert_block_variant";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_social_icons_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_social_icons_block_size";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_image_gallery_block_columns";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_section_block_columns_width";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_form_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_form_block_background_style";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_quote_block_size";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_quote_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_divider_block_style";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_divider_block_width";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_icon_block_size";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_icon_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_feature_list_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_feature_list_block_columns";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_team_grid_block_columns";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_team_grid_block_card_style";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_blog_feed_block_source";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_blog_feed_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_blog_feed_block_columns";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_countdown_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_countdown_block_align";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_timeline_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_steps_block_layout";
  DROP TYPE IF EXISTS "public"."enum__blog_posts_v_blocks_announcement_bar_block_style";
  DROP TYPE IF EXISTS "public"."enum_footer_brand_socials_platform";
  DROP TYPE IF EXISTS "public"."enum_footer_badges_tone";`)
}
