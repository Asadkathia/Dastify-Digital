import type { Block } from 'payload';

export const DividerBlock: Block = {
  slug: 'divider-block',
  interfaceName: 'DividerBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'line',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Wave', value: 'wave' },
        { label: 'Invisible (spacer)', value: 'none' },
      ],
    },
    { name: 'color', type: 'text', admin: { description: 'Line color, e.g. #e2e8f0' } },
    { name: 'thickness', type: 'number', defaultValue: 1 },
    { name: 'spacing', type: 'number', defaultValue: 32, admin: { description: 'Vertical padding (px) around the divider' } },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full', value: 'full' },
        { label: '75%', value: '75' },
        { label: '50%', value: '50' },
        { label: '25%', value: '25' },
      ],
    },
  ],
};
