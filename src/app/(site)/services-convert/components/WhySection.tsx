type WhyData = {
  chip: string;
  title: string;
  lead: string;
  cards: { icon: string; title: string; description: string }[];
};

export default function WhySection({ data }: { data: WhyData }) {
  return (
    <section className="svc-convert-why">
      <div className="wrap">
        <div className="svc-convert-why-inner">
          <div className="svc-convert-why-content">
            <div className="chip svc-convert-why-chip" data-r>
              <span className="chip-dot svc-convert-blue-dot"></span>
              {data.chip}
            </div>
            <h2 className="svc-convert-why-title" data-r data-delay="1">
              {data.title}
            </h2>
            <p className="svc-convert-why-lead" data-r data-delay="2">
              {data.lead}
            </p>
          </div>
          <div className="svc-convert-why-cards">
            {data.cards.map((card, index) => (
              <div key={card.title} className="svc-convert-why-card" data-r data-delay={index === 0 ? undefined : String(index)}>
                <div className="svc-convert-why-card-icon">{card.icon}</div>
                <h3 className="svc-convert-why-card-title">{card.title}</h3>
                <p className="svc-convert-why-card-desc">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
