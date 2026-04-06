import type { PageBuilderBlock } from './types';

type TestimonialsBlockProps = Extract<PageBuilderBlock, { type: 'testimonials' }>;

export function TestimonialsBlock(props: TestimonialsBlockProps) {
  return (
    <section className="sp">
      <div className="wrap">
        {props.title ? <h2 data-field="title" style={{ marginBottom: '20px' }}>{props.title}</h2> : null}
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {props.items.map((item) => (
            <article key={`${item.name}-${item.quote.slice(0, 30)}`} style={{ border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ marginBottom: '16px' }}>&ldquo;{item.quote}&rdquo;</p>
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              {item.role ? <div style={{ opacity: 0.8 }}>{item.role}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
