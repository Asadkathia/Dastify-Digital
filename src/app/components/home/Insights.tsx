import type { HomepageContent } from '@/lib/homepage-content';

type InsightsProps = {
  data: HomepageContent['insights'];
};

export function Insights({ data }: InsightsProps) {
  const [titleTop, titleBottom] = data.title.split('\n');

  return (
    <section className="insights sp" id={data.id}>
      <span className="sec-wm g1">I</span>
      <div className="wrap">
        <div className="insights-head">
          <div>
            <div data-r>
              <span className="chip" style={{ marginBottom: '12px' }}>
                <span className="chip-dot" />
                {data.chip}
              </span>
            </div>
            <h2 className="insights-h2" data-r data-delay="1">
              {titleTop}
              <br />
              {titleBottom}
            </h2>
          </div>
          <button className="btn-ol" data-r type="button">
            {data.cta}
          </button>
        </div>

        <div className="blog-grid">
          {data.items.map((item, index) => (
            <div key={item.title} className="blog-card" data-r data-delay={((index % 3) + 1).toString()}>
              <div className="blog-img img-reveal">
                <img src={item.image} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="blog-info">
                <div className="blog-date">{item.date}</div>
                <div className="blog-title">{item.title}</div>
                <a className="blog-link" href="#">
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
