import Link from 'next/link';
import { CmsImage } from '@/components/CmsImage';
import type { PageBuilderBlock } from './types';

type CardGridBlockProps = Extract<PageBuilderBlock, { type: 'card_grid' }>;

export function CardGridBlock(props: CardGridBlockProps) {
  if (props.cards.length === 0) return null;

  const cols = props.columns ?? 3;
  const gridCols = cols === 2 ? '1fr 1fr' : cols === 4 ? 'repeat(auto-fit,minmax(220px,1fr))' : 'repeat(auto-fit,minmax(260px,1fr))';

  return (
    <section className="sp">
      <div className="wrap">
        {props.title ? (
          <h2 data-field="title" style={{ marginBottom: props.subtitle ? '8px' : '28px' }}>{props.title}</h2>
        ) : null}
        {props.subtitle ? (
          <p data-field="subtitle" style={{ opacity: 0.7, marginBottom: '28px', lineHeight: 1.6 }}>{props.subtitle}</p>
        ) : null}
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: gridCols }}>
          {props.cards.map((card, i) => {
            const inner = (
              <article
                key={i}
                style={{
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.1)';
                }}
              >
                {card.image?.src ? (
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <CmsImage src={card.image.src} alt={card.image.alt || card.title} objectFit="cover" />
                  </div>
                ) : null}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {card.eyebrow ? (
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '6px' }}>
                      {card.eyebrow}
                    </p>
                  ) : null}
                  <h3 style={{ marginBottom: card.text ? '8px' : '0', fontSize: '17px', fontWeight: 700 }}>{card.title}</h3>
                  {card.text ? (
                    <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.75, flex: 1, marginBottom: card.ctaLabel ? '16px' : '0' }}>
                      {card.text}
                    </p>
                  ) : null}
                  {card.ctaLabel && card.ctaHref ? (
                    <Link
                      href={card.ctaHref}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--clr-accent, #7c3aed)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: 'auto',
                      }}
                    >
                      {card.ctaLabel} →
                    </Link>
                  ) : null}
                </div>
              </article>
            );

            return inner;
          })}
        </div>
      </div>
    </section>
  );
}
