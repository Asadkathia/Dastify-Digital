import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtmlString } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  const badge = getConvertedNodeBinding(data, { field: 'badge', defaultTag: 'div' });
  const BadgeTag = badge.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'], richText: true });
  const HeadingTag = heading.Tag;
  const sub = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = sub.Tag;
  return (
    <section className="cs2-hero">
      <div className="cs2-hero__bg" aria-hidden="true">
        <div className="cs2-hero__orb cs2-hero__orb--1" />
        <div className="cs2-hero__orb cs2-hero__orb--2" />
        <div className="cs2-hero__grid" />
      </div>
      <div className="cs2-wrap cs2-hero__inner">
        <BadgeTag {...badge.props} className="cs2-hero__badge">
          <i className="cs2-hero__dot" />
          {data.badge}
        </BadgeTag>
        <HeadingTag {...heading.props} className="cs2-hero__h1" dangerouslySetInnerHTML={{ __html: renderEmHtmlString(data.heading) }} />
        <SubTag {...sub.props} className="cs2-hero__sub">{data.sub}</SubTag>
      </div>
    </section>
  );
}
