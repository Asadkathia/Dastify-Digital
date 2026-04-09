export type AboutValuesData = {
  chip: string;
  title: string;
  intro: string;
  items: { icon: string; title: string; description: string }[];
};

export default function AboutValues({ data }: { data: AboutValuesData }) {
  return (
    <section className="about-values">
      <div className="wrap">
        <div className="about-values-header">
          <div className="chip about-values-chip" data-r>
            <span className="chip-dot about-chip-purple" />
            {data.chip}
          </div>
          <h2 className="h1 about-values-title" data-r data-delay="1">
            {data.title}
          </h2>
          <p className="about-values-intro" data-r data-delay="2">
            {data.intro}
          </p>
        </div>
        <div className="about-values-grid">
          {data.items.map((item, index) => (
            <div className="about-value-item" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-value-${item.title}-${index}`}>
              <div className="about-value-icon">{item.icon}</div>
              <h3 className="about-value-title">{item.title}</h3>
              <p className="about-value-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
