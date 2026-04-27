import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Comparison({ data }: { data: PageContent['comparison'] }) {
  return (
    <section className="sv2-comparison">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center">
          <div className="sv2-eyebrow">{data.eyebrow}</div>
          <h2 className="sv2-h2">{renderEmHtml(data.heading)}</h2>
          <p className="sv2-intro">{data.intro}</p>
        </div>
        <div className="sv2-compare">
          <div className="sv2-compare__head">
            <div className="sv2-compare__col-bad">{data.badHeader}</div>
            <div className="sv2-compare__arrow-col" aria-hidden="true" />
            <div className="sv2-compare__col-good">{data.goodHeader}</div>
          </div>
          {data.rows.map((r, i) => (
            <div key={i} className="sv2-compare__row">
              <div className="sv2-compare__bad">
                <Icon name="heart" size={16} />
                <span>{r.bad}</span>
              </div>
              <div className="sv2-compare__arrow-col">
                <Icon name="arrow" size={20} />
              </div>
              <div className="sv2-compare__good">
                <div className="sv2-compare__good-icon">
                  <Icon name={r.icon as IconName} size={20} />
                </div>
                <div>
                  <b>{r.good}</b>
                  <p>{r.goodSub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sv2-compare__cta">
          <a href={data.cta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="calendar" size={18} />
            <span>{data.cta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
