import type { Migration } from './types.ts';
import { addColumnsIfMissing } from './helpers.ts';

export const migration: Migration = {
  id: '20260403_0004_locked_documents_new_rel_columns',
  name: 'Add payload_locked_documents_rels columns for new collections/plugins',
  async up(client) {
    await addColumnsIfMissing(client, 'payload_locked_documents_rels', [
      { name: 'pages_id', type: 'integer' },
      { name: 'services_id', type: 'integer' },
      { name: 'case_studies_id', type: 'integer' },
      { name: 'blog_categories_id', type: 'integer' },
      { name: 'tags_id', type: 'integer' },
      { name: 'blog_posts_id', type: 'integer' },
      { name: 'menus_id', type: 'integer' },
      { name: 'redirects_id', type: 'integer' },
      { name: 'forms_id', type: 'integer' },
      { name: 'form_submissions_id', type: 'integer' },
      { name: 'search_id', type: 'integer' },
    ]);
  },
};
