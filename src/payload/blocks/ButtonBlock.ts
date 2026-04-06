import type { Block } from 'payload';

export const ButtonBlock: Block = {
  slug: 'button-block',
  interfaceName: 'ButtonBlock',
  fields: [
    { name: 'label', type: 'text', required: true, defaultValue: 'Click Here' },
    { name: 'href', type: 'text', required: true, defaultValue: '#' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    { name: 'color', type: 'text', admin: { description: 'CSS color e.g. #0ea5e9' } },
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
    { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
  ],
};
