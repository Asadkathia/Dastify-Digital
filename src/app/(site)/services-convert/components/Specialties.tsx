'use client';

import { useState } from 'react';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Specialties({ data }: { data: PageContent['specialties'] }) {
  const firstSlug = data.tabs[0]?.slug ?? '';
  const [active, setActive] = useState<string>(firstSlug);
  const activeIndex = Math.max(0, data.tabs.findIndex((t) => t.slug === active));
  const tab = data.tabs[activeIndex];

  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  const note = getConvertedNodeBinding(data, { field: 'note', defaultTag: 'span' });
  const NoteTag = note.Tag;
  const noteCtaLabel = getConvertedNodeBinding(data, { field: 'noteCta.label', defaultTag: 'span' });
  const NoteCtaLabelTag = noteCtaLabel.Tag;

  const headlineB = tab ? getConvertedNodeBinding(data, { field: `tabs.${activeIndex}.headline`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] }) : null;
  const descB = tab ? getConvertedNodeBinding(data, { field: `tabs.${activeIndex}.description`, defaultTag: 'p' }) : null;

  return (
    <section className="sv2-specs">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="sv2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="sv2-h2" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
          <IntroTag {...intro.props} className="sv2-intro">{data.intro}</IntroTag>
        </div>
        <div className="sv2-specs__tabs" role="tablist">
          {data.tabs.map((t, i) => {
            const lB = getConvertedNodeBinding(data, { field: `tabs.${i}.label`, defaultTag: 'span' });
            const LTag = lB.Tag;
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={active === t.slug}
                className={'sv2-specs__tab' + (active === t.slug ? ' is-active' : '')}
                onClick={() => setActive(t.slug)}
              >
                <span className="sv2-specs__tab-icon"><Icon name="pulse" size={16} /></span>
                <LTag {...lB.props}>{t.label}</LTag>
              </button>
            );
          })}
        </div>
        {tab && headlineB && descB ? (
          <div className="sv2-specs__panel" role="tabpanel">
            {(() => { const HTag = headlineB.Tag; return <HTag {...headlineB.props} className="sv2-specs__panel-title">{tab.headline}</HTag>; })()}
            {(() => { const DTag = descB.Tag; return <DTag {...descB.props} className="sv2-specs__panel-desc">{tab.description}</DTag>; })()}
            <ul className="sv2-specs__panel-list">
              {tab.bullets.map((b, i) => {
                const bB = getConvertedNodeBinding(data, { field: `tabs.${activeIndex}.bullets.${i}`, defaultTag: 'span' });
                const BTag = bB.Tag;
                return (
                  <li key={i}>
                    <Icon name="check" size={14} />
                    <BTag {...bB.props}>{b}</BTag>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <p className="sv2-specs__note">
          <NoteTag {...note.props}>{data.note}</NoteTag>{' '}
          <a href={data.noteCta.href} className="sv2-specs__note-link">
            <NoteCtaLabelTag {...noteCtaLabel.props}>{data.noteCta.label}</NoteCtaLabelTag>
          </a>
        </p>
      </div>
    </section>
  );
}
