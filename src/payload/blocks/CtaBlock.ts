import type { Block } from 'payload';

export const CtaBlock: Block = {
  slug: 'cta-block',
  interfaceName: 'CtaBlock',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true },
    { name: 'buttonHref', type: 'text', required: true },
  ],
};
