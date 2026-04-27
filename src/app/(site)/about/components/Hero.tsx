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
    <section className="ab2-hero">
      <div className="ab2-hero__bg" aria-hidden="true">
        <div className="ab2-hero__orb ab2-hero__orb--1" />
        <div className="ab2-hero__orb ab2-hero__orb--2" />
        <div className="ab2-hero__grid" />
      </div>
      <div className="ab2-wrap ab2-hero__inner">
        <BadgeTag {...badge.props} className="ab2-hero__badge">
          <i className="ab2-hero__dot" />
          {data.badge}
        </BadgeTag>
        <HeadingTag {...heading.props} className="ab2-hero__h1">{renderEmHtml(data.heading)}</HeadingTag>
        <SubTag {...sub.props} className="ab2-hero__sub">{data.sub}</SubTag>
      </div>
    </section>
  );
}
