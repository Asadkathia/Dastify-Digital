import type { Block } from 'payload';

export const PricingBlock: Block = {
  slug: 'pricing-block',
  interfaceName: 'PricingBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        { name: 'period', type: 'text' },
        { name: 'description', type: 'text' },
        {
          name: 'features',
          type: 'textarea',
          admin: { description: 'One feature per line' },
        },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaHref', type: 'text' },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
};
