import type { Block } from 'payload';

export const TeamGridBlock: Block = {
  slug: 'team-grid-block',
  interfaceName: 'TeamGridBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Card (bordered)', value: 'card' },
      ],
    },
    {
      name: 'members',
      type: 'array',
      required: true,
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'linkedinUrl', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
  ],
};
