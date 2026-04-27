import Link from 'next/link';
import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';

export default function Hero({ data }: { data: PageContent['hero'] }) {
  return (
    <section className="bp2-hero">
      <div className="bp2-hero__bg" aria-hidden="true">
        <div className="bp2-hero__orb bp2-hero__orb--1" />
        <div className="bp2-hero__orb bp2-hero__orb--2" />
        <div className="bp2-hero__grid" />
      </div>
      <div className="bp2-wrap bp2-hero__inner">
        <Link href={data.backHref} className="bp2-back">
          <Icon name="arrow" size={14} className="bp2-back__icon" />
          <span>{data.backLabel}</span>
        </Link>
        <span className="bp2-badge bp2-badge--primary bp2-hero__cat">{data.category}</span>
        <h1 className="bp2-hero__h1">{data.title}</h1>
        <div className="bp2-meta">
          {data.date} · {data.read} · By {data.author.name}
        </div>
      </div>
    </section>
  );
}
