'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon, type IconName } from './_icons';

export default function Pricing({ data }: { data: HomepageContent['pricing'] }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="hp2-pricing">
      <div className="hp2-wrap">
        <div className="hp2-pricing__header">
          <div className="hp2-pricing__header-left">
            <div className="hp2-eyebrow is-light">{data.eyebrow}</div>
            <h2 className="hp2-h2 is-light">
              {data.titleLead}
              <br />
              <em>{data.titleEm}</em>
            </h2>
            <p className="hp2-intro is-light">{data.intro}</p>
          </div>
          <div className="hp2-pricing__toggle-wrap">
            <div className="hp2-pricing__toggle" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={!annual}
                className={`hp2-pricing__toggle-btn${!annual ? ' is-active' : ''}`}
                onClick={() => setAnnual(false)}
              >
                {data.monthlyLabel}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={annual}
                className={`hp2-pricing__toggle-btn${annual ? ' is-active' : ''}`}
                onClick={() => setAnnual(true)}
              >
                {data.annualLabel}{' '}
                <span className="hp2-pricing__toggle-save">{data.annualSavingsLabel}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hp2-pricing__cards">
          {data.plans.map((p, i) => {
            const price = annual ? p.priceAnnual : p.priceMonthly;
            return (
              <div
                key={i}
                className={`hp2-plan hp2-plan--${p.color}${p.featured ? ' hp2-plan--featured' : ''}`}
              >
                {p.featured ? <div className="hp2-plan__glow" aria-hidden="true" /> : null}
                {p.badge ? <div className="hp2-plan__badge">{p.badge}</div> : null}
                <div className="hp2-plan__top">
                  <div className="hp2-plan__icon">
                    <Icon name={p.icon as IconName} size={20} />
                  </div>
                  <h3 className="hp2-plan__name">{p.name}</h3>
                  <p className="hp2-plan__desc">{p.description}</p>
                </div>
                <div className="hp2-plan__price">
                  <span className="hp2-plan__currency">$</span>
                  <span className="hp2-plan__amount">{price.toLocaleString()}</span>
                  <span className="hp2-plan__per">/mo</span>
                </div>
                <div className="hp2-plan__divider" />
                <ul className="hp2-plan__features">
                  {p.features.map((f, j) => (
                    <li key={j}>
                      <span className="hp2-plan__check">
                        <Icon name="check" size={14} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={p.ctaHref} className="hp2-plan__cta">
                  <span>{p.ctaLabel}</span>
                  <Icon name="arrow" size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="hp2-pricing__note">
          {data.footnoteLead}{' '}
          <Link href={data.footnoteLinkHref} className="hp2-pricing__note-link">
            {data.footnoteLinkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
