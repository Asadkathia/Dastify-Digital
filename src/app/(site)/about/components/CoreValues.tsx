import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function CoreValues({ data }: { data: PageContent['coreValues'] }) {
  return (
    <section className="ab2-values">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <div className="ab2-eyebrow">{data.eyebrow}</div>
          <h2 className="ab2-h2">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="ab2-values__grid">
          {data.items.map((v, i) => (
            <div key={i} className="ab2-values__card">
              <div className="ab2-values__card-icon">
                <Icon name={v.icon as IconName} size={22} />
              </div>
              <h4>{v.title}</h4>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
