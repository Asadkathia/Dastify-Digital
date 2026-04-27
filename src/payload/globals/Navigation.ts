import type { GlobalConfig } from 'payload';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
    afterChange: [
      revalidateGlobalChange('navigation', [
        '/',
        '/about',
        '/services',
        '/services-convert',
        '/work',
        '/insights',
        '/contact',
        '/blog',
        '/blog-1',
        '/blog-post',
        '/case-studies',
        '/book-session',
      ]),
    ],
  },
  fields: [
    {
      name: 'logoImage',
      type: 'upload',
      label: 'Logo Image',
      relationTo: 'media',
      admin: { description: 'Upload a logo image. If set, replaces the text logo in the navbar.' },
    },
    {
      name: 'logoText',
      type: 'text',
      label: 'Logo Text',
      required: true,
      defaultValue: 'Dastify',
      admin: { description: 'The main logo word (e.g. "Dastify") — shown when no logo image is set.' },
    },
    {
      name: 'logoAccent',
      type: 'text',
      label: 'Logo Accent',
      required: true,
      defaultValue: '.Digital',
      admin: { description: 'The accented part of the logo (e.g. ".Digital")' },
    },
    {
      name: 'logoHref',
      type: 'text',
      label: 'Logo Link',
      defaultValue: '/',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Nav Links',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Work', href: '/work' },
        { label: 'Insights', href: '/insights' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      defaultValue: 'Book a Call',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA Button Link',
      defaultValue: '/contact',
    },
  ],
};
