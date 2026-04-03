import type { Block } from 'payload';

export const RichTextBlock: Block = {
  slug: 'rich-text-block',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
};
