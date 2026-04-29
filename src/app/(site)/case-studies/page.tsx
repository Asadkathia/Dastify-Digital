import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { findOneBySlug, getNavigation, getFooter, isDraftEnabled } from '@/lib/cms/queries';
import { getPayloadClient } from '@/lib/payload';
import { getSiteSettings } from '@/lib/site-settings';
import { mergeConvertedContent } from '@/lib/converted-pages/merge-content';
import { resolveRenderSections } from '@/lib/converted-pages/editor-adapter';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import registry from './editor-registry';
import { defaultContent, type CaseStudySeed } from './content';

type CaseStudyDoc = {
  id: number | string;
  slug: string;
  title: string;
  client?: string | null;
  excerpt?: string | null;
  filterTag?: string | null;
  featuredImage?: { url?: string; alt?: string } | null;
  stats?: Array<{ value: string; label: string }> | null;
};

const COLOR_CYCLE: CaseStudySeed['color'][] = ['primary', 'accent', 'support'];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/case-studies',
    settings,
    fallbackTitle: defaultContent.meta.title,
    fallbackDescription: defaultContent.meta.description,
  });
}

async function fetchCaseStudies(): Promise<CaseStudyDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'case-studies',
      depth: 1,
      limit: 100,
      sort: '-updatedAt',
      where: { _status: { equals: 'published' } } as never,
    });
    return (res.docs ?? []) as unknown as CaseStudyDoc[];
  } catch (err) {
    console.error('[case-studies page] fetch failed:', err);
    return [];
  }
}

function docToSeed(doc: CaseStudyDoc, index: number): CaseStudySeed {
  const stats = Array.isArray(doc.stats) ? doc.stats : [];
  // TODO(copy): Payload `case-studies` doesn't carry challenge/strategy/quote/author/role/tags
  // — we surface what we have and leave structured fields blank.
  return {
    client: doc.client ?? doc.title,
    specialty: doc.filterTag ?? '',
    challenge: doc.excerpt ?? '',
    strategy: '',
    results: stats.map((s) => ({ n: s.value, l: s.label })),
    quote: '',
    author: '',
    role: '',
    tags: doc.filterTag ? [doc.filterTag] : [],
    color: COLOR_CYCLE[index % COLOR_CYCLE.length] ?? 'primary',
    slug: doc.slug,
  };
}

export default async function CaseStudiesPage() {
  const draft = await isDraftEnabled();
  const [docs, nav, footer, doc] = await Promise.all([
    fetchCaseStudies(),
    getNavigation(),
    getFooter(),
    findOneBySlug('pages', 'case-studies', draft),
  ]);

  // If Payload has docs, render those; otherwise fall back to verbatim static seed.
  const items: CaseStudySeed[] = docs.length > 0
    ? docs.map(docToSeed)
    : defaultContent.caseStudies.items;

  const baseContent: Record<string, unknown> = {
    ...defaultContent,
    caseStudies: { ...defaultContent.caseStudies, items },
  };
  const convertedContent =
    doc && typeof (doc as { convertedContent?: unknown }).convertedContent === 'object'
      ? ((doc as { convertedContent?: unknown }).convertedContent as Record<string, unknown> | null)
      : null;
  const content = convertedContent
    ? (mergeConvertedContent(baseContent, convertedContent, registry.pageName) as Record<string, unknown>)
    : baseContent;

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/case-studies" /> : null}
      <main>
        {resolveRenderSections(registry.sections, content).map((entry) => {
          const spec = registry.sections.find((s) => s.key === entry.templateKey);
          if (!spec) return null;
          const Component = spec.Component as ComponentType<{ data: unknown }>;
          const sectionData = content[entry.key] as { __hidden?: boolean } | undefined;
          if (sectionData?.__hidden) return null;
          return <Component key={entry.key} data={sectionData} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Case Studies', url: '/case-studies' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/case-studies',
        })}
      />
    </>
  );
}
