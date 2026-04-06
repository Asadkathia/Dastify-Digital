import type { Block } from 'payload';

export const LogoCarouselBlock: Block = {
  slug: 'logo-carousel-block',
  interfaceName: 'LogoCarouselBlock',
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Optional label above logos (e.g. "Trusted by")' } },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'imageAlt', type: 'text' },
        { name: 'href', type: 'text', admin: { description: 'Optional link URL' } },
      ],
    },
  ],
};
