import type { CollectionConfig } from 'payload';
import { collectionAccess, getPreviewURL, slugField, withDrafts } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/blog/tag', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/blog/tag', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/blog'], ['tags'])],
    afterDelete: [revalidateCollectionDelete(['/blog'], ['tags'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
  ],
};
