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
import { FormBlock } from './FormBlock';
import { QuoteBlock } from './QuoteBlock';
import { DividerBlock } from './DividerBlock';
import { IconBlock } from './IconBlock';
import { FeatureListBlock } from './FeatureListBlock';
import { TeamGridBlock } from './TeamGridBlock';
import { BlogFeedBlock } from './BlogFeedBlock';
import { MapBlock } from './MapBlock';
import { CountdownBlock } from './CountdownBlock';
import { TableBlock } from './TableBlock';
import { TimelineBlock } from './TimelineBlock';
import { StepsBlock } from './StepsBlock';
import { AnnouncementBarBlock } from './AnnouncementBarBlock';

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
          case 'form':
            return <FormBlock key={key} {...block} />;
          case 'quote':
            return <QuoteBlock key={key} {...block} />;
          case 'divider':
            return <DividerBlock key={key} {...block} />;
          case 'icon':
            return <IconBlock key={key} {...block} />;
          case 'feature_list':
            return <FeatureListBlock key={key} {...block} />;
          case 'team_grid':
            return <TeamGridBlock key={key} {...block} />;
          case 'blog_feed':
            return <BlogFeedBlock key={key} {...block} />;
          case 'map':
            return <MapBlock key={key} {...block} />;
          case 'countdown':
            return <CountdownBlock key={key} {...block} />;
          case 'table':
            return <TableBlock key={key} {...block} />;
          case 'timeline':
            return <TimelineBlock key={key} {...block} />;
          case 'steps':
            return <StepsBlock key={key} {...block} />;
          case 'announcement_bar':
            return <AnnouncementBarBlock key={key} {...block} />;
          default: {
            const unknownType = (block as { type?: string }).type ?? 'unknown';
            if (process.env.NODE_ENV === 'development') {
              return (
                <div
                  key={key}
                  style={{
                    background: '#fef2f2',
                    border: '2px dashed #ef4444',
                    borderRadius: '6px',
                    color: '#b91c1c',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    padding: '12px 16px',
                    margin: '8px 0',
                  }}
                >
                  ⚠ Unknown block type: <strong>{unknownType}</strong> (index {index})
                </div>
              );
            }
            return null;
          }
        }
      })}
    </>
  );
}
