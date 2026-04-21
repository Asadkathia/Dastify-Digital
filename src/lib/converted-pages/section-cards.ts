import 'server-only';
import { getPayloadClient } from '@/lib/payload';
import type { CollectionSectionType, SectionCard } from './section-types';

// Re-export SectionCard so existing server-side callers that `import { SectionCard }
// from '@/lib/converted-pages/section-cards'` continue to work. Renderers that
// might end up in the client bundle should `import type { SectionCard } from
// '@/lib/converted-pages/section-types'` instead (types-only, always safe).
export type { SectionCard } from './section-types';

export type FetchCardsOptions = {
  type: CollectionSectionType;
  limit?: number;
  /** Collection-specific filter. For blog-posts: slug of a blog-category or tag. For case-studies: filterTag. For services: n/a. */
  filter?: string;
  filterKind?: 'category' | 'tag' | 'featured';
};

function formatDate(iso: string | undefined | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function extractImage(doc: Record<string, unknown>, preferredKey: string): { url?: string; alt: string } {
  const raw = doc[preferredKey] ?? doc.featuredImage ?? doc.heroImage;
  if (!raw || typeof raw !== 'object') {
    return { alt: typeof doc.title === 'string' ? doc.title : '' };
  }
  const obj = raw as Record<string, unknown>;
  return {
    url: typeof obj.url === 'string' ? obj.url : undefined,
    alt: typeof obj.alt === 'string' ? obj.alt : typeof doc.title === 'string' ? doc.title : '',
  };
}

/**
 * Maps a collection document into the generic card shape. Each collection type
 * has a slightly different set of metadata fields; this function picks the most
 * appropriate values for the card's `category` and `date` slots.
 */
export function mapDocToCard(doc: Record<string, unknown>, type: CollectionSectionType): SectionCard {
  const title = typeof doc.title === 'string' ? doc.title : 'Untitled';
  const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : '';
  const slug = typeof doc.slug === 'string' ? doc.slug : '';

  let href = '';
  let category = '';
  let date = '';
  let image;

  if (type === 'blog-posts') {
    href = `/blog/${slug}`;
    const cats = Array.isArray(doc.categories) ? doc.categories : [];
    const firstCat = cats.find((c): c is Record<string, unknown> => typeof c === 'object' && c !== null);
    category = firstCat && typeof firstCat.title === 'string' ? firstCat.title : '';
    date = formatDate(typeof doc.publishedAt === 'string' ? doc.publishedAt : null);
    image = extractImage(doc, 'featuredImage');
  } else if (type === 'services') {
    href = `/services/${slug}`;
    category = typeof doc.tagline === 'string' ? doc.tagline : '';
    date = '';
    image = extractImage(doc, 'heroImage');
  } else {
    // case-studies
    href = `/case-studies/${slug}`;
    category = typeof doc.client === 'string' ? doc.client : '';
    date = '';
    image = extractImage(doc, 'featuredImage');
  }

  return {
    href,
    title,
    excerpt,
    category,
    date,
    image: image.url,
    imageAlt: image.alt,
    linkLabel: type === 'blog-posts' ? 'Read Article →' : type === 'services' ? 'Learn more →' : 'View case study →',
    editable: false,
    staticIndex: -1,
  };
}

/**
 * Fetches cards from a collection. Server-side only — uses the Payload local
 * API for low-latency, auth-bypassing reads during SSR.
 *
 * Gracefully returns [] on error (logs to console.error) so a failing DB doesn't
 * take down the whole page — it renders an empty-state card instead.
 */
export async function fetchCardsFromCollection(opts: FetchCardsOptions): Promise<SectionCard[]> {
  try {
    const payload = await getPayloadClient();
    const where: Record<string, unknown> = { _status: { equals: 'published' } };

    if (opts.type === 'blog-posts' && opts.filter) {
      if (opts.filterKind === 'tag') {
        where['tags.slug'] = { equals: opts.filter };
      } else {
        where['categories.slug'] = { equals: opts.filter };
      }
    }
    if (opts.type === 'case-studies' && opts.filter) {
      if (opts.filterKind === 'featured') {
        where['featured'] = { equals: true };
      } else {
        where['filterTag'] = { equals: opts.filter };
      }
    }

    const sort =
      opts.type === 'services'
        ? 'displayOrder'
        : opts.type === 'blog-posts'
          ? '-publishedAt'
          : '-updatedAt';

    const res = await payload.find({
      collection: opts.type,
      depth: 1,
      limit: opts.limit ?? 6,
      sort,
      where: where as never,
    });

    return (res.docs ?? []).map((doc) => mapDocToCard(doc as unknown as Record<string, unknown>, opts.type));
  } catch (err) {
    console.error(`[section-cards] failed to fetch ${opts.type}:`, err);
    return [];
  }
}
