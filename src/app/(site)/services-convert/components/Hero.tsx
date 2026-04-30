'use client';

import { useEffect, useState } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';
import { renderEmHtmlString } from '../../home/components/_emHtml';

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
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
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
        <HeadingTag {...heading.props} className="sv2-hero__h1" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        <div className="sv2-hero__animated">
          {(() => {
            const safeIdx = data.cyclingWords.length > 0 ? idx % data.cyclingWords.length : 0;
            const wB = getConvertedNodeBinding(data, { field: `cyclingWords.${safeIdx}`, defaultTag: 'span' });
            const WTag = wB.Tag;
            return (
              <WTag {...wB.props} className={'sv2-hero__word' + (visible ? ' is-visible' : '')}>
                {words[idx]}
              </WTag>
            );
          })()}
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
          {(() => {
            // Note: bind to the whole `image` object so writes from the upload
            // panel land at `image = { mediaId, url, alt }`. The helper still
            // reads the legacy `{ src, alt }` shape via normalizeImageValue.
            // The image binding writes `{ url, alt }` from the upload panel.
            // The node binding registers `image.alt` so it's editable as text
            // in the inspector (and satisfies the editor-binding lint).
            const heroImg = getConvertedImageBinding(data, {
              field: 'image',
              altField: 'image.alt',
              defaultAlt: data.image.alt,
            });
            const altB = getConvertedNodeBinding(data, { field: 'image.alt', defaultTag: 'span' });
            const AltTag = altB.Tag;
            if (heroImg.hidden) {
              return (
                <div {...heroImg.props} data-image-hidden="true" className="iph sv2-hero__img sv2-hero__img-ph" aria-label={data.image.alt}>
                  <AltTag {...altB.props}>{data.image.alt}</AltTag>
                </div>
              );
            }
            return heroImg.hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img {...heroImg.props} src={heroImg.src} alt={heroImg.alt || data.image.alt} className="sv2-hero__img" />
            ) : (
              <div {...heroImg.props} className="iph sv2-hero__img sv2-hero__img-ph" aria-label={data.image.alt}>
                <AltTag {...altB.props}>{data.image.alt}</AltTag>
              </div>
            );
          })()}
        </div>
        <div className="sv2-hero__trust">
          <TrustLabelTag {...trustLabel.props} className="sv2-hero__trust-label">{data.trustLabel}</TrustLabelTag>
          <div className="sv2-hero__trust-logos">
            {data.trustLogos.map((logo, i) => {
              const altB = getConvertedNodeBinding(data, { field: `trustLogos.${i}.alt`, defaultTag: 'span' });
              const ATag = altB.Tag;
              const imgBinding = getConvertedImageBinding(data, {
                field: `trustLogos.${i}.image`,
                altField: `trustLogos.${i}.alt`,
                defaultAlt: logo.alt,
              });
              if (imgBinding.hidden) {
                return (
                  <div key={logo.slug} {...imgBinding.props} data-image-hidden="true" className="iph sv2-hero__trust-img" aria-label={logo.alt}>
                    <ATag {...altB.props}>{logo.alt}</ATag>
                  </div>
                );
              }
              return imgBinding.hasImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={logo.slug}
                  {...imgBinding.props}
                  src={imgBinding.src}
                  alt={imgBinding.alt || logo.alt}
                  className="sv2-hero__trust-img"
                />
              ) : (
                <div key={logo.slug} {...imgBinding.props} className="iph sv2-hero__trust-img" aria-label={logo.alt}>
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
