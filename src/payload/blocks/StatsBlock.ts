import type { Block } from 'payload';

export const StatsBlock: Block = {
  slug: 'stats-block',
  interfaceName: 'StatsBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
};
