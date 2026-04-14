import { CtaBlock } from './CtaBlock.ts';
import { FaqBlock } from './FaqBlock.ts';
import { HeroBlock } from './HeroBlock.ts';
import { RichTextBlock } from './RichTextBlock.ts';
import { StatsBlock } from './StatsBlock.ts';
import { TestimonialsBlock } from './TestimonialsBlock.ts';
import { TextImageBlock } from './TextImageBlock.ts';
import { TwoColBlock } from './TwoColBlock.ts';
import { ThreeColBlock } from './ThreeColBlock.ts';
import { SectionBlock } from './SectionBlock.ts';
import { PricingBlock } from './PricingBlock.ts';
import { LogoCarouselBlock } from './LogoCarouselBlock.ts';
import { VideoEmbedBlock } from './VideoEmbedBlock.ts';
import { SpacerBlock } from './SpacerBlock.ts';
import { AccordionBlock } from './AccordionBlock.ts';
import { CardGridBlock } from './CardGridBlock.ts';
import { ButtonBlock } from './ButtonBlock.ts';
import { HeadingBlock } from './HeadingBlock.ts';
import { ImageBlock } from './ImageBlock.ts';
import { AlertBlock } from './AlertBlock.ts';
import { TabsBlock } from './TabsBlock.ts';
import { SocialIconsBlock } from './SocialIconsBlock.ts';
import { CustomHtmlBlock } from './CustomHtmlBlock.ts';
import { CounterBlock } from './CounterBlock.ts';
import { ProgressBarBlock } from './ProgressBarBlock.ts';
import { ImageGalleryBlock } from './ImageGalleryBlock.ts';
import { FormBlock } from './FormBlock.ts';
import { QuoteBlock } from './QuoteBlock.ts';
import { DividerBlock } from './DividerBlock.ts';
import { IconBlock } from './IconBlock.ts';
import { FeatureListBlock } from './FeatureListBlock.ts';
import { TeamGridBlock } from './TeamGridBlock.ts';
import { BlogFeedBlock } from './BlogFeedBlock.ts';
import { MapBlock } from './MapBlock.ts';
import { CountdownBlock } from './CountdownBlock.ts';
import { TableBlock } from './TableBlock.ts';
import { TimelineBlock } from './TimelineBlock.ts';
import { StepsBlock } from './StepsBlock.ts';
import { AnnouncementBarBlock } from './AnnouncementBarBlock.ts';

// Leaf blocks (used standalone and inside SectionBlock columns)
export const leafBlocks = [
  HeroBlock,
  RichTextBlock,
  TextImageBlock,
  CtaBlock,
  FaqBlock,
  StatsBlock,
  TestimonialsBlock,
  TwoColBlock,
  ThreeColBlock,
  PricingBlock,
  LogoCarouselBlock,
  VideoEmbedBlock,
  SpacerBlock,
  AccordionBlock,
  CardGridBlock,
  ButtonBlock,
  HeadingBlock,
  ImageBlock,
  AlertBlock,
  TabsBlock,
  SocialIconsBlock,
  CustomHtmlBlock,
  CounterBlock,
  ProgressBarBlock,
  ImageGalleryBlock,
  FormBlock,
  QuoteBlock,
  DividerBlock,
  IconBlock,
  FeatureListBlock,
  TeamGridBlock,
  BlogFeedBlock,
  MapBlock,
  CountdownBlock,
  TableBlock,
  TimelineBlock,
  StepsBlock,
  AnnouncementBarBlock,
];

// Top-level page builder blocks — SectionBlock wraps everything
export const pageBuilderBlocks = [SectionBlock, ...leafBlocks];
