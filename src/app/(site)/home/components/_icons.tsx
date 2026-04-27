import type { SVGProps } from 'react';

type IconName =
  | 'search'
  | 'bolt'
  | 'users'
  | 'spark'
  | 'shield'
  | 'chart'
  | 'heart'
  | 'stethoscope'
  | 'pulse'
  | 'calendar'
  | 'play'
  | 'arrow'
  | 'check'
  | 'phone';

const PATHS: Record<IconName, string> = {
  search: 'M10 2a8 8 0 105.3 14.02l4.84 4.84 1.42-1.42-4.84-4.84A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z',
  bolt: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  users: 'M8 8a3 3 0 100-6 3 3 0 000 6zm8 0a3 3 0 100-6 3 3 0 000 6zM2 20v-1a5 5 0 015-5h2a5 5 0 015 5v1H2zm12 0v-1a5 5 0 015-5h.5a2.5 2.5 0 012.5 2.5V20h-8z',
  spark: 'M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z',
  shield: 'M12 2l8 4v6c0 5-3.4 9.3-8 10-4.6-.7-8-5-8-10V6l8-4z',
  chart: 'M3 20V4h2v16h16v2H3zm4-4l4-6 4 3 5-8 2 1.4-6 9.5-4-3-3 4.5-2-1z',
  heart: 'M12 21s-7-4.35-7-10.5A4.5 4.5 0 019.5 6c1.6 0 2.6.9 2.5 2.1C12 6.9 13 6 14.5 6A4.5 4.5 0 0119 10.5C19 16.65 12 21 12 21z',
  stethoscope: 'M6 3v7a4 4 0 008 0V3M10 13v3a5 5 0 0010 0v-2M18 9a2 2 0 110 4 2 2 0 010-4z',
  pulse: 'M2 12h4l2-8 4 16 2-8h8',
  calendar: 'M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  play: 'M8 5v14l11-7z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 12l5 5L20 7',
  phone: 'M3 5a2 2 0 012-2h2l2 5-2 1a12 12 0 006 6l1-2 5 2v2a2 2 0 01-2 2A16 16 0 013 5z',
};

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const d = PATHS[name];
  const isStroked = name === 'pulse' || name === 'stethoscope' || name === 'arrow' || name === 'check' || name === 'calendar';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isStroked ? 'none' : 'currentColor'}
      stroke={isStroked ? 'currentColor' : 'none'}
      strokeWidth={isStroked ? 2 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

export type { IconName };
