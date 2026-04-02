'use client';

import { useEffect, useRef } from 'react';
import type { BrandAcronymItem } from '@/lib/homepage-content';

type BrandAcronymSvgProps = {
  items: BrandAcronymItem[];
};

export function BrandAcronymSvg({ items }: BrandAcronymSvgProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const revealStateRef = useRef<'idle' | 'revealing' | 'revealed'>('idle');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const revealDoneTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const PURPLE = '#7C3AED';
    const BLUE = '#0367a5';
    const FONT = 'Manrope';
    const NS = 'http://www.w3.org/2000/svg';

    const el = <K extends keyof SVGElementTagNameMap>(
      tag: K,
      attrs: Record<string, string | number>,
      parent?: SVGElement,
    ) => {
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
      (parent ?? svg).appendChild(node);
      return node;
    };

    const render = () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      svg.innerHTML = '';
      const parent = svg.parentElement;
      if (!parent) return;

      const totalW = Math.max(parent.clientWidth - 32, 820);
      const gap = 1.4;
      const wordGap = totalW * 0.0105;
      const slotW = (totalW - wordGap - gap * 13) / 14;
      const letterFs = Math.min(slotW * 1.28, 150);
      const nodeR = Math.max(letterFs * 0.06, 5);
      const labelFs = 13;
      const vPad = letterFs * 0.18;
      const labelH = labelFs * 7.0;
      const letterCy = labelH + slotW * 0.9 + letterFs * 0.55;
      const nodeTop = letterCy - letterFs * 0.38 - vPad - slotW * 0.9;
      const nodeBottom = letterCy + letterFs * 0.38 + vPad + slotW * 0.9;
      const totalH = nodeBottom + labelH + 8;

      svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);
      svg.setAttribute('width', String(totalW));
      svg.setAttribute('height', String(totalH));

      const xs: number[] = [];
      for (let i = 0; i < 14; i += 1) {
        xs.push((i + 0.5) * (slotW + gap) - gap / 2 + (i >= 7 ? wordGap : 0));
      }

      const dividerX = (xs[6] + xs[7]) / 2;
      el('line', {
        x1: dividerX,
        y1: letterCy - letterFs * 0.44,
        x2: dividerX,
        y2: letterCy + letterFs * 0.44,
        stroke: '#ccc',
        'stroke-width': 1.5,
        opacity: 0.5,
      });

      items.forEach((item, index) => {
        const isAlwaysActive = index === 0;
        const x = xs[index];
        const color = item.color === 'purple' ? PURPLE : BLUE;
        const up = item.dir === 'up';
        const delay = Number((0.05 + index * 0.09).toFixed(2));
        const nodeY = up ? nodeTop : nodeBottom;
        const letterStyle = revealStateRef.current === 'revealed'
          ? 'opacity:1;transform:translateY(0);transition:filter .2s ease;'
          : `opacity:0;transform:translateY(${up ? '6px' : '-6px'});transition:opacity .5s ease ${delay}s,transform .5s ease ${delay}s,filter .2s ease;`;

        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'bai-group');
        g.setAttribute('style', 'cursor:pointer;');
        svg.appendChild(g);

        const gEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
          const node = document.createElementNS(NS, tag);
          Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
          g.appendChild(node);
          return node;
        };

        gEl('rect', {
          x: x - slotW * 0.5,
          y: letterCy - letterFs * 0.55,
          width: slotW,
          height: letterFs,
          fill: 'transparent',
        });

        const letter = gEl('text', {
          x,
          y: letterCy + letterFs * 0.36,
          'text-anchor': 'middle',
          'font-family': FONT,
          'font-weight': 800,
          'font-size': letterFs,
          'letter-spacing': '-0.04em',
          fill: color,
          class: 'bai-letter',
          style: letterStyle,
        });
        letter.textContent = item.l;

        const y1 = letterCy + (up ? -(letterFs * 0.38 + vPad) : letterFs * 0.38 + vPad);
        const lineSize = Math.abs(nodeY - y1);

        const line = gEl('line', {
          x1: x,
          y1,
          x2: x,
          y2: nodeY,
          stroke: '#7EB63E',
          'stroke-width': 1.8,
          'stroke-linecap': 'round',
          class: 'bai-line',
          // Add a micro delay and a slightly longer draw so it does not pop instantly.
          style: isAlwaysActive
            ? `opacity:1;stroke-dasharray:${lineSize};stroke-dashoffset:0;transition:opacity .12s ease .15s,stroke-dashoffset .3s cubic-bezier(.16,1,.3,1) .15s;`
            : `opacity:0;stroke-dasharray:${lineSize};stroke-dashoffset:${lineSize};transition:opacity .12s ease .15s,stroke-dashoffset .3s cubic-bezier(.16,1,.3,1) .15s;`,
        });

        const ring = gEl('circle', {
          cx: x,
          cy: nodeY,
          r: nodeR * 2.2,
          fill: 'none',
          stroke: '#7EB63E',
          'stroke-width': 1.4,
          class: 'bai-node bai-ring',
          style: isAlwaysActive
            ? `opacity:1;transform:scale(1);transform-origin:${x}px ${nodeY}px;transition:opacity .12s ease .15s,transform .3s cubic-bezier(.34,1.56,.64,1) .15s;animation:bai-ring-pulse 1.6s ease-out infinite;`
            : `opacity:0;transform:scale(0);transform-origin:${x}px ${nodeY}px;transition:opacity .12s ease .15s,transform .3s cubic-bezier(.34,1.56,.64,1) .15s;`,
        });

        const dot = gEl('circle', {
          cx: x,
          cy: nodeY,
          r: nodeR,
          fill: '#7EB63E',
          class: 'bai-node bai-inner-dot',
          style: isAlwaysActive
            ? `opacity:1;transform:scale(1);transform-origin:${x}px ${nodeY}px;transition:opacity .12s ease .15s,transform .3s cubic-bezier(.34,1.56,.64,1) .15s;animation:bai-pulse 1.2s ease-in-out infinite;`
            : `opacity:0;transform:scale(0);transform-origin:${x}px ${nodeY}px;transition:opacity .12s ease .15s,transform .3s cubic-bezier(.34,1.56,.64,1) .15s;`,
        });

        const labelY = up ? nodeY - nodeR * 2.5 - 3 : nodeY + nodeR * 2.5 + 3;
        const baseline = up ? 'auto' : 'hanging';

        const label1 = gEl('text', {
          x,
          y: up ? labelY - labelFs * 1.3 : labelY,
          'text-anchor': 'middle',
          'dominant-baseline': baseline,
          'font-family': FONT,
          'font-weight': 600,
          'font-size': labelFs,
          fill: color,
          class: 'bai-label',
          style: isAlwaysActive
            ? 'opacity:1;transition:opacity .2s ease,transform .2s ease;transform:translateY(0);'
            : `opacity:0;transition:opacity .2s ease,transform .2s ease;transform:translateY(${up ? '-4px' : '4px'});`,
        });
        label1.textContent = item.t1;

        const label2 = gEl('text', {
          x,
          y: up ? labelY : labelY + labelFs * 1.3,
          'text-anchor': 'middle',
          'dominant-baseline': baseline,
          'font-family': FONT,
          'font-weight': 400,
          'font-size': labelFs - 1,
          fill: color,
          class: 'bai-label',
          style: isAlwaysActive
            ? 'opacity:1;transition:opacity .2s ease .04s,transform .2s ease .04s;transform:translateY(0);'
            : `opacity:0;transition:opacity .2s ease .04s,transform .2s ease .04s;transform:translateY(${up ? '-4px' : '4px'});`,
        });
        label2.textContent = item.t2;

        if (isAlwaysActive) {
          letter.style.filter = `drop-shadow(0 0 10px ${color})`;
        }

        let hoverTimer: ReturnType<typeof setTimeout> | null = null;

        g.addEventListener('mouseenter', () => {
          if (hoverTimer) clearTimeout(hoverTimer);
          letter.style.filter = `drop-shadow(0 0 10px ${color})`;
          hoverTimer = setTimeout(() => {
            line.style.opacity = '1';
            line.style.strokeDashoffset = '0';
            ring.style.opacity = '1';
            ring.style.transform = 'scale(1)';
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1)';
            [label1, label2].forEach((label) => {
              label.style.opacity = '1';
              label.style.transform = 'translateY(0)';
            });
          }, 150);
        });

        g.addEventListener('mouseleave', () => {
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
          }
          if (isAlwaysActive) {
            letter.style.filter = `drop-shadow(0 0 10px ${color})`;
            line.style.opacity = '1';
            line.style.strokeDashoffset = '0';
            ring.style.opacity = '1';
            ring.style.transform = 'scale(1)';
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1)';
            [label1, label2].forEach((label) => {
              label.style.opacity = '1';
              label.style.transform = 'translateY(0)';
            });
            return;
          }

          letter.style.filter = '';
          line.style.opacity = '0';
          line.style.strokeDashoffset = String(lineSize);
          ring.style.opacity = '0';
          ring.style.transform = 'scale(0)';
          dot.style.opacity = '0';
          dot.style.transform = 'scale(0)';
          [label1, label2].forEach((label) => {
            label.style.opacity = '0';
            label.style.transform = `translateY(${up ? '-4px' : '4px'})`;
          });
        });
      });

      if (revealStateRef.current === 'revealed') return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          observer.disconnect();
          observerRef.current = null;
          if (revealStateRef.current === 'revealed') return;
          revealStateRef.current = 'revealing';
          window.requestAnimationFrame(() => {
            svg.querySelectorAll<SVGElement>('.bai-letter').forEach((node) => {
              node.style.opacity = '1';
              node.style.transform = 'translateY(0)';
            });
          });

          // Mark as fully revealed only after the longest stagger + duration finishes.
          if (revealDoneTimerRef.current) window.clearTimeout(revealDoneTimerRef.current);
          revealDoneTimerRef.current = window.setTimeout(() => {
            revealStateRef.current = 'revealed';
            revealDoneTimerRef.current = null;
          }, 1800);
        },
        { threshold: 0.2 },
      );

      observerRef.current = observer;
      observer.observe(svg);
    };

    render();

    let resizeTimeout: number;
    const handleResize = () => {
      if (revealStateRef.current === 'revealing') return;
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(render, 160);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimeout);
      if (revealDoneTimerRef.current) {
        window.clearTimeout(revealDoneTimerRef.current);
        revealDoneTimerRef.current = null;
      }
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [items]);

  return <svg id="bai-svg" ref={svgRef} />;
}
