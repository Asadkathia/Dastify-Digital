'use client';

import { useState } from 'react';
import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Faqs({ data }: { data: PageContent['faqs'] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="sv2-faqs">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <div className="sv2-eyebrow">{data.eyebrow}</div>
          <h2 className="sv2-h2">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="sv2-faqs__list">
          {data.items.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={'sv2-faq' + (isOpen ? ' is-open' : '')}
                onClick={() => setOpenIdx(isOpen ? null : i)}
              >
                <div className="sv2-faq__q">
                  <span>{f.q}</span>
                  <span className="sv2-faq__toggle" aria-hidden>+</span>
                </div>
                <div className="sv2-faq__a">
                  <div className="sv2-faq__a-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
