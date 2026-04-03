import type { CollectionConfig } from 'payload';
import { collectionAccess } from './shared.ts';
import { revalidateCollectionChange, revalidateCollectionDelete } from '../hooks/revalidate.ts';

export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: {
    useAsTitle: 'title',
  },
  access: collectionAccess,
  versions: {
    drafts: false,
  },
  hooks: {
    afterChange: [revalidateCollectionChange(['/'], ['menus'])],
    afterDelete: [revalidateCollectionDelete(['/'], ['menus'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
};
