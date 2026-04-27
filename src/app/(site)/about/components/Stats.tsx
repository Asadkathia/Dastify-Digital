import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';
import AnimCounter from '../../home/components/_AnimCounter';

export default function Stats({ data }: { data: PageContent['stats'] }) {
  return (
    <section className="ab2-stats">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center ab2-section-head--light">
          <div className="ab2-eyebrow ab2-eyebrow--light">{data.eyebrow}</div>
          <h2 className="ab2-h2 ab2-h2--light">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="ab2-stats__grid">
          {data.items.map((s, i) => (
            <div key={i} className="ab2-stats__tile">
              <AnimCounter value={s.value} label={s.label} className="ab2-stats__counter" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
