import { draftMode } from 'next/headers';
import { BLOG_PAGE_SIZE } from './constants';
import { getPayloadClient } from '@/lib/payload';
import type { Config } from '@/payload-types';

type CMSCollection = keyof Config['collections'];

export type CMSDoc = Record<string, unknown> & {
  id?: number | string;
  title?: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  _status?: 'draft' | 'published';
  meta?: {
    title?: string;
    description?: string;
    image?: { url?: string } | number | string | null;
    canonicalURL?: string;
    noindex?: boolean;
    keywords?: string;
  };
};

export async function isDraftEnabled(): Promise<boolean> {
  const { isEnabled } = await draftMode();
  return isEnabled;
}

export async function findOneBySlug(collection: CMSCollection, slug: string, draft = false): Promise<CMSDoc | null> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection,
      depth: 2,
      draft,
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    return (res.docs?.[0] as unknown as CMSDoc | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function findManyPublished(collection: CMSCollection, limit = 100): Promise<CMSDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection,
      depth: 1,
      draft: false,
      limit,
      where: {
        _status: {
          equals: 'published',
        },
      },
    });

    return (res.docs as unknown as CMSDoc[]) || [];
  } catch {
    return [];
  }
}

export async function findBlogPage(pageNumber: number, draft = false): Promise<{ docs: CMSDoc[]; totalPages: number }> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      depth: 2,
      draft,
      page: pageNumber,
      limit: BLOG_PAGE_SIZE,
      sort: '-publishedAt',
    });

    return {
      docs: (res.docs as unknown as CMSDoc[]) || [],
      totalPages: res.totalPages || 1,
    };
  } catch {
    return {
      docs: [],
      totalPages: 1,
    };
  }
}

export async function findByRelation(args: {
  collection: CMSCollection;
  relationField: string;
  value: string;
  draft?: boolean;
}): Promise<CMSDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: args.collection,
      depth: 2,
      draft: args.draft ?? false,
      limit: 50,
      sort: '-publishedAt',
      where: {
        [args.relationField]: {
          contains: args.value,
        },
      },
    });

    return (res.docs as unknown as CMSDoc[]) || [];
  } catch {
    return [];
  }
}

export async function findMenuByLocation(location: 'header' | 'footer'): Promise<CMSDoc | null> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'menus',
      depth: 2,
      draft: false,
      limit: 1,
      where: {
        location: {
          equals: location,
        },
      },
    });

    return (res.docs?.[0] as unknown as CMSDoc | undefined) ?? null;
  } catch {
    return null;
  }
}

export function extractSeoMeta(doc: CMSDoc | null | undefined) {
  if (!doc || !doc.meta || typeof doc.meta !== 'object') {
    return undefined;
  }

  const imageValue = doc.meta.image;
  const image =
    imageValue && typeof imageValue === 'object' && 'url' in imageValue
      ? String((imageValue as { url?: string }).url || '')
      : typeof imageValue === 'string'
        ? imageValue
        : undefined;

  return {
    title: typeof doc.meta.title === 'string' ? doc.meta.title : undefined,
    description: typeof doc.meta.description === 'string' ? doc.meta.description : undefined,
    image,
    canonicalURL: typeof doc.meta.canonicalURL === 'string' ? doc.meta.canonicalURL : undefined,
    noindex: doc.meta.noindex === true,
    keywords: typeof doc.meta.keywords === 'string' ? doc.meta.keywords : undefined,
  };
}
