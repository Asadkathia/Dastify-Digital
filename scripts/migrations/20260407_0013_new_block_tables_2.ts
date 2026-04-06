import type { Migration } from './types.ts';
import { tableExists } from './helpers.ts';

// Tables for 9 new blocks: button, heading, image, alert, tabs,
// social-icons, custom-html, counter, progress-bar, image-gallery
// Each block needs: pages_blocks_*, _pages_v_blocks_* variants,
// plus section-column-nested variants.

const SIMPLE_BLOCKS: Array<{ slug: string; columns: string }> = [
  {
    slug: 'button_block',
    columns: `
      "label"         TEXT,
      "href"          TEXT,
      "variant"       TEXT DEFAULT 'solid',
      "size"          TEXT DEFAULT 'md',
      "color"         TEXT,
      "align"         TEXT DEFAULT 'center',
      "open_in_new_tab" INTEGER DEFAULT 0`,
  },
  {
    slug: 'heading_block',
    columns: `
      "text"  TEXT,
      "tag"   TEXT DEFAULT 'h2',
      "size"  TEXT DEFAULT 'lg',
      "align" TEXT DEFAULT 'left',
      "color" TEXT`,
  },
  {
    slug: 'image_block',
    columns: `
      "image_id"        INTEGER,
      "image_alt"       TEXT,
      "caption"         TEXT,
      "href"            TEXT,
      "open_in_new_tab" INTEGER DEFAULT 0,
      "border_radius"   INTEGER DEFAULT 0,
      "object_position" TEXT DEFAULT 'center',
      "max_width"       INTEGER,
      "align"           TEXT DEFAULT 'center'`,
  },
  {
    slug: 'alert_block',
    columns: `
      "variant"     TEXT DEFAULT 'info',
      "title"       TEXT,
      "body"        TEXT,
      "dismissible" INTEGER DEFAULT 0`,
  },
  {
    slug: 'tabs_block',
    columns: `
      "title" TEXT`,
  },
  {
    slug: 'social_icons_block',
    columns: `
      "title" TEXT,
      "align" TEXT DEFAULT 'center',
      "size"  TEXT DEFAULT 'md'`,
  },
  {
    slug: 'custom_html_block',
    columns: `
      "label" TEXT,
      "html"  TEXT`,
  },
  {
    slug: 'counter_block',
    columns: `
      "title"    TEXT,
      "duration" INTEGER DEFAULT 2000`,
  },
  {
    slug: 'progress_bar_block',
    columns: `
      "title" TEXT`,
  },
  {
    slug: 'image_gallery_block',
    columns: `
      "title"    TEXT,
      "columns"  TEXT DEFAULT '3',
      "lightbox" INTEGER DEFAULT 1`,
  },
];

