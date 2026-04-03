import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { asPathnameFromSegments } from '@/lib/cms/slug';
import { lexicalToPlainText } from '@/lib/cms/content';
import { extractSeoMeta, findOneBySlug, isDraftEnabled } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/site-settings';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = asPathnameFromSegments(slug);
  const pageSlug = pathname.replace(/^\//, '');

  const draft = await isDraftEnabled();
  const [doc, settings] = await Promise.all([findOneBySlug('pages', pageSlug, draft), getSiteSettings()]);

  if (!doc) {
    return buildMetadata({
      pathname,
      settings,
      fallbackTitle: 'Page Not Found',
    });
  }

  return buildMetadata({
    pathname,
    settings,
    seo: extractSeoMeta(doc),
    fallbackTitle: String(doc.title || 'Page'),
    fallbackDescription: String(doc.excerpt || ''),
  });
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params;
  const pathname = asPathnameFromSegments(slug);
  const pageSlug = pathname.replace(/^\//, '');

  const draft = await isDraftEnabled();
  const doc = await findOneBySlug('pages', pageSlug, draft);

  if (!doc) {
    notFound();
  }

  const title = String(doc.title || 'Page');
  const description = String(doc.excerpt || lexicalToPlainText(doc.blocks) || '');
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: title, url: pathname },
  ]);
  const webpage = buildWebPageJsonLd({ title, description, pathname });

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
