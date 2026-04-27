'use client';

import { useState } from 'react';
import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Specialties({ data }: { data: PageContent['specialties'] }) {
  const firstSlug = data.tabs[0]?.slug ?? '';
  const [active, setActive] = useState<string>(firstSlug);
  const tab = data.tabContent[active];

  return (
    <section className="sv2-specs">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <div className="sv2-eyebrow">{data.eyebrow}</div>
          <h2 className="sv2-h2">{renderEmHtml(data.heading)}</h2>
          <p className="sv2-intro">{data.intro}</p>
        </div>
        <div className="sv2-specs__tabs" role="tablist">
          {data.tabs.map((t) => (
            <button
              key={t.slug}
              type="button"
              role="tab"
              aria-selected={active === t.slug}
              className={'sv2-specs__tab' + (active === t.slug ? ' is-active' : '')}
              onClick={() => setActive(t.slug)}
            >
              <span className="sv2-specs__tab-icon"><Icon name="pulse" size={16} /></span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        {tab ? (
          <div className="sv2-specs__panel" role="tabpanel">
            <h3 className="sv2-specs__panel-title">{tab.headline}</h3>
            <p className="sv2-specs__panel-desc">{tab.description}</p>
            <ul className="sv2-specs__panel-list">
              {tab.bullets.map((b, i) => (
                <li key={i}>
                  <Icon name="check" size={14} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="sv2-specs__note">
          {data.note}{' '}
          <a href={data.noteCta.href} className="sv2-specs__note-link">
            {data.noteCta.label}
          </a>
        </p>
      </div>
    </section>
  );
}
