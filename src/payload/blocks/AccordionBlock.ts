import type { Block } from 'payload';

export const AccordionBlock: Block = {
  slug: 'accordion-block',
  interfaceName: 'AccordionBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
  ],
};
