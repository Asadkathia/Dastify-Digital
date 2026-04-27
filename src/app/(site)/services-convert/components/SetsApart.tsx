import type { PageContent } from '../content';
import { Icon, type IconName } from '../../home/components/_icons';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function SetsApart({ data }: { data: PageContent['setsApart'] }) {
  return (
    <section className="sv2-apart">
      <div className="sv2-wrap">
        <div className="sv2-section-head">
          <div className="sv2-eyebrow">{data.eyebrow}</div>
          <h2 className="sv2-h2">{renderEmHtml(data.heading)}</h2>
        </div>
        <div className="sv2-apart__grid">
          {data.items.map((it, i) => (
            <div key={i} className="sv2-apart__card">
              <div className="sv2-apart__num">{String(i + 1).padStart(2, '0')}</div>
              <div className="sv2-apart__icon">
                <Icon name={it.icon as IconName} size={22} />
              </div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
