import type { HomepageContent } from '@/lib/homepage-content';
import { CaseTabs } from './CaseTabs';

type CaseStudiesProps = {
  data: HomepageContent['caseStudies'];
};

export function CaseStudies({ data }: CaseStudiesProps) {
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
            <h2 className="cases-h2" data-r data-delay="1">
              {data.title}
            </h2>
          </div>
          <button className="btn-ol" data-r type="button">
            {data.cta}
          </button>
        </div>

        <CaseTabs tabs={data.tabs} />

        <div className="cases-grid" data-r data-delay="2">
          <div className="case-main">
            <img src={data.main.image} alt={data.main.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div className="case-info-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div className="case-tag">{data.main.tag}</div>
                  <div className="case-title">{data.main.title}</div>
                  <div className="case-desc">{data.main.description}</div>
                  <a className="view-link" href="#">
                    View Case Study →
                  </a>
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
                <img src={mini.image} alt={mini.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
