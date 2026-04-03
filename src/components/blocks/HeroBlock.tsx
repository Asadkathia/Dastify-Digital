import Link from 'next/link';
import { CmsImage } from '@/components/CmsImage';
import type { PageBuilderBlock } from './types';

type HeroBlockProps = Extract<PageBuilderBlock, { type: 'hero' }>;

export function HeroBlock(props: HeroBlockProps) {
  return (
    <section className="sp">
      <div className="wrap" style={{ display: 'grid', gap: '28px', alignItems: 'center', gridTemplateColumns: '1.2fr 1fr' }}>
        <div>
          {props.eyebrow ? (
            <p style={{ marginBottom: '10px' }}>
              <span className="chip">
                <span className="chip-dot" />
                {props.eyebrow}
              </span>
            </p>
          ) : null}
          <h1 style={{ marginBottom: '12px' }}>{props.title}</h1>
          {props.subtitle ? <p style={{ marginBottom: '20px' }}>{props.subtitle}</p> : null}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {props.primaryCtaLabel && props.primaryCtaHref ? (
              <Link className="btn-dk" href={props.primaryCtaHref}>
                {props.primaryCtaLabel}
              </Link>
            ) : null}
            {props.secondaryCtaLabel && props.secondaryCtaHref ? (
              <Link className="btn-ol" href={props.secondaryCtaHref}>
                {props.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
        {props.image?.src ? (
          <div style={{ position: 'relative', minHeight: '280px', borderRadius: '24px', overflow: 'hidden' }}>
            <CmsImage src={props.image.src} alt={props.image.alt || props.title} objectFit="cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
