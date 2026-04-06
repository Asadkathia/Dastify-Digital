import type { Block } from 'payload';

export const TwoColBlock: Block = {
  slug: 'two-col-block',
  interfaceName: 'TwoColBlock',
  fields: [
    { name: 'leftTitle', type: 'text' },
    { name: 'leftText', type: 'textarea' },
    { name: 'rightTitle', type: 'text' },
    { name: 'rightText', type: 'textarea' },
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
