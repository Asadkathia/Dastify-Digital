'use client';

import { useState, useRef, useEffect } from 'react';
import type { BrandAcronymItem } from '@/lib/homepage-content';

type Props = { items: BrandAcronymItem[] };

// ─── Canvas ───────────────────────────────────────────────────────────────────
const VW   = 900;
const VH   = 560;
const CX   = VW / 2;   // 450  — horizontal centre
const CY   = VH / 2;   // 280  — hub y

// ─── Node rows ────────────────────────────────────────────────────────────────
// Top row: nodes spread across the width, gentle concave-down arc
// Centre node is highest; outer nodes sit slightly lower.
const N         = 7;
const PAD_X     = 52;
const NODE_R    = 42;
const STEM_LEN  = 36;

const TOP_Y_MID  = 52;    // y of the centre (highest) top node
const TOP_Y_EDGE = 82;    // y of the outer (lowest) top nodes — sag = 30px

const BOT_Y_MID  = VH - 52;   // 508
const BOT_Y_EDGE = VH - 82;   // 478

// ─── Hub ─────────────────────────────────────────────────────────────────────
const HUB_R = 58;

// ─── Colours ─────────────────────────────────────────────────────────────────
const PURPLE = '#7C3AED';
const PINK   = '#D946EF';
const BLUE   = '#0369A1';
const CYAN   = '#06B6D4';

function nodeColor(item: BrandAcronymItem): string {
  return item.color === 'purple' ? PURPLE : BLUE;
}

// ─── Geometry ────────────────────────────────────────────────────────────────
function nodeX(i: number): number {
  return PAD_X + (i / (N - 1)) * (VW - PAD_X * 2);
}

// Parabola: centre = mid y, edges = edge y
function topArcY(t: number): number {
  return TOP_Y_MID + (TOP_Y_EDGE - TOP_Y_MID) * Math.pow(2 * t - 1, 2);
}
function botArcY(t: number): number {
  return BOT_Y_MID - (BOT_Y_MID - BOT_Y_EDGE) * Math.pow(2 * t - 1, 2);
}

// ─── Row connector path (gentle arc through all nodes) ───────────────────────
function topRowPath(): string {
  const x0 = nodeX(0);   const y0 = topArcY(0);
  const x6 = nodeX(N - 1); const y6 = topArcY(1);
  // Control point: sit above the centre node so the arc bows downward (∩)
  const ctrlY = TOP_Y_MID + 6;
  return `M ${x0} ${y0} Q ${CX} ${ctrlY} ${x6} ${y6}`;
}
function botRowPath(): string {
  const x0 = nodeX(0);   const y0 = botArcY(0);
  const x6 = nodeX(N - 1); const y6 = botArcY(1);
  const ctrlY = BOT_Y_MID - 6;
  return `M ${x0} ${y0} Q ${CX} ${ctrlY} ${x6} ${y6}`;
}

// ─── Hourglass shape paths ────────────────────────────────────────────────────
// The hourglass is made of FOUR filled + stroked bezier shapes:
//   Top-left wing:  from top-left edge node  → hub left tangent
//   Top-right wing: from top-right edge node → hub right tangent
//   Bot-left wing:  hub left tangent → bot-left edge node
//   Bot-right wing: hub right tangent → bot-right edge node
//
// Each wing is a CLOSED shape (filled) with two bezier edges:
//   - Outer edge: sweeps wide outward
//   - Inner edge: stays closer to centre axis
// This creates the volumetric glass tube look.

const HUB_TANG   = 28;   // half-width of hub tangent (where paths meet hub)
const WING_BULGE = 70;   // how far the outer edge bows outward from the axis
// Scaled offsets (were 60/20/90/180 at VH=920, now VH=560 → ×0.61)
const V_FAR  = 36;   // vertical offset for outer control point near hub (was 60)
const V_NEAR = 12;   // vertical offset for inner control point near hub (was 20)
const H_FAR  = 110;  // horizontal pull for inner return curve (was 180)
const H_NEAR = 55;   // horizontal pull for inner tighter curve (was 90)

