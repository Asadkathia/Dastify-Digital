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
];

// Top-level page builder blocks — SectionBlock wraps everything
export const pageBuilderBlocks = [SectionBlock, ...leafBlocks];
