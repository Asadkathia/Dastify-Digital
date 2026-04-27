import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  const badge = getConvertedNodeBinding(data, { field: 'badge', defaultTag: 'div' });
  const BadgeTag = badge.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const sub = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = sub.Tag;
  return (
    <section className="ct2-hero">
      <div className="ct2-hero__bg" aria-hidden="true">
        <div className="ct2-hero__orb ct2-hero__orb--1" />
        <div className="ct2-hero__orb ct2-hero__orb--2" />
        <div className="ct2-hero__grid" />
      </div>
      <div className="ct2-wrap ct2-hero__inner">
        <BadgeTag {...badge.props} className="ct2-hero__badge">
          <i className="ct2-hero__dot" />
          {data.badge}
        </BadgeTag>
        <HeadingTag {...heading.props} className="ct2-hero__h1">{renderEmHtml(data.heading)}</HeadingTag>
        <SubTag {...sub.props} className="ct2-hero__sub">{data.sub}</SubTag>
      </div>
    </section>
  );
}
