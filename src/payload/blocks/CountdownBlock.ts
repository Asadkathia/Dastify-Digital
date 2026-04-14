import type { Block } from 'payload';

export const CountdownBlock: Block = {
  slug: 'countdown-block',
  interfaceName: 'CountdownBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'targetDate', type: 'date', required: true },
    { name: 'expiredMessage', type: 'text', admin: { description: 'Text shown after the deadline passes' } },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'boxes',
      options: [
        { label: 'Boxes', value: 'boxes' },
        { label: 'Inline', value: 'inline' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    { name: 'accentColor', type: 'text' },
    { name: 'showLabels', type: 'checkbox', defaultValue: true },
  ],
};
