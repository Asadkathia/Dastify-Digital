import type { CollectionConfig } from 'payload';
import { collectionAccess, excerptField, getPreviewURL, slugField, withDrafts } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/services', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/services', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/services'], ['services'])],
    afterDelete: [revalidateCollectionDelete(['/services'], ['services'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    excerptField,
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
};
