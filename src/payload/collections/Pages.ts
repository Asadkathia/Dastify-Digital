import type { CollectionConfig } from 'payload';
import { pageBuilderBlocks } from '../blocks/index.ts';
import { collectionAccess, excerptField, getPreviewURL, slugField, withDrafts } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/'], ['pages'])],
    afterDelete: [revalidateCollectionDelete(['/'], ['pages'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    excerptField,
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: true,
    },
  ],
};
