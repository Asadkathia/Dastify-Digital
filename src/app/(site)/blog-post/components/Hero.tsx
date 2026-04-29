import Link from 'next/link';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  const backLabel = getConvertedNodeBinding(data, { field: 'backLabel', defaultTag: 'span' });
  const BackLabelTag = backLabel.Tag;
  const category = getConvertedNodeBinding(data, { field: 'category', defaultTag: 'span' });
  const CategoryTag = category.Tag;
  const title = getConvertedNodeBinding(data, { field: 'title', defaultTag: 'h1', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const dateB = getConvertedNodeBinding(data, { field: 'date', defaultTag: 'span' });
  const DateTag = dateB.Tag;
  const readB = getConvertedNodeBinding(data, { field: 'read', defaultTag: 'span' });
  const ReadTag = readB.Tag;
  return (
    <section className="bp2-hero">
      <div className="bp2-hero__bg" aria-hidden="true">
        <div className="bp2-hero__orb bp2-hero__orb--1" />
        <div className="bp2-hero__orb bp2-hero__orb--2" />
        <div className="bp2-hero__grid" />
      </div>
      <div className="bp2-wrap bp2-hero__inner">
        <Link href={data.backHref} className="bp2-back">
          <Icon name="arrow" size={14} className="bp2-back__icon" />
          <BackLabelTag {...backLabel.props}>{data.backLabel}</BackLabelTag>
        </Link>
        <CategoryTag {...category.props} className="bp2-badge bp2-badge--primary bp2-hero__cat">{data.category}</CategoryTag>
        <TitleTag {...title.props} className="bp2-hero__h1">{data.title}</TitleTag>
        <div className="bp2-meta">
          <DateTag {...dateB.props}>{data.date}</DateTag> · <ReadTag {...readB.props}>{data.read}</ReadTag> · By {data.author.name}
        </div>
      </div>
    </section>
  );
}
