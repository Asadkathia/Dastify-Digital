import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload';
import { canonicalFromPath, getSiteURL } from '../../lib/cms/urls.ts';

async function triggerRevalidate(paths: string[], tags: string[]) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn('[revalidate] REVALIDATE_SECRET is not set; skipping cache revalidation. Live site may show stale content.');
    return;
  }

  const endpoint = `${getSiteURL()}/api/revalidate`;

  try {
    const res = await fetch(endpoint, {
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
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[revalidate] endpoint returned ${res.status}: ${body.slice(0, 200)}`, { paths, tags });
    }
  } catch (err) {
    console.error('[revalidate] request failed:', err, { paths, tags });
  }
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
