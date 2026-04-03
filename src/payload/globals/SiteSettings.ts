import type { GlobalConfig } from 'payload';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
    afterChange: [revalidateGlobalChange('site-settings', ['/'])],
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Dastify Digital' },
    { name: 'siteDescription', type: 'textarea', required: true },
    { name: 'organizationName', type: 'text', required: true, defaultValue: 'Dastify Digital' },
    { name: 'defaultCanonicalBase', type: 'text', required: true, defaultValue: 'http://localhost:3000' },
    {
      name: 'robotsPolicy',
      type: 'select',
      options: [
        { label: 'Index, Follow', value: 'index-follow' },
        { label: 'Noindex, Nofollow', value: 'noindex-nofollow' },
      ],
      defaultValue: 'index-follow',
      required: true,
    },
    { name: 'twitterHandle', type: 'text' },
    { name: 'googleAnalyticsId', type: 'text' },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'organizationLogo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
