import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';

export default function Testimonial({ data }: { data: HomepageContent['testimonial'] }) {
  const quoteLead = getConvertedNodeBinding(data, { field: 'quoteLead', defaultTag: 'span' });
  const QuoteLeadTag = quoteLead.Tag;
  const quoteEm = getConvertedNodeBinding(data, { field: 'quoteEm', defaultTag: 'em' });
  const QuoteEmTag = quoteEm.Tag;
  const quoteTail = getConvertedNodeBinding(data, { field: 'quoteTail', defaultTag: 'span' });
  const QuoteTailTag = quoteTail.Tag;
  const name = getConvertedNodeBinding(data, { field: 'authorName', defaultTag: 'div' });
  const NameTag = name.Tag;
  const role = getConvertedNodeBinding(data, { field: 'authorRole', defaultTag: 'div' });
  const RoleTag = role.Tag;
  return (
    <section className="hp2-testimonial">
      <div className="hp2-wrap">
        <div className="hp2-testimonial__inner">
          <div className="hp2-testimonial__quote">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ opacity: 0.15 }}
              aria-hidden="true"
            >
              <path
                d="M14 28c-3.3 0-6-2.7-6-6s2.7-6 6-6c0-5.5-4.5-10-10-10v-4c7.7 0 14 6.3 14 14 0 3.3-2.7 6-6 6h2zm20 0c-3.3 0-6-2.7-6-6s2.7-6 6-6c0-5.5-4.5-10-10-10v-4c7.7 0 14 6.3 14 14 0 3.3-2.7 6-6 6h2z"
                fill="currentColor"
              />
            </svg>
            <blockquote>
              <QuoteLeadTag {...quoteLead.props}>{data.quoteLead}</QuoteLeadTag>
              <QuoteEmTag {...quoteEm.props}>{data.quoteEm}</QuoteEmTag>
              <QuoteTailTag {...quoteTail.props}>{data.quoteTail}</QuoteTailTag>
            </blockquote>
          </div>
          <div className="hp2-testimonial__author">
            <div className="hp2-testimonial__avatar" aria-hidden="true">
              {data.authorInitials}
            </div>
            <div>
              <NameTag {...name.props} className="hp2-testimonial__name">{data.authorName}</NameTag>
              <RoleTag {...role.props} className="hp2-testimonial__role">{data.authorRole}</RoleTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
