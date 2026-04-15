import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

const VARIANT_BASE: Record<string, React.CSSProperties> = {
  solid:   { background: '#2563eb', color: '#fff',    border: 'none' },
  outline: { background: 'transparent', color: '#2563eb', border: '2px solid #2563eb' },
  ghost:   { background: 'transparent', color: '#2563eb', border: 'none' },
};

export function ButtonWidget({ widget }: Props) {
  const { label = 'Click Here', variant = 'solid' } = widget.data as {
    label?: string;
    variant?: string;
    link?: unknown;
  };

  const styleOverrides = applyWidgetStyles(widget.styles);
  const variantStyle = VARIANT_BASE[variant] ?? VARIANT_BASE.solid;

  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px',
        borderRadius: '6px',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        ...variantStyle,
        // Style overrides win over variant defaults
        ...styleOverrides,
      }}
    >
      {label}
    </button>
  );
}
