import type { Block } from 'payload';

export const TabsBlock: Block = {
  slug: 'tabs-block',
  interfaceName: 'TabsBlock',
  fields: [
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
  ],
};
