'use client';

import { useEffect, useState } from 'react';
import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  const words = data.cyclingWords.length > 0 ? data.cyclingWords : [''];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length < 2) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setVisible(true);
      }, 400);
    }, 2400);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <section className="sv2-hero">
      <div className="sv2-hero__bg" aria-hidden="true">
        <div className="sv2-hero__orb sv2-hero__orb--1" />
        <div className="sv2-hero__orb sv2-hero__orb--2" />
        <div className="sv2-hero__grid" />
      </div>
      <div className="sv2-wrap sv2-hero__inner">
        <div className="sv2-hero__badge">
          <i className="sv2-hero__dot" />
          {data.badge}
        </div>
        <h1 className="sv2-hero__h1">{renderEmHtml(data.heading)}</h1>
        <div className="sv2-hero__animated">
          <span className={'sv2-hero__word' + (visible ? ' is-visible' : '')}>{words[idx]}</span>
        </div>
        <p className="sv2-hero__sub">{data.sub}</p>
        <div className="sv2-hero__pills">
          {data.pills.map((p, i) => (
            <span key={i} className="sv2-pill">{p}</span>
          ))}
        </div>
        <div className="sv2-hero__ctas">
          <a href={data.primaryCta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="search" size={18} />
            <span>{data.primaryCta.label}</span>
          </a>
          <a href={data.secondaryCta.href} className="sv2-btn sv2-btn--outline sv2-btn--lg">
            <Icon name="chart" size={18} />
            <span>{data.secondaryCta.label}</span>
          </a>
        </div>
        <div className="sv2-hero__hero-img">
          {/* TODO(assets): drop hero image at public/services/hero-dashboard.webp and set hero.image.src */}
          {data.image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.image.src} alt={data.image.alt} className="sv2-hero__img" />
          ) : (
            <div className="iph sv2-hero__img sv2-hero__img-ph" aria-label={data.image.alt}>
              <span>{data.image.alt}</span>
            </div>
          )}
        </div>
        <div className="sv2-hero__trust">
          <span className="sv2-hero__trust-label">{data.trustLabel}</span>
          <div className="sv2-hero__trust-logos">
            {data.trustLogos.map((logo) => (
              // TODO(assets): drop badge at public/trust-badges/<slug>.png
              <div key={logo.slug} className="iph sv2-hero__trust-img" aria-label={logo.alt}>
                <span>{logo.alt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
