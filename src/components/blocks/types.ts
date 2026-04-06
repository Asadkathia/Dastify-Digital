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
    }
  | {
      type: 'two_col';
      leftTitle?: string;
      leftText?: string;
      rightTitle?: string;
      rightText?: string;
      gap?: 'small' | 'medium' | 'large';
    }
  | {
      type: 'three_col';
      col1Title?: string;
      col1Text?: string;
      col2Title?: string;
      col2Text?: string;
      col3Title?: string;
      col3Text?: string;
      gap?: 'small' | 'medium' | 'large';
    };

function mediaToImage(
  media: number | Media | string | { url?: string; alt?: string; filename?: string } | null | undefined,
  alt?: string | null,
): BuilderImage | undefined {
  if (!media || typeof media === 'number') {
    return undefined;
  }

  if (typeof media === 'string') {
    const src = media.trim();
    return src ? { src, alt: alt?.trim() || undefined } : undefined;
  }

  const src = media.url?.trim() || (media.filename?.trim() ? `/media/${media.filename.trim()}` : undefined);
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

  return blocks.flatMap((rawBlock): PageBuilderBlock[] => {
    // Handle new block types not yet in generated Payload types
    const looseBt = (rawBlock as unknown as Record<string, unknown>).blockType as string;
    if (looseBt === 'two-col-block' || looseBt === 'three-col-block') {
      const b = rawBlock as unknown as Record<string, unknown>;
      if (looseBt === 'two-col-block') {
        return [
          {
            type: 'two_col',
            leftTitle: b.leftTitle as string | undefined,
            leftText: b.leftText as string | undefined,
            rightTitle: b.rightTitle as string | undefined,
            rightText: b.rightText as string | undefined,
            gap: (b.gap as 'small' | 'medium' | 'large') || 'medium',
          },
        ];
      }
      return [
        {
          type: 'three_col',
          col1Title: b.col1Title as string | undefined,
          col1Text: b.col1Text as string | undefined,
          col2Title: b.col2Title as string | undefined,
          col2Text: b.col2Text as string | undefined,
          col3Title: b.col3Title as string | undefined,
          col3Text: b.col3Text as string | undefined,
          gap: (b.gap as 'small' | 'medium' | 'large') || 'medium',
        },
      ];
    }

    const block = rawBlock;
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
