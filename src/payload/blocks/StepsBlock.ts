import type { Block } from 'payload';

export const StepsBlock: Block = {
  slug: 'steps-block',
  interfaceName: 'StepsBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Numbered cards', value: 'cards' },
      ],
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: { description: 'Color for step numbers / connectors' },
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon (optional, overrides step number)' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
};
