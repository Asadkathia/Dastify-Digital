import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { JsonLd } from '@/components/JsonLd';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import type { PageBuilderBlock } from '@/components/blocks/types';
import { lexicalToPlainText } from '@/lib/cms/content';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';
import { getFooter, getNavigation } from '@/lib/cms/queries';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const draft = await isDraftEnabled();
  const [doc, settings] = await Promise.all([findOneBySlug('case-studies', slug, draft), getSiteSettings()]);

  if (!doc) {
    return buildMetadata({ pathname: `/case-studies/${slug}`, settings, fallbackTitle: 'Case Study Not Found' });
  }

  return buildMetadata({
    pathname: `/case-studies/${slug}`,
    settings,
    seo: extractSeoMeta(doc),
    fallbackTitle: String(doc.title || 'Case Study'),
    fallbackDescription: String(doc.excerpt || ''),
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const draft = await isDraftEnabled();
  const [doc, footer, nav] = await Promise.all([findOneBySlug('case-studies', slug, draft), getFooter(), getNavigation()]);

  if (!doc) notFound();

  const title = String(doc.title || 'Case Study');
  const description = String(doc.excerpt || lexicalToPlainText(doc.content) || '');
  const client = typeof doc.client === 'string' && doc.client ? doc.client : null;
  const featuredImage = doc.featuredImage as { url?: string; alt?: string } | null | undefined;
  const rawStats = Array.isArray(doc.stats) ? doc.stats as Array<{ value: string; label: string }> : [];
  const stats = rawStats.slice(0, 5);

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: title, url: `/case-studies/${slug}` },
  ]);

  const webpage = buildWebPageJsonLd({ title, description, pathname: `/case-studies/${slug}` });

  const hasContent: boolean = !!(doc.content && typeof doc.content === 'object' && 'root' in (doc.content as object));

  const blocks = Array.isArray(doc.blocks) ? (doc.blocks as unknown as PageBuilderBlock[]) : [];
  const hasBlocks = blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        <SiteNavbar nav={nav} activePath="/case-studies" />
        <main>
          <PageBlocksRenderer blocks={blocks} />
        </main>
        <SiteFooter footer={footer} />
        <JsonLd data={breadcrumb} />
        <JsonLd data={webpage} />
      </>
    );
  }

  return (
    <>
      <SiteNavbar nav={nav} activePath="/case-studies" />
      <main>
        <article>
          {/* Hero */}
          <section className="sp" style={{ paddingBottom: 0 }}>
            <div className="wrap" style={{ maxWidth: '940px' }}>
              {client && (
                <div style={{ marginBottom: '16px', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent, #2563eb)' }}>
                  {client}
                </div>
              )}
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
                {title}
              </h1>

              {/* Stats bar */}
              {stats.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '40px',
                  flexWrap: 'wrap',
                  padding: '24px',
                  background: 'var(--color-surface-alt, #f9fafb)',
                  borderRadius: '12px',
                  marginBottom: '32px',
                }}>
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-heading, #111827)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', marginTop: '4px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {description && !hasContent && (
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary, #6b7280)', lineHeight: 1.7 }}>
                  {description}
                </p>
              )}
            </div>
          </section>

          {/* Featured image */}
          {featuredImage?.url && (
            <div className="wrap" style={{ maxWidth: '940px', marginTop: '32px', marginBottom: '48px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImage.url}
                alt={featuredImage.alt ?? title}
                style={{ width: '100%', borderRadius: '12px', display: 'block' }}
              />
            </div>
          )}

          {/* Body */}
          <section className="sp" style={{ paddingTop: featuredImage?.url ? 0 : undefined }}>
            <div className="wrap" style={{ maxWidth: '860px' }}>
              {hasContent ? (
                <div className="prose">
                  <RichText data={doc.content as never} />
                </div>
              ) : null}

              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-border, #e5e7eb)' }}>
                <Link href="/case-studies" style={{ color: 'var(--color-accent, #2563eb)', textDecoration: 'none', fontWeight: 600 }}>
                  ← All Case Studies
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter footer={footer} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={webpage} />
    </>
  );
}
