import type { PageBuilderBlock } from './types';

type VideoEmbedBlockProps = Extract<PageBuilderBlock, { type: 'video_embed' }>;

function buildEmbedUrl(url: string, autoplay: boolean): string | null {
  try {
    const u = new URL(url);

    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let videoId = '';
      if (u.hostname.includes('youtu.be')) {
        videoId = u.pathname.slice(1);
      } else {
        videoId = u.searchParams.get('v') || '';
      }
      if (!videoId) return null;
      const params = new URLSearchParams({ rel: '0' });
      if (autoplay) params.set('autoplay', '1');
      return `https://www.youtube.com/embed/${videoId}?${params}`;
    }

    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const videoId = u.pathname.split('/').filter(Boolean).pop();
      if (!videoId) return null;
      const params = new URLSearchParams();
      if (autoplay) params.set('autoplay', '1');
      return `https://player.vimeo.com/video/${videoId}?${params}`;
    }

    // Already an embed URL or other
    return url;
  } catch {
    return null;
  }
}

export function VideoEmbedBlock(props: VideoEmbedBlockProps) {
  const embedUrl = buildEmbedUrl(props.url, Boolean(props.autoplay));

  if (!embedUrl) return null;

  return (
    <section className="sp">
      <div className="wrap" style={{ maxWidth: '900px' }}>
        {props.title ? (
          <h2 data-field="title" style={{ marginBottom: '16px' }}>{props.title}</h2>
        ) : null}
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9
            height: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            background: '#000',
          }}
        >
          <iframe
            src={embedUrl}
            title={props.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>
        {props.caption ? (
          <p style={{ marginTop: '10px', fontSize: '13px', opacity: 0.6, textAlign: 'center' }} data-field="caption">
            {props.caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
