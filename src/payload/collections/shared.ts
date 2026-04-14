import type { Field, PayloadRequest } from 'payload';
import { isAdminOrEditor } from '../access.ts';

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    description: 'URL-safe identifier. Lowercase letters, numbers, and hyphens only. Example: about-us',
  },
  validate: (val: string | null | undefined) => {
    if (!val) return 'Slug is required';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) {
      return 'Slug must be lowercase letters, numbers, and hyphens only (e.g. about-us)';
    }
    return true;
  },
};

export const excerptField: Field = {
  name: 'excerpt',
  type: 'textarea',
};

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
  },
};

export const collectionAccess = {
  read: () => true,
  create: ({ req }: { req: PayloadRequest }) => isAdminOrEditor(req),
  update: ({ req }: { req: PayloadRequest }) => isAdminOrEditor(req),
  delete: ({ req }: { req: PayloadRequest }) => isAdminOrEditor(req),
};

export const withDrafts = {
  max: 50,
  drafts: {
    autosave: {
      interval: 1200,
      showSaveDraftButton: true,
    },
    validate: false,
    schedulePublish: true,
  },
};

export function getPreviewURL(prefix: string, slug: unknown): string {
  const cleanSlug = typeof slug === 'string' && slug.length > 0 ? slug : '';
  const base = `/${String(prefix || '').replace(/^\/+|\/+$/g, '')}`;
  const path = cleanSlug
    ? `${base}/${cleanSlug}`.replace(/\/+/g, '/')
    : base || '/';
  const secret = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET;
  const params = new URLSearchParams({
    slug: path.startsWith('/') ? path : `/${path}`,
  });
  if (secret) {
    params.set('secret', secret);
  }
  return `/api/preview?${params.toString()}`;
}
