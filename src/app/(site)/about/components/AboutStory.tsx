export type AboutStoryData = {
  watermark: string;
  chip: string;
  title: string;
  intro: string;
  items: { year: string; title: string; description: string }[];
};

export default function AboutStory({ data }: { data: AboutStoryData }) {
  return (
    <section className="about-story">
      <span className="sec-wm g3">{data.watermark}</span>
      <div className="wrap">
        <div className="about-story-header">
          <div className="chip about-story-chip" data-r>
            <span className="chip-dot about-chip-blue" />
            {data.chip}
          </div>
          <h2 className="h1 about-story-title" data-r data-delay="1">
            {data.title}
          </h2>
          <p className="about-story-intro" data-r data-delay="2">
            {data.intro}
          </p>
        </div>
        <div className="about-timeline">
          {data.items.map((item, index) => (
            <div className="about-timeline-item" data-r data-delay={index === 0 ? undefined : `${index}`} key={`about-timeline-${item.year}-${index}`}>
              <div className="about-timeline-content">
                <div className="about-timeline-year">{item.year}</div>
                <h3 className="about-timeline-title">{item.title}</h3>
                <p className="about-timeline-desc">{item.description}</p>
              </div>
              <div className="about-timeline-dot">
                <div className="about-timeline-dot-inner" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
