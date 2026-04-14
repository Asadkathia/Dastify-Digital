import type { Block } from 'payload';

export const FormBlock: Block = {
  slug: 'form-block',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left aligned', value: 'left' },
        { label: 'Card (boxed)', value: 'card' },
      ],
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Brand', value: 'brand' },
      ],
    },
  ],
};
