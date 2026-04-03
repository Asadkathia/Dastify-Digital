import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload';
import { canonicalFromPath, getSiteURL } from '../../lib/cms/urls.ts';

async function triggerRevalidate(paths: string[], tags: string[]) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return;
  }

  const endpoint = `${getSiteURL()}/api/revalidate`;

  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-revalidate-secret': secret,
    },
    body: JSON.stringify({
      paths,
      tags,
      source: 'payload-hook',
      url: canonicalFromPath('/api/revalidate'),
    }),
  }).catch(() => undefined);
}

export const revalidateCollectionChange = (extraPaths: string[] = [], tags: string[] = []): CollectionAfterChangeHook => {
  return async ({ doc, collection }) => {
    const slug = typeof doc?.slug === 'string' ? doc.slug : null;
    const paths = ['/', ...extraPaths];

    if (slug) {
      paths.push(`/${collection.slug}/${slug}`);
    }

    await triggerRevalidate(paths, [collection.slug, ...tags]);
    return doc;
  };
};

export const revalidateCollectionDelete = (extraPaths: string[] = [], tags: string[] = []): CollectionAfterDeleteHook => {
  return async ({ collection }) => {
    await triggerRevalidate(['/', ...extraPaths], [collection.slug, ...tags]);
  };
};

export const revalidateGlobalChange = (globalSlug: string, paths: string[] = ['/']): GlobalAfterChangeHook => {
  return async ({ doc }) => {
    await triggerRevalidate(paths, [globalSlug]);
    return doc;
  };
};
