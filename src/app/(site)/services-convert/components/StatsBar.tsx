import type { PageContent } from '../content';
import AnimCounter from '../../home/components/_AnimCounter';

const COLOR_VAR: Record<'primary' | 'accent' | 'support', string> = {
  primary: 'var(--primary)',
  accent: 'var(--accent)',
  support: 'var(--support)',
};

export default function StatsBar({ data }: { data: PageContent['stats'] }) {
  return (
    <section className="sv2-stats">
      <div className="sv2-wrap">
        <div className="sv2-stats__label">{data.label}</div>
        <div className="sv2-stats__grid">
          {data.items.map((s, i) => (
            <div key={i} className="sv2-stat">
              {s.arrow ? <span className="sv2-stat__arrow" style={{ color: COLOR_VAR[s.color] }}>{s.arrow}</span> : null}
              <AnimCounter value={s.value} label={s.label} color={COLOR_VAR[s.color]} className="sv2-stat__counter" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
