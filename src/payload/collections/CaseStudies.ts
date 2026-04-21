import type { CollectionConfig } from 'payload';
import {
  bodyContentField,
  collectionAccess,
  excerptField,
  getPreviewURL,
  slugField,
  withDrafts,
} from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';
import { pageBuilderBlocks } from '../blocks/index.ts';

/**
 * Case Studies — brand book section 05 ("Case Studies").
 * Canonical design: tabbed category filter + featured card (large) + mini
 * cards (stacked). Stats are prominently displayed on each card.
 *
 * When a page's Case Studies section has sectionType='case-studies', cards are
 * rendered from docs in this collection, filtered by `filterTag` when set.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'featured', '_status'],
    preview: (doc) => getPreviewURL('/case-studies', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/case-studies', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/case-studies', '/work'], ['case-studies'])],
    afterDelete: [revalidateCollectionDelete(['/case-studies', '/work'], ['case-studies'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'client',
      type: 'text',
      admin: { description: 'Client / practice name shown prominently on the case-study card.' },
    },
    excerptField,
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'When true, this case study occupies the large featured slot in the section layout (brand book §05).',
      },
    },
    {
      name: 'filterTag',
      type: 'text',
      admin: { description: 'Lowercase slug used by the case-studies section tabbed filter (e.g. "dental", "fertility"). Leave blank for untagged.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 0,
      maxRows: 5,
      admin: { description: 'Up to 5 prominently-displayed metrics (e.g. "$2.4M new patient revenue"). Drives the "Stats prominently displayed" treatment from brand book §05.' },
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'Big number (e.g. "$2.4M", "47", "95%").' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'Short caption under the number (e.g. "New patient revenue").' } },
      ],
    },
    bodyContentField('content'),
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: false,
      admin: {
        description: 'Full converted page layout. When populated, /case-studies/[slug] renders these blocks pixel-perfect instead of the default layout. Imported automatically via the Case Study Converter.',
      },
    },
  ],
};
