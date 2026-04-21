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
 * Services — brand book section 06 ("Services" — numbered accordion).
 * Fields here match the canonical accordion row design:
 *   number · name · tagline · description · outcomes[] · cta · hoverImage
 *
 * When a page's Services section has sectionType='services', each row is
 * rendered from one doc in this collection, ordered by `displayOrder` ASC.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'displayOrder', 'tagline', '_status'],
    preview: (doc) => getPreviewURL('/services', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/services', data?.slug),
    },
  },
  access: collectionAccess,
  versions: withDrafts,
  hooks: {
    afterChange: [revalidateCollectionChange(['/services', '/services-convert'], ['services'])],
    afterDelete: [revalidateCollectionDelete(['/services', '/services-convert'], ['services'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Service name shown in the accordion header (e.g. "Healthcare SEO").' } },
    slugField,
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: 'Sort order in the services accordion. Lower numbers appear first. The "01 / 02 / 03" prefix on the page is auto-derived from this.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'One-line summary shown under the service name in the accordion row.' },
    },
    excerptField,
    {
      name: 'outcomesTitle',
      type: 'text',
      defaultValue: 'What you get',
      admin: { description: 'Heading above the outcomes list in the expanded panel.' },
    },
    {
      name: 'outcomes',
      type: 'array',
      labels: { singular: 'Outcome', plural: 'Outcomes' },
      admin: { description: 'Bullet list of deliverables or results shown when the accordion row is expanded.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      admin: { description: 'Call-to-action shown inside the expanded panel.' },
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Learn more →' },
        { name: 'href', type: 'text', defaultValue: '/contact' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Used on the standalone /services/[slug] detail page as the hero.' },
    },
    {
      name: 'hoverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Preview image revealed on hover inside the services accordion (brand book §06).' },
    },
    bodyContentField('content'),
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: false,
      admin: {
        description: 'Full converted page layout. When populated, /services/[slug] renders these blocks pixel-perfect instead of the default layout. Imported automatically via the Service Converter.',
      },
    },
  ],
};
