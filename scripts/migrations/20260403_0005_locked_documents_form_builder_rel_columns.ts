import type { Migration } from './types.ts';
import { addColumnsIfMissing } from './helpers.ts';

export const migration: Migration = {
  id: '20260403_0005_locked_documents_form_builder_rel_columns',
  name: 'Add payload_locked_documents_rels columns for form builder collections',
  async up(client) {
    await addColumnsIfMissing(client, 'payload_locked_documents_rels', [
      { name: 'forms_id', type: 'integer' },
      { name: 'form_submissions_id', type: 'integer' },
    ]);
  },
};
