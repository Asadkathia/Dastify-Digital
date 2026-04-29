'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export default function DragScrollRow({
  className,
  role,
  children,
  showArrows = false,
}: {
  className?: string;
  role?: string;
  children: ReactNode;
  showArrows?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let pointerId = -1;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // Let touch/pen use native momentum scrolling.
      if (e.pointerType !== 'mouse') return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      pointerId = e.pointerId;
      el.classList.add('is-dragging');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        try { el.setPointerCapture(pointerId); } catch {}
      }
      if (moved) {
        e.preventDefault();
        el.scrollLeft = startLeft - dx;
      }
    };

    const stop = () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove('is-dragging');
      try { el.releasePointerCapture(pointerId); } catch {}
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('pointerleave', stop);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', stop);
      el.removeEventListener('pointercancel', stop);
      el.removeEventListener('pointerleave', stop);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  useEffect(() => {
    if (!showArrows) return;
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [showArrows, updateArrows]);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const second = firstCard?.nextElementSibling as HTMLElement | null;
    let step = el.clientWidth * 0.8;
    if (firstCard) {
      const gap = second ? second.offsetLeft - (firstCard.offsetLeft + firstCard.offsetWidth) : 0;
      step = firstCard.offsetWidth + Math.max(0, gap);
    }
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
    // Re-check arrow state after the scroll settles.
    window.setTimeout(updateArrows, 350);
  }, [updateArrows]);

  const track = (
    <div ref={ref} className={className} role={role}>
      {children}
    </div>
  );

  if (!showArrows) return track;

  return (
    <div className="hp2-disc__nav-wrap">
      <button
        type="button"
        className="hp2-disc__nav-btn hp2-disc__nav-btn--prev"
        aria-label="Previous"
        aria-disabled={!canPrev}
        disabled={!canPrev}
        onClick={() => scrollByCard(-1)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {track}
      <button
        type="button"
        className="hp2-disc__nav-btn hp2-disc__nav-btn--next"
        aria-label="Next"
        aria-disabled={!canNext}
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
