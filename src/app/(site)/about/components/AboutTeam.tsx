import Link from "next/link";

export type AboutTeamData = {
  watermark: string;
  chip: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  cta: { label: string; href: string };
  visuals: { icon: string; label: string; dimensions: string; height: string; className: string }[];
};

export default function AboutTeam({ data }: { data: AboutTeamData }) {
  return (
    <section className="about-team">
      <span className="sec-wm g2">{data.watermark}</span>
      <div className="wrap">
        <div className="about-team-inner">
          <div className="about-team-content">
            <div className="chip about-team-chip" data-r>
              <span className="chip-dot" />
              {data.chip}
            </div>
            <h2 className="h1 about-team-title" data-r data-delay="1">
              {data.title}
            </h2>
            <p className="about-team-desc" data-r data-delay="2">
              {data.description}
            </p>
            <div className="about-team-stats" data-r data-delay="3">
              {data.stats.map((item, index) => (
                <div className="about-team-stat" key={`about-team-stat-${item.label}-${index}`}>
                  <div className="about-stat-num">{item.value}</div>
                  <div className="about-stat-lbl">{item.label}</div>
                </div>
              ))}
            </div>
            <Link href={data.cta.href} className="btn-dk" data-r data-delay="4">
              {data.cta.label}
            </Link>
          </div>
          <div className="about-team-visual">
            {data.visuals.map((item, index) => (
              <div className={`iph ${item.className}`} style={{ height: item.height }} data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-team-visual-${item.label}-${index}`}>
                <div className="iph-ic">{item.icon}</div>
                <span className="iph-lbl">{item.label}</span>
                <span className="iph-dim">{item.dimensions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
