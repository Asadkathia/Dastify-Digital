import type { PageContent } from '../content';
import { renderEmHtml } from '../../home/components/_emHtml';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  return (
    <section className="bl2-hero">
      <div className="bl2-hero__bg" aria-hidden="true">
        <div className="bl2-hero__orb bl2-hero__orb--1" />
        <div className="bl2-hero__orb bl2-hero__orb--2" />
        <div className="bl2-hero__grid" />
      </div>
      <div className="bl2-wrap bl2-hero__inner">
        <div className="bl2-hero__badge">
          <i className="bl2-hero__dot" />
          {data.badge}
        </div>
        <h1 className="bl2-hero__h1">{renderEmHtml(data.heading)}</h1>
        <p className="bl2-hero__sub">{data.sub}</p>
      </div>
    </section>
  );
}
