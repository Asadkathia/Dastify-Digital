import Link from 'next/link';
import type { PageContent } from '../content';
import { Icon } from '../../home/components/_icons';

export default function FinalCta({ data }: { data: PageContent['finalCta'] }) {
  return (
    <section className="ab2-cta">
      <div className="ab2-wrap">
        <div className="ab2-cta__box">
          <div className="ab2-cta__orb" aria-hidden="true" />
          <div className="ab2-cta__content">
            <h2>{data.heading}</h2>
            <p>{data.sub}</p>
            <div className="ab2-cta__btns">
              <Link href={data.primary.href} className="ab2-btn ab2-btn--primary ab2-btn--lg">
                <Icon name="calendar" size={18} />
                <span>{data.primary.label}</span>
              </Link>
              <a href={data.phone.href} className="ab2-btn ab2-btn--outline ab2-btn--lg">
                <span>{data.phone.label}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
