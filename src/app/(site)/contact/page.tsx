import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { findOneBySlug, getNavigation, getFooter, isDraftEnabled } from '@/lib/cms/queries';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { resolveRenderSections } from '@/lib/converted-pages/editor-adapter';
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
    ? mergeConvertedContent(defaultContent, convertedContent, registry.pageName)
    : defaultContent;

  // Facebook social link is intentionally removed from the contact page;
  // strip it post-merge in case the visual editor re-adds it via convertedContent.
  if (merged.info?.social?.links) {
    merged.info.social.links = merged.info.social.links.filter(
      (link) => link.label.toLowerCase() !== 'facebook',
    );
  }

  const content = merged as PageContent;
  const meta = content.meta;
  const contentMap = content as unknown as Record<string, unknown>;

  // Resolve final order/duplicate/delete list. Hero renders standalone; Form
  // and Info share a `.ct2-main` wrapper so they always render together (in
  // their resolved relative order) inside that wrapper.
  const resolved = resolveRenderSections(registry.sections, contentMap);
  const heroEntries = resolved.filter((e) => e.templateKey === 'hero');
  const innerEntries = resolved.filter((e) => e.templateKey !== 'hero');
  const innerVisible = innerEntries.filter((entry) => {
    const sectionData = contentMap[entry.key] as { __hidden?: boolean } | undefined;
    return !sectionData?.__hidden;
  });

  function renderEntry(entry: { key: string; templateKey: string }) {
    const spec = registry.sections.find((s) => s.key === entry.templateKey);
    if (!spec) return null;
    const Component = spec.Component as ComponentType<{ data: unknown }>;
    const sectionData = contentMap[entry.key] as { __hidden?: boolean } | undefined;
    if (sectionData?.__hidden) return null;
    return <Component key={entry.key} data={sectionData} />;
  }

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/contact" /> : null}
      <main>
        {heroEntries.map(renderEntry)}
        {innerVisible.length > 0 ? (
          <section className="ct2-main">
            <div className="ct2-wrap">
              <div className="ct2-layout">
                {innerVisible.map(renderEntry)}
              </div>
            </div>
          </section>
        ) : null}
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
