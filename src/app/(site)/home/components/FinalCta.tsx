import Link from 'next/link';
import type { HomepageContent } from '@/lib/homepage-content';
import { Icon } from './_icons';

export default function FinalCta({ data }: { data: HomepageContent['finalCta'] }) {
  return (
    <section className="hp2-final">
      <div className="hp2-wrap">
        <div className="hp2-final__box">
          <div className="hp2-final__orb" aria-hidden="true" />
          <div className="hp2-final__content">
            <h2>{data.heading}</h2>
            <p>{data.body}</p>
          </div>
          <div className="hp2-final__btns">
            <Link href={data.primaryCta.href} className="hp2-btn hp2-btn--primary hp2-btn--lg">
              <Icon name="calendar" size={18} />
              <span>{data.primaryCta.label}</span>
            </Link>
            <a href={data.secondaryCta.href} className="hp2-btn hp2-btn--outline-light hp2-btn--lg">
              <Icon name="phone" size={18} />
              <span>{data.secondaryCta.label}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
