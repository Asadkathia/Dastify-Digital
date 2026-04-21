import type { Block } from 'payload';
import { HeroBlock } from './HeroBlock.ts';
import { RichTextBlock } from './RichTextBlock.ts';
import { TextImageBlock } from './TextImageBlock.ts';
import { CtaBlock } from './CtaBlock.ts';
import { FaqBlock } from './FaqBlock.ts';
import { StatsBlock } from './StatsBlock.ts';
import { TestimonialsBlock } from './TestimonialsBlock.ts';
import { TwoColBlock } from './TwoColBlock.ts';
import { ThreeColBlock } from './ThreeColBlock.ts';
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

export const SectionBlock: Block = {
  slug: 'section-block',
  interfaceName: 'SectionBlock',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'paddingTop', type: 'number' },
    { name: 'paddingBottom', type: 'number' },
    { name: 'paddingLeft', type: 'number' },
    { name: 'paddingRight', type: 'number' },
    { name: 'marginTop', type: 'number' },
    { name: 'marginBottom', type: 'number' },
    { name: 'maxWidth', type: 'number', admin: { description: 'If set, the section is capped at this width and centred.' } },
    { name: 'backgroundColor', type: 'text' },
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: '1/1',
          options: [
            { label: 'Full (1/1)', value: '1/1' },
            { label: 'Half (1/2)', value: '1/2' },
            { label: 'One Third (1/3)', value: '1/3' },
            { label: 'Two Thirds (2/3)', value: '2/3' },
            { label: 'One Quarter (1/4)', value: '1/4' },
            { label: 'Three Quarters (3/4)', value: '3/4' },
          ],
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [
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
          ],
        },
      ],
    },
  ],
};
