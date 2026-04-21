import Link from 'next/link';
import type { Metadata } from 'next';
import { getPayloadClient } from '@/lib/payload';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';
import { getFooter, getNavigation } from '@/lib/cms/queries';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';

type CaseStudyDoc = {
  id: number | string;
  slug: string;
  title: string;
  client?: string | null;
  excerpt?: string | null;
  featured?: boolean;
  filterTag?: string | null;
  featuredImage?: { url?: string; alt?: string } | null;
  stats?: Array<{ value: string; label: string }> | null;
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    pathname: '/case-studies',
    settings,
    fallbackTitle: 'Case Studies | Dastify Digital',
    fallbackDescription: 'Real healthcare growth outcomes from Dastify Digital campaigns.',
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

export default async function CaseStudiesPage() {
  const [caseStudies, footer, nav] = await Promise.all([fetchCaseStudies(), getFooter(), getNavigation()]);

  const featured = caseStudies.find((c) => c.featured);
  const rest = caseStudies.filter((c) => !c.featured);

  return (
    <>
      <SiteNavbar nav={nav} activePath="/case-studies" />
      <main>
        <section className="sp">
          <div className="wrap">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '8px' }}>
              Case Studies
            </h1>
            <p style={{ color: 'var(--color-text-secondary, #6b7280)', marginBottom: '48px', fontSize: '1.125rem' }}>
              Real results from healthcare practices across the country.
            </p>

            {caseStudies.length === 0 && (
              <p style={{ color: 'var(--color-text-secondary, #6b7280)' }}>No case studies published yet.</p>
            )}

            {featured && (
              <div style={{ marginBottom: '48px' }}>
                <CaseStudyCard doc={featured} featured />
              </div>
            )}

            {rest.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}>
                {rest.map((doc) => <CaseStudyCard key={String(doc.id)} doc={doc} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}

function CaseStudyCard({ doc, featured = false }: { doc: CaseStudyDoc; featured?: boolean }) {
  const imgUrl = doc.featuredImage?.url;
  const imgAlt = doc.featuredImage?.alt ?? doc.title;
  const stats = Array.isArray(doc.stats) ? doc.stats.slice(0, 3) : [];

  return (
    <article style={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--color-border, #e5e7eb)',
      background: 'var(--color-surface, #fff)',
      display: 'flex',
      flexDirection: featured ? 'row' : 'column',
      gap: 0,
    }}>
      {imgUrl ? (
        <div style={{
          aspectRatio: featured ? '16/9' : '16/9',
          width: featured ? '45%' : '100%',
          flexShrink: 0,
          overflow: 'hidden',
          background: '#f3f4f6',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={imgAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{
          aspectRatio: '16/9',
          width: featured ? '45%' : '100%',
          flexShrink: 0,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}>
          📊
        </div>
      )}

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {doc.client && (
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent, #2563eb)' }}>
            {doc.client}
          </div>
        )}
        <h2 style={{ fontSize: featured ? '1.75rem' : '1.25rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
          <Link href={`/case-studies/${doc.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {doc.title}
          </Link>
        </h2>
        {doc.excerpt && (
          <p style={{ margin: 0, color: 'var(--color-text-secondary, #6b7280)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {doc.excerpt}
          </p>
        )}
        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--color-border, #e5e7eb)' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-heading, #111827)' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <Link
            href={`/case-studies/${doc.slug}`}
            style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-accent, #2563eb)', textDecoration: 'none' }}
          >
            View case study →
          </Link>
        </div>
      </div>
    </article>
  );
}
