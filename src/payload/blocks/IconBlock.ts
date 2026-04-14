import type { Block } from 'payload';

export const IconBlock: Block = {
  slug: 'icon-block',
  interfaceName: 'IconBlock',
  fields: [
    { name: 'icon', type: 'text', required: true, admin: { description: 'Emoji, Unicode character, or SVG string' } },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small (24px)', value: 'sm' },
        { label: 'Medium (48px)', value: 'md' },
        { label: 'Large (72px)', value: 'lg' },
        { label: 'XL (96px)', value: 'xl' },
      ],
    },
    { name: 'color', type: 'text' },
    { name: 'label', type: 'text', admin: { description: 'Optional label below the icon' } },
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
  ],
};
