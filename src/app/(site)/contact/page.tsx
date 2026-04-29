import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { findOneBySlug, getNavigation, getFooter, isDraftEnabled } from '@/lib/cms/queries';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import registry from './editor-registry';
import { defaultContent, type PageContent } from './content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

// TODO: the other hardcoded converted-page routes (about, blog-1, blog-post,
// book-session, case-studies, services-convert) have the same bug — they
// render defaultContent directly and ignore Payload edits. Apply the same
// merge pattern (or delete them and fall through to /[...slug]) when revisiting.
export default async function ContactPage() {
  const draft = await isDraftEnabled();
  const [nav, footer, doc] = await Promise.all([
    getNavigation(),
    getFooter(),
    findOneBySlug('pages', 'contact', draft),
  ]);

  const convertedContent =
    doc && typeof (doc as { convertedContent?: unknown }).convertedContent === 'object'
      ? ((doc as { convertedContent?: unknown }).convertedContent as Record<string, unknown> | null)
      : null;

  const merged = convertedContent
    ? mergeConvertedContent(defaultContent, convertedContent)
    : defaultContent;
  const content = merged as unknown as Record<string, unknown>;
  const meta = (merged as PageContent).meta;

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/contact" /> : null}
      <main>
        {registry.sections.map((section) => {
          const Component = section.Component as ComponentType<{ data: unknown }>;
          return <Component key={section.key} data={content[section.key]} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: meta.title,
          description: meta.description,
          pathname: '/contact',
        })}
      />
    </>
  );
}
