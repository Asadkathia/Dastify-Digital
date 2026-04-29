import type { PageContent } from '../content';
import { getConvertedNodeBinding, getConvertedImageBinding } from '@/components/converted-editor';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function WhyDifferent({ data }: { data: PageContent['whyDifferent'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const heading = getConvertedNodeBinding(data, { field: 'heading', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const HeadingTag = heading.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  return (
    <section className="sv2-why">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <EyebrowTag {...eyebrow.props} className="sv2-eyebrow">{data.eyebrow}</EyebrowTag>
          <HeadingTag {...heading.props} className="sv2-h2">{renderEmHtml(data.heading)}</HeadingTag>
          <IntroTag {...intro.props} className="sv2-intro">{data.intro}</IntroTag>
        </div>
        <div className="sv2-why__grid">
          {data.challenges.map((c, i) => {
            const tB = getConvertedNodeBinding(data, { field: `challenges.${i}.title`, defaultTag: 'h4', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const TTag = tB.Tag;
            const pB = getConvertedNodeBinding(data, { field: `challenges.${i}.problem`, defaultTag: 'p' });
            const PTag = pB.Tag;
            const sB = getConvertedNodeBinding(data, { field: `challenges.${i}.solution`, defaultTag: 'p' });
            const STag = sB.Tag;
            const iconB = getConvertedImageBinding(data, { field: `challenges.${i}.icon`, defaultAlt: c.title });
            return (
              <div key={i} className="sv2-why__card">
                <div className="sv2-why__card-icon" {...iconB.props}>
                  <Icon name={c.icon as IconName} size={22} />
                </div>
                <TTag {...tB.props}>{c.title}</TTag>
                <PTag {...pB.props} className="sv2-why__problem">{c.problem}</PTag>
                <div className="sv2-why__divider">
                  <Icon name="arrow" size={14} />
                </div>
                <STag {...sB.props} className="sv2-why__solution">{c.solution}</STag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
