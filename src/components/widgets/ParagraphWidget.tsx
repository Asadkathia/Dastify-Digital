import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

export function ParagraphWidget({ widget }: Props) {
  const { text = '' } = widget.data as { text?: string };
  return (
    <p style={{ margin: 0, ...applyWidgetStyles(widget.styles) }}>
      {text}
    </p>
  );
}
