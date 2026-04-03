import type { Block } from 'payload';

export const TextImageBlock: Block = {
  slug: 'text-image-block',
  interfaceName: 'TextImageBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'text', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Image Left', value: 'left' },
        { label: 'Image Right', value: 'right' },
      ],
      defaultValue: 'right',
    },
  ],
};
