import type { Block } from 'payload';

export const TestimonialsBlock: Block = {
  slug: 'testimonials-block',
  interfaceName: 'TestimonialsBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
  ],
};
