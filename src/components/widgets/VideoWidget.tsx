import type { WidgetInstance } from '@/payload/views/PageEditor/types';
import { applyWidgetStyles } from './widget-styles';

type Props = { widget: WidgetInstance };

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

export function VideoWidget({ widget }: Props) {
  const { url = '', aspectRatio = '16/9' } = widget.data as {
    url?: string; aspectRatio?: string;
  };

  const embedUrl = getEmbedUrl(url);
  const [w, h] = aspectRatio.split('/').map(Number);
  const paddingBottom = h && w ? `${(h / w) * 100}%` : '56.25%';

  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom,
    background: '#0f172a',
    borderRadius: '4px',
    overflow: 'hidden',
    ...applyWidgetStyles(widget.styles),
  };

  if (!url) {
    return (
      <div
        style={{
          ...wrapStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#475569',
          fontSize: '13px',
          paddingBottom: undefined,
          height: '120px',
        }}
      >
        ▶ Enter a YouTube or Vimeo URL
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div style={{ ...wrapStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontSize: '12px', paddingBottom: undefined, height: '60px' }}>
        Unsupported video URL
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <iframe
        src={embedUrl}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
