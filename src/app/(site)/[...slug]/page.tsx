import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { JsonLd } from '@/components/JsonLd';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import '@/components/storyblok';
import { asPathnameFromSegments } from '@/lib/cms/slug';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';
import { extractStoryblokSeo, getStoryblokPage } from '@/lib/storyblok';
import type { ISbStoryData } from '@storyblok/react/rsc';
import type { Page } from '@/payload-types';

type Props = {
  params: Promise<{ slug: string[] }>;
};

function isStoryblokEnabled() {
  return process.env.ENABLE_STORYBLOK === 'true';
}

function storyFallbackTitle(story: ISbStoryData | null): string {
  const content = story?.content as { title?: unknown } | undefined;
  return typeof content?.title === 'string' && content.title.trim() ? content.title : 'Page';
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = asPathnameFromSegments(slug);
  const pageSlug = pathname.replace(/^\//, '');
  const draft = await isDraftEnabled();

  const [settings, story, doc] = await Promise.all([
    getSiteSettings(),
    isStoryblokEnabled() ? getStoryblokPage(pathname, draft) : Promise.resolve(null),
    findOneBySlug('pages', pageSlug, draft),
  ]);

  const storySeo = extractStoryblokSeo(story);

  if (storySeo) {
    return buildMetadata({
      pathname,
      settings,
      seo: storySeo,
      fallbackTitle: storyFallbackTitle(story),
      fallbackDescription: storySeo.description,
    });
  }

  if (!doc) {
    return buildMetadata({
      pathname,
      settings,
      fallbackTitle: 'Page Not Found',
    });
  }

  return buildMetadata({
    pathname,
    settings,
    seo: extractSeoMeta(doc),
    fallbackTitle: String(doc.title || 'Page'),
    fallbackDescription: String(doc.excerpt || ''),
  });
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  const pathname = asPathnameFromSegments(slug);
  const pageSlug = pathname.replace(/^\//, '');
  const draft = await isDraftEnabled();

  if (isStoryblokEnabled()) {
    const story = await getStoryblokPage(pathname, draft);

    if (story?.content) {
      const title = storyFallbackTitle(story);
      const seo = extractStoryblokSeo(story);
      const description = seo?.description || '';

      return (
        <>
          <StoryblokStory story={story} />
          <JsonLd
            data={
              buildBreadcrumbJsonLd([
                { name: 'Home', url: '/' },
                { name: title, url: pathname },
              ])
            }
          />
          <JsonLd data={buildWebPageJsonLd({ title, description, pathname })} />
        </>
      );
    }
  }

  const doc = (await findOneBySlug('pages', pageSlug, draft)) as Page | null;

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Page');
  const description = String(doc.excerpt || '');
  const blocks = mapPayloadBlocksToPageBuilderBlocks(doc.blocks);

  return (
    <>
      {blocks.length > 0 ? (
        <PageBlocksRenderer blocks={blocks} />
      ) : (
        <section className="sp">
          <div className="wrap">
            <h1>{title}</h1>
            {description ? <p style={{ marginTop: '16px' }}>{description}</p> : null}
          </div>
        </section>
      )}
      <JsonLd
        data={
          buildBreadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: title, url: pathname },
          ])
        }
      />
      <JsonLd data={buildWebPageJsonLd({ title, description, pathname })} />
    </>
  );
}
