'use client';

import { useEffect, useState } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
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

  const badge = getConvertedNodeBinding(data, { field: 'badge', defaultTag: 'div' });
  const BadgeTag = badge.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const sub = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = sub.Tag;
  const pLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PLabelTag = pLabel.Tag;
  const sLabel = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'span' });
  const SLabelTag = sLabel.Tag;
  const trustLabel = getConvertedNodeBinding(data, { field: 'trustLabel', defaultTag: 'span' });
  const TrustLabelTag = trustLabel.Tag;

  return (
    <section className="sv2-hero">
      <div className="sv2-hero__bg" aria-hidden="true">
        <div className="sv2-hero__orb sv2-hero__orb--1" />
        <div className="sv2-hero__orb sv2-hero__orb--2" />
        <div className="sv2-hero__grid" />
      </div>
      <div className="sv2-wrap sv2-hero__inner">
        <BadgeTag {...badge.props} className="sv2-hero__badge">
          <i className="sv2-hero__dot" />
          {data.badge}
        </BadgeTag>
        <HeadingTag {...heading.props} className="sv2-hero__h1">{renderEmHtml(data.heading)}</HeadingTag>
        <div className="sv2-hero__animated">
          <span className={'sv2-hero__word' + (visible ? ' is-visible' : '')}>{words[idx]}</span>
        </div>
        <SubTag {...sub.props} className="sv2-hero__sub">{data.sub}</SubTag>
        <div className="sv2-hero__pills">
          {data.pills.map((p, i) => {
            const pB = getConvertedNodeBinding(data, { field: `pills.${i}`, defaultTag: 'span' });
            const PTag = pB.Tag;
            return <PTag key={i} {...pB.props} className="sv2-pill">{p}</PTag>;
          })}
        </div>
        <div className="sv2-hero__ctas">
          <a href={data.primaryCta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="search" size={18} />
            <PLabelTag {...pLabel.props}>{data.primaryCta.label}</PLabelTag>
          </a>
          <a href={data.secondaryCta.href} className="sv2-btn sv2-btn--outline sv2-btn--lg">
            <Icon name="chart" size={18} />
            <SLabelTag {...sLabel.props}>{data.secondaryCta.label}</SLabelTag>
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
          <TrustLabelTag {...trustLabel.props} className="sv2-hero__trust-label">{data.trustLabel}</TrustLabelTag>
          <div className="sv2-hero__trust-logos">
            {data.trustLogos.map((logo, i) => {
              const altB = getConvertedNodeBinding(data, { field: `trustLogos.${i}.alt`, defaultTag: 'span' });
              const ATag = altB.Tag;
              return logo.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={logo.slug}
                  src={logo.image}
                  alt={logo.alt}
                  className="sv2-hero__trust-img"
                />
              ) : (
                <div key={logo.slug} className="iph sv2-hero__trust-img" aria-label={logo.alt}>
                  <ATag {...altB.props}>{logo.alt}</ATag>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
