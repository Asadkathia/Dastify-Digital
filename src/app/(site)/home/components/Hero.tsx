import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';
import AnimCounter from './_AnimCounter';
import { renderEmHtml } from './_emHtml';

const TONE_PALETTE = ['primary', 'accent', 'support'] as const;
type Tone = (typeof TONE_PALETTE)[number] | null;
function toneForIndex(i: number): Tone {
  if (i % 2 !== 0) return null;
  return TONE_PALETTE[Math.floor(i / 2) % TONE_PALETTE.length];
}

type HeroData = HomepageContent['hero'] & { heroVariant?: 'A' | 'B' | 'C' };

function TrustLogos({ data, centered }: { data: HomepageContent['hero']; centered?: boolean }) {
  const labelNode = getConvertedNodeBinding(data, { field: 'trustLogosLabel', defaultTag: 'span' });
  const LabelTag = labelNode.Tag;
  return (
    <div className={`hp2-trust-logos${centered ? ' is-center' : ''}`}>
      <LabelTag {...labelNode.props} className="hp2-trust-logos__label">{data.trustLogosLabel}</LabelTag>
      <div className="hp2-trust-logos__row">
        {data.trustLogos.map((l, i) => {
          const labelBinding = getConvertedNodeBinding(data, { field: `trustLogos.${i}.label`, defaultTag: 'span' });
          const LBTag = labelBinding.Tag;
          const tone = toneForIndex(i);
          return l.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={l.slug}
              src={l.image}
              alt={l.label}
              className="hp2-trust-logos__img"
            />
          ) : (
            <div key={l.slug} className="iph hp2-trust-logos__placeholder" aria-label={l.label} data-tone={tone ?? undefined}>
              <LBTag {...labelBinding.props}>{l.label}</LBTag>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroA({ data }: { data: HomepageContent['hero'] }) {
  const kickerNode = getConvertedNodeBinding(data, { field: 'kicker', defaultTag: 'div' });
  const KickerTag = kickerNode.Tag;
  const headingNode = getConvertedNodeBinding(data, { field: 'headingA', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = headingNode.Tag;
  const subNode = getConvertedNodeBinding(data, { field: 'subA', defaultTag: 'p' });
  const SubTag = subNode.Tag;
  const primaryCtaLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PrimaryCtaLabelTag = primaryCtaLabel.Tag;
  const secondaryCtaLabel = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'span' });
  const SecondaryCtaLabelTag = secondaryCtaLabel.Tag;
  return (
    <section className="hp2-hero hp2-hero--a">
      <div className="hp2-hero__grid-bg" aria-hidden="true" />
      <div className="hp2-hero__inner">
        <div className="hp2-hero__left">
          <KickerTag {...kickerNode.props} className="hp2-hero__kicker">
            <i className="hp2-hero__dot" />
            {data.kicker}
          </KickerTag>
          <HeadingTag {...headingNode.props} className="hp2-hero__h1">{renderEmHtml(data.headingA)}</HeadingTag>
          <SubTag {...subNode.props} className="hp2-hero__sub">{data.subA}</SubTag>
          <div className="hp2-hero__ctas">
            <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
              <Icon name="calendar" size={18} />
              <PrimaryCtaLabelTag {...primaryCtaLabel.props}>{data.primaryCta.label}</PrimaryCtaLabelTag>
            </Link>
            <Link href={data.secondaryCta.href} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
              <Icon name="play" size={18} />
              <SecondaryCtaLabelTag {...secondaryCtaLabel.props}>{data.secondaryCta.label}</SecondaryCtaLabelTag>
            </Link>
          </div>
          <div className="hp2-hero__proof">
            {data.proofStats.map((s, i) => {
              const valueB = getConvertedNodeBinding(data, { field: `proofStats.${i}.value`, defaultTag: 'span' });
              const labelB = getConvertedNodeBinding(data, { field: `proofStats.${i}.label`, defaultTag: 'span' });
              return (
                <AnimCounter
                  key={i}
                  value={s.value}
                  label={s.label}
                  color="#fff"
                  valueProps={valueB.props}
                  labelProps={labelB.props}
                />
              );
            })}
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
  const eyebrowNode = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrowNode.Tag;
  const headingNode = getConvertedNodeBinding(data, { field: 'headingB', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = headingNode.Tag;
  const subNode = getConvertedNodeBinding(data, { field: 'subB', defaultTag: 'p' });
  const SubTag = subNode.Tag;
  const primaryCtaLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PrimaryCtaLabelTag = primaryCtaLabel.Tag;
  const phoneNode = getConvertedNodeBinding(data, { field: 'phone', defaultTag: 'span' });
  const PhoneTag = phoneNode.Tag;
  return (
    <section className="hp2-hero hp2-hero--b">
      <div className="hp2-hero__grid-bg" aria-hidden="true" />
      <div className="hp2-hero--b__inner">
        <EyebrowTag {...eyebrowNode.props} className="hp2-hero--b__eyebrow">
          <i className="hp2-hero__dot" />
          {data.eyebrow}
        </EyebrowTag>
        <HeadingTag {...headingNode.props} className="hp2-hero--b__h1">{renderEmHtml(data.headingB)}</HeadingTag>
        <SubTag {...subNode.props} className="hp2-hero--b__sub">{data.subB}</SubTag>
        <div className="hp2-hero--b__ctas">
          <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="calendar" size={18} />
            <PrimaryCtaLabelTag {...primaryCtaLabel.props}>{data.primaryCta.label}</PrimaryCtaLabelTag>
          </Link>
          <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
            <PhoneTag {...phoneNode.props}>{data.phone}</PhoneTag>
          </a>
        </div>
        <TrustLogos data={data} centered />
        <div className="hp2-hero--b__stats">
          {data.statTiles.map((t, i) => {
            const valueB = getConvertedNodeBinding(data, { field: `statTiles.${i}.value`, defaultTag: 'div' });
            const VTag = valueB.Tag;
            const labelB = getConvertedNodeBinding(data, { field: `statTiles.${i}.label`, defaultTag: 'div' });
            const LTag = labelB.Tag;
            const subB = getConvertedNodeBinding(data, { field: `statTiles.${i}.sublabel`, defaultTag: 'div' });
            const STag = subB.Tag;
            return (
              <div key={i} className="hp2-hero--b__tile">
                <VTag {...valueB.props} className="hp2-hero--b__tile-n">{t.value}</VTag>
                <LTag {...labelB.props} className="hp2-hero--b__tile-l">{t.label}</LTag>
                {t.sublabel ? <STag {...subB.props} className="hp2-hero--b__tile-s">{t.sublabel}</STag> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroC({ data }: { data: HomepageContent['hero'] }) {
  const badgeNode = getConvertedNodeBinding(data, { field: 'badge', defaultTag: 'span' });
  const BadgeTag = badgeNode.Tag;
  const headingNode = getConvertedNodeBinding(data, { field: 'headingC', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = headingNode.Tag;
  const subNode = getConvertedNodeBinding(data, { field: 'subC', defaultTag: 'p' });
  const SubTag = subNode.Tag;
  const primaryCtaLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PrimaryCtaLabelTag = primaryCtaLabel.Tag;
  const secondaryCtaLabel = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'span' });
  const SecondaryCtaLabelTag = secondaryCtaLabel.Tag;
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
          <BadgeTag {...badgeNode.props}>{data.badge}</BadgeTag>
        </div>
        <HeadingTag {...headingNode.props} className="hp2-hero--c__h1">{renderEmHtml(data.headingC)}</HeadingTag>
        <SubTag {...subNode.props} className="hp2-hero--c__sub">{data.subC}</SubTag>
        <div className="hp2-hero--c__ctas">
          <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
            <Icon name="arrow" size={18} />
            <PrimaryCtaLabelTag {...primaryCtaLabel.props}>{data.primaryCta.label}</PrimaryCtaLabelTag>
          </Link>
          <Link href={data.secondaryCta.href} className="hp2-btn hp2-btn--ghost hp2-btn--lg">
            <Icon name="play" size={18} />
            <SecondaryCtaLabelTag {...secondaryCtaLabel.props}>{data.secondaryCta.label}</SecondaryCtaLabelTag>
          </Link>
        </div>
        <TrustLogos data={data} centered />
        <div className="hp2-hero--c__ticker" role="list">
          {data.ticker.map((t, i) => {
            const tickB = getConvertedNodeBinding(data, { field: `ticker.${i}`, defaultTag: 'span' });
            const TTag = tickB.Tag;
            return (
              <TTag key={i} {...tickB.props} className="hp2-hero--c__tick" role="listitem">
                {t}
              </TTag>
            );
          })}
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
