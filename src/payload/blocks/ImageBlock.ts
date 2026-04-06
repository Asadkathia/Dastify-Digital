import type { Block } from 'payload';

export const ImageBlock: Block = {
  slug: 'image-block',
  interfaceName: 'ImageBlock',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'caption', type: 'text' },
    { name: 'href', type: 'text' },
    { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
    { name: 'borderRadius', type: 'number', defaultValue: 0, min: 0, max: 100 },
    {
      name: 'objectPosition',
      type: 'select',
      defaultValue: 'center',
      options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'].map((v) => ({ label: v, value: v })),
    },
    { name: 'maxWidth', type: 'number', min: 0 },
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
