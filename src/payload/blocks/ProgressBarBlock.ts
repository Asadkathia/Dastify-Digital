import type { Block } from 'payload';

export const ProgressBarBlock: Block = {
  slug: 'progress-bar-block',
  interfaceName: 'ProgressBarBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true, min: 0, max: 100, admin: { description: 'Percentage 0–100' } },
        { name: 'color', type: 'text', admin: { description: 'Hex color e.g. #0ea5e9' } },
      ],
    },
  ],
};
