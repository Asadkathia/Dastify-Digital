import type { Block } from 'payload';

export const CustomHtmlBlock: Block = {
  slug: 'custom-html-block',
  interfaceName: 'CustomHtmlBlock',
  fields: [
    { name: 'label', type: 'text', admin: { description: 'Internal label for this block' } },
    { name: 'html', type: 'textarea', required: true, admin: { description: 'Raw HTML or embed code (iframe, script, etc.)' } },
  ],
};
