import type { Block } from 'payload';

export const MapBlock: Block = {
  slug: 'map-block',
  interfaceName: 'MapBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'embedUrl', type: 'text', admin: { description: 'Google Maps embed URL (from Share > Embed a map)' } },
    { name: 'height', type: 'number', defaultValue: 400, admin: { description: 'Map height in px' } },
    { name: 'borderRadius', type: 'number', defaultValue: 12 },
    { name: 'showAddressCard', type: 'checkbox', defaultValue: true },
    { name: 'phone', type: 'text' },
    { name: 'hours', type: 'text' },
  ],
};
