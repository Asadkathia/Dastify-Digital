import type { Block } from 'payload';

export const HeadingBlock: Block = {
  slug: 'heading-block',
  interfaceName: 'HeadingBlock',
  fields: [
    { name: 'text', type: 'text', required: true },
    {
      name: 'tag',
      type: 'select',
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((v) => ({ label: v.toUpperCase(), value: v })),
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'lg',
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    { name: 'color', type: 'text' },
  ],
};
