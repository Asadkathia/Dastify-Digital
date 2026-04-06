import type { Block } from 'payload';

export const AlertBlock: Block = {
  slug: 'alert-block',
  interfaceName: 'AlertBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    { name: 'dismissible', type: 'checkbox', defaultValue: false },
  ],
};
