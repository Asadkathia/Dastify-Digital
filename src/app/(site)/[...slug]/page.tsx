import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { loadConvertedPageContent } from '@/lib/converted-pages/content-map';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';
import { asPathnameFromSegments } from '@/lib/cms/slug';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';
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
  const convertedRegistry =
    convertedPageName
      ? await loadConvertedPageRegistry(convertedPageName)
      : null;
  const fallbackConvertedContent =
    convertedPageName && !convertedContent
      ? await loadConvertedPageContent(convertedPageName)
      : null;
  const effectiveConvertedContent =
    fallbackConvertedContent && convertedContent
      ? mergeConvertedContent(fallbackConvertedContent, convertedContent)
      : (convertedContent ?? fallbackConvertedContent);
  const navSection = convertedRegistry?.sections.find((section) => section.key === 'nav');
  const footerSection = convertedRegistry?.sections.find((section) => section.key === 'footer');
  const contentSections = convertedRegistry?.sections.filter((section) => section.key !== 'nav' && section.key !== 'footer') ?? [];
  const NavComponent = navSection?.Component as ComponentType<{ data: unknown }> | undefined;
  const FooterComponent = footerSection?.Component as ComponentType<{ data: unknown }> | undefined;

  return (
    <>
      {convertedRegistry && effectiveConvertedContent ? (
        <>
          <NavbarScrollState selector=".nav" solidClass="scrolled" offset={80} />
          <ScrollRevealController />
          {NavComponent ? <NavComponent data={effectiveConvertedContent.nav} /> : null}
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
