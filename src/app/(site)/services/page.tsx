import Link from 'next/link';
import type { Metadata } from 'next';
import { findManyPublished } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/services',
    settings,
    fallbackTitle: 'Services',
    fallbackDescription: 'Healthcare growth services tailored to your practice.',
  });
}

export default async function ServicesPage() {
  const services = await findManyPublished('services', 100);

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Services</h1>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {services.map((service) => (
            <article key={String(service.id)}>
              <h2 style={{ fontSize: '24px' }}>
                <Link href={`/services/${String(service.slug || '')}`}>{String(service.title || 'Untitled')}</Link>
              </h2>
              {service.excerpt ? <p>{String(service.excerpt)}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
