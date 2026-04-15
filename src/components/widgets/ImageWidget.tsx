import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

export function ImageWidget({ widget }: Props) {
  const { src, alt = '' } = widget.data as { src?: string | null; alt?: string };
  const styleOverrides = applyWidgetStyles(widget.styles);

  if (!src) {
    return (
      <div
        style={{
          background: '#f1f5f9',
          border: '1px dashed #cbd5e1',
          borderRadius: '4px',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '13px',
          ...styleOverrides,
        }}
      >
        No image selected
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        display: 'block',
        maxWidth: '100%',
        width: '100%',
        ...styleOverrides,
      }}
    />
  );
}
