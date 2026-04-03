import type { CollectionConfig } from 'payload';
import {
  collectionAccess,
  excerptField,
  getPreviewURL,
  publishedAtField,
  slugField,
  withDrafts,
} from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/blog', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/blog', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/blog', '/feed.xml'], ['blog-posts'])],
    afterDelete: [revalidateCollectionDelete(['/blog', '/feed.xml'], ['blog-posts'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    excerptField,
    publishedAtField,
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
};
