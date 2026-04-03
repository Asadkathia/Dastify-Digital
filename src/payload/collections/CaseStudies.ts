import type { CollectionConfig } from 'payload';
import { collectionAccess, excerptField, getPreviewURL, slugField, withDrafts } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/case-studies', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/case-studies', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/case-studies'], ['case-studies'])],
    afterDelete: [revalidateCollectionDelete(['/case-studies'], ['case-studies'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    excerptField,
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'featuredImage',
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
