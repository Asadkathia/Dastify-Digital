import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Certifications({ data }: { data: PageContent['certifications'] }) {
  return (
    <section className="ab2-certs">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center ab2-section-head--light">
          <div className="ab2-eyebrow ab2-eyebrow--light">{data.eyebrow}</div>
          <h2 className="ab2-h2 ab2-h2--light">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="ab2-certs__grid">
          {data.items.map((c, i) => (
            <div key={i} className="ab2-certs__card">
              <div className="ab2-certs__icon">
                <Icon name={c.icon as IconName} size={24} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
