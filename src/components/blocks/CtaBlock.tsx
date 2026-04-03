import Link from 'next/link';
import type { PageBuilderBlock } from './types';

type CtaBlockProps = Extract<PageBuilderBlock, { type: 'cta' }>;

export function CtaBlock(props: CtaBlockProps) {
  return (
    <section className="cta-section sp">
      <div className="wrap">
        <div className="cta-inner">
          <h2 className="cta-h2">{props.title}</h2>
          {props.subtitle ? <p className="cta-sub">{props.subtitle}</p> : null}
          <div style={{ marginTop: '16px' }}>
            <Link className="btn-pu" href={props.buttonHref}>
              {props.buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
