import type { Field, GlobalBeforeChangeHook, GlobalConfig } from 'payload';
import { homepageContent } from '../../lib/homepage-content.ts';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';
import { pageBuilderBlocks } from '../blocks/index.ts';

// ─── Preview URL ─────────────────────────────────────────────────────────────

function getHomepagePreviewURL(slug = '/'): string | null {
  const secret = process.env.PREVIEW_SECRET;
  const params = new URLSearchParams({ slug });
  if (secret) params.set('secret', secret);
  return `/api/preview?${params.toString()}`;
}

// ─── Orphan-row trap fix (see Footer.ts for why) ─────────────────────────────
//
// The v2 homepage has nested arrays inside `group` fields (e.g.
// `hero.proofStats`, `services.items`, `pricing.plans[].features`). Payload
// 3.x's upsertRow for globals with nested arrays can leave orphans that then
// collide on UNIQUE PK. Stripping `id` on every array row forces fresh UUIDs.
function stripIdsFromArray(items: unknown): void {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    delete record.id;
    for (const val of Object.values(record)) {
      if (Array.isArray(val)) stripIdsFromArray(val);
    }
  }
}

const stripNestedArrayIds: GlobalBeforeChangeHook = ({ data }) => {
  if (!data || typeof data !== 'object') return data;
  const d = data as Record<string, unknown>;
  for (const key of Object.keys(d)) {
    const group = d[key];
    if (!group || typeof group !== 'object' || Array.isArray(group)) continue;
    const record = group as Record<string, unknown>;
    for (const val of Object.values(record)) {
      if (Array.isArray(val)) stripIdsFromArray(val);
    }
  }
  return data;
};

// ─── Field builders for the v2 sections ──────────────────────────────────────

const linkGroup = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'href', type: 'text' },
  ],
});

const heroFields: Field[] = [
  { name: 'kicker', type: 'text' },
  { name: 'eyebrow', type: 'text' },
  { name: 'badge', type: 'text' },
  { name: 'headingA', type: 'textarea' },
  { name: 'headingB', type: 'textarea' },
  { name: 'headingC', type: 'textarea' },
  { name: 'subA', type: 'textarea' },
  { name: 'subB', type: 'textarea' },
  { name: 'subC', type: 'textarea' },
  linkGroup('primaryCta'),
  linkGroup('secondaryCta'),
  { name: 'phone', type: 'text' },
  {
    name: 'proofStats',
    type: 'array',
    fields: [
      { name: 'value', type: 'text' },
      { name: 'label', type: 'text' },
      { name: 'sublabel', type: 'text' },
    ],
  },
  {
    name: 'statTiles',
    type: 'array',
    fields: [
      { name: 'value', type: 'text' },
      { name: 'label', type: 'text' },
      { name: 'sublabel', type: 'text' },
    ],
  },
  {
    name: 'ticker',
    type: 'array',
    fields: [{ name: 'text', type: 'text' }],
  },
  { name: 'image', type: 'text' },
  { name: 'imageAlt', type: 'text' },
  { name: 'trustLogosLabel', type: 'text' },
  {
    name: 'trustLogos',
    type: 'array',
    fields: [
      { name: 'slug', type: 'text' },
      { name: 'label', type: 'text' },
      { name: 'src', type: 'text' },
    ],
  },
];

const trustBarFields: Field[] = [
  { name: 'label', type: 'text' },
  { name: 'logos', type: 'array', fields: [{ name: 'text', type: 'text' }] },
];

const servicesFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleEm', type: 'text' },
  { name: 'titleTail', type: 'text' },
  { name: 'intro', type: 'textarea' },
  {
    name: 'items',
    type: 'array',
    fields: [
      { name: 'icon', type: 'text' },
      { name: 'name', type: 'text' },
      { name: 'description', type: 'textarea' },
    ],
  },
];

const growthFunnelFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleEm', type: 'text' },
  { name: 'intro', type: 'textarea' },
  { name: 'ctaLabel', type: 'text' },
  { name: 'ctaHref', type: 'text' },
  {
    name: 'steps',
    type: 'array',
    fields: [
      { name: 'num', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'sub', type: 'text' },
      { name: 'desc', type: 'textarea' },
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'n', type: 'text' },
          { name: 'd', type: 'textarea' },
        ],
      },
    ],
  },
];

const resultsFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleTail', type: 'text' },
  { name: 'intro', type: 'textarea' },
  { name: 'ctaLabel', type: 'text' },
  { name: 'ctaHref', type: 'text' },
  {
    name: 'cards',
    type: 'array',
    fields: [
      { name: 'client', type: 'text' },
      { name: 'value', type: 'text' },
      { name: 'label', type: 'text' },
      { name: 'barPercent', type: 'number' },
      { name: 'featured', type: 'checkbox' },
      {
        name: 'subStats',
        type: 'array',
        fields: [
          { name: 'value', type: 'text' },
          { name: 'label', type: 'text' },
        ],
      },
    ],
  },
];

const testimonialFields: Field[] = [
  { name: 'quoteLead', type: 'textarea' },
  { name: 'quoteEm', type: 'text' },
  { name: 'quoteTail', type: 'textarea' },
  { name: 'authorInitials', type: 'text' },
  { name: 'authorName', type: 'text' },
  { name: 'authorRole', type: 'text' },
];

const weServeFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleEm', type: 'text' },
  { name: 'intro', type: 'textarea' },
  {
    name: 'specialties',
    type: 'array',
    fields: [
      { name: 'icon', type: 'text' },
      { name: 'name', type: 'text' },
    ],
  },
  { name: 'noteLead', type: 'text' },
  { name: 'noteLink', type: 'text' },
];

const aboutPreviewFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleTail', type: 'text' },
  { name: 'body', type: 'textarea' },
  {
    name: 'stats',
    type: 'array',
    fields: [
      { name: 'value', type: 'text' },
      { name: 'label', type: 'text' },
    ],
  },
  { name: 'ctaLabel', type: 'text' },
  { name: 'ctaHref', type: 'text' },
  { name: 'image', type: 'text' },
  { name: 'imageAlt', type: 'text' },
];

const pricingFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'titleLead', type: 'text' },
  { name: 'titleEm', type: 'text' },
  { name: 'intro', type: 'textarea' },
  { name: 'monthlyLabel', type: 'text' },
  { name: 'annualLabel', type: 'text' },
  { name: 'annualSavingsLabel', type: 'text' },
  {
    name: 'plans',
    type: 'array',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'icon', type: 'text' },
      { name: 'priceMonthly', type: 'number' },
      { name: 'priceAnnual', type: 'number' },
      { name: 'description', type: 'textarea' },
      { name: 'badge', type: 'text' },
      { name: 'featured', type: 'checkbox' },
      {
        name: 'color',
        type: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Accent', value: 'accent' },
          { label: 'Support', value: 'support' },
        ],
      },
      { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text' }] },
      { name: 'ctaLabel', type: 'text' },
      { name: 'ctaHref', type: 'text' },
    ],
  },
  { name: 'footnoteLead', type: 'textarea' },
  { name: 'footnoteLinkLabel', type: 'text' },
  { name: 'footnoteLinkHref', type: 'text' },
];

const blogPreviewFields: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'title', type: 'text' },
  { name: 'intro', type: 'textarea' },
  { name: 'ctaLabel', type: 'text' },
  { name: 'ctaHref', type: 'text' },
  {
    name: 'posts',
    type: 'array',
    fields: [
      { name: 'tag', type: 'text' },
      { name: 'title', type: 'text' },
      { name: 'readTime', type: 'text' },
      { name: 'href', type: 'text' },
    ],
  },
];

const finalCtaFields: Field[] = [
  { name: 'heading', type: 'text' },
  { name: 'body', type: 'textarea' },
  linkGroup('primaryCta'),
  linkGroup('secondaryCta'),
];

// ─── Global config ───────────────────────────────────────────────────────────

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content (deprecated)',
  // v2 redesign moved homepage editing into the Pages collection (slug=home,
  // convertedPageName=home). The public `/` route reads from that Pages row,
  // not from this global. Hiding from admin nav so marketing doesn't get
  // confused about which surface to edit. Route is still reachable by URL,
  // but nothing in the sidebar points to it.
  //
  // The underlying homepage_* tables on Neon still hold the legacy v1 column
  // set; the new field shape in code wouldn't load anyway without a Postgres
  // migration. Leaving both as-is — the global is functionally retired.
  admin: {
    hidden: true,
    components: {
      elements: {
        beforeDocumentControls: [
          '@/payload/components/HomepageEditorButton#default',
          '@/payload/components/HomepagePreviewLink#HomepagePreviewLink',
        ],
      },
    },
    preview: () => getHomepagePreviewURL('/'),
    livePreview: {
      url: () => getHomepagePreviewURL('/'),
    },
  },
  versions: {
    max: 50,
    drafts: {
      autosave: {
        interval: 1200,
        showSaveDraftButton: true,
      },
      validate: false,
      schedulePublish: true,
    },
  },
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
    beforeChange: [stripNestedArrayIds],
    afterChange: [revalidateGlobalChange('homepage', ['/'])],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroVariant',
              type: 'select',
              defaultValue: homepageContent.heroVariant,
              options: [
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
              ],
            },
            { name: 'hero', type: 'group', defaultValue: homepageContent.hero, fields: heroFields },
            { name: 'trustBar', type: 'group', defaultValue: homepageContent.trustBar, fields: trustBarFields },
          ],
        },
        {
          label: 'Services + Results',
          fields: [
            { name: 'services', type: 'group', defaultValue: homepageContent.services, fields: servicesFields },
            { name: 'growthFunnel', type: 'group', defaultValue: homepageContent.growthFunnel, fields: growthFunnelFields },
            { name: 'results', type: 'group', defaultValue: homepageContent.results, fields: resultsFields },
          ],
        },
        {
          label: 'Testimonial + Specialties',
          fields: [
            { name: 'testimonial', type: 'group', defaultValue: homepageContent.testimonial, fields: testimonialFields },
            { name: 'weServe', type: 'group', defaultValue: homepageContent.weServe, fields: weServeFields },
          ],
        },
        {
          label: 'About + Pricing',
          fields: [
            { name: 'aboutPreview', type: 'group', defaultValue: homepageContent.aboutPreview, fields: aboutPreviewFields },
            { name: 'pricing', type: 'group', defaultValue: homepageContent.pricing, fields: pricingFields },
          ],
        },
        {
          label: 'Blog + Final CTA',
          fields: [
            { name: 'blogPreview', type: 'group', defaultValue: homepageContent.blogPreview, fields: blogPreviewFields },
            { name: 'finalCta', type: 'group', defaultValue: homepageContent.finalCta, fields: finalCtaFields },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'json',
      admin: { hidden: true },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: pageBuilderBlocks,
      required: false,
      admin: {
        description:
          'Unified page-builder blocks — same palette as the Pages collection. When populated, the homepage can optionally render these instead of the structured v2 sections.',
      },
    },
  ],
};
