import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

const COLOR_MAP: Record<string, { bg: string; color: string; border: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#1d4ed8', border: 'rgba(59,130,246,0.3)'  },
  purple: { bg: 'rgba(124,58,237,0.12)',  color: '#6d28d9', border: 'rgba(124,58,237,0.3)'  },
  green:  { bg: 'rgba(34,197,94,0.12)',   color: '#15803d', border: 'rgba(34,197,94,0.3)'   },
  orange: { bg: 'rgba(249,115,22,0.12)',  color: '#c2410c', border: 'rgba(249,115,22,0.3)'  },
  red:    { bg: 'rgba(239,68,68,0.12)',   color: '#b91c1c', border: 'rgba(239,68,68,0.3)'   },
  gray:   { bg: 'rgba(100,116,139,0.12)', color: '#475569', border: 'rgba(100,116,139,0.3)' },
};

const SIZE_MAP: Record<string, React.CSSProperties> = {
  sm: { fontSize: '10px', padding: '2px 8px'  },
  md: { fontSize: '11px', padding: '4px 12px' },
  lg: { fontSize: '13px', padding: '6px 16px' },
};

export function BadgeWidget({ widget }: Props) {
  const { text = 'Badge', color = 'blue', size = 'md' } = widget.data as {
    text?: string; color?: string; size?: string;
  };

  const palette = COLOR_MAP[color] ?? COLOR_MAP.blue;
  const sizeStyle = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        color: palette.color,
        ...sizeStyle,
        ...applyWidgetStyles(widget.styles),
      }}
    >
      {text}
    </span>
  );
}
