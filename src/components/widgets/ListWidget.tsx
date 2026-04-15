import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

export function ListWidget({ widget }: Props) {
  const { items = '', style = 'bullet' } = widget.data as {
    items?: string; style?: 'bullet' | 'numbered' | 'check' | 'none';
  };

  const lines = items.split('\n').map((l) => l.trim()).filter(Boolean);
  const containerStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    ...applyWidgetStyles(widget.styles),
  };

  if (style === 'numbered') {
    return (
      <ol style={{ ...containerStyle, paddingLeft: '1.4em' }}>
        {lines.map((line, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>{line}</li>
        ))}
      </ol>
    );
  }

  if (style === 'check') {
    return (
      <ul style={{ ...containerStyle, listStyle: 'none' }}>
        {lines.map((line, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: '#22c55e', fontSize: '14px', lineHeight: '1.5', flexShrink: 0 }}>✓</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (style === 'none') {
    return (
      <ul style={{ ...containerStyle, listStyle: 'none' }}>
        {lines.map((line, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>{line}</li>
        ))}
      </ul>
    );
  }

  // bullet (default)
  return (
    <ul style={{ ...containerStyle, paddingLeft: '1.4em' }}>
      {lines.map((line, i) => (
        <li key={i} style={{ marginBottom: '4px' }}>{line}</li>
      ))}
    </ul>
  );
}
