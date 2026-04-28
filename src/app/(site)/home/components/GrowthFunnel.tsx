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

// Derive a single-word tab label from the step's full title.
// Marketing-edited title stays authoritative; the tab is just its lead/identity word.
function tabLabelFromTitle(title: string): string {
  const trimmed = title.trim();
  if (/loyalty\s*&\s*growth/i.test(trimmed)) return 'Growth';
  return trimmed.split(/\s+/)[0];
}

export default function GrowthFunnel({ data }: { data: HomepageContent['growthFunnel'] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const triggerIdRef = useRef<string>('gf-pin');
  const completedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current step
  const [direction, setDirection] = useState<1 | -1>(1);
  const [completed, setCompleted] = useState(false);

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
    const stageEl = stageRef.current;
    if (!sectionEl || !stageEl) return;

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
        let prevIdx = -1;
        const trig = ScrollTrigger.create({
          id: triggerIdRef.current,
          trigger: stageEl,
          start: 'center center',
          end: '+=400%',
          pin: stageEl,
          pinSpacing: true,
          invalidateOnRefresh: true,
          scrub: 0.5,
          snap: {
            snapTo: [0, 0.25, 0.5, 0.75, 1],
            duration: { min: 0.15, max: 0.35 },
            ease: 'power2.out',
            delay: 0.05,
            inertia: false,
          },
          onUpdate: (self) => {
            // Once the user has completed the animation, leave it locked to the
            // final step and let the page scroll past normally — no reverse traversal.
            if (completedRef.current) return;

            const p = self.progress * stepCount;
            const idx = Math.min(stepCount - 1, Math.floor(p));
            const within = Math.max(0, Math.min(1, p - idx));
            if (idx !== prevIdx) {
              setDirection(self.direction === -1 ? -1 : 1);
              prevIdx = idx;
            }
            setActive(idx);
            setProgress(within);

            // Mark complete the moment the user scrolls into the final segment going
            // forward, then defer killing the trigger so React commits the final state
            // before the pin spacer collapses.
            if (self.progress >= 0.999 && self.direction === 1) {
              completedRef.current = true;
              setActive(stepCount - 1);
              setProgress(1);
              setCompleted(true);
              requestAnimationFrame(() => {
                type LenisAPI = {
                  stop?: () => void;
                  start?: () => void;
                  resize?: () => void;
                  scrollTo?: (target: number, opts?: { immediate?: boolean; force?: boolean }) => void;
                };
                const lenis = (window as unknown as { __lenis?: LenisAPI }).__lenis;

                // Capture the spacer height (= total scroll distance of the pin) BEFORE
                // killing the trigger, since trig.start/end become unavailable after kill.
                const spacerHeight = Math.max(0, trig.end - trig.start);
                const oldScrollY = window.scrollY || document.documentElement.scrollTop || 0;

                // Pause Lenis so its in-flight wheel-tween doesn't carry a stale
                // targetScroll into the new (shorter) document.
                lenis?.stop?.();

                // revert: removes the pin-spacer (400vh of reserved scroll space) and
                // restores the stage to its natural document flow. Without revert the
                // page keeps that 400vh as empty whitespace forever.
                trig.kill(true);
                ScrollTrigger.refresh();
                lenis?.resize?.();

                // The browser does NOT auto-adjust scrollY when the document shrinks.
                // Without this compensation the user "skips" forward by spacerHeight
                // (typically 400vh = 2–3 sections). Subtract spacerHeight so the user
                // stays visually pinned to whatever was just below the funnel.
                const newScrollY = Math.max(0, oldScrollY - spacerHeight);
                window.scrollTo(0, newScrollY);

                requestAnimationFrame(() => {
                  lenis?.scrollTo?.(newScrollY, { immediate: true, force: true });
                  lenis?.start?.();
                });
              });
            }
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

    // After completion the pin trigger is dead — clicks just swap the visible
    // panel via existing transitions; no scroll-jump because there's no pin region.
    if (completedRef.current) return;

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
  const ctaLabel = getConvertedNodeBinding(data, { field: 'ctaLabel', defaultTag: 'span' });
  const CtaLabelTag = ctaLabel.Tag;

  return (
    <section
      ref={sectionRef}
      className={'hp2-gf' + (completed ? ' is-completed' : '')}
      data-tone={activeTone}
      data-direction={direction === 1 ? 'fwd' : 'rev'}
    >
      <div className="hp2-wrap hp2-gf__inner">
        <div ref={stageRef} className="hp2-gf__stage">
        <div className="hp2-gf__head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">
            {data.titleLead}{' '}
            <TitleEmTag {...titleEm.props} className="hp2-gf__title-em">{renderEmHtml(data.titleEm)}</TitleEmTag>
          </TitleTag>
        </div>

        {/* display-sized word labels — replace pills */}
        <div className="hp2-gf__tabs" role="tablist">
          {data.steps.map((s, i) => {
            const isActive = i === safeIndex;
            const tone = toneForIndex(i);
            return (
              <button
                key={`${i}-${isActive ? 'on' : 'off'}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-tone={tone}
                className={'hp2-gf__tab' + (isActive ? ' is-active' : '')}
                onClick={() => handleJump(i)}
              >
                {tabLabelFromTitle(s.title)}
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
              const isPassed = i < safeIndex;
              const tone = toneForIndex(i);
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={
                    'hp2-gf__bar-seg' +
                    (isActive ? ' is-active' : '') +
                    (isPassed ? ' is-passed' : '')
                  }
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
