'use client';

import { useState } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Faqs({ data }: { data: PageContent['faqs'] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;

  return (
    <section className="sv2-faqs">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="sv2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="sv2-h2">{renderEmHtml(data.heading)}</HeadingTag>
        </div>
        <div className="sv2-faqs__list">
          {data.items.map((f, i) => {
            const isOpen = openIdx === i;
            const qB = getConvertedNodeBinding(data, { field: `items.${i}.q`, defaultTag: 'span' });
            const QTag = qB.Tag;
            const aB = getConvertedNodeBinding(data, { field: `items.${i}.a`, defaultTag: 'div' });
            const ATag = aB.Tag;
            return (
              <div
                key={i}
                className={'sv2-faq' + (isOpen ? ' is-open' : '')}
                onClick={() => setOpenIdx(isOpen ? null : i)}
              >
                <div className="sv2-faq__q">
                  <QTag {...qB.props}>{f.q}</QTag>
                  <span className="sv2-faq__toggle" aria-hidden>+</span>
                </div>
                <div className="sv2-faq__a">
                  <ATag {...aB.props} className="sv2-faq__a-inner">{f.a}</ATag>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