// Top-left wing (closed filled shape)
function topLeftWing(): string {
  const sx  = nodeX(0);        const sy  = topArcY(0);
  const ex  = CX - HUB_TANG;  const ey  = CY;
  const o1x = sx - WING_BULGE + 20; const o1y = sy + (CY - sy) * 0.35;
  const o2x = CX - H_FAR;          const o2y = CY - V_FAR;
  const i1x = CX - H_NEAR;         const i1y = CY - V_NEAR;
  const i2x = sx + 40;             const i2y = sy + (CY - sy) * 0.5;
  return [
    `M ${sx} ${sy}`,
    `C ${o1x} ${o1y}, ${o2x} ${o2y}, ${ex} ${ey}`,
    `C ${i1x} ${i1y}, ${i2x} ${i2y}, ${sx} ${sy}`,
    'Z',
  ].join(' ');
}

// Top-right wing
function topRightWing(): string {
  const sx  = nodeX(N - 1);    const sy  = topArcY(1);
  const ex  = CX + HUB_TANG;  const ey  = CY;
  const o1x = sx + WING_BULGE - 20; const o1y = sy + (CY - sy) * 0.35;
  const o2x = CX + H_FAR;          const o2y = CY - V_FAR;
  const i1x = CX + H_NEAR;         const i1y = CY - V_NEAR;
  const i2x = sx - 40;             const i2y = sy + (CY - sy) * 0.5;
  return [
    `M ${sx} ${sy}`,
    `C ${o1x} ${o1y}, ${o2x} ${o2y}, ${ex} ${ey}`,
    `C ${i1x} ${i1y}, ${i2x} ${i2y}, ${sx} ${sy}`,
    'Z',
  ].join(' ');
}

// Bottom-left wing
function botLeftWing(): string {
  const sx  = nodeX(0);        const sy  = botArcY(0);
  const ex  = CX - HUB_TANG;  const ey  = CY;
  const o1x = sx - WING_BULGE + 20; const o1y = sy - (sy - CY) * 0.35;
  const o2x = CX - H_FAR;          const o2y = CY + V_FAR;
  const i1x = CX - H_NEAR;         const i1y = CY + V_NEAR;
  const i2x = sx + 40;             const i2y = sy - (sy - CY) * 0.5;
  return [
    `M ${sx} ${sy}`,
    `C ${o1x} ${o1y}, ${o2x} ${o2y}, ${ex} ${ey}`,
    `C ${i1x} ${i1y}, ${i2x} ${i2y}, ${sx} ${sy}`,
    'Z',
  ].join(' ');
}

// Bottom-right wing
function botRightWing(): string {
  const sx  = nodeX(N - 1);    const sy  = botArcY(1);
  const ex  = CX + HUB_TANG;  const ey  = CY;
  const o1x = sx + WING_BULGE - 20; const o1y = sy - (sy - CY) * 0.35;
  const o2x = CX + H_FAR;          const o2y = CY + V_FAR;
  const i1x = CX + H_NEAR;         const i1y = CY + V_NEAR;
  const i2x = sx - 40;             const i2y = sy - (sy - CY) * 0.5;
  return [
    `M ${sx} ${sy}`,
    `C ${o1x} ${o1y}, ${o2x} ${o2y}, ${ex} ${ey}`,
    `C ${i1x} ${i1y}, ${i2x} ${i2y}, ${sx} ${sy}`,
    'Z',
  ].join(' ');
}

// Outer stroke edge only (first bezier leg)
function topLeftStroke(): string {
  const sx = nodeX(0);         const sy = topArcY(0);
  const ex = CX - HUB_TANG;   const ey = CY;
  const c1x = sx - WING_BULGE + 20; const c1y = sy + (CY - sy) * 0.35;
  const c2x = CX - H_FAR;          const c2y = CY - V_FAR;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}
function topRightStroke(): string {
  const sx = nodeX(N - 1);    const sy = topArcY(1);
  const ex = CX + HUB_TANG;  const ey = CY;
  const c1x = sx + WING_BULGE - 20; const c1y = sy + (CY - sy) * 0.35;
  const c2x = CX + H_FAR;          const c2y = CY - V_FAR;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}
function botLeftStroke(): string {
  const sx = nodeX(0);        const sy = botArcY(0);
  const ex = CX - HUB_TANG;  const ey = CY;
  const c1x = sx - WING_BULGE + 20; const c1y = sy - (sy - CY) * 0.35;
  const c2x = CX - H_FAR;          const c2y = CY + V_FAR;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}
