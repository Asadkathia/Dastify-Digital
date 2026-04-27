import Link from 'next/link';
import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Article({ data }: { data: PageContent['article'] }) {
  return (
    <section className="bp2-content">
      <div className="bp2-wrap">
        <div className="bp2-layout">
          <article className="bp2-article">
            <p className="bp2-lead">{renderEmHtml(data.lead)}</p>
            {/* bodyHtml is trusted markup originating from Payload's rich-text export
                or from this file's defaultContent — both authored, never user input. */}
            <div className="bp2-prose" dangerouslySetInnerHTML={{ __html: data.bodyHtml }} />

            <div className="bp2-cta-inline">
              <h3>{data.inlineCta.heading}</h3>
              <p>{data.inlineCta.body}</p>
              <Link href={data.inlineCta.ctaHref} className="bp2-btn bp2-btn--primary bp2-btn--md">
                <Icon name="calendar" size={16} />
                <span>{data.inlineCta.ctaLabel}</span>
              </Link>
            </div>
          </article>

          <aside className="bp2-sidebar">
            <div className="bp2-sidebar__card">
              <h4>{data.sidebar.tocTitle}</h4>
              <ul className="bp2-toc">
                {data.sidebar.toc.map((item) => (
                  <li key={item.anchor}>
                    <a href={`#${item.anchor}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bp2-sidebar__card">
              <h4>{data.sidebar.cta.heading}</h4>
              <p>{data.sidebar.cta.body}</p>
              <Link href={data.sidebar.cta.ctaHref} className="bp2-btn bp2-btn--primary bp2-btn--sm bp2-btn--full">
                <Icon name="calendar" size={14} />
                <span>{data.sidebar.cta.ctaLabel}</span>
              </Link>
            </div>

            <div className="bp2-sidebar__card">
              <h4>{data.sidebar.categoriesTitle}</h4>
              <div className="bp2-sidebar__tags">
                {data.sidebar.categories.map((c) => (
                  <Link key={c.label} href={c.href} className="bp2-badge bp2-badge--neutral">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
