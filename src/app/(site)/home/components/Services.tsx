import type { HomepageContent } from '@/lib/homepage-content';
import { getConvertedNodeBinding } from '@/components/converted-editor';
import { Icon, type IconName } from './_icons';

export default function Services({ data }: { data: HomepageContent['services'] }) {
  const eyebrow = getConvertedNodeBinding(data, { field: 'eyebrow', defaultTag: 'div' });
  const EyebrowTag = eyebrow.Tag;
  const title = getConvertedNodeBinding(data, { field: 'titleLead', defaultTag: 'h2', allowedTags: ['h1', 'h2', 'h3', 'h4', 'p'] });
  const TitleTag = title.Tag;
  const titleEm = getConvertedNodeBinding(data, { field: 'titleEm', defaultTag: 'em' });
  const TitleEmTag = titleEm.Tag;
  const titleTail = getConvertedNodeBinding(data, { field: 'titleTail', defaultTag: 'span' });
  const TitleTailTag = titleTail.Tag;
  const intro = getConvertedNodeBinding(data, { field: 'intro', defaultTag: 'p' });
  const IntroTag = intro.Tag;
  return (
    <section className="hp2-services">
      <div className="hp2-wrap">
        <div className="hp2-section-head">
          <EyebrowTag {...eyebrow.props} className="hp2-eyebrow">{data.eyebrow}</EyebrowTag>
          <TitleTag {...title.props} className="hp2-h2">
            {data.titleLead}
            <br />
            <TitleEmTag {...titleEm.props}>{data.titleEm}</TitleEmTag>
            <TitleTailTag {...titleTail.props}>{data.titleTail}</TitleTailTag>
          </TitleTag>
          <IntroTag {...intro.props} className="hp2-intro">{data.intro}</IntroTag>
        </div>
        <div className="hp2-services__grid">
          {data.items.map((s, i) => {
            const name = getConvertedNodeBinding(data, { field: `items.${i}.name`, defaultTag: 'h3', allowedTags: ['h2', 'h3', 'h4', 'p'] });
            const NameTag = name.Tag;
            const desc = getConvertedNodeBinding(data, { field: `items.${i}.description`, defaultTag: 'p' });
            const DescTag = desc.Tag;
            return (
              <div key={i} className="hp2-svc">
                <div className="hp2-svc__head">
                  <div className="hp2-svc__icon">
                    <Icon name={s.icon as IconName} size={22} />
                  </div>
                  <NameTag {...name.props} className="hp2-svc__name">{s.name}</NameTag>
                </div>
                <DescTag {...desc.props} className="hp2-svc__desc">{s.description}</DescTag>
                <span className="hp2-svc__link">
                  Learn more <Icon name="arrow" size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
