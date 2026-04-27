import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Trust({ data }: { data: PageContent['trust'] }) {
  return (
    <section className="ab2-trust">
      <div className="ab2-wrap">
        <div className="ab2-section-head ab2-section-head--center">
          <div className="ab2-eyebrow">{data.eyebrow}</div>
          <h2 className="ab2-h2">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="ab2-trust__logos">
          {data.logos.map((l) => (
            <div key={l.slug} className="ab2-trust__logo">
              {l.label}
            </div>
          ))}
        </div>
        <div className="ab2-trust__badges">
          <span className="ab2-trust__badges-label">{data.badgesLabel}</span>
          <div className="ab2-trust__badges-row">
            {data.badges.map((b) => (
              // TODO(assets): drop real badge PNG at public/trust-badges/<slug>.png and switch to <img src=...>
              <div key={b.slug} className="iph ab2-trust__badge-ph" aria-label={b.alt}>
                <span>{b.alt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
