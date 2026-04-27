import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Process({ data }: { data: PageContent['process'] }) {
  return (
    <section className="sv2-process">
      <div className="sv2-wrap">
        <div className="sv2-section-head sv2-section-head--center sv2-section-head--light">
          <h2 className="sv2-h2 sv2-h2--light">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="sv2-process__track">
          {data.steps.map((s, i) => (
            <div key={i} className="sv2-process__step">
              <div className="sv2-process__num">{i + 1}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
