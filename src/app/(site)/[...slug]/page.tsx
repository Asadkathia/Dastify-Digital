import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { loadConvertedPageContent } from '@/lib/converted-pages/content-map';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';
import { extractSectionOverrides, generateOverrideCss } from '@/lib/converted-pages/section-overrides';
import { fetchCardsFromCollection } from '@/lib/converted-pages/section-cards';
import { resolveSectionType } from '@/lib/converted-pages/section-types';
import type { SectionCard } from '@/lib/converted-pages/section-types';
import { asPathnameFromSegments } from '@/lib/cms/slug';
import { extractSeoMeta, findOneBySlug, isDraftEnabled, getNavigation, getFooter } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import type { Page } from '@/payload-types';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = asPathnameFromSegments(slug);
  const pageSlug = pathname.replace(/^\//, '');
  const draft = await isDraftEnabled();

  const [settings, doc] = await Promise.all([
    getSiteSettings(),
    findOneBySlug('pages', pageSlug, draft),
  ]);

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

  const doc = (await findOneBySlug('pages', pageSlug, draft)) as Page | null;

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Page');
  const description = String(doc.excerpt || '');
  const convertedPageName =
    typeof doc.convertedPageName === 'string' ? doc.convertedPageName : '';
  const convertedContent =
    doc.convertedContent && typeof doc.convertedContent === 'object'
      ? (doc.convertedContent as Record<string, unknown>)
      : null;
  const blocks = mapPayloadBlocksToPageBuilderBlocks(doc.blocks);
  const [convertedRegistry, nav, footer] = await Promise.all([
    convertedPageName ? loadConvertedPageRegistry(convertedPageName) : Promise.resolve(null),
    convertedPageName ? getNavigation() : Promise.resolve(null),
    convertedPageName ? getFooter() : Promise.resolve(null),
  ]);
  // Always load defaults when there's a converted page registered. Even if
  // convertedContent has saved data, partial saves from the admin can leave
  // some sections undefined — merging defaults underneath keeps the page
  // safe to render. Sections present in convertedContent override defaults.
  const fallbackConvertedContent = convertedPageName
    ? await loadConvertedPageContent(convertedPageName)
    : null;
  const effectiveConvertedContent =
    fallbackConvertedContent && convertedContent
      ? mergeConvertedContent(fallbackConvertedContent, convertedContent)
      : (convertedContent ?? fallbackConvertedContent);
  const contentSections = convertedRegistry?.sections.filter((section) => section.key !== 'nav' && section.key !== 'footer') ?? [];

  // For each section that has sectionType pointing at a collection, fetch the
  // cards server-side and stash them in a map keyed by section key. The
  // renderer below passes `cards={sectionCards[key]}` to each Component — any
  // component that supports collection-backed rendering (BlogGrid today,
  // Services + CaseStudiesGrid once migrated) reads this prop.
  const sectionCardsByKey: Record<string, SectionCard[] | undefined> = {};
  if (convertedRegistry && effectiveConvertedContent) {
    await Promise.all(
      contentSections.map(async (section) => {
        const data = effectiveConvertedContent[section.key];
        if (!data || typeof data !== 'object') return;
        const d = data as Record<string, unknown>;
        const sectionType = typeof d.sectionType === 'string' ? d.sectionType : undefined;
        const resolved = resolveSectionType(sectionType as Parameters<typeof resolveSectionType>[0], section.key);
        if (resolved === 'static') return;
        const source = typeof d.source === 'string' ? d.source : undefined;
        const filter = source === 'category'
          ? (typeof d.sourceCategory === 'string' ? d.sourceCategory : undefined)
          : source === 'tag'
            ? (typeof d.sourceTag === 'string' ? d.sourceTag : undefined)
            : undefined;
        const fetched = await fetchCardsFromCollection({
          type: resolved,
          limit: typeof d.sourceLimit === 'number' ? d.sourceLimit : undefined,
          filter,
          filterKind: source === 'category' ? 'category' : source === 'tag' ? 'tag' : undefined,
        });
        // Empty collection → fall back to static posts[] from content.ts
        // (brand book Rule 01 + Rule 03: preserve provided content, show placeholders).
        sectionCardsByKey[section.key] = fetched.length > 0 ? fetched : undefined;
      }),
    );
  }

  const sectionOverrideCss = convertedRegistry && effectiveConvertedContent
    ? generateOverrideCss(convertedRegistry, extractSectionOverrides(effectiveConvertedContent))
    : '';

  return (
    <>
      {sectionOverrideCss ? (
        <style dangerouslySetInnerHTML={{ __html: sectionOverrideCss }} />
      ) : null}
      {convertedRegistry && effectiveConvertedContent ? (
        <>
          <ScrollRevealController />
          {nav ? (
            <SiteNavbar
              nav={nav}
              activePath={pathname}
              navClassName={convertedPageName === 'about' ? 'about-nav' : undefined}
              linkListClassName={
                convertedPageName === 'about'
                  ? 'about-nav-links'
                  : convertedPageName === 'services-convert'
                    ? 'svc-convert-nav-links'
                    : convertedPageName === 'blog-post'
                      ? 'blog-post-nav-links'
                      : undefined
              }
              ctaClassName={undefined}
            />
          ) : null}
          <main>
            {contentSections.map((section) => {
              const Component = section.Component as ComponentType<{ data: unknown; cards?: SectionCard[] }>;
              return (
                <Component
                  key={section.key}
                  data={effectiveConvertedContent[section.key]}
                  cards={sectionCardsByKey[section.key]}
                />
              );
            })}
          </main>
          <SiteFooter footer={footer} />
        </>
      ) : blocks.length > 0 ? (
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
