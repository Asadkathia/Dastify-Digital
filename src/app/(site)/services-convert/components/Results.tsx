type ResultsData = {
  headline: string;
  stats: { value: string; label: string }[];
};

export default function Results({ data }: { data: ResultsData }) {
  return (
    <section className="svc-convert-results">
      <div className="wrap">
        <div className="svc-convert-results-inner">
          <h2 className="svc-convert-results-headline" data-r>
            {data.headline}
          </h2>
          {data.stats.map((stat, index) => (
            <div key={stat.label} className="svc-convert-results-stat" data-r data-delay={String(index + 1)}>
              <div className="svc-convert-stat-num">{stat.value}</div>
              <div className="svc-convert-stat-lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
