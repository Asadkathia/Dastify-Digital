import type { GlobalConfig, GlobalBeforeChangeHook } from 'payload';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';

// Payload's upsertRow for globals with nested arrays (columns > links) sometimes
// fails to DELETE child rows before re-INSERTing, causing UNIQUE id collisions
// on save. This hook truncates all footer child tables prior to update so
// Payload's subsequent INSERT pass always lands on empty tables.
const FOOTER_CHILD_TABLES = [
  'footer_columns_links',
  'footer_columns',
  'footer_cta_column_links',
  'footer_brand_socials',
  'footer_badges',
];

const purgeFooterChildren: GlobalBeforeChangeHook = async ({ req }) => {
  const adapter = req.payload.db as unknown as { drizzle?: { run: (q: unknown) => Promise<unknown> }; execute?: (q: unknown) => Promise<unknown> };
  try {
    for (const table of FOOTER_CHILD_TABLES) {
      if (adapter.drizzle && typeof adapter.drizzle.run === 'function') {
        const { sql } = await import('drizzle-orm');
        await adapter.drizzle.run(sql.raw(`DELETE FROM "${table}"`));
      } else if (typeof adapter.execute === 'function') {
        const { sql } = await import('drizzle-orm');
        await adapter.execute(sql.raw(`DELETE FROM "${table}"`));
      }
    }
  } catch (err) {
    req.payload.logger.warn({ err }, '[Footer] purgeFooterChildren failed (non-fatal)');
  }
};

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
    beforeChange: [purgeFooterChildren],
    afterChange: [
      revalidateGlobalChange('footer', [
        '/',
        '/about',
        '/services',
        '/services-convert',
        '/work',
        '/insights',
        '/contact',
        '/blog',
      ]),
    ],
  },
  fields: [
    // ── Brand ────────────────────────────────────────────────────────────────
    {
      name: 'brand',
      type: 'group',
      label: 'Brand',
      fields: [
        {
          name: 'logoImage',
          type: 'upload',
          label: 'Logo Image',
          relationTo: 'media',
          admin: { description: 'Upload a logo image. If set, replaces the text logo in the footer.' },
        },
        {
          name: 'namePrefix',
          type: 'text',
          label: 'Name Prefix',
          required: true,
          defaultValue: 'Dastify',
          admin: { description: 'Text before the dot accent — shown when no logo image is set.' },
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Accent Character',
          required: true,
          defaultValue: '.',
          admin: { description: 'The dot or accent character between name parts' },
        },
        {
          name: 'nameSuffix',
          type: 'text',
          label: 'Name Suffix',
          required: true,
          defaultValue: 'Digital',
          admin: { description: 'Text after the dot accent (e.g. "Digital")' },
        },
        {
          name: 'tagline',
          type: 'textarea',
          label: 'Tagline',
          defaultValue:
            'The creative authority for healthcare growth. HIPAA-compliant campaigns that fill your calendar.',
        },
        {
          name: 'socials',
          type: 'array',
          label: 'Social Links',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              required: true,
              options: [
                { label: 'X (Twitter)', value: 'x' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
              ],
            },
            {
              name: 'href',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },

    // ── Link Columns ─────────────────────────────────────────────────────────
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column Title',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            { name: 'label', type: 'text', label: 'Label', required: true },
            { name: 'href', type: 'text', label: 'URL', required: true },
            {
              name: 'highlight',
              type: 'checkbox',
              label: 'Highlight (purple)',
              defaultValue: false,
            },
          ],
        },
      ],
    },

    // ── CTA Column (optional) ─────────────────────────────────────────────────
    {
      name: 'ctaColumn',
      type: 'group',
      label: 'CTA Column (optional)',
      admin: { description: 'Optional 4th column with a button CTA. Leave title blank to hide.' },
      fields: [
        { name: 'title', type: 'text', label: 'Column Title' },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            { name: 'label', type: 'text', label: 'Label' },
            { name: 'href', type: 'text', label: 'URL' },
          ],
        },
        { name: 'buttonLabel', type: 'text', label: 'Button Label' },
        { name: 'buttonHref', type: 'text', label: 'Button URL' },
      ],
    },

    // ── Bottom Row ────────────────────────────────────────────────────────────
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: '© 2026 Dastify Digital. All rights reserved.',
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Compliance Badges',
      fields: [
        { name: 'label', type: 'text', label: 'Badge Label', required: true },
        {
          name: 'tone',
          type: 'select',
          label: 'Colour Tone',
          options: [
            { label: 'Purple (default)', value: 'purple' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
          ],
        },
      ],
    },
  ],
};
