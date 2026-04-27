import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';

export default function CtaBanner({ data }: { data: PageContent['ctaBanner'] }) {
  return (
    <section className="sv2-cta-banner">
      <div className="sv2-wrap">
        <div className="sv2-cta-banner__box">
          <div className="sv2-cta-banner__orb" aria-hidden="true" />
          <div className="sv2-cta-banner__content">
            <h2>{data.heading}</h2>
            <p>{data.sub}</p>
            <ul className="sv2-cta-banner__list">
              {data.bullets.map((b, i) => (
                <li key={i}>
                  <Icon name="check" size={16} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <a href={data.cta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg sv2-cta-banner__cta">
              <Icon name="calendar" size={18} />
              <span>{data.cta.label}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
