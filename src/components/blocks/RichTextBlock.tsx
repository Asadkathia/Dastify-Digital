import type { PageBuilderBlock } from './types';

type RichTextBlockProps = Extract<PageBuilderBlock, { type: 'rich_text' }>;

export function RichTextBlock(props: RichTextBlockProps) {
  return (
    <section className="sp">
      <div className="wrap" style={{ maxWidth: '860px' }}>
        <div data-field="content" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{props.content}</div>
      </div>
    </section>
  );
}
