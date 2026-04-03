import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { lexicalToPlainText } from '@/lib/cms/content';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';

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
    return buildMetadata({
      pathname: `/blog/${slug}`,
      settings,
      fallbackTitle: 'Blog Post Not Found',
    });
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
  const doc = await findOneBySlug('blog-posts', slug, draft);

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Blog Post');
  const description = String(doc.excerpt || lexicalToPlainText(doc.content) || '');

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: title, url: `/blog/${slug}` },
  ]);

  const article = buildArticleJsonLd({
    title,
    description,
    pathname: `/blog/${slug}`,
    publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined,
    modifiedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  });

  return (
    <section className="sp">
      <div className="wrap">
        <h1>{title}</h1>
        <p style={{ marginTop: '16px' }}>{description}</p>
      </div>
      <JsonLd data={breadcrumb} />
      <JsonLd data={article} />
    </section>
  );
}
