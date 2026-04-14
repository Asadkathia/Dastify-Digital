import type { Block } from 'payload';

export const FeatureListBlock: Block = {
  slug: 'feature-list-block',
  interfaceName: 'FeatureListBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: '2 columns', value: '2col' },
      ],
    },
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
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon character' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'iconColor', type: 'text' },
      ],
    },
  ],
};
