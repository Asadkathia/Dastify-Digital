import Link from 'next/link';
import type { PageContent } from '../content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from '../../home/components/_icons';

export default function FinalCta({ data }: { data: PageContent['finalCta'] }) {
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const sub = getConvertedNodeBinding(data, { field: 'sub', defaultTag: 'p' });
  const SubTag = sub.Tag;
  const pLabel = getConvertedNodeBinding(data, { field: 'primary.label', defaultTag: 'span' });
  const PLabelTag = pLabel.Tag;
  const phLabel = getConvertedNodeBinding(data, { field: 'phone.label', defaultTag: 'span' });
  const PhLabelTag = phLabel.Tag;
  return (
    <section className="ab2-cta">
      <div className="ab2-wrap">
        <div className="ab2-cta__box">
          <div className="ab2-cta__orb" aria-hidden="true" />
          <div className="ab2-cta__content">
            <HeadingTag {...heading.props}>{data.heading}</HeadingTag>
            <SubTag {...sub.props}>{data.sub}</SubTag>
            <div className="ab2-cta__btns">
              <Link href={data.primary.href} className="ab2-btn ab2-btn--primary ab2-btn--lg">
                <Icon name="calendar" size={18} />
                <PLabelTag {...pLabel.props}>{data.primary.label}</PLabelTag>
              </Link>
              <a href={data.phone.href} className="ab2-btn ab2-btn--outline ab2-btn--lg">
                <PhLabelTag {...phLabel.props}>{data.phone.label}</PhLabelTag>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
