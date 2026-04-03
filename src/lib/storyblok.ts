import { apiPlugin, storyblokInit, type ISbStoryData, type StoryblokClient } from '@storyblok/react/rsc';

const STORYBLOK_HOME_SLUG = process.env.STORYBLOK_HOME_SLUG?.trim() || 'home';
const STORYBLOK_PREVIEW_TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN?.trim();

const getStoryblokApi: (() => StoryblokClient) | null = STORYBLOK_PREVIEW_TOKEN
  ? storyblokInit({
      accessToken: STORYBLOK_PREVIEW_TOKEN,
      use: [apiPlugin],
      apiOptions: {
        region: 'us',
      },
    })
  : null;

export type StoryblokPageSEO = {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonicalURL?: string;
  keywords?: string;
};

function normalizeStoryblokSlug(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, '');
  return trimmed || STORYBLOK_HOME_SLUG;
}

export function pathnameToStoryblokSlug(pathname: string): string {
  return normalizeStoryblokSlug(pathname);
}

export function storyblokSlugToPathname(slug: string): string {
  const normalized = normalizeStoryblokSlug(slug);
  if (normalized === STORYBLOK_HOME_SLUG) {
    return '/';
  }

  return `/${normalized}`;
}

export async function getStoryblokPage(pathname: string, draft = false): Promise<ISbStoryData | null> {
  if (!STORYBLOK_PREVIEW_TOKEN || !getStoryblokApi) {
    return null;
  }

  const slug = pathnameToStoryblokSlug(pathname);

  try {
    const client = getStoryblokApi();
    const { data } = await client.get(`cdn/stories/${slug}`, {
      version: draft ? 'draft' : 'published',
      resolve_relations: 'faq.items,stats.items,testimonials.items',
    });

    return data?.story ?? null;
  } catch {
    return null;
  }
}

export async function getStoryblokPageMeta(pathname: string, draft = false): Promise<StoryblokPageSEO | undefined> {
  const story = await getStoryblokPage(pathname, draft);
  return extractStoryblokSeo(story);
}

export function extractStoryblokSeo(story: ISbStoryData | null | undefined): StoryblokPageSEO | undefined {
  const content = story?.content as
    | {
        seo_title?: unknown;
        seo_description?: unknown;
        seo_image?: { filename?: unknown } | null;
        noindex?: unknown;
        canonicalURL?: unknown;
        keywords?: unknown;
      }
    | undefined;

  if (!content) {
    return undefined;
  }

  const seo: StoryblokPageSEO = {
    title: typeof content.seo_title === 'string' ? content.seo_title : undefined,
    description: typeof content.seo_description === 'string' ? content.seo_description : undefined,
    image:
      content.seo_image && typeof content.seo_image === 'object' && typeof content.seo_image.filename === 'string'
        ? content.seo_image.filename
        : undefined,
    noindex: content.noindex === true,
    canonicalURL: typeof content.canonicalURL === 'string' ? content.canonicalURL : undefined,
    keywords: typeof content.keywords === 'string' ? content.keywords : undefined,
  };

  return seo;
}
