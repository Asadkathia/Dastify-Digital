'use client';

import { useEffect, useRef, useState } from 'react';
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerIdRef = useRef<string>('gf-pin');
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current step

  const stepCount = data.steps.length;
  const safeIndex = Math.min(active, Math.max(0, stepCount - 1));
  const activeTone = toneForIndex(safeIndex);
  const overallProgress = (safeIndex + progress) / stepCount;

  // ScrollTrigger pin + scrub. Skipped on mobile, reduced-motion, or inside editor iframe.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.self !== window.top) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let cleanupFns: Array<() => void> = [];
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const trig = ScrollTrigger.create({
          id: triggerIdRef.current,
          trigger: sectionEl,
          // Pin only once the entire section is fully in view (avoids cutoff on laptops).
          // If the section is taller than the viewport, fall back to top-aligned pin.
          start: () => (sectionEl.offsetHeight <= window.innerHeight ? 'bottom bottom' : 'top top'),
          end: '+=400%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1,
          snap: {
            snapTo: [0, 0.25, 0.5, 0.75, 1],
            duration: { min: 0.3, max: 0.6 },
            ease: 'power2.inOut',
            delay: 0.1,
          },
          onUpdate: (self) => {
            const p = self.progress * stepCount;
            const idx = Math.min(stepCount - 1, Math.floor(p));
            const within = Math.max(0, Math.min(1, p - idx));
            setActive(idx);
            setProgress(within);
          },
        });
        return () => {
          trig.kill();
        };
      });

      cleanupFns.push(() => mm.revert());
    })();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      cleanupFns = [];
    };
  }, [stepCount]);

  const handleJump = (i: number) => {
    if (typeof window === 'undefined') return;
    setActive(i);
    setProgress(0);

    if (window.self !== window.top || window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      const trig = ScrollTrigger.getById(triggerIdRef.current);
      if (!trig) return;
      const target = trig.start + (i / stepCount + 1 / (2 * stepCount)) * (trig.end - trig.start);
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: object) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    });
  };

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
    <section
      ref={sectionRef}
      className="hp2-gf"
      data-tone={activeTone}
    >
      <div className="hp2-wrap hp2-gf__inner">
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
                onClick={() => handleJump(i)}
              >
                <span className="hp2-gf__tab-num">{s.num}</span>
                <span className="hp2-gf__tab-label">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* stacked panels — every step always mounted so visual editor bindings stay live */}
        <div className="hp2-gf__card">
          <div className="hp2-gf__panels">
            {data.steps.map((step, i) => {
              const tone = toneForIndex(i);
              const isActive = i === safeIndex;
              const numB = getConvertedNodeBinding(data, { field: `steps.${i}.num`, defaultTag: 'span' });
              const NumTag = numB.Tag;
              const titleB = getConvertedNodeBinding(data, { field: `steps.${i}.title`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
              const TTag = titleB.Tag;
              const subB = getConvertedNodeBinding(data, { field: `steps.${i}.sub`, defaultTag: 'p' });
              const STag = subB.Tag;
              const descB = getConvertedNodeBinding(data, { field: `steps.${i}.desc`, defaultTag: 'p' });
              const DTag = descB.Tag;
              return (
                <div
                  key={i}
                  className={'hp2-gf__panel' + (isActive ? ' is-active' : '')}
                  data-tone={tone}
                  aria-hidden={!isActive}
                >
                  <div className="hp2-gf__card-grid">
                    <div className="hp2-gf__card-left">
                      <NumTag {...numB.props} className="hp2-gf__big-num">{step.num}</NumTag>
                      <div className="hp2-gf__step-label">STEP {step.num}</div>
                      <TTag {...titleB.props} className="hp2-gf__step-h">{step.title}</TTag>
                      <STag {...subB.props} className="hp2-gf__step-sub">{step.sub}</STag>
                      <DTag {...descB.props} className="hp2-gf__step-desc">{step.desc}</DTag>
                    </div>
                    <div className="hp2-gf__card-right">
                      {step.items.map((it, j) => {
                        const nB = getConvertedNodeBinding(data, { field: `steps.${i}.items.${j}.n`, defaultTag: 'b' });
                        const NB = nB.Tag;
                        const dB = getConvertedNodeBinding(data, { field: `steps.${i}.items.${j}.d`, defaultTag: 'p' });
                        const DB = dB.Tag;
                        return (
                          <div key={j} className="hp2-gf__svc" style={{ ['--svc-i' as string]: j }}>
                            <div className="hp2-gf__svc-h">
                              <NB {...nB.props}>{it.n}</NB>
                            </div>
                            <DB {...dB.props} className="hp2-gf__svc-d">{it.d}</DB>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* timeline with scaleX fill */}
          <div className="hp2-gf__bar" role="tablist">
            <div
              className="hp2-gf__bar-fill"
              style={{ transform: `scaleX(${overallProgress})` }}
              aria-hidden
            />
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
                  onClick={() => handleJump(i)}
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
