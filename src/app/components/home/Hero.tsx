import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { CmsImage } from '@/components/CmsImage';

type HeroProps = {
  data: HomepageContent['hero'];
};

export function Hero({ data }: HeroProps) {
  const marquee = [...data.marquee, ...data.marquee];
  const primaryHref = data.primaryCtaHref?.url || null;
  const secondaryHref = data.secondaryCtaHref?.url || null;

  return (
    <section className="hero" id={data.id}>
      <span className="sec-wm g1">D</span>
      <div className="hero-body">
        <div className="hero-left">
          <div className="hero-chip">
            <span className="chip">
              <span className="chip-dot" />
              <span data-field="chip">{data.chip}</span>
            </span>
          </div>

          <h1 className="hero-h1">
            {data.headingLines.map((line) => (
              <span key={line.text} className="line-wrap">
                <span
                  className="line-inner"
                  data-delay={line.delay}
                  style={line.colorVar ? { color: line.colorVar } : undefined}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub" data-r data-delay="2" data-field="description">
            {data.description}
          </p>

          <div className="hero-actions" data-r data-delay="3">
            {primaryHref ? (
              <Link
                className="btn-dk"
                href={primaryHref}
                target={data.primaryCtaHref?.openInNewTab ? '_blank' : undefined}
                rel={data.primaryCtaHref?.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                <span data-field="primaryCta">{data.primaryCta}</span>
              </Link>
            ) : (
              <button className="btn-dk" type="button">
                <span data-field="primaryCta">{data.primaryCta}</span>
              </button>
            )}
            {secondaryHref ? (
              <Link
                className="btn-ol"
                href={secondaryHref}
                target={data.secondaryCtaHref?.openInNewTab ? '_blank' : undefined}
                rel={data.secondaryCtaHref?.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                <span data-field="secondaryCta">{data.secondaryCta}</span>
              </Link>
            ) : (
              <button className="btn-ol" type="button">
                <span data-field="secondaryCta">{data.secondaryCta}</span>
              </button>
            )}
          </div>

          <div className="hero-stats">
            {data.stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                {stat.counterTarget ? (
                  <span className="hero-stat-n" data-count={stat.counterTarget} data-suffix={stat.suffix ?? ''}>
                    {stat.value}
                    {stat.suffix ?? ''}
                  </span>
                ) : (
                  <span className="hero-stat-n">
                    {stat.value}
                    {stat.suffix ?? ''}
                  </span>
                )}
                <div className="hero-stat-l">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right" data-r="R">
          <div className="hero-img-wrap img-reveal">
            <CmsImage src={data.image} alt={data.imageAlt} objectFit="contain" priority />
          </div>
          <div className="hero-badge">
            <div className="hero-badge-n" data-field="badgeValue">{data.badgeValue}</div>
            <div className="hero-badge-l" data-field="badgeLabel">{data.badgeLabel}</div>
          </div>
        </div>
      </div>

      <div className="hero-marquee">
        <div className="marquee-track">
          {marquee.map((item, idx) => (
            <span key={`${item}-${idx}`} className="marquee-item">
              <span className="dot">+</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
