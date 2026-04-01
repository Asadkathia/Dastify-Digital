import type { HomepageContent } from '@/lib/homepage-content';

type ServicesProps = {
  data: HomepageContent['services'];
};

export function Services({ data }: ServicesProps) {
  return (
    <section className="svcs sp" id={data.id}>
      <span className="sec-wm g2">S</span>
      <div className="wrap">
        <div className="svcs-head" data-r>
          <div>
            <span className="chip" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <span className="chip-dot" />
              {data.chip}
            </span>
            <h2 className="svcs-h2">
              {data.titleLines[0]}
              <br />
              {data.titleLines[1]}
            </h2>
          </div>
          <p className="svcs-sub">{data.description}</p>
        </div>

        <div className="svc-list" data-r data-delay="1">
          {data.items.map((item) => (
            <div key={item.number} className="svc-item">
              <div className="svc-n">{item.number}</div>
              <div className="svc-name-wrap">
                <div className="svc-name">{item.name}</div>
                <div className="svc-desc">{item.description}</div>
              </div>
              <div className="svc-img">
                <img src={item.image} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="svc-arr">↗</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
