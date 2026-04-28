'use client';

import { useState } from 'react';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';
import { renderEmHtml } from './_emHtml';

const TONE_PALETTE = ['primary', 'accent', 'support', 'primary-ink'] as const;
type Tone = (typeof TONE_PALETTE)[number];
function toneForIndex(i: number): Tone {
  return TONE_PALETTE[i % TONE_PALETTE.length];
}

export default function GrowthFunnel({ data }: { data: HomepageContent['growthFunnel'] }) {
  const [active, setActive] = useState(0);

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

  const safeIndex = Math.min(active, Math.max(0, data.steps.length - 1));
  const activeStep = data.steps[safeIndex];
  const activeTone = toneForIndex(safeIndex);

  const activeNumB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.num`, defaultTag: 'span' });
  const ActiveNumTag = activeNumB.Tag;
  const activeTitleB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const ActiveTitleTag = activeTitleB.Tag;
  const activeSubB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.sub`, defaultTag: 'p' });
  const ActiveSubTag = activeSubB.Tag;
  const activeDescB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.desc`, defaultTag: 'p' });
  const ActiveDescTag = activeDescB.Tag;

  return (
    <section className="hp2-gf">
      <div className="hp2-wrap">
        <div className="hp2-gf__head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">
            {data.titleLead}
            <br />
            <TitleEmTag {...titleEm.props} className="hp2-gf__title-em">{renderEmHtml(data.titleEm)}</TitleEmTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>

        {/* tab pills */}
        <div className="hp2-gf__tabs" role="tablist">
          {data.steps.map((s, i) => {
            const isActive = i === safeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={'hp2-gf__tab' + (isActive ? ' is-active' : '')}
                onClick={() => setActive(i)}
              >
                <span className="hp2-gf__tab-num">{s.num}</span>
                <span className="hp2-gf__tab-label">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* active step card */}
        <div className="hp2-gf__card" data-tone={activeTone}>
          <div className="hp2-gf__card-grid">
            <div className="hp2-gf__card-left">
              <ActiveNumTag {...activeNumB.props} className="hp2-gf__big-num">{activeStep.num}</ActiveNumTag>
              <div className="hp2-gf__step-label">STEP {activeStep.num}</div>
              <ActiveTitleTag {...activeTitleB.props} className="hp2-gf__step-h">{activeStep.title}</ActiveTitleTag>
              <ActiveSubTag {...activeSubB.props} className="hp2-gf__step-sub">{activeStep.sub}</ActiveSubTag>
              <ActiveDescTag {...activeDescB.props} className="hp2-gf__step-desc">{activeStep.desc}</ActiveDescTag>
            </div>
            <div className="hp2-gf__card-right">
              {activeStep.items.map((it, j) => {
                const nB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.items.${j}.n`, defaultTag: 'b' });
                const NB = nB.Tag;
                const dB = getConvertedNodeBinding(data, { field: `steps.${safeIndex}.items.${j}.d`, defaultTag: 'p' });
                const DB = dB.Tag;
                return (
                  <div key={j} className="hp2-gf__svc">
                    <div className="hp2-gf__svc-h">
                      <NB {...nB.props}>{it.n}</NB>
                    </div>
                    <DB {...dB.props} className="hp2-gf__svc-d">{it.d}</DB>
                  </div>
                );
              })}
            </div>
          </div>

          {/* progress bar */}
          <div className="hp2-gf__bar" role="tablist">
            {data.steps.map((s, i) => {
              const isActive = i === safeIndex;
              const tone = toneForIndex(i);
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={'hp2-gf__bar-seg' + (isActive ? ' is-active' : '')}
                  data-tone={tone}
                  onClick={() => setActive(i)}
                >
                  <span>{s.num} · {s.title.toUpperCase()}</span>
                  {isActive && <span className="hp2-gf__bar-dot" aria-hidden>●</span>}
                </button>
              );
            })}
          </div>
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
