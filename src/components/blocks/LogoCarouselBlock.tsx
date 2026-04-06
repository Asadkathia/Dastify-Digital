import Image from 'next/image';
import Link from 'next/link';
import type { PageBuilderBlock } from './types';

type LogoCarouselBlockProps = Extract<PageBuilderBlock, { type: 'logo_carousel' }>;

export function LogoCarouselBlock(props: LogoCarouselBlockProps) {
  if (props.logos.length === 0) return null;

  return (
    <section className="sp">
      <div className="wrap">
        {props.title ? (
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.5,
              marginBottom: '24px',
            }}
            data-field="title"
          >
            {props.title}
          </p>
        ) : null}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px 48px',
          }}
        >
          {props.logos.map((logo, i) => {
            const img = (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '120px',
                  height: '48px',
                  opacity: 0.65,
                  filter: 'grayscale(1)',
                  transition: 'opacity 0.2s, filter 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '1';
                  (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = '0.65';
                  (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(1)';
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            );

            return logo.href ? (
              <Link key={i} href={logo.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                {img}
              </Link>
            ) : (
              img
            );
          })}
        </div>
      </div>
    </section>
  );
}
