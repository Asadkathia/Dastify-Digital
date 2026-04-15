import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { CaseTabs } from './CaseTabs';
import { CmsImage } from '@/components/CmsImage';

type CaseStudiesProps = {
  data: HomepageContent['caseStudies'];
};

export function CaseStudies({ data }: CaseStudiesProps) {
  const ctaHref = data.ctaHref?.url || '/case-studies';

  return (
    <section className="cases sp" id={data.id}>
      <span className="sec-wm g1">C</span>
      <div className="wrap">
        <div className="cases-head">
          <div>
            <div data-r>
              <span className="chip">
                <span className="chip-dot" />
                {data.chip}
              </span>
            </div>
            <h2 className="cases-h2" data-r data-delay="1" data-field="title">
              {data.title}
            </h2>
          </div>
          <Link
            className="btn-ol"
            data-r
            href={ctaHref}
            target={data.ctaHref?.openInNewTab ? '_blank' : undefined}
            rel={data.ctaHref?.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            <span data-field="cta">{data.cta}</span>
          </Link>
        </div>

        <CaseTabs tabs={data.tabs} />

        <div className="cases-grid" data-r data-delay="2">
          <div className="case-main">
            <CmsImage src={data.main.image} alt={data.main.alt} objectFit="cover" />
            <div className="case-info-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div className="case-tag">{data.main.tag}</div>
                  <div className="case-title">{data.main.title}</div>
                  <div className="case-desc">{data.main.description}</div>
                  <Link className="view-link" href="/case-studies">
                    View Case Study →
                  </Link>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '32px' }}>
                  <div className="case-stat-big">{data.main.stat}</div>
                  <div className="case-stat-lbl">{data.main.statLabel}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="case-side">
            {data.minis.map((mini) => (
              <div key={mini.title} className="case-mini">
                <CmsImage src={mini.image} alt={mini.alt} objectFit="cover" />
                <div className="case-mini-ov">
                  <div className="case-mini-tag">{mini.tag}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div className="case-mini-t">{mini.title}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="case-mini-n">{mini.stat}</div>
                      <div style={{ fontSize: '10px', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.10em' }}>
                        {mini.statLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
