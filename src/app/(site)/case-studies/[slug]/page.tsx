import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { lexicalToPlainText } from '@/lib/cms/content';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
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
  const [doc, settings] = await Promise.all([findOneBySlug('case-studies', slug, draft), getSiteSettings()]);

  if (!doc) {
    return buildMetadata({
      pathname: `/case-studies/${slug}`,
      settings,
      fallbackTitle: 'Case Study Not Found',
    });
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
  const doc = await findOneBySlug('case-studies', slug, draft);

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Case Study');
  const description = String(doc.excerpt || lexicalToPlainText(doc.content) || '');

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: title, url: `/case-studies/${slug}` },
  ]);

  const webpage = buildWebPageJsonLd({ title, description, pathname: `/case-studies/${slug}` });

  return (
    <section className="sp">
      <div className="wrap">
        <h1>{title}</h1>
        <p style={{ marginTop: '16px' }}>{description}</p>
      </div>
      <JsonLd data={breadcrumb} />
      <JsonLd data={webpage} />
    </section>
  );
}
