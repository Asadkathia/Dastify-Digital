import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access.ts';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: ({ req }) => isAdmin(req),
    update: ({ req }) => isAdmin(req),
    delete: ({ req }) => isAdmin(req),
    create: ({ req }) => {
      // Allow first user bootstrap flow before authentication exists.
      return !req.user || isAdmin(req);
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
};
