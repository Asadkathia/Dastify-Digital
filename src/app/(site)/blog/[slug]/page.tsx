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
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
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
  const [doc, settings] = await Promise.all([findOneBySlug('blog-posts', slug, draft), getSiteSettings()]);

  if (!doc) {
    return buildMetadata({ pathname: `/blog/${slug}`, settings, fallbackTitle: 'Blog Post Not Found' });
  }

  return buildMetadata({
    pathname: `/blog/${slug}`,
    settings,
    seo: extractSeoMeta(doc),
    fallbackTitle: String(doc.title || 'Blog Post'),
    fallbackDescription: String(doc.excerpt || ''),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const draft = await isDraftEnabled();
  const [doc, footer, nav] = await Promise.all([findOneBySlug('blog-posts', slug, draft), getFooter(), getNavigation()]);

  if (!doc) notFound();

  const title = String(doc.title || 'Blog Post');
  const excerpt = String(doc.excerpt || lexicalToPlainText(doc.content) || '');
  const publishedAt = typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined;
  const featuredImage = doc.featuredImage as { url?: string; alt?: string } | null | undefined;
  const categories = Array.isArray(doc.categories) ? doc.categories as Array<{ title?: string; slug?: string }> : [];
  const firstCategory = categories[0];

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: title, url: `/blog/${slug}` },
  ]);

  const article = buildArticleJsonLd({
    title,
    description: excerpt,
    pathname: `/blog/${slug}`,
    publishedAt,
    modifiedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  });

  const hasContent: boolean = !!(doc.content && typeof doc.content === 'object' && 'root' in (doc.content as object));

  const blocks = Array.isArray(doc.blocks) ? (doc.blocks as unknown as PageBuilderBlock[]) : [];
  const hasBlocks = blocks.length > 0;

  // Pixel-perfect layout path: when the record has blocks[], render the full
  // converted page via PageBlocksRenderer and skip the default article layout.
  if (hasBlocks) {
    return (
      <>
        <SiteNavbar nav={nav} activePath={`/blog/${slug}`} />
        <main>
          <PageBlocksRenderer blocks={blocks} />
        </main>
        <SiteFooter footer={footer} />
        <JsonLd data={breadcrumb} />
        <JsonLd data={article} />
      </>
    );
  }

  return (
    <>
      <SiteNavbar nav={nav} activePath={`/blog/${slug}`} />
      <main>
        <article>
          {/* Hero */}
          <section className="sp" style={{ paddingBottom: 0 }}>
            <div className="wrap" style={{ maxWidth: '860px' }}>
              {firstCategory && (
                <div style={{ marginBottom: '16px' }}>
                  <Link
                    href={`/blog/category/${String(firstCategory.slug || '')}`}
                    style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent, #2563eb)', textDecoration: 'none' }}
                  >
                    {String(firstCategory.title || '')}
                  </Link>
                </div>
              )}
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
                {title}
              </h1>
              {excerpt && (
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary, #6b7280)', lineHeight: 1.7, marginBottom: '24px' }}>
                  {excerpt}
                </p>
              )}
              {publishedAt && (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '32px' }}>
                  {new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          </section>

          {/* Featured image */}
          {featuredImage?.url && (
            <div className="wrap" style={{ maxWidth: '860px', marginBottom: '48px' }}>
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
              ) : excerpt ? (
                <p style={{ lineHeight: 1.8 }}>{excerpt}</p>
              ) : null}

              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--color-border, #e5e7eb)' }}>
                <Link href="/blog" style={{ color: 'var(--color-accent, #2563eb)', textDecoration: 'none', fontWeight: 600 }}>
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter footer={footer} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={article} />
    </>
  );
}
