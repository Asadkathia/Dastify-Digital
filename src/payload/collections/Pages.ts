import type { CollectionConfig, PayloadRequest } from 'payload';
import { pageBuilderBlocks } from '../blocks/index.ts';
import { collectionAccess, excerptField, getPreviewURL, slugField } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

const UNAVAILABLE_SLUG_MESSAGE = (slug: string) =>
  `Slug "${slug}" isn't available because it's already in use by another CMS page.`;

const RESERVED_SLUG_MESSAGE = (slug: string) =>
  `Slug "${slug}" isn't available because it's already in use by an existing site route.`;

const RESERVED_SITE_SLUGS = new Set([
  'admin',
  'api',
  '_next',
  'converted-preview',
  'legacy-preview',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'feed.xml',
  'page-editor-preview',
]);

const pageSlugField = {
  ...slugField,
  validate: async (value: unknown, options: { id?: number | string; req?: PayloadRequest }) => {
    const slug = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (!slug) return 'Slug is required';

    const req = options.req;
    if (!req?.payload) return true;

    const existing = await req.payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      pagination: false,
    });

    const found = existing.docs[0] as { id?: number | string } | undefined;
    if (!found) return true;

    const currentId = options.id != null ? String(options.id) : null;
    const foundId = found.id != null ? String(found.id) : null;

    if (!currentId || !foundId || currentId !== foundId) {
      return UNAVAILABLE_SLUG_MESSAGE(slug);
    }

    if (RESERVED_SITE_SLUGS.has(slug)) {
      // Allow legacy docs that already use a reserved slug to keep saving
      // unchanged content, but block switching another page into reserved slugs.
      if (currentId) {
        try {
          const currentDoc = (await req.payload.findByID({
            collection: 'pages',
            id: currentId,
            depth: 0,
          })) as { slug?: string } | null;

          const currentSlug = typeof currentDoc?.slug === 'string' ? currentDoc.slug.trim().toLowerCase() : '';
          if (currentSlug === slug) {
            return true;
          }
        } catch {
          // Fallback to blocking reserved slug.
        }
      }

      return RESERVED_SLUG_MESSAGE(slug);
    }

    return true;
  },
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => getPreviewURL('/', doc?.slug),
    livePreview: {
      url: ({ data }) => getPreviewURL('/', data?.slug),
    },
    components: {
      afterList: ['/src/payload/components/VisualEditorButton#VisualEditorButton'],
      edit: {
        beforeDocumentControls: ['/src/payload/components/VisualEditorDocButton#VisualEditorDocButton'],
      },
    },
  },
  access: collectionAccess,
  // Blocks are stored as JSON on the parent row (see payload.config.ts blocksAsJSON).
  // Autosave stays off so title/slug/SEO edits only run through the explicit
  // Save Draft / Publish buttons — visual content is managed via the Visual Editor.
  versions: {
    drafts: {
      autosave: false,
      validate: false,
      schedulePublish: true,
    },
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (originalDoc && typeof originalDoc === 'object') {
          const source = originalDoc as Record<string, unknown>;
          const nextData = (data && typeof data === 'object' ? { ...data } : {}) as Record<string, unknown>;

          if (typeof source.convertedPageName === 'string' && !nextData.convertedPageName) {
            nextData.convertedPageName = source.convertedPageName;
          }

          if (source.convertedContent && !nextData.convertedContent) {
            nextData.convertedContent = source.convertedContent;
          }

          return nextData;
        }
        return data;
      },
    ],
    afterChange: [revalidateCollectionChange(['/'], ['pages'])],
    afterDelete: [revalidateCollectionDelete(['/'], ['pages'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    pageSlugField as never,
    excerptField,
    {
      // Stores the original converted page name (e.g. "about", "services-convert").
      // Used by the visual editor to identify converted pages independently of the slug,
      // so renaming the slug does not break the converted content binding.
      name: 'convertedPageName',
      type: 'text',
      admin: { readOnly: true, description: 'Set automatically when a converted page is uploaded to CMS.' },
    },
    {
      name: 'convertedContent',
      type: 'json',
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: false,
      admin: {
        condition: (_, siblingData) => !siblingData?.convertedPageName,
      },
    },
  ],
};
