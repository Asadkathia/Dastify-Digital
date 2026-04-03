import type { Media, Page } from '@/payload-types';

export type BuilderImage = {
  src: string;
  alt?: string;
};

export type PageBuilderBlock =
  | {
      type: 'hero';
      eyebrow?: string;
      title: string;
      subtitle?: string;
      image?: BuilderImage;
      primaryCtaLabel?: string;
      primaryCtaHref?: string;
      secondaryCtaLabel?: string;
      secondaryCtaHref?: string;
    }
  | {
      type: 'rich_text';
      content: string;
    }
  | {
      type: 'text_image';
      title?: string;
      text?: string;
      image?: BuilderImage;
      layout?: 'left' | 'right';
    }
  | {
      type: 'cta';
      title: string;
      subtitle?: string;
      buttonLabel: string;
      buttonHref: string;
    }
  | {
      type: 'faq';
      title?: string;
      items: Array<{ question: string; answer: string }>;
    }
  | {
      type: 'stats';
      title?: string;
      items: Array<{ label: string; value: string }>;
    }
  | {
      type: 'testimonials';
      title?: string;
      items: Array<{ quote: string; name: string; role?: string }>;
    };

function mediaToImage(media: number | Media | null | undefined, alt?: string | null): BuilderImage | undefined {
  if (!media || typeof media === 'number') {
    return undefined;
  }

  const src = media.url?.trim();
  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: alt?.trim() || media.alt?.trim() || undefined,
  };
}

export function mapPayloadBlocksToPageBuilderBlocks(blocks: Page['blocks'] | null | undefined): PageBuilderBlock[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.flatMap((block): PageBuilderBlock[] => {
    switch (block.blockType) {
      case 'hero-block':
        return [
          {
            type: 'hero',
            eyebrow: block.eyebrow || undefined,
            title: block.title,
            subtitle: block.subtitle || undefined,
            image: mediaToImage(block.image, block.imageAlt),
            primaryCtaLabel: block.primaryCtaLabel || undefined,
            primaryCtaHref: block.primaryCtaHref || undefined,
            secondaryCtaLabel: block.secondaryCtaLabel || undefined,
            secondaryCtaHref: block.secondaryCtaHref || undefined,
          },
        ];
      case 'rich-text-block':
        return [
          {
            type: 'rich_text',
            content: block.content || '',
          },
        ];
      case 'text-image-block':
        return [
          {
            type: 'text_image',
            title: block.title || undefined,
            text: block.text || undefined,
            image: mediaToImage(block.image),
            layout: block.layout === 'left' ? 'left' : 'right',
          },
        ];
      case 'cta-block':
        return [
          {
            type: 'cta',
            title: block.title,
            subtitle: block.subtitle || undefined,
            buttonLabel: block.buttonLabel,
            buttonHref: block.buttonHref,
          },
        ];
      case 'faq-block':
        return [
          {
            type: 'faq',
            title: block.title || undefined,
            items:
              block.items
                ?.filter((item): item is { question: string; answer: string } =>
                  Boolean(item?.question?.trim() && item?.answer?.trim()),
                )
                .map((item) => ({ question: item.question, answer: item.answer })) || [],
          },
        ];
      case 'stats-block':
        return [
          {
            type: 'stats',
            title: block.title || undefined,
            items:
              block.items
                ?.filter((item): item is { label: string; value: string } => Boolean(item?.label?.trim() && item?.value?.trim()))
                .map((item) => ({ label: item.label, value: item.value })) || [],
          },
        ];
      case 'testimonials-block':
        return [
          {
            type: 'testimonials',
            title: block.title || undefined,
            items:
              block.items
                ?.filter((item): item is { quote: string; name: string; role?: string | null } =>
                  Boolean(item?.quote?.trim() && item?.name?.trim()),
                )
                .map((item) => ({ quote: item.quote, name: item.name, role: item.role || undefined })) || [],
          },
        ];
      default:
        return [];
    }
  });
}
