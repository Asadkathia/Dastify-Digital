import type { PageBuilderBlock } from './types';

type StatsBlockProps = Extract<PageBuilderBlock, { type: 'stats' }>;

export function StatsBlock(props: StatsBlockProps) {
  return (
    <section className="sp">
      <div className="wrap">
        {props.title ? <h2 style={{ marginBottom: '20px' }}>{props.title}</h2> : null}
        <div className="hero-stats" style={{ borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          {props.items.map((item) => (
            <div key={`${item.label}-${item.value}`} className="hero-stat">
              <div className="hero-stat-n">{item.value}</div>
              <div className="hero-stat-l">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
