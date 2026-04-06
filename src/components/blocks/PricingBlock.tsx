import Link from 'next/link';
import type { PageBuilderBlock } from './types';

type PricingBlockProps = Extract<PageBuilderBlock, { type: 'pricing' }>;

export function PricingBlock(props: PricingBlockProps) {
  return (
    <section className="sp">
      <div className="wrap">
        {props.title ? (
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h2 data-field="title">{props.title}</h2>
          </div>
        ) : null}
        {props.subtitle ? (
          <p style={{ textAlign: 'center', marginBottom: '40px', opacity: 0.7 }} data-field="subtitle">
            {props.subtitle}
          </p>
        ) : null}
        <div
          style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
            alignItems: 'stretch',
          }}
        >
          {props.plans.map((plan, i) => (
            <div
              key={`${plan.name}-${i}`}
              style={{
                border: plan.highlighted ? '2px solid var(--clr-accent, #7c3aed)' : '1px solid rgba(255,255,255,.1)',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                background: plan.highlighted ? 'rgba(124,58,237,.08)' : undefined,
                position: 'relative',
              }}
            >
              {plan.highlighted ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--clr-accent, #7c3aed)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 12px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              ) : null}

              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{plan.name}</p>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>{plan.price}</span>
                {plan.period ? (
                  <span style={{ fontSize: '14px', opacity: 0.6, marginLeft: '4px' }}>{plan.period}</span>
                ) : null}
              </div>
              {plan.description ? (
                <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '16px', lineHeight: 1.5 }}>{plan.description}</p>
              ) : null}

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {plan.features.map((feat, fi) => (
                  <li
                    key={fi}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ color: 'var(--clr-accent, #7c3aed)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              {plan.ctaLabel && plan.ctaHref ? (
                <Link
                  href={plan.ctaHref}
                  className={plan.highlighted ? 'btn-dk' : 'btn-ol'}
                  style={{ textAlign: 'center' }}
                >
                  {plan.ctaLabel}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
