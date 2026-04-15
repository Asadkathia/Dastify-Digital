import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

export function DividerWidget({ widget }: Props) {
  const styles = widget.styles ?? {};
  const styleOverrides = applyWidgetStyles(widget.styles, ['marginTop', 'marginBottom']);
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${styles.borderWidth ?? 1}px solid ${styles.borderColor ?? '#e2e8f0'}`,
        marginTop: '8px',
        marginBottom: '8px',
        ...styleOverrides,
      }}
    />
  );
}
