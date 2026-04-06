import { CmsImage } from '@/components/CmsImage';
import type { PageBuilderBlock } from './types';

type TextImageBlockProps = Extract<PageBuilderBlock, { type: 'text_image' }>;

export function TextImageBlock(props: TextImageBlockProps) {
  const imageFirst = props.layout === 'left';

  return (
    <section className="sp">
      <div className="wrap" style={{ display: 'grid', gap: '28px', alignItems: 'center', gridTemplateColumns: '1fr 1fr' }}>
        {imageFirst ? (
          <div style={{ position: 'relative', minHeight: '280px', borderRadius: '24px', overflow: 'hidden' }}>
            {props.image?.src ? <CmsImage src={props.image.src} alt={props.image.alt || props.title || 'Image'} objectFit="cover" /> : null}
          </div>
        ) : null}

        <div>
          {props.title ? <h2 data-field="title" style={{ marginBottom: '12px' }}>{props.title}</h2> : null}
          {props.text ? <p data-field="text" style={{ whiteSpace: 'pre-wrap' }}>{props.text}</p> : null}
        </div>

        {!imageFirst ? (
          <div style={{ position: 'relative', minHeight: '280px', borderRadius: '24px', overflow: 'hidden' }}>
            {props.image?.src ? <CmsImage src={props.image.src} alt={props.image.alt || props.title || 'Image'} objectFit="cover" /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
