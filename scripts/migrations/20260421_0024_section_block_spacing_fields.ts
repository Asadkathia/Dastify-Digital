import type { Migration } from './types.ts';
import { addColumnIfMissing, tableExists } from './helpers.ts';

/**
 * Adds the full spacing/layout field set to every section-block table:
 *   padding_left, padding_right, margin_top, margin_bottom, max_width, min_height.
 *
 * Mirror of src/migrations/20260421_195925_section_block_spacing_fields.ts and
 * 20260421_201250_section_block_min_height.ts, combined into one SQLite pass.
 *
 * Renderer uses these to emit scoped !important CSS so overrides can REDUCE a
 * section's size (not just add to it), plus a `minHeight` that drives a direct
 * Section Height slider in the visual editor's Spacing tab.
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

const NEW_COLUMNS = [
  { name: 'padding_left', type: 'numeric' },
  { name: 'padding_right', type: 'numeric' },
  { name: 'margin_top', type: 'numeric' },
  { name: 'margin_bottom', type: 'numeric' },
  { name: 'max_width', type: 'numeric' },
  { name: 'min_height', type: 'numeric' },
] as const;

export const migration: Migration = {
  id: '20260421_0024_section_block_spacing_fields',
  name: 'Add spacing + min-height columns to every section-block table',
  async up(client) {
    for (const table of TABLES) {
      if (!(await tableExists(client, table))) continue;
      for (const col of NEW_COLUMNS) {
        await addColumnIfMissing(client, table, { name: col.name, type: col.type });
      }
    }
  },
};
