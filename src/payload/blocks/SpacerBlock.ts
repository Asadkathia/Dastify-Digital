import type { Block } from 'payload';

export const SpacerBlock: Block = {
  slug: 'spacer-block',
  interfaceName: 'SpacerBlock',
  fields: [
    {
      name: 'height',
      type: 'number',
      defaultValue: 60,
      min: 8,
      max: 400,
      required: true,
      admin: { description: 'Height in pixels' },
    },
    { name: 'showDivider', type: 'checkbox', defaultValue: false, admin: { description: 'Show a horizontal line' } },
  ],
};
