import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function WhyDifferent({ data }: { data: PageContent['whyDifferent'] }) {
  return (
    <section className="sv2-why">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <div className="sv2-eyebrow">{data.eyebrow}</div>
          <h2 className="sv2-h2">{renderEmHtml(data.heading)}</h2>
          <p className="sv2-intro">{data.intro}</p>
        </div>
        <div className="sv2-why__grid">
          {data.challenges.map((c, i) => (
            <div key={i} className="sv2-why__card">
              <div className="sv2-why__card-icon">
                <Icon name={c.icon as IconName} size={22} />
              </div>
              <h4>{c.title}</h4>
              <p className="sv2-why__problem">{c.problem}</p>
              <div className="sv2-why__divider">
                <Icon name="arrow" size={14} />
              </div>
              <p className="sv2-why__solution">{c.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
