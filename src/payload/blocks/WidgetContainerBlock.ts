import type { Block } from 'payload';

// Permissive schema so the editor's widget-container payload round-trips
// through Payload save without rejection. Public rendering is a follow-up.
export const WidgetContainerBlock: Block = {
  slug: 'widget-container',
  interfaceName: 'WidgetContainerBlock',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'layout', type: 'text' },
    { name: 'widgets', type: 'json' },
  ],
};
