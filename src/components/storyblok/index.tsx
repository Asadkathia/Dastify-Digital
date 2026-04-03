import {
  apiPlugin,
  storyblokEditable,
  storyblokInit,
  type SbBlokData,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { FaqBlock } from '@/components/blocks/FaqBlock';
import { HeroBlock } from '@/components/blocks/HeroBlock';
import { RichTextBlock } from '@/components/blocks/RichTextBlock';
import { StatsBlock } from '@/components/blocks/StatsBlock';
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock';
import { TextImageBlock } from '@/components/blocks/TextImageBlock';

function richTextToPlainText(richText: unknown): string {
  if (!richText) {
    return '';
  }

  if (typeof richText === 'string') {
    return richText;
  }

  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') {
      return '';
    }

    const typedNode = node as { text?: unknown; content?: unknown };
    const text = typeof typedNode.text === 'string' ? typedNode.text : '';
    const children = Array.isArray(typedNode.content) ? typedNode.content.map(walk).join(' ') : '';
    return [text, children].filter(Boolean).join(' ').trim();
  };

  return walk(richText);
}

function imageFieldToSource(image: unknown): string | undefined {
  if (!image || typeof image !== 'object') {
    return undefined;
  }

  const filename = (image as { filename?: unknown }).filename;
  return typeof filename === 'string' ? filename : undefined;
}

type StoryblokBlockProps = {
  blok: SbBlokData;
};

function StoryblokPage({ blok }: StoryblokBlockProps) {
  const body = Array.isArray(blok.body) ? (blok.body as SbBlokData[]) : [];

  return (
    <main {...storyblokEditable(blok)}>
      {body.map((nested) => (
        <StoryblokServerComponent key={nested._uid} blok={nested} />
      ))}
    </main>
  );
}

function HeroStoryblok({ blok }: StoryblokBlockProps) {
  return (
    <div {...storyblokEditable(blok)}>
      <HeroBlock
        type="hero"
        eyebrow={typeof blok.eyebrow === 'string' ? blok.eyebrow : undefined}
        title={typeof blok.title === 'string' ? blok.title : 'Hero'}
        subtitle={typeof blok.subtitle === 'string' ? blok.subtitle : undefined}
        image={{
          src: imageFieldToSource(blok.image) || '',
          alt: typeof blok.imageAlt === 'string' ? blok.imageAlt : undefined,
        }}
        primaryCtaLabel={typeof blok.primaryCtaLabel === 'string' ? blok.primaryCtaLabel : undefined}
        primaryCtaHref={typeof blok.primaryCtaHref === 'string' ? blok.primaryCtaHref : undefined}
        secondaryCtaLabel={typeof blok.secondaryCtaLabel === 'string' ? blok.secondaryCtaLabel : undefined}
        secondaryCtaHref={typeof blok.secondaryCtaHref === 'string' ? blok.secondaryCtaHref : undefined}
      />
    </div>
  );
}

function RichTextStoryblok({ blok }: StoryblokBlockProps) {
  return (
    <div {...storyblokEditable(blok)}>
      <RichTextBlock type="rich_text" content={richTextToPlainText(blok.content)} />
    </div>
  );
}

function TextImageStoryblok({ blok }: StoryblokBlockProps) {
  const layout = blok.layout === 'left' ? 'left' : 'right';

  return (
    <div {...storyblokEditable(blok)}>
      <TextImageBlock
        type="text_image"
        title={typeof blok.title === 'string' ? blok.title : undefined}
        text={typeof blok.text === 'string' ? blok.text : undefined}
        image={{ src: imageFieldToSource(blok.image) || '' }}
        layout={layout}
      />
    </div>
  );
}

function CtaStoryblok({ blok }: StoryblokBlockProps) {
  return (
    <div {...storyblokEditable(blok)}>
      <CtaBlock
        type="cta"
        title={typeof blok.title === 'string' ? blok.title : 'Call To Action'}
        subtitle={typeof blok.subtitle === 'string' ? blok.subtitle : undefined}
        buttonLabel={typeof blok.buttonLabel === 'string' ? blok.buttonLabel : 'Learn More'}
        buttonHref={typeof blok.buttonHref === 'string' ? blok.buttonHref : '#'}
      />
    </div>
  );
}

function FaqStoryblok({ blok }: StoryblokBlockProps) {
  const items = Array.isArray(blok.items)
    ? (blok.items as Array<{ question?: unknown; answer?: unknown }>)
        .filter((item) => typeof item.question === 'string' && typeof item.answer === 'string')
        .map((item) => ({ question: item.question as string, answer: item.answer as string }))
    : [];

  return (
    <div {...storyblokEditable(blok)}>
      <FaqBlock type="faq" title={typeof blok.title === 'string' ? blok.title : undefined} items={items} />
    </div>
  );
}

function StatsStoryblok({ blok }: StoryblokBlockProps) {
  const items = Array.isArray(blok.items)
    ? (blok.items as Array<{ label?: unknown; value?: unknown }>)
        .filter((item) => typeof item.label === 'string' && typeof item.value === 'string')
        .map((item) => ({ label: item.label as string, value: item.value as string }))
    : [];

  return (
    <div {...storyblokEditable(blok)}>
      <StatsBlock type="stats" title={typeof blok.title === 'string' ? blok.title : undefined} items={items} />
    </div>
  );
}

function TestimonialsStoryblok({ blok }: StoryblokBlockProps) {
  const items = Array.isArray(blok.items)
    ? (blok.items as Array<{ quote?: unknown; name?: unknown; role?: unknown }>)
        .filter((item) => typeof item.quote === 'string' && typeof item.name === 'string')
        .map((item) => ({
          quote: item.quote as string,
          name: item.name as string,
          role: typeof item.role === 'string' ? item.role : undefined,
        }))
    : [];

  return (
    <div {...storyblokEditable(blok)}>
      <TestimonialsBlock
        type="testimonials"
        title={typeof blok.title === 'string' ? blok.title : undefined}
        items={items}
      />
    </div>
  );
}

const storyblokAccessToken = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || process.env.STORYBLOK_PREVIEW_TOKEN;

if (storyblokAccessToken) {
  storyblokInit({
    accessToken: storyblokAccessToken,
    use: [apiPlugin],
    components: {
      page: StoryblokPage,
      hero: HeroStoryblok,
      rich_text: RichTextStoryblok,
      text_image: TextImageStoryblok,
      cta: CtaStoryblok,
      faq: FaqStoryblok,
      stats: StatsStoryblok,
      testimonials: TestimonialsStoryblok,
    },
  });
}
