import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';

export default function Formula({ data }: { data: PageContent['formula'] }) {
  return (
    <section className="sv2-formula">
      <div className="sv2-wrap">
        <div className="sv2-eyebrow sv2-eyebrow--light sv2-formula__eyebrow">{data.eyebrow}</div>
        <div className="sv2-formula__grid">
          {data.items.map((it, i) => (
            <div key={i} className="sv2-formula__card">
              <div className="sv2-formula__icon">
                <Icon name={it.icon as IconName} size={28} />
              </div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
        <div className="sv2-formula__ctas">
          <a href={data.primaryCta.href} className="sv2-btn sv2-btn--primary sv2-btn--lg">
            <Icon name="arrow" size={18} />
            <span>{data.primaryCta.label}</span>
          </a>
          <a href={data.secondaryCta.href} className="sv2-btn sv2-btn--outline sv2-btn--lg">
            <span>{data.secondaryCta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
