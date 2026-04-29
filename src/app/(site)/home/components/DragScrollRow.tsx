'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function DragScrollRow({
  className,
  role,
  children,
}: {
  className?: string;
  role?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={ref} className={className} role={role}>
      {children}
    </div>
  );
}