// Array sub-tables
const ARRAY_TABLES: Array<{ name: string; sql: string }> = [
  // tabs items
  {
    name: 'pages_blocks_tabs_block_tabs',
    sql: `CREATE TABLE "pages_blocks_tabs_block_tabs" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT,
      "content" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_tabs_block_tabs',
    sql: `CREATE TABLE "_pages_v_blocks_tabs_block_tabs" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "label" TEXT,
      "content" TEXT
    );`,
  },
  // social-icons links
  {
    name: 'pages_blocks_social_icons_block_links',
    sql: `CREATE TABLE "pages_blocks_social_icons_block_links" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "platform" TEXT,
      "url" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_social_icons_block_links',
    sql: `CREATE TABLE "_pages_v_blocks_social_icons_block_links" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "platform" TEXT,
      "url" TEXT
    );`,
  },
  // counter items
  {
    name: 'pages_blocks_counter_block_items',
    sql: `CREATE TABLE "pages_blocks_counter_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "value" REAL,
      "prefix" TEXT,
      "suffix" TEXT,
      "label" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_counter_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_counter_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "value" REAL,
      "prefix" TEXT,
      "suffix" TEXT,
      "label" TEXT
    );`,
  },
  // progress-bar items
  {
    name: 'pages_blocks_progress_bar_block_items',
    sql: `CREATE TABLE "pages_blocks_progress_bar_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT,
      "value" REAL,
      "color" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_progress_bar_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_progress_bar_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "label" TEXT,
      "value" REAL,
      "color" TEXT
    );`,
  },
  // image-gallery images
  {
    name: 'pages_blocks_image_gallery_block_images',
    sql: `CREATE TABLE "pages_blocks_image_gallery_block_images" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "image_id" INTEGER,
      "image_alt" TEXT,
      "caption" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_image_gallery_block_images',
    sql: `CREATE TABLE "_pages_v_blocks_image_gallery_block_images" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "image_id" INTEGER,
      "image_alt" TEXT,
      "caption" TEXT
    );`,
  },
  // section-col nested tabs
  {
    name: 'pages_blocks_section_block_columns_blocks_tabs_block_tabs',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_tabs_block_tabs" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT,
      "content" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_tabs_block_tabs',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_tabs_block_tabs" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "label" TEXT,
      "content" TEXT
    );`,
  },
  // section-col nested social-icons links
  {
    name: 'pages_blocks_section_block_columns_blocks_social_icons_block_links',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_social_icons_block_links" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "platform" TEXT,
      "url" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_social_icons_block_links',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_social_icons_block_links" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "platform" TEXT,
      "url" TEXT
    );`,
  },
  // section-col nested counter items
  {
    name: 'pages_blocks_section_block_columns_blocks_counter_block_items',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_counter_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "value" REAL,
      "prefix" TEXT,
      "suffix" TEXT,
      "label" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_counter_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_counter_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "value" REAL,
      "prefix" TEXT,
      "suffix" TEXT,
      "label" TEXT
    );`,
  },
  // section-col nested progress-bar items
  {
    name: 'pages_blocks_section_block_columns_blocks_progress_bar_block_items',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_progress_bar_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "label" TEXT,
      "value" REAL,
      "color" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_progress_bar_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_progress_bar_block_items" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "label" TEXT,
      "value" REAL,
      "color" TEXT
    );`,
  },
  // section-col nested image-gallery images
  {
    name: 'pages_blocks_section_block_columns_blocks_image_gallery_block_images',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_image_gallery_block_images" (
      "_order" INTEGER NOT NULL,
      "_parent_id" TEXT NOT NULL,
      "id" TEXT NOT NULL PRIMARY KEY,
      "image_id" INTEGER,
      "image_alt" TEXT,
      "caption" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_image_gallery_block_images',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_image_gallery_block_images" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" INTEGER NOT NULL PRIMARY KEY,
      "image_id" INTEGER,
      "image_alt" TEXT,
      "caption" TEXT
    );`,
  },
];

function makeSimpleBlockTables(slug: string, columns: string): Array<{ name: string; sql: string }> {
  const colBlock = `pages_blocks_${slug}`;
  const vColBlock = `_pages_v_blocks_${slug}`;
  const secNested = `pages_blocks_section_block_columns_blocks_${slug}`;
  const vSecNested = `_pages_v_blocks_section_block_columns_blocks_${slug}`;

  return [
    {
      name: colBlock,
      sql: `CREATE TABLE "${colBlock}" (
        "_order"     INTEGER NOT NULL,
        "_parent_id" INTEGER NOT NULL,
        "_path"      TEXT    NOT NULL,
        "id"         TEXT    NOT NULL PRIMARY KEY,
        ${columns.trim()},
        "block_name" TEXT
      );`,
    },
    {
      name: vColBlock,
      sql: `CREATE TABLE "${vColBlock}" (
        "_order"     INTEGER NOT NULL,
        "_parent_id" INTEGER NOT NULL,
        "_path"      TEXT    NOT NULL,
        "id"         INTEGER NOT NULL PRIMARY KEY,
        ${columns.trim()},
        "_uuid"      TEXT,
        "block_name" TEXT
      );`,
    },
    {
      name: secNested,
      sql: `CREATE TABLE "${secNested}" (
        "_order"     INTEGER NOT NULL,
        "_parent_id" TEXT    NOT NULL,
        "id"         TEXT    NOT NULL PRIMARY KEY,
        ${columns.trim()},
        "block_name" TEXT
      );`,
    },
    {
      name: vSecNested,
      sql: `CREATE TABLE "${vSecNested}" (
        "_order"     INTEGER NOT NULL,
        "_parent_id" INTEGER NOT NULL,
        "id"         INTEGER NOT NULL PRIMARY KEY,
        ${columns.trim()},
        "_uuid"      TEXT,
        "block_name" TEXT
      );`,
    },
  ];
}

const ALL_TABLES = [
  ...SIMPLE_BLOCKS.flatMap(({ slug, columns }) => makeSimpleBlockTables(slug, columns)),
  ...ARRAY_TABLES,
];

export const migration: Migration = {
  id: '20260407_0013',
  name: '20260407_0013_new_block_tables_2',
  async up(client) {
    for (const table of ALL_TABLES) {
      if (await tableExists(client, table.name)) {
        console.log(`  [skip] ${table.name} already exists`);
        continue;
      }
      await client.execute(table.sql);
      console.log(`  [create] ${table.name}`);
    }
  },
};
