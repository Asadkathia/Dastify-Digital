import type { PageBuilderBlock } from './types';

type FaqBlockProps = Extract<PageBuilderBlock, { type: 'faq' }>;

export function FaqBlock(props: FaqBlockProps) {
  return (
    <section className="faq sp">
      <div className="wrap">
        {props.title ? <h2 className="faq-h2" style={{ marginBottom: '22px' }}>{props.title}</h2> : null}
        <div className="faq-list">
          {props.items.map((item) => (
            <article key={item.question} className="faq-item" style={{ padding: '18px 0' }}>
              <h3 className="faq-qt" style={{ marginBottom: '8px' }}>{item.question}</h3>
              <p className="faq-ai">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
