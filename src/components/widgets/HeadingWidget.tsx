import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type HeadingData = { text?: string; level?: 'h1' | 'h2' | 'h3' | 'h4' };
type Props = { widget: WidgetInstance };

const TAG_MAP = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' } as const;

export function HeadingWidget({ widget }: Props) {
  const { text = 'Heading', level = 'h2' } = widget.data as HeadingData;
  const style: React.CSSProperties = { margin: 0, ...applyWidgetStyles(widget.styles) };
  const tag = TAG_MAP[level] ?? 'h2';

  if (tag === 'h1') return <h1 style={style}>{text}</h1>;
  if (tag === 'h3') return <h3 style={style}>{text}</h3>;
  if (tag === 'h4') return <h4 style={style}>{text}</h4>;
  return <h2 style={style}>{text}</h2>;
}
