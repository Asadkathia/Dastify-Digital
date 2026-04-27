import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Timeline({ data }: { data: PageContent['timeline'] }) {
  return (
    <section className="ab2-timeline">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <div className="ab2-eyebrow">{data.eyebrow}</div>
          <h2 className="ab2-h2">{renderEmHtml(data.heading)}</h2>
        </div>
        <div
          className="ab2-timeline__htrack"
          style={{ gridTemplateColumns: `repeat(${data.milestones.length}, 1fr)` }}
        >
          <div className="ab2-timeline__hline" aria-hidden="true" />
          {data.milestones.map((m, i) => (
            <div key={i} className="ab2-timeline__hitem">
              <div className="ab2-timeline__hdot" />
              <div className="ab2-timeline__hyear">{m.year}</div>
              <h4>{m.title}</h4>
              <p>{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
