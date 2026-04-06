import type { Block } from 'payload';

export const ThreeColBlock: Block = {
  slug: 'three-col-block',
  interfaceName: 'ThreeColBlock',
  fields: [
    { name: 'col1Title', type: 'text' },
    { name: 'col1Text', type: 'textarea' },
    { name: 'col2Title', type: 'text' },
    { name: 'col2Text', type: 'textarea' },
    { name: 'col3Title', type: 'text' },
    { name: 'col3Text', type: 'textarea' },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small (16px)', value: 'small' },
        { label: 'Medium (32px)', value: 'medium' },
        { label: 'Large (64px)', value: 'large' },
      ],
    },
  ],
};
