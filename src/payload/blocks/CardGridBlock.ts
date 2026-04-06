import type { Block } from 'payload';

export const CardGridBlock: Block = {
  slug: 'card-grid-block',
  interfaceName: 'CardGridBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imageAlt', type: 'text' },
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaHref', type: 'text' },
      ],
    },
  ],
};
