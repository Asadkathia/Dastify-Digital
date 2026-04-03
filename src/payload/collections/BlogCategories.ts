import type { CollectionConfig } from 'payload';
import { collectionAccess, getPreviewURL, slugField, withDrafts } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/blog/category', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/blog/category', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/blog'], ['blog-categories'])],
    afterDelete: [revalidateCollectionDelete(['/blog'], ['blog-categories'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    { name: 'description', type: 'textarea' },
  ],
};
