import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon } from './_icons';

export default function FinalCta({ data }: { data: HomepageContent['finalCta'] }) {
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const body = getConvertedNodeBinding(data, { field: 'body', defaultTag: 'p' });
  const BodyTag = body.Tag;
  const primaryLabel = getConvertedNodeBinding(data, { field: 'primaryCta.label', defaultTag: 'span' });
  const PrimaryLabelTag = primaryLabel.Tag;
  const secondaryLabel = getConvertedNodeBinding(data, { field: 'secondaryCta.label', defaultTag: 'span' });
  const SecondaryLabelTag = secondaryLabel.Tag;
  return (
    <section className="hp2-final">
      <div className="hp2-wrap">
        <div className="hp2-final__box">
          <div className="hp2-final__orb" aria-hidden="true" />
          <div className="hp2-final__content">
            <HeadingTag {...heading.props}>{data.heading}</HeadingTag>
            <BodyTag {...body.props}>{data.body}</BodyTag>
          </div>
          <div className="hp2-final__btns">
            <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
              <Icon name="calendar" size={18} />
              <PrimaryLabelTag {...primaryLabel.props}>{data.primaryCta.label}</PrimaryLabelTag>
            </Link>
            <a href={data.secondaryCta.href} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
              <Icon name="phone" size={18} />
              <SecondaryLabelTag {...secondaryLabel.props}>{data.secondaryCta.label}</SecondaryLabelTag>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
