'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon, type IconName } from './_icons';

export default function Pricing({ data }: { data: HomepageContent['pricing'] }) {
  const [annual, setAnnual] = useState(false);
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleEm = getConvertedNodeBinding(data, { field: 'titleEm', defaultTag: 'em' });
  const TitleEmTag = titleEm.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const monthlyLabel = getConvertedNodeBinding(data, { field: 'monthlyLabel', defaultTag: 'span' });
  const MonthlyLabelTag = monthlyLabel.Tag;
  const annualLabel = getConvertedNodeBinding(data, { field: 'annualLabel', defaultTag: 'span' });
  const AnnualLabelTag = annualLabel.Tag;
  const savings = getConvertedNodeBinding(data, { field: 'annualSavingsLabel', defaultTag: 'span' });
  const SavingsTag = savings.Tag;
  const footLead = getConvertedNodeBinding(data, { field: 'footnoteLead', defaultTag: 'span' });
  const FootLeadTag = footLead.Tag;
  const footLink = getConvertedNodeBinding(data, { field: 'footnoteLinkLabel', defaultTag: 'span' });
  const FootLinkTag = footLink.Tag;

  return (
    <section className="hp2-pricing">
      <div className="hp2-wrap">
        <div className="hp2-pricing__header">
          <div className="hp2-pricing__header-left">
            <EyebrowTag {...eyebrow.props} className="hp2-eyebrow is-light">{data.eyebrow}</EyebrowTag>
            <TitleTag {...title.props} className="hp2-h2 is-light">
              {data.titleLead}
              <br />
              <TitleEmTag {...titleEm.props}>{data.titleEm}</TitleEmTag>
            </TitleTag>
            <IntroTag {...intro.props} className="hp2-intro is-light">{data.intro}</IntroTag>
          </div>
          <div className="hp2-pricing__toggle-wrap">
            <div
              className="hp2-pricing__toggle"
              role="tablist"
              data-active={annual ? 'annual' : 'monthly'}
            >
              <button
                type="button"
                role="tab"
                aria-selected={!annual}
                className={`hp2-pricing__toggle-btn${!annual ? ' is-active' : ''}`}
                onClick={() => setAnnual(false)}
              >
                <MonthlyLabelTag {...monthlyLabel.props}>{data.monthlyLabel}</MonthlyLabelTag>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={annual}
                className={`hp2-pricing__toggle-btn${annual ? ' is-active' : ''}`}
                onClick={() => setAnnual(true)}
              >
                <AnnualLabelTag {...annualLabel.props}>{data.annualLabel}</AnnualLabelTag>{' '}
                <SavingsTag {...savings.props} className="hp2-pricing__toggle-save">{data.annualSavingsLabel}</SavingsTag>
              </button>
            </div>
          </div>
        </div>

        <div className="hp2-pricing__cards">
          {data.plans.map((p, i) => {
            const price = annual ? p.priceAnnual : p.priceMonthly;
            const badge = getConvertedNodeBinding(data, { field: `plans.${i}.badge`, defaultTag: 'div' });
            const BadgeTag = badge.Tag;
            const name = getConvertedNodeBinding(data, { field: `plans.${i}.name`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const NameTag = name.Tag;
            const desc = getConvertedNodeBinding(data, { field: `plans.${i}.description`, defaultTag: 'p' });
            const DescTag = desc.Tag;
            const priceFieldKey = annual ? `plans.${i}.priceAnnual` : `plans.${i}.priceMonthly`;
            const priceB = getConvertedNodeBinding(data, { field: priceFieldKey, defaultTag: 'span' });
            const PriceTag = priceB.Tag;
            const ctaLabel = getConvertedNodeBinding(data, { field: `plans.${i}.ctaLabel`, defaultTag: 'span' });
            const CtaLabelTag = ctaLabel.Tag;
            return (
              <div
                key={i}
                className={`hp2-plan hp2-plan--${p.color}${p.featured ? ' hp2-plan--featured' : ''}`}
              >
                {p.featured ? <div className="hp2-plan__glow" aria-hidden="true" /> : null}
                {p.badge ? <BadgeTag {...badge.props} className="hp2-plan__badge">{p.badge}</BadgeTag> : null}
                <div className="hp2-plan__top">
                  <div className="hp2-plan__icon">
                    <Icon name={p.icon as IconName} size={20} />
                  </div>
                  <NameTag {...name.props} className="hp2-plan__name">{p.name}</NameTag>
                  <DescTag {...desc.props} className="hp2-plan__desc">{p.description}</DescTag>
                </div>
                <div className="hp2-plan__price">
                  <span className="hp2-plan__currency">$</span>
                  <PriceTag {...priceB.props} className="hp2-plan__amount">{price.toLocaleString()}</PriceTag>
                  <span className="hp2-plan__per">/mo</span>
                </div>
                <div className="hp2-plan__divider" />
                <ul className="hp2-plan__features">
                  {p.features.map((f, j) => {
                    const fB = getConvertedNodeBinding(data, { field: `plans.${i}.features.${j}`, defaultTag: 'span' });
                    const FTag = fB.Tag;
                    return (
                      <li key={j}>
                        <span className="hp2-plan__check">
                          <Icon name="check" size={14} />
                        </span>
                        <FTag {...fB.props}>{f}</FTag>
                      </li>
                    );
                  })}
                </ul>
                <Link href={p.ctaHref} className="hp2-plan__cta">
                  <CtaLabelTag {...ctaLabel.props}>{p.ctaLabel}</CtaLabelTag>
                  <Icon name="arrow" size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="hp2-pricing__note">
          <FootLeadTag {...footLead.props}>{data.footnoteLead}</FootLeadTag>{' '}
          <Link href={data.footnoteLinkHref} className="hp2-pricing__note-link">
            <FootLinkTag {...footLink.props}>{data.footnoteLinkLabel}</FootLinkTag>
          </Link>
        </p>
      </div>
    </section>
  );
}
