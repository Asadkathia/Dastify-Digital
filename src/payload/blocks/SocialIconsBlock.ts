import type { Block } from 'payload';

export const SocialIconsBlock: Block = {
  slug: 'social-icons-block',
  interfaceName: 'SocialIconsBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'platform', type: 'text', required: true, admin: { description: 'e.g. facebook, instagram, linkedin, twitter, youtube, tiktok, github' } },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};
