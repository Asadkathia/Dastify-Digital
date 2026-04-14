import type { Block } from 'payload';

export const TimelineBlock: Block = {
  slug: 'timeline-block',
  interfaceName: 'TimelineBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Alternating', value: 'alternating' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'date', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon character' } },
        { name: 'accentColor', type: 'text' },
      ],
    },
  ],
};
