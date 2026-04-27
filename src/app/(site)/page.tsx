import type { ComponentType } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { draftMode } from 'next/headers';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { LivePreviewSync } from '../components/home/LivePreviewSync';
import { ScrollRevealController } from '../components/home/ScrollRevealController';
import { getNavigation, getFooter } from '@/lib/cms/queries';
import { JsonLd } from '@/components/JsonLd';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';
import { getPayloadClient } from '@/lib/payload';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import type { PageBuilderBlock } from '@/components/blocks/types';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { extractSectionOverrides, generateOverrideCss } from '@/lib/converted-pages/section-overrides';
import type { HomepageContent } from '@/lib/homepage-content';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const [payload, settings] = await Promise.all([getPayloadClient(), getSiteSettings()]);

  try {
    const homepage = (await payload.findGlobal({ slug: 'homepage', depth: 1 })) as {
      meta?: {
        title?: string;
        description?: string;
        canonicalURL?: string;
        keywords?: string;
        noindex?: boolean;
        image?: { url?: string };
      };
    };

    return buildMetadata({
      pathname: '/',
      settings,
      seo: {
        title: homepage.meta?.title,
        description: homepage.meta?.description,
        canonicalURL: homepage.meta?.canonicalURL,
        keywords: homepage.meta?.keywords,
        noindex: homepage.meta?.noindex,
        image: homepage.meta?.image?.url,
      },
      fallbackTitle: settings.siteName,
      fallbackDescription: settings.siteDescription,
    });
  } catch {
    return buildMetadata({
      pathname: '/',
      settings,
      fallbackTitle: settings.siteName,
      fallbackDescription: settings.siteDescription,
    });
  }
}

export const dynamic = 'force-dynamic';

async function findHomePageRecord(draft: boolean): Promise<Record<string, unknown> | null> {
  try {
    const client = await getPayloadClient();
    const res = await client.find({
      collection: 'pages',
      where: { convertedPageName: { equals: 'home' } } as never,
      depth: 2,
      limit: 1,
      draft,
    });
    const doc = res.docs?.[0];
    return doc ? (doc as unknown as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const { isEnabled } = await draftMode();
  noStore();

  const [settings, nav, footer, rawHomepage, homePageRecord] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
    (async () => {
      try {
        const client = await getPayloadClient();
        return await client.findGlobal({ slug: 'homepage', draft: isEnabled, depth: 1 });
      } catch {
        return null;
      }
    })(),
    findHomePageRecord(isEnabled),
  ]);

  const organizationJsonLd = buildOrganizationJsonLd(settings);
  const websiteJsonLd = buildWebsiteJsonLd(settings);

  const convertedPageName = typeof homePageRecord?.convertedPageName === 'string'
    ? homePageRecord.convertedPageName
    : '';
  const convertedContent = homePageRecord && typeof homePageRecord.convertedContent === 'object'
    ? (homePageRecord.convertedContent as Record<string, unknown>)
    : null;

  // v2: the public homepage is driven exclusively by the converted-page
  // registry. Empty convertedContent → defaults from src/app/(site)/home/content.ts.
  const registry = await loadConvertedPageRegistry('home');
  if (registry && (convertedPageName === 'home' || convertedPageName === '')) {
    const effective = convertedContent
      ? mergeConvertedContent(registry.defaultContent, convertedContent)
      : registry.defaultContent;
    const sectionOverrideCss = generateOverrideCss(registry, extractSectionOverrides(effective));
    const effectiveTyped = effective as unknown as HomepageContent;

    return (
      <>
        {sectionOverrideCss ? <style dangerouslySetInnerHTML={{ __html: sectionOverrideCss }} /> : null}
        <LivePreviewSync enabled={isEnabled} />
        <ScrollRevealController />
        <SiteNavbar nav={nav} activePath="/" scrolledClass="solid" linkListClassName="nav-links" ctaClassName="btn-dk nav-cta" />
        <main>
          {registry.sections.map((section) => {
            const Component = section.Component as ComponentType<{ data: unknown }>;
            // Hero needs the top-level heroVariant flag merged into its data
            // so the same content block can render A / B / C layouts.
            const raw = (effectiveTyped as unknown as Record<string, unknown>)[section.key];
            const data = section.key === 'hero'
              ? { ...(raw as object), heroVariant: effectiveTyped.heroVariant ?? 'A' }
              : raw;
            return <Component key={section.key} data={data} />;
          })}
        </main>
        <SiteFooter footer={footer} />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </>
    );
  }

  // Blocks[] fallback — only reached if the registry fails to load.
  const homepageBlocks = rawHomepage && Array.isArray((rawHomepage as { blocks?: unknown[] }).blocks)
    ? ((rawHomepage as { blocks?: unknown[] }).blocks as PageBuilderBlock[])
    : [];

  return (
    <>
      <LivePreviewSync enabled={isEnabled} />
      <ScrollRevealController />
      <SiteNavbar nav={nav} activePath="/" scrolledClass="solid" linkListClassName="nav-links" ctaClassName="btn-dk nav-cta" />
      {homepageBlocks.length > 0 ? <PageBlocksRenderer blocks={homepageBlocks} /> : null}
      <SiteFooter footer={footer} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
    </>
  );
}
