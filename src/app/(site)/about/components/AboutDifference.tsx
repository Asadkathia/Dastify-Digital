export type AboutDifferenceData = {
  chip: string;
  title: string;
  intro: string;
  cards: { number: string; title: string; description: string }[];
};

export default function AboutDifference({ data }: { data: AboutDifferenceData }) {
  return (
    <section className="about-difference">
      <div className="wrap">
        <div className="about-difference-header">
          <div className="chip about-difference-chip" data-r>
            <span className="chip-dot about-chip-purple" />
            {data.chip}
          </div>
          <h2 className="h1 about-difference-title" data-r data-delay="1">
            {data.title}
          </h2>
          <p className="about-difference-intro" data-r data-delay="2">
            {data.intro}
          </p>
        </div>
        <div className="about-difference-grid">
          {data.cards.map((item, index) => (
            <div className="about-difference-card" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-difference-${item.title}-${index}`}>
              <div className="about-difference-num">{item.number}</div>
              <h3 className="about-difference-card-title">{item.title}</h3>
              <p className="about-difference-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
