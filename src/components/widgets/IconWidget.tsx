import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

const SIZE_PX: Record<string, string> = {
  sm: '24px',
  md: '40px',
  lg: '64px',
  xl: '96px',
};

export function IconWidget({ widget }: Props) {
  const { emoji = '⭐', size = 'md', align = 'left' } = widget.data as {
    emoji?: string; size?: string; align?: string;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        ...applyWidgetStyles(widget.styles),
      }}
    >
      <span
        style={{
          fontSize: SIZE_PX[size] ?? SIZE_PX.md,
          lineHeight: 1,
          display: 'block',
        }}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    </div>
  );
}
