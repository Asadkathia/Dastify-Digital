import type { CollectionConfig } from 'payload';
import { isAdminOrEditor } from '../access.ts';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdminOrEditor(req),
    update: ({ req }) => isAdminOrEditor(req),
    delete: ({ req }) => isAdminOrEditor(req),
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};
