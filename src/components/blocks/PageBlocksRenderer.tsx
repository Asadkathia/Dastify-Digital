import type { PageBuilderBlock } from './types';
import { HeroBlock } from './HeroBlock';
import { RichTextBlock } from './RichTextBlock';
import { TextImageBlock } from './TextImageBlock';
import { CtaBlock } from './CtaBlock';
import { FaqBlock } from './FaqBlock';
import { StatsBlock } from './StatsBlock';
import { TestimonialsBlock } from './TestimonialsBlock';
import { TwoColBlock } from './TwoColBlock';
import { ThreeColBlock } from './ThreeColBlock';

type PageBlocksRendererProps = {
  blocks: PageBuilderBlock[];
};

export function PageBlocksRenderer({ blocks }: PageBlocksRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'hero':
            return <HeroBlock key={key} {...block} />;
          case 'rich_text':
            return <RichTextBlock key={key} {...block} />;
          case 'text_image':
            return <TextImageBlock key={key} {...block} />;
          case 'cta':
            return <CtaBlock key={key} {...block} />;
          case 'faq':
            return <FaqBlock key={key} {...block} />;
          case 'stats':
            return <StatsBlock key={key} {...block} />;
          case 'testimonials':
            return <TestimonialsBlock key={key} {...block} />;
          case 'two_col':
            return <TwoColBlock key={key} {...block} />;
          case 'three_col':
            return <ThreeColBlock key={key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
