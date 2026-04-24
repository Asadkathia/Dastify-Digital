import type { HomepageContent } from '@/lib/homepage-content';
import { Icon, type IconName } from './_icons';

export default function Services({ data }: { data: HomepageContent['services'] }) {
  return (
    <section className="hp2-services">
      <div className="hp2-wrap">
        <div className="hp2-section-head">
          <div className="hp2-eyebrow">{data.eyebrow}</div>
          <h2 className="hp2-h2">
            {data.titleLead}
            <br />
            <em>{data.titleEm}</em>
            {data.titleTail}
          </h2>
          <p className="hp2-intro">{data.intro}</p>
        </div>
        <div className="hp2-services__grid">
          {data.items.map((s, i) => (
            <div key={i} className="hp2-svc">
              <div className="hp2-svc__head">
                <div className="hp2-svc__icon">
                  <Icon name={s.icon as IconName} size={22} />
                </div>
                <h3 className="hp2-svc__name">{s.name}</h3>
              </div>
              <p className="hp2-svc__desc">{s.description}</p>
              <span className="hp2-svc__link">
                Learn more <Icon name="arrow" size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