function botRightStroke(): string {
  const sx = nodeX(N - 1);    const sy = botArcY(1);
  const ex = CX + HUB_TANG;  const ey = CY;
  const c1x = sx + WING_BULGE - 20; const c1y = sy - (sy - CY) * 0.35;
  const c2x = CX + H_FAR;          const c2y = CY + V_FAR;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BrandAcronymSvg({ items }: Props) {
  const [hovered, setHovered]   = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const topItems = items.filter(it => it.word === 'DASTIFY');
  const botItems = items.filter(it => it.word === 'DIGITAL');

  const topNodes = topItems.map((item, i) => ({
    item, nx: nodeX(i), ny: topArcY(i / (N - 1)), isTop: true, idx: i,
  }));
  const botNodes = botItems.map((item, i) => ({
    item, nx: nodeX(i), ny: botArcY(i / (N - 1)), isTop: false, idx: N + i,
  }));
  const allNodes = [...topNodes, ...botNodes];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      className="bai2-svg"
      aria-label="DASTIFY DIGITAL brand acronym infographic"
      role="img"
    >
      <defs>
        {/* Hourglass top wing fills — purple/pink */}
        <linearGradient id="hg-top-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PURPLE}  stopOpacity="0.18" />
          <stop offset="100%" stopColor={PINK}  stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hg-top-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={PURPLE}  stopOpacity="0.18" />
          <stop offset="100%" stopColor={PINK}  stopOpacity="0.12" />
        </linearGradient>

        {/* Hourglass bottom wing fills — blue/cyan */}
        <linearGradient id="hg-bot-l" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BLUE}   stopOpacity="0.18" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hg-bot-r" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={BLUE}   stopOpacity="0.18" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0.12" />
        </linearGradient>

        {/* Stroke edge gradients (bright outer lines) */}
        <linearGradient id="hg-sk-tl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PURPLE} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
        <linearGradient id="hg-sk-tr" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={PURPLE} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
        <linearGradient id="hg-sk-bl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BLUE}  />
          <stop offset="100%" stopColor={CYAN} />
        </linearGradient>
        <linearGradient id="hg-sk-br" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={BLUE}  />
          <stop offset="100%" stopColor={CYAN} />
        </linearGradient>

        {/* Row connector gradients */}
        <linearGradient id="hg-row-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={PURPLE} />
          <stop offset="50%"  stopColor={PINK}   />
          <stop offset="100%" stopColor={PURPLE} />
        </linearGradient>
        <linearGradient id="hg-row-bot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={BLUE} />
          <stop offset="50%"  stopColor={CYAN} />
          <stop offset="100%" stopColor={BLUE} />
        </linearGradient>

        {/* Hub */}
        <radialGradient id="hg-hub" cx="38%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#A78BFA" />
          <stop offset="45%"  stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </radialGradient>

        {/* Filters */}
        <filter id="hg-hub-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hg-wing-glow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hg-node-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="rgba(100,50,200,0.15)" />
        </filter>
        <filter id="hg-node-hover" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ══════════════════════════════════════════════════════════
          HOURGLASS WINGS — filled shapes (behind everything)
      ══════════════════════════════════════════════════════════ */}

      {/* Top-left wing fill */}
      <path
        d={topLeftWing()}
        fill="url(#hg-top-l)"
        opacity={revealed ? 1 : 0}
        style={{ transition: 'opacity .8s ease .1s' }}
      />
      {/* Top-right wing fill */}
      <path
        d={topRightWing()}
        fill="url(#hg-top-r)"
        opacity={revealed ? 1 : 0}
        style={{ transition: 'opacity .8s ease .1s' }}
      />
      {/* Bottom-left wing fill */}
      <path
        d={botLeftWing()}
        fill="url(#hg-bot-l)"
        opacity={revealed ? 1 : 0}
        style={{ transition: 'opacity .8s ease .15s' }}
      />
      {/* Bottom-right wing fill */}
      <path
        d={botRightWing()}
        fill="url(#hg-bot-r)"
        opacity={revealed ? 1 : 0}
        style={{ transition: 'opacity .8s ease .15s' }}
      />

      {/* ── Outer stroke edges (bright gradient lines) ── */}
      <path
        d={topLeftStroke()}
        fill="none"
        stroke="url(#hg-sk-tl)"
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#hg-wing-glow)"
        opacity={revealed ? 0.9 : 0}
        style={{ transition: 'opacity .7s ease .2s' }}
      />
      <path
        d={topRightStroke()}
        fill="none"
        stroke="url(#hg-sk-tr)"
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#hg-wing-glow)"
        opacity={revealed ? 0.9 : 0}
        style={{ transition: 'opacity .7s ease .2s' }}
      />
      <path
        d={botLeftStroke()}
        fill="none"
        stroke="url(#hg-sk-bl)"
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#hg-wing-glow)"
        opacity={revealed ? 0.9 : 0}
        style={{ transition: 'opacity .7s ease .25s' }}
      />
      <path
        d={botRightStroke()}
        fill="none"
        stroke="url(#hg-sk-br)"
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#hg-wing-glow)"
        opacity={revealed ? 0.9 : 0}
        style={{ transition: 'opacity .7s ease .25s' }}
      />

      {/* ══════════════════════════════════════════════════════════
          ROW CONNECTOR LINES (through the nodes)
      ══════════════════════════════════════════════════════════ */}
      <path
        d={topRowPath()}
        fill="none"
        stroke="url(#hg-row-top)"
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={revealed ? 0.75 : 0}
        style={{ transition: 'opacity .6s ease .3s' }}
      />
      <path
        d={botRowPath()}
        fill="none"
        stroke="url(#hg-row-bot)"
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={revealed ? 0.75 : 0}
        style={{ transition: 'opacity .6s ease .35s' }}
      />

      {/* ══════════════════════════════════════════════════════════
          WORD LABELS
      ══════════════════════════════════════════════════════════ */}
      <text
        x={CX} y={TOP_Y_MID - NODE_R - 24}
        textAnchor="middle" dominantBaseline="auto"
        fontFamily="Manrope, sans-serif"
        fontWeight={700} fontSize={13} letterSpacing="0.24em"
        fill={PURPLE}
        opacity={revealed ? 0.6 : 0}
        style={{ transition: 'opacity .5s ease .6s', userSelect: 'none' }}
      >
        DASTIFY
      </text>
      <text
        x={CX} y={BOT_Y_MID + NODE_R + 30}
        textAnchor="middle" dominantBaseline="hanging"
        fontFamily="Manrope, sans-serif"
        fontWeight={700} fontSize={13} letterSpacing="0.24em"
        fill={BLUE}
        opacity={revealed ? 0.6 : 0}
        style={{ transition: 'opacity .5s ease .65s', userSelect: 'none' }}
      >
        DIGITAL
      </text>

      {/* ══════════════════════════════════════════════════════════
          NODES
      ══════════════════════════════════════════════════════════ */}
      {allNodes.map(({ item, nx, ny, isTop, idx }) => {
        const isHovered   = hovered === idx;
        const color       = nodeColor(item);
        const revealDelay = `${0.1 + idx * 0.055}s`;

        // Stems point toward the hub: downward for top row, upward for bottom
        const stemYStart = isTop ? ny + NODE_R            : ny - NODE_R;
        const stemYEnd   = isTop ? ny + NODE_R + STEM_LEN : ny - NODE_R - STEM_LEN;
        const dotY       = stemYEnd;
        const labelY     = isTop ? stemYEnd + 6 : stemYEnd - 6;
        const domBase    = isTop ? 'hanging' : 'auto';

        return (
          <g
            key={idx}
            className="bai2-node-group"
            tabIndex={0}
            role="button"
            aria-label={`${item.l} — ${item.t1} ${item.t2}`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(idx)}
            onBlur={() => setHovered(null)}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {/* Outer accent ring — always visible */}
            <circle
              cx={nx} cy={ny} r={NODE_R + 8}
              fill="none" stroke={color} strokeWidth={1}
              opacity={revealed ? (isHovered ? 0.5 : 0.28) : 0}
              style={{ transition: 'opacity .3s ease' }}
            />

            {/* Main circle — always at active scale */}
            <circle
              cx={nx} cy={ny} r={NODE_R}
              fill="white"
              stroke={color}
              strokeWidth={isHovered ? 2.5 : 2}
              filter={isHovered ? 'url(#hg-node-hover)' : 'url(#hg-node-shadow)'}
              style={{
                transform: `scale(${revealed ? (isHovered ? 1.1 : 1) : 0})`,
                transformOrigin: `${nx}px ${ny}px`,
                transition: revealed
                  ? `transform .38s cubic-bezier(.34,1.56,.64,1) ${isHovered ? '0s' : revealDelay}, stroke-width .15s ease`
                  : `transform .38s cubic-bezier(.34,1.56,.64,1) ${revealDelay}`,
              }}
            />

            {/* Letter */}
            <text
              x={nx} y={ny}
              textAnchor="middle" dominantBaseline="central"
              fontFamily="Manrope, sans-serif"
              fontWeight={800} fontSize={24} letterSpacing="-0.02em"
              fill={color}
              style={{
                opacity: revealed ? 1 : 0,
                transition: `opacity .3s ease ${revealDelay}`,
                userSelect: 'none', pointerEvents: 'none',
              }}
            >
              {item.l}
            </text>

            {/* Stem — always visible */}
            <line
              x1={nx} y1={stemYStart}
              x2={nx} y2={stemYEnd}
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{
                opacity: revealed ? (isHovered ? 0.8 : 0.5) : 0,
                transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: `${nx}px ${stemYStart}px`,
                transition: `opacity .2s ease, transform .3s cubic-bezier(.16,1,.3,1) ${revealDelay}`,
              }}
            />

            {/* Dot — always visible */}
            <circle
              cx={nx} cy={dotY} r={3.5}
              fill={color}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'scale(1)' : 'scale(0)',
                transformOrigin: `${nx}px ${dotY}px`,
                transition: `opacity .2s ease .06s, transform .28s cubic-bezier(.34,1.56,.64,1) calc(${revealDelay} + .06s)`,
              }}
            />

            {/* Label t1 — always visible */}
            <text
              x={nx} y={labelY}
              textAnchor="middle" dominantBaseline={domBase}
              fontFamily="Manrope, sans-serif"
              fontWeight={700} fontSize={14}
              fill={color}
              style={{
                opacity: revealed ? (isHovered ? 1 : 0.85) : 0,
                transform: 'translateY(0)',
                transition: `opacity .2s ease, transform .25s cubic-bezier(.16,1,.3,1) calc(${revealDelay} + .05s)`,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              {item.t1}
            </text>

            {/* Label t2 — always visible */}
            <text
              x={nx}
              y={isTop ? labelY + 18 : labelY - 18}
              textAnchor="middle" dominantBaseline={domBase}
              fontFamily="Manrope, sans-serif"
              fontWeight={400} fontSize={13}
              fill={color}
              style={{
                opacity: revealed ? (isHovered ? 0.8 : 0.6) : 0,
                transform: 'translateY(0)',
                transition: `opacity .2s ease, transform .25s cubic-bezier(.16,1,.3,1) calc(${revealDelay} + .09s)`,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              {item.t2}
            </text>
          </g>
        );
      })}

      {/* ══════════════════════════════════════════════════════════
          HUB — rendered last (on top of everything)
      ══════════════════════════════════════════════════════════ */}

      {/* Outermost halo ring */}
      <circle
        cx={CX} cy={CY} r={HUB_R + 30}
        fill="none" stroke="url(#hg-hub)" strokeWidth={1}
        opacity={revealed ? 0.2 : 0}
        style={{ transition: 'opacity .7s ease .4s' }}
      />
      {/* Mid ring */}
      <circle
        cx={CX} cy={CY} r={HUB_R + 14}
        fill="none" stroke="url(#hg-hub)" strokeWidth={1.5}
        opacity={revealed ? 0.32 : 0}
        style={{ transition: 'opacity .7s ease .38s' }}
      />
      {/* Hub body */}
      <circle
        cx={CX} cy={CY} r={HUB_R}
        fill="url(#hg-hub)"
        filter="url(#hg-hub-glow)"
        style={{
          transform: `scale(${revealed ? 1 : 0})`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: 'transform .55s cubic-bezier(.34,1.56,.64,1) .3s',
        }}
      />
      {/* Hub inner highlight ring */}
      <circle
        cx={CX} cy={CY} r={HUB_R - 10}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1.5}
        style={{
          transform: `scale(${revealed ? 1 : 0})`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: 'transform .55s cubic-bezier(.34,1.56,.64,1) .34s',
        }}
      />
      {/* Hub label: DASTIFY */}
      <text
        x={CX} y={CY - 9}
        textAnchor="middle" dominantBaseline="auto"
        fontFamily="Manrope, sans-serif"
        fontWeight={800} fontSize={15} letterSpacing="0.06em"
        fill="white"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity .4s ease .55s', userSelect: 'none' }}
      >
        DASTIFY
      </text>
      {/* Hub label: DIGITAL */}
      <text
        x={CX} y={CY + 11}
        textAnchor="middle" dominantBaseline="hanging"
        fontFamily="Manrope, sans-serif"
        fontWeight={300} fontSize={10.5} letterSpacing="0.18em"
        fill="rgba(255,255,255,0.8)"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity .4s ease .58s', userSelect: 'none' }}
      >
        DIGITAL
      </text>
    </svg>
  );
}
