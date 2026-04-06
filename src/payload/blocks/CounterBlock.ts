import type { Block } from 'payload';

export const CounterBlock: Block = {
  slug: 'counter-block',
  interfaceName: 'CounterBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'duration', type: 'number', defaultValue: 2000, min: 500, max: 10000, admin: { description: 'Animation duration in milliseconds' } },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'prefix', type: 'text' },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
};
