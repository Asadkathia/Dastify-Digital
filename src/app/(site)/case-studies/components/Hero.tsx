import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  return (
    <section className="cs2-hero">
      <div className="cs2-hero__bg" aria-hidden="true">
        <div className="cs2-hero__orb cs2-hero__orb--1" />
        <div className="cs2-hero__orb cs2-hero__orb--2" />
        <div className="cs2-hero__grid" />
      </div>
      <div className="cs2-wrap cs2-hero__inner">
        <div className="cs2-hero__badge">
          <i className="cs2-hero__dot" />
          {data.badge}
        </div>
        <h1 className="cs2-hero__h1">{renderEmHtml(data.heading)}</h1>
        <p className="cs2-hero__sub">{data.sub}</p>
      </div>
    </section>
  );
}
