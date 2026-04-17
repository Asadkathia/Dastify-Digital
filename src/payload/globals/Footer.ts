import type { GlobalConfig } from 'payload';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
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
