import type { Block } from 'payload';

export const TableBlock: Block = {
  slug: 'table-block',
  interfaceName: 'TableBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'caption', type: 'text' },
    {
      name: 'headers',
      type: 'array',
      admin: { description: 'Column headers' },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [{ name: 'value', type: 'text' }],
        },
      ],
    },
    { name: 'striped', type: 'checkbox', defaultValue: true },
    { name: 'bordered', type: 'checkbox', defaultValue: false },
    { name: 'responsive', type: 'checkbox', defaultValue: true },
  ],
};
