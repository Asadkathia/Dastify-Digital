import type { CollectionConfig } from 'payload';
import {
  bodyContentField,
  collectionAccess,
  excerptField,
  getPreviewURL,
  publishedAtField,
  slugField,
  withDrafts,
} from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';
import { pageBuilderBlocks } from '../blocks/index.ts';

/**
 * Blog Posts — brand book section 08 ("Insights/Blog" — 3-column card grid).
 * When a page's Blog section has sectionType='blog-posts', cards are rendered
 * from docs in this collection sorted by publishedAt DESC.
 */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
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
    bodyContentField('content'),
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: false,
      admin: {
        description: 'Full converted page layout. When populated, /blog/[slug] renders these blocks pixel-perfect instead of the default layout. Imported automatically via the Blog Post Converter.',
      },
    },
  ],
};
