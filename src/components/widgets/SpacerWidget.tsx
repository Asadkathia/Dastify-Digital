import type { WidgetInstance } from '@/payload/views/PageEditor/types';

type Props = { widget: WidgetInstance };

export function SpacerWidget({ widget }: Props) {
  const { height = '32' } = widget.data as { height?: string };
  const h = parseInt(height, 10) || 32;
  return <div style={{ height: `${h}px`, flexShrink: 0 }} aria-hidden="true" />;
}
