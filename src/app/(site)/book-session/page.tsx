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
import { defaultContent } from './content';
import { BookingProvider } from './components/BookingContext';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

export default async function BookSessionPage() {
  const draft = await isDraftEnabled();
  const [nav, footer, doc] = await Promise.all([
    getNavigation(),
    getFooter(),
    findOneBySlug('pages', 'book-session', draft),
  ]);
  const convertedContent =
    doc && typeof (doc as { convertedContent?: unknown }).convertedContent === 'object'
      ? ((doc as { convertedContent?: unknown }).convertedContent as Record<string, unknown> | null)
      : null;
  const merged = convertedContent
    ? (mergeConvertedContent(
        defaultContent as unknown as Record<string, unknown>,
        convertedContent,
        registry.pageName,
      ) as Record<string, unknown>)
    : (defaultContent as unknown as Record<string, unknown>);

  const resolved = resolveRenderSections(registry.sections, merged);
  // Layout split: Hero standalone; Sidebar pinned to its column; Scheduler /
  // Form (and any duplicates of those templates) flow inside `.bk2-form-wrap`
  // in their resolved order.
  const heroEntries = resolved.filter((e) => e.templateKey === 'hero');
  const sidebarEntries = resolved.filter((e) => e.templateKey === 'sidebar');
  const formWrapEntries = resolved.filter(
    (e) => e.templateKey !== 'hero' && e.templateKey !== 'sidebar',
  );
  const isVisible = (entry: { key: string }) =>
    !((merged[entry.key] as { __hidden?: boolean } | undefined)?.__hidden);
  const sidebarVisible = sidebarEntries.filter(isVisible);
  const formWrapVisible = formWrapEntries.filter(isVisible);
  const showMain = sidebarVisible.length > 0 || formWrapVisible.length > 0;

  function renderEntry(entry: { key: string; templateKey: string }) {
    const spec = registry.sections.find((s) => s.key === entry.templateKey);
    if (!spec) return null;
    const Component = spec.Component as ComponentType<{ data: unknown }>;
    const sectionData = merged[entry.key] as { __hidden?: boolean } | undefined;
    if (sectionData?.__hidden) return null;
    return <Component key={entry.key} data={sectionData} />;
  }

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/book-session" /> : null}
      <main>
        {heroEntries.map(renderEntry)}
        {showMain ? (
          <BookingProvider>
            <section className="bk2-main">
              <div className="bk2-wrap">
                <div className="bk2-layout">
                  <div className="bk2-form-wrap">{formWrapVisible.map(renderEntry)}</div>
                  {sidebarVisible.map(renderEntry)}
                </div>
              </div>
            </section>
          </BookingProvider>
        ) : null}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Book Session', url: '/book-session' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/book-session',
        })}
      />
    </>
  );
}
