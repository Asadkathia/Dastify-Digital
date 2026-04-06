import type { Migration } from './types.ts';
import { tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260406_0011_section_block_tables',
  name: 'Create section-block, two-col-block, three-col-block tables for pages',
  async up(client) {
    // ── pages_blocks_section_block ──────────────────────────────────────────
    if (!(await tableExists(client, 'pages_blocks_section_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block" (
          "_order"           INTEGER  NOT NULL,
          "_parent_id"       INTEGER  NOT NULL,
          "_path"            TEXT     NOT NULL,
          "id"               TEXT     NOT NULL PRIMARY KEY,
          "label"            TEXT,
          "padding_top"      REAL,
          "padding_bottom"   REAL,
          "background_color" TEXT,
          "block_name"       TEXT
        );
      `);
    }

    // ── pages_blocks_section_block_columns ──────────────────────────────────
    if (!(await tableExists(client, 'pages_blocks_section_block_columns'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "width"      TEXT DEFAULT '1/1'
        );
      `);
    }

    // Nested leaf-block tables inside section-block columns
    // Each leaf block type needs its own table scoped to section columns.
    // Naming: pages_blocks_section_block_columns_blocks_<slug>

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_hero_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_hero_block" (
          "_order"               INTEGER NOT NULL,
          "_parent_id"           TEXT    NOT NULL,
          "_path"                TEXT    NOT NULL,
          "id"                   TEXT    NOT NULL PRIMARY KEY,
          "eyebrow"              TEXT,
          "title"                TEXT,
          "subtitle"             TEXT,
          "image_id"             INTEGER,
          "image_alt"            TEXT,
          "primary_cta_label"    TEXT,
          "primary_cta_href"     TEXT,
          "secondary_cta_label"  TEXT,
          "secondary_cta_href"   TEXT,
          "block_name"           TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_rich_text_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_rich_text_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "content"    TEXT,
          "block_name" TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_text_image_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_text_image_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "title"      TEXT,
          "text"       TEXT,
          "image_id"   INTEGER,
          "layout"     TEXT,
          "block_name" TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_cta_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_cta_block" (
          "_order"        INTEGER NOT NULL,
          "_parent_id"    TEXT    NOT NULL,
          "_path"         TEXT    NOT NULL,
          "id"            TEXT    NOT NULL PRIMARY KEY,
          "title"         TEXT,
          "subtitle"      TEXT,
          "button_label"  TEXT,
          "button_href"   TEXT,
          "block_name"    TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_faq_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_faq_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "title"      TEXT,
          "block_name" TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_faq_block_items'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_faq_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "question"   TEXT,
          "answer"     TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_stats_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_stats_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "title"      TEXT,
          "block_name" TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_stats_block_items'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_stats_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "label"      TEXT,
          "value"      TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_testimonials_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_testimonials_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "title"      TEXT,
          "block_name" TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_testimonials_block_items'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_testimonials_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "quote"      TEXT,
          "name"       TEXT,
          "role"       TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_two_col_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_two_col_block" (
          "_order"       INTEGER NOT NULL,
          "_parent_id"   TEXT    NOT NULL,
          "_path"        TEXT    NOT NULL,
          "id"           TEXT    NOT NULL PRIMARY KEY,
          "left_title"   TEXT,
          "left_text"    TEXT,
          "right_title"  TEXT,
          "right_text"   TEXT,
          "gap"          TEXT,
          "block_name"   TEXT
        );
      `);
    }

    if (!(await tableExists(client, 'pages_blocks_section_block_columns_blocks_three_col_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_section_block_columns_blocks_three_col_block" (
          "_order"      INTEGER NOT NULL,
          "_parent_id"  TEXT    NOT NULL,
          "_path"       TEXT    NOT NULL,
          "id"          TEXT    NOT NULL PRIMARY KEY,
          "col1_title"  TEXT,
          "col1_text"   TEXT,
          "col2_title"  TEXT,
          "col2_text"   TEXT,
          "col3_title"  TEXT,
          "col3_text"   TEXT,
          "gap"         TEXT,
          "block_name"  TEXT
        );
      `);
    }

    // ── pages_blocks_two_col_block (top-level) ──────────────────────────────
    if (!(await tableExists(client, 'pages_blocks_two_col_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_two_col_block" (
          "_order"      INTEGER NOT NULL,
          "_parent_id"  INTEGER NOT NULL,
          "_path"       TEXT    NOT NULL,
          "id"          TEXT    NOT NULL PRIMARY KEY,
          "left_title"  TEXT,
          "left_text"   TEXT,
          "right_title" TEXT,
          "right_text"  TEXT,
          "gap"         TEXT,
          "block_name"  TEXT
        );
      `);
    }

    // ── pages_blocks_three_col_block (top-level) ────────────────────────────
    if (!(await tableExists(client, 'pages_blocks_three_col_block'))) {
      await client.execute(`
        CREATE TABLE "pages_blocks_three_col_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         TEXT    NOT NULL PRIMARY KEY,
          "col1_title" TEXT,
          "col1_text"  TEXT,
          "col2_title" TEXT,
          "col2_text"  TEXT,
          "col3_title" TEXT,
          "col3_text"  TEXT,
          "gap"        TEXT,
          "block_name" TEXT
        );
      `);
    }

    // ── _pages_v (versions) equivalents ─────────────────────────────────────
    if (!(await tableExists(client, '_pages_v_blocks_section_block'))) {
      await client.execute(`
        CREATE TABLE "_pages_v_blocks_section_block" (
          "_order"           INTEGER NOT NULL,
          "_parent_id"       INTEGER NOT NULL,
          "_path"            TEXT    NOT NULL,
          "id"               INTEGER NOT NULL PRIMARY KEY,
          "label"            TEXT,
          "padding_top"      REAL,
          "padding_bottom"   REAL,
          "background_color" TEXT,
          "_uuid"            TEXT,
          "block_name"       TEXT
        );
      `);
    }

    if (!(await tableExists(client, '_pages_v_blocks_section_block_columns'))) {
      await client.execute(`
        CREATE TABLE "_pages_v_blocks_section_block_columns" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "width"      TEXT DEFAULT '1/1',
          "_uuid"      TEXT
        );
      `);
    }

    // Versioned nested leaf tables for section-block columns
    const vNestedLeafs: Array<{ table: string; sql: string }> = [
      {
        table: '_pages_v_blocks_section_block_columns_blocks_hero_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_hero_block" (
          "_order"               INTEGER NOT NULL,
          "_parent_id"           INTEGER NOT NULL,
          "_path"                TEXT    NOT NULL,
          "id"                   INTEGER NOT NULL PRIMARY KEY,
          "eyebrow"              TEXT,
          "title"                TEXT,
          "subtitle"             TEXT,
          "image_id"             INTEGER,
          "image_alt"            TEXT,
          "primary_cta_label"    TEXT,
          "primary_cta_href"     TEXT,
          "secondary_cta_label"  TEXT,
          "secondary_cta_href"   TEXT,
          "_uuid"                TEXT,
          "block_name"           TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_rich_text_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_rich_text_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "content"    TEXT,
          "_uuid"      TEXT,
          "block_name" TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_text_image_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_text_image_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "title"      TEXT,
          "text"       TEXT,
          "image_id"   INTEGER,
          "layout"     TEXT,
          "_uuid"      TEXT,
          "block_name" TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_cta_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_cta_block" (
          "_order"       INTEGER NOT NULL,
          "_parent_id"   INTEGER NOT NULL,
          "_path"        TEXT    NOT NULL,
          "id"           INTEGER NOT NULL PRIMARY KEY,
          "title"        TEXT,
          "subtitle"     TEXT,
          "button_label" TEXT,
          "button_href"  TEXT,
          "_uuid"        TEXT,
          "block_name"   TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_faq_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_faq_block" (
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
        table: '_pages_v_blocks_section_block_columns_blocks_faq_block_items',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_faq_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "question"   TEXT,
          "answer"     TEXT,
          "_uuid"      TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_stats_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_stats_block" (
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
        table: '_pages_v_blocks_section_block_columns_blocks_stats_block_items',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_stats_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "label"      TEXT,
          "value"      TEXT,
          "_uuid"      TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_testimonials_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_testimonials_block" (
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
        table: '_pages_v_blocks_section_block_columns_blocks_testimonials_block_items',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_testimonials_block_items" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "quote"      TEXT,
          "name"       TEXT,
          "role"       TEXT,
          "_uuid"      TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_two_col_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_two_col_block" (
          "_order"      INTEGER NOT NULL,
          "_parent_id"  INTEGER NOT NULL,
          "_path"       TEXT    NOT NULL,
          "id"          INTEGER NOT NULL PRIMARY KEY,
          "left_title"  TEXT,
          "left_text"   TEXT,
          "right_title" TEXT,
          "right_text"  TEXT,
          "gap"         TEXT,
          "_uuid"       TEXT,
          "block_name"  TEXT
        );`,
      },
      {
        table: '_pages_v_blocks_section_block_columns_blocks_three_col_block',
        sql: `CREATE TABLE "_pages_v_blocks_section_block_columns_blocks_three_col_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "col1_title" TEXT,
          "col1_text"  TEXT,
          "col2_title" TEXT,
          "col2_text"  TEXT,
          "col3_title" TEXT,
          "col3_text"  TEXT,
          "gap"        TEXT,
          "_uuid"      TEXT,
          "block_name" TEXT
        );`,
      },
    ];

    for (const { table, sql } of vNestedLeafs) {
      if (!(await tableExists(client, table))) {
        await client.execute(sql);
      }
    }

    // ── Versioned top-level two-col and three-col ────────────────────────────
    if (!(await tableExists(client, '_pages_v_blocks_two_col_block'))) {
      await client.execute(`
        CREATE TABLE "_pages_v_blocks_two_col_block" (
          "_order"      INTEGER NOT NULL,
          "_parent_id"  INTEGER NOT NULL,
          "_path"       TEXT    NOT NULL,
          "id"          INTEGER NOT NULL PRIMARY KEY,
          "left_title"  TEXT,
          "left_text"   TEXT,
          "right_title" TEXT,
          "right_text"  TEXT,
          "gap"         TEXT,
          "_uuid"       TEXT,
          "block_name"  TEXT
        );
      `);
    }

    if (!(await tableExists(client, '_pages_v_blocks_three_col_block'))) {
      await client.execute(`
        CREATE TABLE "_pages_v_blocks_three_col_block" (
          "_order"     INTEGER NOT NULL,
          "_parent_id" INTEGER NOT NULL,
          "_path"      TEXT    NOT NULL,
          "id"         INTEGER NOT NULL PRIMARY KEY,
          "col1_title" TEXT,
          "col1_text"  TEXT,
          "col2_title" TEXT,
          "col2_text"  TEXT,
          "col3_title" TEXT,
          "col3_text"  TEXT,
          "gap"        TEXT,
          "_uuid"      TEXT,
          "block_name" TEXT
        );
      `);
    }
  },
};
