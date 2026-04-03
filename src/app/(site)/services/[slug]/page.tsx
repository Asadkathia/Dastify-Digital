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
  const [doc, settings] = await Promise.all([findOneBySlug('services', slug, draft), getSiteSettings()]);

  if (!doc) {
    return buildMetadata({
      pathname: `/services/${slug}`,
      settings,
      fallbackTitle: 'Service Not Found',
    });
  }

  return buildMetadata({
    pathname: `/services/${slug}`,
    settings,
    seo: extractSeoMeta(doc),
    fallbackTitle: String(doc.title || 'Service'),
    fallbackDescription: String(doc.excerpt || ''),
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const draft = await isDraftEnabled();
  const doc = await findOneBySlug('services', slug, draft);

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Service');
  const description = String(doc.excerpt || lexicalToPlainText(doc.content) || '');

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: title, url: `/services/${slug}` },
  ]);

  const webpage = buildWebPageJsonLd({ title, description, pathname: `/services/${slug}` });

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
