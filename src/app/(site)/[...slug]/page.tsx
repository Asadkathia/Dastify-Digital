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
import { asPathnameFromSegments } from '@/lib/cms/slug';
import { extractSeoMeta, findOneBySlug, isDraftEnabled, getNavigation } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';
import { SiteNavbar } from '@/components/SiteNavbar';
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
  const docRecord = doc as unknown as Record<string, unknown>;
  const convertedPageName =
    typeof docRecord.convertedPageName === 'string'
      ? String(docRecord.convertedPageName)
      : '';
  const convertedContent =
    docRecord.convertedContent &&
    typeof docRecord.convertedContent === 'object'
      ? (docRecord.convertedContent as Record<string, unknown>)
      : null;
  const blocks = mapPayloadBlocksToPageBuilderBlocks(doc.blocks);
  const [convertedRegistry, nav] = await Promise.all([
    convertedPageName ? loadConvertedPageRegistry(convertedPageName) : Promise.resolve(null),
    convertedPageName ? getNavigation() : Promise.resolve(null),
  ]);
  const fallbackConvertedContent =
    convertedPageName && !convertedContent
      ? await loadConvertedPageContent(convertedPageName)
      : null;
  const effectiveConvertedContent =
    fallbackConvertedContent && convertedContent
      ? mergeConvertedContent(fallbackConvertedContent, convertedContent)
      : (convertedContent ?? fallbackConvertedContent);
  const footerSection = convertedRegistry?.sections.find((section) => section.key === 'footer');
  const contentSections = convertedRegistry?.sections.filter((section) => section.key !== 'nav' && section.key !== 'footer') ?? [];
  const FooterComponent = footerSection?.Component as ComponentType<{ data: unknown }> | undefined;

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
              ctaClassName={
                convertedPageName === 'services-convert'
                  ? 'svc-convert-btn-nav'
                  : 'about-btn-nav'
              }
            />
          ) : null}
          <main>
            {contentSections.map((section) => {
              const Component = section.Component as ComponentType<{ data: unknown }>;
                return <Component key={section.key} data={effectiveConvertedContent[section.key]} />;
              })}
          </main>
          {FooterComponent ? <FooterComponent data={effectiveConvertedContent.footer} /> : null}
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
