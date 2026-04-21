import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * Adds a single `breakpoint_styles` JSON column to every section-block table.
 * Stores per-breakpoint spacing overrides as one blob:
 *   { tablet?: BreakpointOverrides, mobile?: BreakpointOverrides }
 *
 * Driven by the unified Section Height slider in the Spacing tab — one blob
 * keeps future per-breakpoint fields schema-free.
 */
const TABLES = [
  'pages_blocks_section_block',
  '_pages_v_blocks_section_block',
  'homepage_blocks_section_block',
  '_homepage_v_blocks_section_block',
  'blog_posts_blocks_section_block',
  '_blog_posts_v_blocks_section_block',
  'services_blocks_section_block',
  '_services_v_blocks_section_block',
  'case_studies_blocks_section_block',
  '_case_studies_v_blocks_section_block',
];

export const migration: Migration = {
  id: '20260421_0025_section_block_breakpoint_styles',
  name: 'Add breakpoint_styles JSON column to every section-block table',
  async up(client) {
    for (const table of TABLES) {
      if (!(await tableExists(client, table))) continue;
      await addColumnIfMissing(client, table, { name: 'breakpoint_styles', type: 'text' });
    }
  },
};
