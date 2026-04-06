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
import { SectionBlockRenderer } from './SectionBlockRenderer';
import { PricingBlock } from './PricingBlock';
import { LogoCarouselBlock } from './LogoCarouselBlock';
import { VideoEmbedBlock } from './VideoEmbedBlock';
import { SpacerBlock } from './SpacerBlock';
import { AccordionBlock } from './AccordionBlock';
import { CardGridBlock } from './CardGridBlock';
import { ButtonBlock } from './ButtonBlock';
import { HeadingBlock } from './HeadingBlock';
import { ImageBlock } from './ImageBlock';
import { AlertBlock } from './AlertBlock';
import { TabsBlock } from './TabsBlock';
import { SocialIconsBlock } from './SocialIconsBlock';
import { CustomHtmlBlock } from './CustomHtmlBlock';
import { CounterBlock } from './CounterBlock';
import { ProgressBarBlock } from './ProgressBarBlock';
import { ImageGalleryBlock } from './ImageGalleryBlock';

type PageBlocksRendererProps = {
  blocks: PageBuilderBlock[];
};

export function PageBlocksRenderer({ blocks }: PageBlocksRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'section':
            return <SectionBlockRenderer key={key} {...block} />;
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
          case 'pricing':
            return <PricingBlock key={key} {...block} />;
          case 'logo_carousel':
            return <LogoCarouselBlock key={key} {...block} />;
          case 'video_embed':
            return <VideoEmbedBlock key={key} {...block} />;
          case 'spacer':
            return <SpacerBlock key={key} {...block} />;
          case 'accordion':
            return <AccordionBlock key={key} {...block} />;
          case 'card_grid':
            return <CardGridBlock key={key} {...block} />;
          case 'button':
            return <ButtonBlock key={key} {...block} />;
          case 'heading':
            return <HeadingBlock key={key} {...block} />;
          case 'image':
            return <ImageBlock key={key} {...block} />;
          case 'alert':
            return <AlertBlock key={key} {...block} />;
          case 'tabs':
            return <TabsBlock key={key} {...block} />;
          case 'social_icons':
            return <SocialIconsBlock key={key} {...block} />;
          case 'custom_html':
            return <CustomHtmlBlock key={key} {...block} />;
          case 'counter':
            return <CounterBlock key={key} {...block} />;
          case 'progress_bar':
            return <ProgressBarBlock key={key} {...block} />;
          case 'image_gallery':
            return <ImageGalleryBlock key={key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
