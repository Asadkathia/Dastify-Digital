import Link from 'next/link';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Article({ data }: { data: PageContent['article'] }) {
  const lead = getConvertedNodeBinding(data, { field: 'lead', defaultTag: 'p', richText: true });
  const LeadTag = lead.Tag;
  const inlineH = getConvertedNodeBinding(data, { field: 'inlineCta.heading', defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const InlineHTag = inlineH.Tag;
  const inlineB = getConvertedNodeBinding(data, { field: 'inlineCta.body', defaultTag: 'p' });
  const InlineBTag = inlineB.Tag;
  const inlineL = getConvertedNodeBinding(data, { field: 'inlineCta.ctaLabel', defaultTag: 'span' });
  const InlineLTag = inlineL.Tag;
  const tocTitle = getConvertedNodeBinding(data, { field: 'sidebar.tocTitle', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const TocTitleTag = tocTitle.Tag;
  const sCtaH = getConvertedNodeBinding(data, { field: 'sidebar.cta.heading', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const SCtaHTag = sCtaH.Tag;
  const sCtaB = getConvertedNodeBinding(data, { field: 'sidebar.cta.body', defaultTag: 'p' });
  const SCtaBTag = sCtaB.Tag;
  const sCtaL = getConvertedNodeBinding(data, { field: 'sidebar.cta.ctaLabel', defaultTag: 'span' });
  const SCtaLTag = sCtaL.Tag;
  const catsTitle = getConvertedNodeBinding(data, { field: 'sidebar.categoriesTitle', defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
  const CatsTitleTag = catsTitle.Tag;
  return (
    <section className="bp2-content">
      <div className="bp2-wrap">
        <div className="bp2-layout">
          <article className="bp2-article">
            <LeadTag {...lead.props} className="bp2-lead" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.lead) }} />
            {/* bodyHtml is trusted markup originating from Payload's rich-text export
                or from this file's defaultContent — both authored, never user input. */}
            <div className="bp2-prose" dangerouslySetInnerHTML={{ __html: data.bodyHtml }} />

            <div className="bp2-cta-inline">
              <InlineHTag {...inlineH.props}>{data.inlineCta.heading}</InlineHTag>
              <InlineBTag {...inlineB.props}>{data.inlineCta.body}</InlineBTag>
              <Link href={data.inlineCta.ctaHref} className="bp2-btn bp2-btn--primary bp2-btn--md">
                <Icon name="calendar" size={16} />
                <InlineLTag {...inlineL.props}>{data.inlineCta.ctaLabel}</InlineLTag>
              </Link>
            </div>
          </article>

          <aside className="bp2-sidebar">
            <div className="bp2-sidebar__card">
              <TocTitleTag {...tocTitle.props}>{data.sidebar.tocTitle}</TocTitleTag>
              <ul className="bp2-toc">
                {data.sidebar.toc.map((item, i) => {
                  const lB = getConvertedNodeBinding(data, { field: `sidebar.toc.${i}.label`, defaultTag: 'span' });
                  const LTag = lB.Tag;
                  return (
                    <li key={item.anchor}>
                      <a href={`#${item.anchor}`}>
                        <LTag {...lB.props}>{item.label}</LTag>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bp2-sidebar__card">
              <SCtaHTag {...sCtaH.props}>{data.sidebar.cta.heading}</SCtaHTag>
              <SCtaBTag {...sCtaB.props}>{data.sidebar.cta.body}</SCtaBTag>
              <Link href={data.sidebar.cta.ctaHref} className="bp2-btn bp2-btn--primary bp2-btn--sm bp2-btn--full">
                <Icon name="calendar" size={14} />
                <SCtaLTag {...sCtaL.props}>{data.sidebar.cta.ctaLabel}</SCtaLTag>
              </Link>
            </div>

            <div className="bp2-sidebar__card">
              <CatsTitleTag {...catsTitle.props}>{data.sidebar.categoriesTitle}</CatsTitleTag>
              <div className="bp2-sidebar__tags">
                {data.sidebar.categories.map((c, i) => {
                  const lB = getConvertedNodeBinding(data, { field: `sidebar.categories.${i}.label`, defaultTag: 'span' });
                  const LTag = lB.Tag;
                  return (
                    <Link key={c.label} href={c.href} className="bp2-badge bp2-badge--neutral">
                      <LTag {...lB.props}>{c.label}</LTag>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
