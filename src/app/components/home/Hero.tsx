import type { HomepageContent } from '@/lib/homepage-content';

type HeroProps = {
  data: HomepageContent['hero'];
};

export function Hero({ data }: HeroProps) {
  const marquee = [...data.marquee, ...data.marquee];

  return (
    <section className="hero" id={data.id}>
      <span className="sec-wm g1">D</span>
      <div className="hero-body">
        <div className="hero-left">
          <div className="hero-chip">
            <span className="chip">
              <span className="chip-dot" />
              {data.chip}
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

          <p className="hero-sub" data-r data-delay="2">
            {data.description}
          </p>

          <div className="hero-actions" data-r data-delay="3">
            <button className="btn-dk" type="button">
              {data.primaryCta}
            </button>
            <button className="btn-ol" type="button">
              {data.secondaryCta}
            </button>
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
            <img src={data.image} alt={data.imageAlt} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
          <div className="hero-badge">
            <div className="hero-badge-n">{data.badgeValue}</div>
            <div className="hero-badge-l">{data.badgeLabel}</div>
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
