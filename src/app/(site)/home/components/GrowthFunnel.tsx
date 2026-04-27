'use client';

import { useState } from 'react';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';
import { renderEmHtml } from './_emHtml';

const TONE_PALETTE = ['primary', 'accent', 'support'] as const;
type Tone = (typeof TONE_PALETTE)[number] | null;
function toneForIndex(i: number): Tone {
  if (i % 2 !== 0) return null;
  return TONE_PALETTE[Math.floor(i / 2) % TONE_PALETTE.length];
}

export default function GrowthFunnel({ data }: { data: HomepageContent['growthFunnel'] }) {
  const [open, setOpen] = useState<number | null>(0);

  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleEm = getConvertedNodeBinding(data, { field: 'titleEm', defaultTag: 'span' });
  const TitleEmTag = titleEm.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;

  return (
    <section className="hp2-gf">
      <div className="hp2-wrap">
        <div className="hp2-gf__head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">
            {data.titleLead}
            <br />
            <TitleEmTag {...titleEm.props}>{renderEmHtml(data.titleEm)}</TitleEmTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>
        <div className="hp2-gf__steps">
          {data.steps.map((s, i) => {
            const numB = getConvertedNodeBinding(data, { field: `steps.${i}.num`, defaultTag: 'span' });
            const NumTag = numB.Tag;
            const titleB = getConvertedNodeBinding(data, { field: `steps.${i}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = titleB.Tag;
            const subB = getConvertedNodeBinding(data, { field: `steps.${i}.sub`, defaultTag: 'p' });
            const STag = subB.Tag;
            const descB = getConvertedNodeBinding(data, { field: `steps.${i}.desc`, defaultTag: 'p' });
            const DTag = descB.Tag;
            const tone = toneForIndex(i);
            return (
              <div
                key={i}
                className={'hp2-gf__step' + (open === i ? ' is-open' : '')}
                data-tone={tone ?? undefined}
                onClick={() => setOpen((cur) => (cur === i ? null : i))}
              >
                <div className="hp2-gf__step-head">
                  <NumTag {...numB.props} className="hp2-gf__num">{s.num}</NumTag>
                  <div className="hp2-gf__step-title">
                    <TTag {...titleB.props}>{s.title}</TTag>
                    <STag {...subB.props}>{s.sub}</STag>
                  </div>
                  <span className="hp2-gf__chevron" aria-hidden>+</span>
                </div>
                <div className="hp2-gf__step-body">
                  <div className="hp2-gf__step-body-inner">
                    <DTag {...descB.props} className="hp2-gf__step-desc">{s.desc}</DTag>
                    <div className="hp2-gf__items">
                      {s.items.map((it, j) => {
                        const nB = getConvertedNodeBinding(data, { field: `steps.${i}.items.${j}.n`, defaultTag: 'b' });
                        const NB = nB.Tag;
                        const dB = getConvertedNodeBinding(data, { field: `steps.${i}.items.${j}.d`, defaultTag: 'p' });
                        const DB = dB.Tag;
                        return (
                          <div key={j} className="hp2-gf__item">
                            <div className="hp2-gf__item-dot" />
                            <div>
                              <NB {...nB.props}>{it.n}</NB>
                              <DB {...dB.props}>{it.d}</DB>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hp2-gf__cta">
          <a href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="arrow" size={18} />
            <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
          </a>
        </div>
      </div>
    </section>
  );
}
