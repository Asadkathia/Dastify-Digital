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
  | 'phone'
  | 'mail'
  | 'tooth'
  | 'scan-face'
  | 'flower-2'
  | 'heart-pulse'
  | 'scissors'
  | 'video'
  | 'bone'
  | 'brain';

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
  mail: 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2l8 6 8-6',
  // source: hand-authored — two-cusp tooth outline with a center notch, narrowing to a single root
  tooth: 'M8 3c-2.2 0-4 1.8-4 4 0 2 .7 3 1.3 4.3.5 1 .7 2 1 3.4.4 2 .9 4.8 1.7 6.3.4.7 1.3.7 1.7 0 .7-1.4 1.1-3.4 1.3-5 .1-.9.9-.9 1 0 .2 1.6.6 3.6 1.3 5 .4.7 1.3.7 1.7 0 .8-1.5 1.3-4.3 1.7-6.3.3-1.4.5-2.4 1-3.4C19.3 10 20 9 20 7c0-2.2-1.8-4-4-4-1.6 0-2.4.6-3.2 1.1-.5.3-1.1.3-1.6 0C10.4 3.6 9.6 3 8 3z',
  // source: lucide v0.x — scan-face (adapted)
  'scan-face': 'M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M9 9h.01M15 9h.01M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5',
  // source: hand-authored — 5-petal flower with circle center
  'flower-2': 'M12 4a2.5 2.5 0 00-2.4 3.2 2.5 2.5 0 00-2.9 3.6 2.5 2.5 0 000 4.4 2.5 2.5 0 002.9 3.6A2.5 2.5 0 0012 21a2.5 2.5 0 002.4-2.2 2.5 2.5 0 002.9-3.6 2.5 2.5 0 000-4.4 2.5 2.5 0 00-2.9-3.6A2.5 2.5 0 0012 4zM12 10.5a2 2 0 100 4 2 2 0 000-4z',
  // source: lucide v0.x — heart-pulse (adapted)
  'heart-pulse': 'M19 14c1.5-1.7 3-3.7 3-6.5A4.5 4.5 0 0017.5 3C16 3 14.5 3.6 12 6 9.5 3.6 8 3 6.5 3A4.5 4.5 0 002 7.5c0 1 .2 1.9.6 2.7M2 12h4l2-3 4 6 2-3h8',
  // source: lucide v0.x — scissors (adapted): two circular handles on left, blades meeting at right
  scissors: 'M6 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 19.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.1 8.6L20 20M8.1 15.4L20 4',
  // source: lucide v0.x — video (adapted): rectangular body left, triangular lens flange right
  video: 'M16 8.5V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1.5l6 3.5v-11l-6 3.5z',
  // source: lucide v0.x — bone (adapted): shaft with rounded knobs at each end
  bone: 'M17 10c.7-.3 1-.9 1-1.6V8a3 3 0 00-6 0c0 .7-.5 1-1 1H9c-.5 0-1-.3-1-1a3 3 0 00-6 0v.4c0 .7.3 1.3 1 1.6.7.3 1 .9 1 1.6v.8c0 .7-.3 1.3-1 1.6-.7.3-1 .9-1 1.6V16a3 3 0 006 0c0-.7.5-1 1-1h2c.5 0 1 .3 1 1a3 3 0 006 0v-.4c0-.7-.3-1.3-1-1.6-.7-.3-1-.9-1-1.6v-.8c0-.7.3-1.3 1-1.6z',
  // source: lucide v0.x — brain (adapted): two hemispheres with center division and cortical curves
  brain: 'M12 5a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 003 3 3 3 0 003-3V5zM12 5a3 3 0 013-3 3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3 3 3 0 01-3-3M9 8h0M15 8h0M9 16h0M15 16h0',
};

const STROKED_NAMES = new Set<IconName>([
  'pulse',
  'stethoscope',
  'arrow',
  'check',
  'calendar',
  'mail',
  'tooth',
  'scan-face',
  'flower-2',
  'heart-pulse',
  'scissors',
  'video',
  'bone',
  'brain',
]);

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const d = PATHS[name];
  const isStroked = STROKED_NAMES.has(name);
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
      aria-hidden={true}
      focusable={false}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

export type { IconName };
