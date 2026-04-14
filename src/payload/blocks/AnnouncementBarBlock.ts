import type { Block } from 'payload';

export const AnnouncementBarBlock: Block = {
  slug: 'announcement-bar-block',
  interfaceName: 'AnnouncementBarBlock',
  fields: [
    { name: 'message', type: 'text', required: true },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaHref', type: 'text' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'brand',
      options: [
        { label: 'Brand', value: 'brand' },
        { label: 'Dark', value: 'dark' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
        { label: 'Info', value: 'info' },
      ],
    },
    { name: 'dismissible', type: 'checkbox', defaultValue: true },
    { name: 'icon', type: 'text', admin: { description: 'Leading emoji/icon (optional)' } },
  ],
};
