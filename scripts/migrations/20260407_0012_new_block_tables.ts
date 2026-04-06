import type { Migration } from './types.ts';
import { tableExists } from './helpers.ts';

// Tables needed for the 7 new blocks: pricing, logo-carousel, video-embed,
// spacer, accordion, card-grid — both pages_* and _pages_v_* variants,
// plus the nested variants inside section-block columns.

const TABLES: Array<{ name: string; sql: string }> = [
  // ── pricing-block ────────────────────────────────────────────────────────
  {
    name: 'pages_blocks_pricing_block',
    sql: `CREATE TABLE "pages_blocks_pricing_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_pricing_block_plans',
    sql: `CREATE TABLE "pages_blocks_pricing_block_plans" (
      "_order"      INTEGER NOT NULL,
      "_parent_id"  TEXT    NOT NULL,
      "id"          TEXT    NOT NULL PRIMARY KEY,
      "name"        TEXT,
      "price"       TEXT,
      "period"      TEXT,
      "description" TEXT,
      "features"    TEXT,
      "cta_label"   TEXT,
      "cta_href"    TEXT,
      "highlighted" INTEGER DEFAULT 0
    );`,
  },
  {
    name: '_pages_v_blocks_pricing_block',
    sql: `CREATE TABLE "_pages_v_blocks_pricing_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_pricing_block_plans',
    sql: `CREATE TABLE "_pages_v_blocks_pricing_block_plans" (
      "_order"      INTEGER NOT NULL,
      "_parent_id"  INTEGER NOT NULL,
      "id"          INTEGER NOT NULL PRIMARY KEY,
      "name"        TEXT,
      "price"       TEXT,
      "period"      TEXT,
      "description" TEXT,
      "features"    TEXT,
      "cta_label"   TEXT,
      "cta_href"    TEXT,
      "highlighted" INTEGER DEFAULT 0,
      "_uuid"       TEXT
    );`,
  },

  // ── logo-carousel-block ──────────────────────────────────────────────────
  {
    name: 'pages_blocks_logo_carousel_block',
    sql: `CREATE TABLE "pages_blocks_logo_carousel_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_logo_carousel_block_logos',
    sql: `CREATE TABLE "pages_blocks_logo_carousel_block_logos" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "image_id"   INTEGER,
      "image_alt"  TEXT,
      "href"       TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_logo_carousel_block',
    sql: `CREATE TABLE "_pages_v_blocks_logo_carousel_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_logo_carousel_block_logos',
    sql: `CREATE TABLE "_pages_v_blocks_logo_carousel_block_logos" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "image_id"   INTEGER,
      "image_alt"  TEXT,
      "href"       TEXT,
      "_uuid"      TEXT
    );`,
  },

  // ── video-embed-block ────────────────────────────────────────────────────
  {
    name: 'pages_blocks_video_embed_block',
    sql: `CREATE TABLE "pages_blocks_video_embed_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "url"        TEXT,
      "title"      TEXT,
      "caption"    TEXT,
      "autoplay"   INTEGER DEFAULT 0,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_video_embed_block',
    sql: `CREATE TABLE "_pages_v_blocks_video_embed_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "url"        TEXT,
      "title"      TEXT,
      "caption"    TEXT,
      "autoplay"   INTEGER DEFAULT 0,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },

  // ── spacer-block ─────────────────────────────────────────────────────────
  {
    name: 'pages_blocks_spacer_block',
    sql: `CREATE TABLE "pages_blocks_spacer_block" (
      "_order"       INTEGER NOT NULL,
      "_parent_id"   INTEGER NOT NULL,
      "_path"        TEXT    NOT NULL,
      "id"           TEXT    NOT NULL PRIMARY KEY,
      "height"       REAL    DEFAULT 60,
      "show_divider" INTEGER DEFAULT 0,
      "block_name"   TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_spacer_block',
    sql: `CREATE TABLE "_pages_v_blocks_spacer_block" (
      "_order"       INTEGER NOT NULL,
      "_parent_id"   INTEGER NOT NULL,
      "_path"        TEXT    NOT NULL,
      "id"           INTEGER NOT NULL PRIMARY KEY,
      "height"       REAL    DEFAULT 60,
      "show_divider" INTEGER DEFAULT 0,
      "_uuid"        TEXT,
      "block_name"   TEXT
    );`,
  },

  // ── accordion-block ──────────────────────────────────────────────────────
  {
    name: 'pages_blocks_accordion_block',
    sql: `CREATE TABLE "pages_blocks_accordion_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_accordion_block_items',
    sql: `CREATE TABLE "pages_blocks_accordion_block_items" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "heading"    TEXT,
      "body"       TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_accordion_block',
    sql: `CREATE TABLE "_pages_v_blocks_accordion_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_accordion_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_accordion_block_items" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "heading"    TEXT,
      "body"       TEXT,
      "_uuid"      TEXT
    );`,
  },

  // ── card-grid-block ──────────────────────────────────────────────────────
  {
    name: 'pages_blocks_card_grid_block',
    sql: `CREATE TABLE "pages_blocks_card_grid_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "columns"    TEXT    DEFAULT '3',
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_card_grid_block_cards',
    sql: `CREATE TABLE "pages_blocks_card_grid_block_cards" (
      "_order"    INTEGER NOT NULL,
      "_parent_id" TEXT   NOT NULL,
      "id"        TEXT    NOT NULL PRIMARY KEY,
      "image_id"  INTEGER,
      "image_alt" TEXT,
      "eyebrow"   TEXT,
      "title"     TEXT,
      "text"      TEXT,
      "cta_label" TEXT,
      "cta_href"  TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_card_grid_block',
    sql: `CREATE TABLE "_pages_v_blocks_card_grid_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "columns"    TEXT    DEFAULT '3',
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_card_grid_block_cards',
    sql: `CREATE TABLE "_pages_v_blocks_card_grid_block_cards" (
      "_order"    INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"        INTEGER NOT NULL PRIMARY KEY,
      "image_id"  INTEGER,
      "image_alt" TEXT,
      "eyebrow"   TEXT,
      "title"     TEXT,
      "text"      TEXT,
      "cta_label" TEXT,
      "cta_href"  TEXT,
      "_uuid"     TEXT
    );`,
  },

  // ── section-block column nested variants for new blocks ──────────────────
  {
    name: 'pages_blocks_section_block_columns_blocks_pricing_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_pricing_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_pricing_block_plans',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_pricing_block_plans" (
      "_order"      INTEGER NOT NULL,
      "_parent_id"  TEXT    NOT NULL,
      "id"          TEXT    NOT NULL PRIMARY KEY,
      "name"        TEXT,
      "price"       TEXT,
      "period"      TEXT,
      "description" TEXT,
      "features"    TEXT,
      "cta_label"   TEXT,
      "cta_href"    TEXT,
      "highlighted" INTEGER DEFAULT 0
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_logo_carousel_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_logo_carousel_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_logo_carousel_block_logos',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_logo_carousel_block_logos" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "image_id"   INTEGER,
      "image_alt"  TEXT,
      "href"       TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_video_embed_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_video_embed_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "url"        TEXT,
      "title"      TEXT,
      "caption"    TEXT,
      "autoplay"   INTEGER DEFAULT 0,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_spacer_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_spacer_block" (
      "_order"       INTEGER NOT NULL,
      "_parent_id"   TEXT    NOT NULL,
      "_path"        TEXT    NOT NULL,
      "id"           TEXT    NOT NULL PRIMARY KEY,
      "height"       REAL    DEFAULT 60,
      "show_divider" INTEGER DEFAULT 0,
      "block_name"   TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_accordion_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_accordion_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_accordion_block_items',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_accordion_block_items" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "heading"    TEXT,
      "body"       TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_card_grid_block',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_card_grid_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" TEXT    NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         TEXT    NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "columns"    TEXT    DEFAULT '3',
      "block_name" TEXT
    );`,
  },
  {
    name: 'pages_blocks_section_block_columns_blocks_card_grid_block_cards',
    sql: `CREATE TABLE "pages_blocks_section_block_columns_blocks_card_grid_block_cards" (
      "_order"    INTEGER NOT NULL,
      "_parent_id" TEXT   NOT NULL,
      "id"        TEXT    NOT NULL PRIMARY KEY,
      "image_id"  INTEGER,
      "image_alt" TEXT,
      "eyebrow"   TEXT,
      "title"     TEXT,
      "text"      TEXT,
      "cta_label" TEXT,
      "cta_href"  TEXT
    );`,
  },

  // ── versioned section column nested for new blocks ────────────────────────
  {
    name: '_pages_v_blocks_section_block_columns_blocks_pricing_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_pricing_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_pricing_block_plans',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_pricing_block_plans" (
      "_order"      INTEGER NOT NULL,
      "_parent_id"  INTEGER NOT NULL,
      "id"          INTEGER NOT NULL PRIMARY KEY,
      "name"        TEXT,
      "price"       TEXT,
      "period"      TEXT,
      "description" TEXT,
      "features"    TEXT,
      "cta_label"   TEXT,
      "cta_href"    TEXT,
      "highlighted" INTEGER DEFAULT 0,
      "_uuid"       TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_logo_carousel_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_logo_carousel_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_logo_carousel_block_logos',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_logo_carousel_block_logos" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "image_id"   INTEGER,
      "image_alt"  TEXT,
      "href"       TEXT,
      "_uuid"      TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_video_embed_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_video_embed_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "url"        TEXT,
      "title"      TEXT,
      "caption"    TEXT,
      "autoplay"   INTEGER DEFAULT 0,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_spacer_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_spacer_block" (
      "_order"       INTEGER NOT NULL,
      "_parent_id"   INTEGER NOT NULL,
      "_path"        TEXT    NOT NULL,
      "id"           INTEGER NOT NULL PRIMARY KEY,
      "height"       REAL    DEFAULT 60,
      "show_divider" INTEGER DEFAULT 0,
      "_uuid"        TEXT,
      "block_name"   TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_accordion_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_accordion_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_accordion_block_items',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_accordion_block_items" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "heading"    TEXT,
      "body"       TEXT,
      "_uuid"      TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_card_grid_block',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_card_grid_block" (
      "_order"     INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "_path"      TEXT    NOT NULL,
      "id"         INTEGER NOT NULL PRIMARY KEY,
      "title"      TEXT,
      "subtitle"   TEXT,
      "columns"    TEXT    DEFAULT '3',
      "_uuid"      TEXT,
      "block_name" TEXT
    );`,
  },
  {
    name: '_pages_v_blocks_section_block_columns_blocks_card_grid_block_cards',
    sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_card_grid_block_cards" (
      "_order"    INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id"        INTEGER NOT NULL PRIMARY KEY,
      "image_id"  INTEGER,
      "image_alt" TEXT,
      "eyebrow"   TEXT,
      "title"     TEXT,
      "text"      TEXT,
      "cta_label" TEXT,
      "cta_href"  TEXT,
      "_uuid"     TEXT
    );`,
  },
];

export const migration: Migration = {
  id: '20260407_0012_new_block_tables',
  name: 'Create pricing, logo-carousel, video-embed, spacer, accordion, card-grid block tables',
  async up(client) {
    for (const { name, sql } of TABLES) {
      if (!(await tableExists(client, name))) {
        await client.execute(sql);
      }
    }
  },
};
