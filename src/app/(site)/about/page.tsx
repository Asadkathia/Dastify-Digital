import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { findOneBySlug, getNavigation, getFooter, isDraftEnabled } from '@/lib/cms/queries';
import { getSiteSettings } from '@/lib/site-settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { resolveRenderSections } from '@/lib/converted-pages/editor-adapter';
import registry from './editor-registry';
import { defaultContent } from './content';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/about',
    settings,
    fallbackTitle: defaultContent.meta.title,
    fallbackDescription: defaultContent.meta.description,
  });
}

export default async function AboutPage() {
  const draft = await isDraftEnabled();
  const [nav, footer, doc] = await Promise.all([
    getNavigation(),
    getFooter(),
    findOneBySlug('pages', 'about', draft),
  ]);

  const convertedContent =
    doc && typeof (doc as { convertedContent?: unknown }).convertedContent === 'object'
      ? ((doc as { convertedContent?: unknown }).convertedContent as Record<string, unknown> | null)
      : null;
  const merged = convertedContent
    ? mergeConvertedContent(defaultContent as unknown as Record<string, unknown>, convertedContent, registry.pageName)
    : (defaultContent as unknown as Record<string, unknown>);
  const content = merged as Record<string, unknown>;

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/about" /> : null}
      <main>
        {resolveRenderSections(registry.sections, content).map((entry) => {
          const spec = registry.sections.find((s) => s.key === entry.templateKey);
          if (!spec) return null;
          const Component = spec.Component as ComponentType<{ data: unknown }>;
          const sectionData = content[entry.key] as { __hidden?: boolean } | undefined;
          if (sectionData === undefined) return null;
          if (sectionData?.__hidden) return null;
          return <Component key={entry.key} data={sectionData} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/about',
        })}
      />
    </>
  );
}
