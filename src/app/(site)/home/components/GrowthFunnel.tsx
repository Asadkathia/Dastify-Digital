'use client';

import { useState } from 'react';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';
import { renderEmHtml } from './_emHtml';

export default function GrowthFunnel({ data }: { data: HomepageContent['growthFunnel'] }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="hp2-gf">
      <div className="hp2-wrap">
        <div className="hp2-gf__head">
          <div className="hp2-eyebrow">{data.eyebrow}</div>
          <h2 className="hp2-h2">
            {data.titleLead}
            <br />
            {renderEmHtml(data.titleEm)}
          </h2>
          <p className="hp2-intro">{data.intro}</p>
        </div>
        <div className="hp2-gf__steps">
          {data.steps.map((s, i) => (
            <div
              key={i}
              className={'hp2-gf__step' + (open === i ? ' is-open' : '')}
              onClick={() => setOpen(i)}
            >
              <div className="hp2-gf__step-head">
                <span className="hp2-gf__num">{s.num}</span>
                <div className="hp2-gf__step-title">
                  <h3>{s.title}</h3>
                  <p>{s.sub}</p>
                </div>
                <span className="hp2-gf__chevron" aria-hidden>+</span>
              </div>
              <div className="hp2-gf__step-body">
                <div className="hp2-gf__step-body-inner">
                  <p className="hp2-gf__step-desc">{s.desc}</p>
                  <div className="hp2-gf__items">
                    {s.items.map((it, j) => (
                      <div key={j} className="hp2-gf__item">
                        <div className="hp2-gf__item-dot" />
                        <div>
                          <b>{it.n}</b>
                          <p>{it.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hp2-gf__cta">
          <a href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="arrow" size={18} />
            <span>{data.ctaLabel}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
