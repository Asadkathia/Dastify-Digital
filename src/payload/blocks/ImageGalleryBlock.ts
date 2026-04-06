import type { Block } from 'payload';

export const ImageGalleryBlock: Block = {
  slug: 'image-gallery-block',
  interfaceName: 'ImageGalleryBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    { name: 'lightbox', type: 'checkbox', defaultValue: true },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'imageAlt', type: 'text' },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
};
