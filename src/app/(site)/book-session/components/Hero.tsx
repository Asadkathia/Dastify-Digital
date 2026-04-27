import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  return (
    <section className="bk2-hero">
      <div className="bk2-hero__bg" aria-hidden="true">
        <div className="bk2-hero__orb bk2-hero__orb--1" />
        <div className="bk2-hero__orb bk2-hero__orb--2" />
        <div className="bk2-hero__grid" />
      </div>
      <div className="bk2-wrap bk2-hero__inner">
        <div className="bk2-hero__badge">
          <i className="bk2-hero__dot" />
          {data.badge}
        </div>
        <h1 className="bk2-hero__h1">{renderEmHtml(data.heading)}</h1>
        <p className="bk2-hero__sub">{data.sub}</p>
      </div>
    </section>
  );
}
