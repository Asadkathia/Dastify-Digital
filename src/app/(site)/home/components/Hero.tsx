import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';
import AnimCounter from './_AnimCounter';
import { renderEmHtml } from './_emHtml';

type HeroData = HomepageContent['hero'] & { heroVariant?: 'A' | 'B' | 'C' };

function TrustLogos({ data, centered }: { data: HomepageContent['hero']; centered?: boolean }) {
  return (
    <div className={`hp2-trust-logos${centered ? ' is-center' : ''}`}>
      <span className="hp2-trust-logos__label">{data.trustLogosLabel}</span>
      <div className="hp2-trust-logos__row">
        {data.trustLogos.map((l) =>
          l.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={l.slug}
              src={l.image}
              alt={l.label}
              className="hp2-trust-logos__img"
            />
          ) : (
            <div key={l.slug} className="iph hp2-trust-logos__placeholder" aria-label={l.label}>
              <span>{l.label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function HeroA({ data }: { data: HomepageContent['hero'] }) {
  return (
    <section className="hp2-hero hp2-hero--a">
      <div className="hp2-hero__grid-bg" aria-hidden="true" />
      <div className="hp2-hero__inner">
        <div className="hp2-hero__left">
          <div className="hp2-hero__kicker">
            <i className="hp2-hero__dot" />
            {data.kicker}
          </div>
          <h1 className="hp2-hero__h1">{renderEmHtml(data.headingA)}</h1>
          <p className="hp2-hero__sub">{data.subA}</p>
          <div className="hp2-hero__ctas">
            <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
              <Icon name="calendar" size={18} />
              <span>{data.primaryCta.label}</span>
            </Link>
            <Link href={data.secondaryCta.href} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
              <Icon name="play" size={18} />
              <span>{data.secondaryCta.label}</span>
            </Link>
          </div>
          <div className="hp2-hero__proof">
            {data.proofStats.map((s, i) => (
              <AnimCounter key={i} value={s.value} label={s.label} color="#fff" />
            ))}
          </div>
          <TrustLogos data={data} />
        </div>
        <div className="hp2-hero__right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt={data.imageAlt} className="hp2-hero__img" />
        </div>
      </div>
    </section>
  );
}

function HeroB({ data }: { data: HomepageContent['hero'] }) {
  return (
    <section className="hp2-hero hp2-hero--b">
      <div className="hp2-hero__grid-bg" aria-hidden="true" />
      <div className="hp2-hero--b__inner">
        <div className="hp2-hero--b__eyebrow">
          <i className="hp2-hero__dot" />
          {data.eyebrow}
        </div>
        <h1 className="hp2-hero--b__h1">{renderEmHtml(data.headingB)}</h1>
        <p className="hp2-hero--b__sub">{data.subB}</p>
        <div className="hp2-hero--b__ctas">
          <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="calendar" size={18} />
            <span>Talk to a strategist</span>
          </Link>
          <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
            <span>{data.phone}</span>
          </a>
        </div>
        <TrustLogos data={data} centered />
        <div className="hp2-hero--b__stats">
          {data.statTiles.map((t, i) => (
            <div key={i} className="hp2-hero--b__tile">
              <div className="hp2-hero--b__tile-n">{t.value}</div>
              <div className="hp2-hero--b__tile-l">{t.label}</div>
              {t.sublabel ? <div className="hp2-hero--b__tile-s">{t.sublabel}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroC({ data }: { data: HomepageContent['hero'] }) {
  return (
    <section className="hp2-hero hp2-hero--c">
      <div className="hp2-hero--c__bg" aria-hidden="true">
        <div className="hp2-hero--c__orb hp2-hero--c__orb--1" />
        <div className="hp2-hero--c__orb hp2-hero--c__orb--2" />
        <div className="hp2-hero--c__orb hp2-hero--c__orb--3" />
      </div>
      <div className="hp2-hero--c__inner">
        <div className="hp2-hero--c__badge">
          <Icon name="shield" size={14} />
          <span>{data.badge}</span>
        </div>
        <h1 className="hp2-hero--c__h1">{renderEmHtml(data.headingC)}</h1>
        <p className="hp2-hero--c__sub">{data.subC}</p>
        <div className="hp2-hero--c__ctas">
          <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="arrow" size={18} />
            <span>See if we&rsquo;re a fit</span>
          </Link>
          <Link href={data.secondaryCta.href} className="hp2-btn hp2-btn--ghost hp2-btn--lg">
            <Icon name="play" size={18} />
            <span>See results</span>
          </Link>
        </div>
        <TrustLogos data={data} centered />
        <div className="hp2-hero--c__ticker" role="list">
          {data.ticker.map((t, i) => (
            <span key={i} className="hp2-hero--c__tick" role="listitem">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Hero({ data }: { data: HeroData }) {
  const variant = data.heroVariant ?? 'A';
  if (variant === 'B') return <HeroB data={data} />;
  if (variant === 'C') return <HeroC data={data} />;
  return <HeroA data={data} />;
}
