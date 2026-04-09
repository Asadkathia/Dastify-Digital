import type { Migration } from './types.ts';
import { addColumnsIfMissing } from './helpers.ts';

export const migration: Migration = {
  id: '20260410_0016_pages_converted_content',
  name: 'Add converted_content columns to pages and page versions',
  async up(client) {
    await addColumnsIfMissing(client, 'pages', [
      { name: 'converted_content', type: 'text' },
    ]);

    await addColumnsIfMissing(client, '_pages_v', [
      { name: 'version_converted_content', type: 'text' },
    ]);
  },
};
