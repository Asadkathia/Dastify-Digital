import Link from 'next/link';
import type { Metadata } from 'next';
import { findManyPublished } from '@/lib/cms/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/case-studies',
    settings,
    fallbackTitle: 'Case Studies',
    fallbackDescription: 'Real healthcare growth outcomes from Dastify Digital campaigns.',
  });
}

export default async function CaseStudiesPage() {
  const caseStudies = await findManyPublished('case-studies', 100);

  return (
    <section className="sp">
      <div className="wrap">
        <h1>Case Studies</h1>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          {caseStudies.map((entry) => (
            <article key={String(entry.id)}>
              <h2 style={{ fontSize: '24px' }}>
                <Link href={`/case-studies/${String(entry.slug || '')}`}>{String(entry.title || 'Untitled')}</Link>
              </h2>
              {entry.excerpt ? <p>{String(entry.excerpt)}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
