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
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const runwayRef = useRef<HTMLDivElement | null>(null);
  // Ratchet: scroll-driven updates may only advance forward. Tab clicks reset
  // this so the user can rewind via tabs if they want.
  const prevIdxRef = useRef(0);
  // Once the user has fully traversed the runway forward, we collapse it so
  // scrolling back up past the section is short (otherwise the user has to
  // scroll through the full pin runway showing the locked final step).
  const collapsedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [mode, setMode] = useState<'live' | 'editor'>('live');

  const stepCount = data.steps.length;
  const safeIndex = Math.min(active, Math.max(0, stepCount - 1));
  const activeTone = toneForIndex(safeIndex);

  const writeBarProgress = (p: number) => {
    const el = barFillRef.current;
    if (el) el.style.setProperty('--gf-progress', String(p));
  };

  // Inside the visual editor iframe we render a flat, scroll-free layout so
  // marketing can edit every step inline. CSS keys off `data-mode="editor"`.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.self !== window.top) setMode('editor');
  }, []);

  // Bar-fill snaps to the active step (CSS handles the eased transition between
  // discrete values). Kept in sync with `active` so jumps from tab clicks update
  // the bar even when the scroll listener isn't running (mobile / editor).
  useEffect(() => {
    writeBarProgress((safeIndex + 1) / stepCount);
  }, [safeIndex, stepCount]);

  // Scroll-driven step advancement.
  //
  // Reads `runway.getBoundingClientRect()` directly on each rAF-throttled scroll
  // tick to compute progress through the runway, then maps progress → active
  // step. This is pixel-accurate and immune to the timing flakiness of
  // IntersectionObserver against a zero-height root margin under smooth scroll.
  //
  // A separate IntersectionObserver gates the scroll listener so it only runs
  // while the section is on screen — the listener is detached entirely the
  // rest of the time.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mode === 'editor') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    const runway = runwayRef.current;
    if (!runway) return;

    let pending = false;
    let rafId = 0;
    let scrollAttached = false;

    const compute = () => {
      pending = false;
      if (collapsedRef.current) return;
      const rect = runway.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Pin engages while runway top has scrolled past viewport top and runway
      // bottom hasn't yet reached viewport bottom. Within that window:
      //   scrolled  = -rect.top                   (0 → scrollable)
      //   scrollable = rect.height - viewportH    (= (stepCount - 1) × 100vh)
      const scrollable = rect.height - viewportH;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      // 4 steps share [0..1] evenly: idx 0 owns [0, .25), idx 1 owns [.25, .5), …
      // idx 3 owns [.75, 1]. Floor handles the open interval at the high end.
      const idx = Math.min(stepCount - 1, Math.floor(progress * stepCount));
      // Forward-only ratchet: never decrement on scroll-back. Once a step has
      // been reached, scrolling up keeps it locked there — no reverse traversal
      // through prior panels. Tab clicks (handleJump) bypass this by resetting
      // prevIdxRef directly.
      if (idx > prevIdxRef.current) {
        setDirection(1);
        prevIdxRef.current = idx;
        setActive(idx);
      }
      // End of forward scroll → collapse the runway so backward scroll is short.
      // Triggered exactly when the pin is releasing (scrollY at sticky-max), so
      // pin stays at viewport top in both pre- and post-collapse states. With
      // tight scrollY compensation, this is visually seamless.
      if (progress >= 0.999 && idx === stepCount - 1) {
        collapse();
      }
    };

    const collapse = () => {
      if (collapsedRef.current) return;
      const section = sectionRef.current;
      if (!section || !runway) return;
      collapsedRef.current = true;

      type LenisAPI = {
        stop?: () => void;
        start?: () => void;
        resize?: () => void;
        scrollTo?: (y: number, opts?: { immediate?: boolean; force?: boolean }) => void;
      };
      const lenis = (window as unknown as { __lenis?: LenisAPI }).__lenis;

      // CRITICAL: capture scrollY before layout change; flip the attribute,
      // re-measure (forces layout flush), compensate scrollY, sync Lenis — all
      // in a single synchronous task so the browser cannot paint with the
      // runway collapsed but scrollY stale.
      const oldHeight = runway.offsetHeight;
      const oldScrollY = window.scrollY;

      lenis?.stop?.();
      section.setAttribute('data-completed', 'true');
      const newHeight = runway.offsetHeight; // forces layout flush
      const reduction = Math.max(0, oldHeight - newHeight);
      const newScrollY = Math.max(0, oldScrollY - reduction);

      window.scrollTo(0, newScrollY);
      lenis?.resize?.();
      lenis?.scrollTo?.(newScrollY, { immediate: true, force: true });
      lenis?.start?.();
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(compute);
    };

    const attach = () => {
      if (scrollAttached) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      scrollAttached = true;
      compute();
    };
    const detach = () => {
      if (!scrollAttached) return;
      window.removeEventListener('scroll', onScroll);
      scrollAttached = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    const visObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) attach();
        else detach();
      },
      { rootMargin: '0px', threshold: 0 },
    );
    visObserver.observe(runway);

    return () => {
      visObserver.disconnect();
      detach();
    };
  }, [stepCount, mode]);

  const handleJump = (i: number) => {
    if (typeof window === 'undefined') return;
    // Tab clicks bypass the forward-only ratchet — user explicitly chose this
    // step. Re-anchor the ratchet so subsequent scroll-forward works from here.
    prevIdxRef.current = i;
    setDirection(i >= safeIndex ? 1 : -1);
    setActive(i);

    if (mode === 'editor') return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    const runway = runwayRef.current;
    if (!runway) return;
    const rect = runway.getBoundingClientRect();
    const runwayTopDoc = rect.top + window.scrollY;
    const viewportH = window.innerHeight;
    const scrollable = rect.height - viewportH;
    // Aim at the middle of step i's progress range so it sits firmly in the
    // [i/N, (i+1)/N) bucket.
    const targetY = runwayTopDoc + ((i + 0.5) / stepCount) * scrollable;

    type LenisAPI = {
      scrollTo?: (y: number, opts?: { duration?: number; easing?: (t: number) => number }) => void;
    };
    const lenis = (window as unknown as { __lenis?: LenisAPI }).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(targetY, {
        duration: 1.0,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
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
      data-direction={direction === 1 ? 'fwd' : 'rev'}
      data-mode={mode}
      style={{ ['--gf-step-count' as string]: stepCount }}
    >
      <div ref={runwayRef} className="hp2-gf__runway">
        <div className="hp2-gf__pin">
          <div className="hp2-wrap hp2-gf__inner">
            <div ref={stageRef} className="hp2-gf__stage">
              <div className="hp2-gf__head">
                <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
                <TitleTag {...title.props} className="hp2-h2">
                  {data.titleLead}{' '}
                  <TitleEmTag {...titleEm.props} className="hp2-gf__title-em">{renderEmHtml(data.titleEm)}</TitleEmTag>
                </TitleTag>
                {/* Editor-only binding for `intro`; not rendered in current layout. */}
                <IntroTag {...intro.props} hidden>{data.intro}</IntroTag>
              </div>

              {/* display-sized word labels — replace pills */}
              <div className="hp2-gf__tabs" role="tablist">
                {data.steps.map((s, i) => {
                  const isActive = i === safeIndex;
                  const tone = toneForIndex(i);
                  return (
                    <button
                      key={i}
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

              {/* stacked panels — every step always mounted so editor bindings stay live */}
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

                {/* timeline with eased scaleX fill driven by --gf-progress */}
                <div className="hp2-gf__bar" role="tablist">
                  <div ref={barFillRef} className="hp2-gf__bar-fill" aria-hidden />
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
          </div>
        </div>
      </div>

      <div className="hp2-wrap hp2-gf__cta">
        <a href={data.ctaHref} className="hp2-btn hp2-btn--primary hp2-btn--lg">
          <Icon name="arrow" size={18} />
          <CtaLabelTag {...ctaLabel.props}>{data.ctaLabel}</CtaLabelTag>
        </a>
      </div>
    </section>
  );
}
