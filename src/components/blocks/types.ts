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
      objectPosition?: string;
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
      objectPosition?: string;
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
    }
  | {
      type: 'section';
      id?: string;
      paddingTop?: number;
      paddingBottom?: number;
      paddingLeft?: number;
      paddingRight?: number;
      marginTop?: number;
      marginBottom?: number;
      maxWidth?: number;
      backgroundColor?: string;
      columns: Array<{
        width: '1/1' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
        blocks: PageBuilderBlock[];
      }>;
    }
  | {
      type: 'pricing';
      title?: string;
      subtitle?: string;
      plans: Array<{
        name: string;
        price: string;
        period?: string;
        description?: string;
        features: string[];
        ctaLabel?: string;
        ctaHref?: string;
        highlighted?: boolean;
      }>;
    }
  | {
      type: 'logo_carousel';
      title?: string;
      logos: Array<{ src: string; alt: string; href?: string }>;
    }
  | {
      type: 'video_embed';
      url: string;
      title?: string;
      caption?: string;
      autoplay?: boolean;
    }
  | {
      type: 'spacer';
      height: number;
      showDivider?: boolean;
    }
  | {
      type: 'accordion';
      title?: string;
      items: Array<{ heading: string; body: string }>;
    }
  | {
      type: 'card_grid';
      title?: string;
      subtitle?: string;
      columns?: 2 | 3 | 4;
      cards: Array<{
        image?: BuilderImage;
        eyebrow?: string;
        title: string;
        text?: string;
        ctaLabel?: string;
        ctaHref?: string;
      }>;
    }
  | {
      type: 'button';
      label: string;
      href?: string;
      variant?: 'solid' | 'outline' | 'ghost';
      size?: 'sm' | 'md' | 'lg';
      color?: string;
      align?: 'left' | 'center' | 'right';
      openInNewTab?: boolean;
    }
  | {
      type: 'heading';
      text: string;
      tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      align?: 'left' | 'center' | 'right';
      color?: string;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    }
  | {
      type: 'image';
      image?: BuilderImage;
      alt?: string;
      href?: string;
      openInNewTab?: boolean;
      borderRadius?: number;
      objectPosition?: string;
      maxWidth?: number;
      align?: 'left' | 'center' | 'right';
      caption?: string;
    }
  | {
      type: 'alert';
      variant?: 'info' | 'success' | 'warning' | 'error';
      title?: string;
      body: string;
      dismissible?: boolean;
    }
  | {
      type: 'tabs';
      tabs: Array<{ label: string; content: string }>;
    }
  | {
      type: 'social_icons';
      title?: string;
      align?: 'left' | 'center' | 'right';
      size?: 'sm' | 'md' | 'lg';
      links: Array<{ platform: string; url: string }>;
    }
  | {
      type: 'custom_html';
      html: string;
      label?: string;
    }
  | {
      type: 'counter';
      title?: string;
      duration?: number;
      items: Array<{ value: number; suffix?: string; prefix?: string; label: string }>;
    }
  | {
      type: 'progress_bar';
      title?: string;
      items: Array<{ label: string; value: number; color?: string }>;
    }
  | {
      type: 'image_gallery';
      title?: string;
      columns?: 2 | 3 | 4;
      images: Array<{ image: BuilderImage; alt?: string; caption?: string }>;
      lightbox?: boolean;
    }
  | {
      type: 'form';
      formId?: string | number;
      title?: string;
      description?: string;
      layout?: 'centered' | 'left' | 'card';
      backgroundStyle?: 'none' | 'light' | 'dark' | 'brand';
    }
  | {
      type: 'quote';
      quote: string;
      author?: string;
      role?: string;
      avatar?: BuilderImage;
      size?: 'sm' | 'md' | 'lg';
      align?: 'left' | 'center';
      accentColor?: string;
    }
  | {
      type: 'divider';
      style?: 'line' | 'dashed' | 'dotted' | 'none';
      color?: string;
      thickness?: number;
      spacing?: number;
      width?: 'full' | '75' | '50' | '25';
    }
  | {
      type: 'icon';
      icon: string;
      size?: 'sm' | 'md' | 'lg' | 'xl';
      color?: string;
      label?: string;
      align?: 'left' | 'center' | 'right';
    }
  | {
      type: 'feature_list';
      title?: string;
      subtitle?: string;
      layout?: 'grid' | 'list' | '2col';
      columns?: '2' | '3' | '4';
      items: Array<{ icon?: string; title: string; description?: string; iconColor?: string }>;
    }
  | {
      type: 'team_grid';
      title?: string;
      subtitle?: string;
      columns?: '2' | '3' | '4';
      cardStyle?: 'default' | 'minimal' | 'card';
      members: Array<{ photo?: BuilderImage; name: string; role?: string; bio?: string; linkedinUrl?: string; email?: string }>;
    }
  | {
      type: 'blog_feed';
      title?: string;
      subtitle?: string;
      source?: 'latest' | 'category' | 'tag';
      category?: string;
      tag?: string;
      limit?: number;
      layout?: 'grid' | 'list' | 'featured';
      columns?: '2' | '3';
      showExcerpt?: boolean;
      showDate?: boolean;
      showCategory?: boolean;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      type: 'map';
      title?: string;
      address?: string;
      embedUrl?: string;
      height?: number;
      borderRadius?: number;
      showAddressCard?: boolean;
      phone?: string;
      hours?: string;
    }
  | {
      type: 'countdown';
      title?: string;
      targetDate: string;
      expiredMessage?: string;
      layout?: 'boxes' | 'inline' | 'minimal';
      align?: 'left' | 'center' | 'right';
      accentColor?: string;
      showLabels?: boolean;
    }
  | {
      type: 'table';
      title?: string;
      caption?: string;
      headers?: Array<{ label: string }>;
      rows?: Array<{ cells: Array<{ value: string }> }>;
      striped?: boolean;
      bordered?: boolean;
      responsive?: boolean;
    }
  | {
      type: 'timeline';
      title?: string;
      subtitle?: string;
      layout?: 'vertical' | 'horizontal' | 'alternating';
      items: Array<{ date?: string; title: string; description?: string; icon?: string; accentColor?: string }>;
    }
  | {
      type: 'steps';
      title?: string;
      subtitle?: string;
      layout?: 'horizontal' | 'vertical' | 'cards';
      accentColor?: string;
      steps: Array<{ icon?: string; title: string; description?: string }>;
    }
  | {
      type: 'announcement_bar';
      message: string;
      ctaLabel?: string;
      ctaHref?: string;
      style?: 'brand' | 'dark' | 'warning' | 'success' | 'info';
      dismissible?: boolean;
      icon?: string;
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

type LooseBlock = Record<string, unknown>;

function mapSingleBlock(rawBlock: unknown): PageBuilderBlock[] {
  const b = rawBlock as LooseBlock;
  const bt = b.blockType as string;

  switch (bt) {
    case 'section-block': {
      type ColWidth = '1/1' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
      type PayloadColumn = { width?: string; blocks?: unknown[] };
      const cols = (b.columns as PayloadColumn[] | undefined) ?? [];
      return [
        {
          type: 'section',
          id: typeof b.id === 'string' ? b.id : undefined,
          paddingTop: b.paddingTop as number | undefined,
          paddingBottom: b.paddingBottom as number | undefined,
          paddingLeft: b.paddingLeft as number | undefined,
          paddingRight: b.paddingRight as number | undefined,
          marginTop: b.marginTop as number | undefined,
          marginBottom: b.marginBottom as number | undefined,
          maxWidth: b.maxWidth as number | undefined,
          backgroundColor: b.backgroundColor as string | undefined,
          columns: cols.map((col) => ({
            width: (col.width ?? '1/1') as ColWidth,
            blocks: mapPayloadBlocksToPageBuilderBlocks(col.blocks as Page['blocks']),
          })),
        },
      ];
    }

    case 'hero-block':
      return [
        {
          type: 'hero',
          eyebrow: (b.eyebrow as string) || undefined,
          title: (b.title as string) || '',
          subtitle: (b.subtitle as string) || undefined,
          image: mediaToImage(b.image as Parameters<typeof mediaToImage>[0], b.imageAlt as string | null),
          objectPosition: (b.objectPosition as string) || undefined,
          primaryCtaLabel: (b.primaryCtaLabel as string) || undefined,
          primaryCtaHref: (b.primaryCtaHref as string) || undefined,
          secondaryCtaLabel: (b.secondaryCtaLabel as string) || undefined,
          secondaryCtaHref: (b.secondaryCtaHref as string) || undefined,
        },
      ];

    case 'rich-text-block':
      return [{ type: 'rich_text', content: (b.content as string) || '' }];

    case 'text-image-block':
      return [
        {
          type: 'text_image',
          title: (b.title as string) || undefined,
          text: (b.text as string) || undefined,
          image: mediaToImage(b.image as Parameters<typeof mediaToImage>[0]),
          objectPosition: (b.objectPosition as string) || undefined,
          layout: b.layout === 'left' ? 'left' : 'right',
        },
      ];

    case 'cta-block':
      return [
        {
          type: 'cta',
          title: (b.title as string) || '',
          subtitle: (b.subtitle as string) || undefined,
          buttonLabel: (b.buttonLabel as string) || '',
          buttonHref: (b.buttonHref as string) || '',
        },
      ];

    case 'faq-block': {
      type Item = { question: string; answer: string };
      const items = ((b.items as Item[] | undefined) ?? [])
        .filter((item) => Boolean(item?.question?.trim() && item?.answer?.trim()))
        .map((item) => ({ question: item.question, answer: item.answer }));
      return [{ type: 'faq', title: (b.title as string) || undefined, items }];
    }

    case 'stats-block': {
      type Item = { label: string; value: string };
      const items = ((b.items as Item[] | undefined) ?? [])
        .filter((item) => Boolean(item?.label?.trim() && item?.value?.trim()))
        .map((item) => ({ label: item.label, value: item.value }));
      return [{ type: 'stats', title: (b.title as string) || undefined, items }];
    }

    case 'testimonials-block': {
      type Item = { quote: string; name: string; role?: string | null };
      const items = ((b.items as Item[] | undefined) ?? [])
        .filter((item) => Boolean(item?.quote?.trim() && item?.name?.trim()))
        .map((item) => ({ quote: item.quote, name: item.name, role: item.role || undefined }));
      return [{ type: 'testimonials', title: (b.title as string) || undefined, items }];
    }

    case 'two-col-block':
      return [
        {
          type: 'two_col',
          leftTitle: (b.leftTitle as string) || undefined,
          leftText: (b.leftText as string) || undefined,
          rightTitle: (b.rightTitle as string) || undefined,
          rightText: (b.rightText as string) || undefined,
          gap: ((b.gap as string) || 'medium') as 'small' | 'medium' | 'large',
        },
      ];

    case 'three-col-block':
      return [
        {
          type: 'three_col',
          col1Title: (b.col1Title as string) || undefined,
          col1Text: (b.col1Text as string) || undefined,
          col2Title: (b.col2Title as string) || undefined,
          col2Text: (b.col2Text as string) || undefined,
          col3Title: (b.col3Title as string) || undefined,
          col3Text: (b.col3Text as string) || undefined,
          gap: ((b.gap as string) || 'medium') as 'small' | 'medium' | 'large',
        },
      ];

    case 'pricing-block': {
      type Plan = {
        name: string; price: string; period?: string; description?: string;
        features?: string | string[]; ctaLabel?: string; ctaHref?: string; highlighted?: boolean;
      };
      const plans = ((b.plans as Plan[] | undefined) ?? []).map((p) => ({
        name: p.name || '',
        price: p.price || '',
        period: p.period || undefined,
        description: p.description || undefined,
        features: Array.isArray(p.features)
          ? p.features
          : typeof p.features === 'string'
            ? p.features.split('\n').map((f) => f.trim()).filter(Boolean)
            : [],
        ctaLabel: p.ctaLabel || undefined,
        ctaHref: p.ctaHref || undefined,
        highlighted: Boolean(p.highlighted),
      }));
      return [{ type: 'pricing', title: (b.title as string) || undefined, subtitle: (b.subtitle as string) || undefined, plans }];
    }

    case 'logo-carousel-block': {
      type Logo = { image?: Parameters<typeof mediaToImage>[0]; imageAlt?: string; alt?: string; href?: string };
      const logos = ((b.logos as Logo[] | undefined) ?? [])
        .map((l): { src: string; alt: string; href?: string } | null => {
          const img = mediaToImage(l.image, l.imageAlt || l.alt);
          if (!img?.src) return null;
          return { src: img.src, alt: img.alt || '', href: l.href || undefined };
        })
        .filter((l): l is { src: string; alt: string; href?: string } => l !== null);
      return [{ type: 'logo_carousel', title: (b.title as string) || undefined, logos }];
    }

    case 'video-embed-block':
      return [
        {
          type: 'video_embed',
          url: (b.url as string) || '',
          title: (b.title as string) || undefined,
          caption: (b.caption as string) || undefined,
          autoplay: Boolean(b.autoplay),
        },
      ];

    case 'spacer-block':
      return [
        {
          type: 'spacer',
          height: (b.height as number) || 60,
          showDivider: Boolean(b.showDivider),
        },
      ];

    case 'accordion-block': {
      type Item = { heading: string; body: string };
      const items = ((b.items as Item[] | undefined) ?? [])
        .filter((item) => Boolean(item?.heading?.trim()))
        .map((item) => ({ heading: item.heading, body: item.body || '' }));
      return [{ type: 'accordion', title: (b.title as string) || undefined, items }];
    }

    case 'button-block':
      return [{
        type: 'button',
        label: (b.label as string) || 'Click Here',
        href: (b.href as string) || '#',
        variant: ((b.variant as string) || 'solid') as 'solid' | 'outline' | 'ghost',
        size: ((b.size as string) || 'md') as 'sm' | 'md' | 'lg',
        color: (b.color as string) || undefined,
        align: ((b.align as string) || 'center') as 'left' | 'center' | 'right',
        openInNewTab: Boolean(b.openInNewTab),
      }];

    case 'heading-block':
      return [{
        type: 'heading',
        text: (b.text as string) || '',
        tag: ((b.tag as string) || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
        align: ((b.align as string) || 'left') as 'left' | 'center' | 'right',
        color: (b.color as string) || undefined,
        size: ((b.size as string) || 'lg') as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
      }];

    case 'image-block':
      return [{
        type: 'image',
        image: mediaToImage(b.image as Parameters<typeof mediaToImage>[0], b.imageAlt as string | null),
        alt: (b.imageAlt as string) || undefined,
        href: (b.href as string) || undefined,
        openInNewTab: Boolean(b.openInNewTab),
        borderRadius: (b.borderRadius as number) || 0,
        objectPosition: (b.objectPosition as string) || 'center',
        maxWidth: (b.maxWidth as number) || undefined,
        align: ((b.align as string) || 'center') as 'left' | 'center' | 'right',
        caption: (b.caption as string) || undefined,
      }];

    case 'alert-block':
      return [{
        type: 'alert',
        variant: ((b.variant as string) || 'info') as 'info' | 'success' | 'warning' | 'error',
        title: (b.title as string) || undefined,
        body: (b.body as string) || '',
        dismissible: Boolean(b.dismissible),
      }];

    case 'tabs-block': {
      type Tab = { label: string; content: string };
      const tabs = ((b.tabs as Tab[] | undefined) ?? [])
        .filter((t) => t?.label?.trim())
        .map((t) => ({ label: t.label, content: t.content || '' }));
      return [{ type: 'tabs', tabs }];
    }

    case 'social-icons-block': {
      type SocialLink = { platform: string; url: string };
      const links = ((b.links as SocialLink[] | undefined) ?? [])
        .filter((l) => l?.platform?.trim() && l?.url?.trim())
        .map((l) => ({ platform: l.platform, url: l.url }));
      return [{
        type: 'social_icons',
        title: (b.title as string) || undefined,
        align: ((b.align as string) || 'center') as 'left' | 'center' | 'right',
        size: ((b.size as string) || 'md') as 'sm' | 'md' | 'lg',
        links,
      }];
    }

    case 'custom-html-block':
      return [{
        type: 'custom_html',
        html: (b.html as string) || '',
        label: (b.label as string) || undefined,
      }];

    case 'counter-block': {
      type CounterItem = { value: number; suffix?: string; prefix?: string; label: string };
      const items = ((b.items as CounterItem[] | undefined) ?? [])
        .filter((i) => i?.label?.trim())
        .map((i) => ({ value: Number(i.value) || 0, suffix: i.suffix || undefined, prefix: i.prefix || undefined, label: i.label }));
      return [{ type: 'counter', title: (b.title as string) || undefined, duration: (b.duration as number) || 2000, items }];
    }

    case 'progress-bar-block': {
      type BarItem = { label: string; value: number; color?: string };
      const items = ((b.items as BarItem[] | undefined) ?? [])
        .filter((i) => i?.label?.trim())
        .map((i) => ({ label: i.label, value: Number(i.value) || 0, color: i.color || undefined }));
      return [{ type: 'progress_bar', title: (b.title as string) || undefined, items }];
    }

    case 'image-gallery-block': {
      type GalleryImage = { image?: Parameters<typeof mediaToImage>[0]; imageAlt?: string; caption?: string };
      const images = ((b.images as GalleryImage[] | undefined) ?? []).map((gi) => ({
        image: mediaToImage(gi.image, gi.imageAlt) ?? { src: '' },
        alt: gi.imageAlt || undefined,
        caption: gi.caption || undefined,
      })).filter((gi) => gi.image.src);
      const cols = (b.columns as number) || 3;
      return [{
        type: 'image_gallery',
        title: (b.title as string) || undefined,
        columns: (cols === 2 || cols === 3 || cols === 4 ? cols : 3) as 2 | 3 | 4,
        images,
        lightbox: b.lightbox !== false,
      }];
    }

    case 'card-grid-block': {
      type Card = { image?: Parameters<typeof mediaToImage>[0]; imageAlt?: string; eyebrow?: string; title: string; text?: string; ctaLabel?: string; ctaHref?: string };
      const cards = ((b.cards as Card[] | undefined) ?? [])
        .filter((c) => Boolean(c?.title?.trim()))
        .map((c) => ({
          image: mediaToImage(c.image, c.imageAlt),
          eyebrow: c.eyebrow || undefined,
          title: c.title,
          text: c.text || undefined,
          ctaLabel: c.ctaLabel || undefined,
          ctaHref: c.ctaHref || undefined,
        }));
      const cols = (b.columns as number) || 3;
      return [{
        type: 'card_grid',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        columns: (cols === 2 || cols === 3 || cols === 4 ? cols : 3) as 2 | 3 | 4,
        cards,
      }];
    }

    case 'quote-block':
      return [{
        type: 'quote',
        quote: (b.quote as string) || '',
        author: (b.author as string) || undefined,
        role: (b.role as string) || undefined,
        avatar: mediaToImage(b.avatar as Parameters<typeof mediaToImage>[0]),
        size: ((b.size as string) || 'md') as 'sm' | 'md' | 'lg',
        align: ((b.align as string) || 'center') as 'left' | 'center',
        accentColor: (b.accentColor as string) || undefined,
      }];

    case 'divider-block':
      return [{
        type: 'divider',
        style: ((b.style as string) || 'line') as 'line' | 'dashed' | 'dotted' | 'none',
        color: (b.color as string) || undefined,
        thickness: (b.thickness as number) || 1,
        spacing: (b.spacing as number) || 32,
        width: ((b.width as string) || 'full') as 'full' | '75' | '50' | '25',
      }];

    case 'icon-block':
      return [{
        type: 'icon',
        icon: (b.icon as string) || '★',
        size: ((b.size as string) || 'md') as 'sm' | 'md' | 'lg' | 'xl',
        color: (b.color as string) || undefined,
        label: (b.label as string) || undefined,
        align: ((b.align as string) || 'center') as 'left' | 'center' | 'right',
      }];

    case 'feature-list-block': {
      type FLItem = { icon?: string; title: string; description?: string; iconColor?: string };
      const items = ((b.items as FLItem[] | undefined) ?? []).filter((i) => i?.title?.trim());
      return [{
        type: 'feature_list',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        layout: ((b.layout as string) || 'grid') as 'grid' | 'list' | '2col',
        columns: ((b.columns as string) || '3') as '2' | '3' | '4',
        items,
      }];
    }

    case 'team-grid-block': {
      type Member = { photo?: Parameters<typeof mediaToImage>[0]; photoAlt?: string; name: string; role?: string; bio?: string; linkedinUrl?: string; email?: string };
      const members = ((b.members as Member[] | undefined) ?? [])
        .filter((m) => m?.name?.trim())
        .map((m) => ({
          photo: mediaToImage(m.photo, m.photoAlt),
          name: m.name,
          role: m.role || undefined,
          bio: m.bio || undefined,
          linkedinUrl: m.linkedinUrl || undefined,
          email: m.email || undefined,
        }));
      return [{
        type: 'team_grid',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        columns: ((b.columns as string) || '3') as '2' | '3' | '4',
        cardStyle: ((b.cardStyle as string) || 'default') as 'default' | 'minimal' | 'card',
        members,
      }];
    }

    case 'blog-feed-block':
      return [{
        type: 'blog_feed',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        source: ((b.source as string) || 'latest') as 'latest' | 'category' | 'tag',
        category: (b.category as string) || undefined,
        tag: (b.tag as string) || undefined,
        limit: Number(b.limit) || 3,
        layout: ((b.layout as string) || 'grid') as 'grid' | 'list' | 'featured',
        columns: ((b.columns as string) || '3') as '2' | '3',
        showExcerpt: b.showExcerpt !== false,
        showDate: b.showDate !== false,
        showCategory: b.showCategory !== false,
        ctaLabel: (b.ctaLabel as string) || undefined,
        ctaHref: (b.ctaHref as string) || undefined,
      }];

    case 'map-block':
      return [{
        type: 'map',
        title: (b.title as string) || undefined,
        address: (b.address as string) || undefined,
        embedUrl: (b.embedUrl as string) || undefined,
        height: Number(b.height) || 400,
        borderRadius: Number(b.borderRadius) || 12,
        showAddressCard: b.showAddressCard !== false,
        phone: (b.phone as string) || undefined,
        hours: (b.hours as string) || undefined,
      }];

    case 'countdown-block':
      return [{
        type: 'countdown',
        title: (b.title as string) || undefined,
        targetDate: (b.targetDate as string) || new Date().toISOString(),
        expiredMessage: (b.expiredMessage as string) || undefined,
        layout: ((b.layout as string) || 'boxes') as 'boxes' | 'inline' | 'minimal',
        align: ((b.align as string) || 'center') as 'left' | 'center' | 'right',
        accentColor: (b.accentColor as string) || undefined,
        showLabels: b.showLabels !== false,
      }];

    case 'table-block': {
      type Header = { label: string };
      type Row = { cells: Array<{ value: string }> };
      return [{
        type: 'table',
        title: (b.title as string) || undefined,
        caption: (b.caption as string) || undefined,
        headers: ((b.headers as Header[] | undefined) ?? []),
        rows: ((b.rows as Row[] | undefined) ?? []),
        striped: b.striped !== false,
        bordered: Boolean(b.bordered),
        responsive: b.responsive !== false,
      }];
    }

    case 'timeline-block': {
      type TLItem = { date?: string; title: string; description?: string; icon?: string; accentColor?: string };
      const items = ((b.items as TLItem[] | undefined) ?? []).filter((i) => i?.title?.trim());
      return [{
        type: 'timeline',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        layout: ((b.layout as string) || 'vertical') as 'vertical' | 'horizontal' | 'alternating',
        items,
      }];
    }

    case 'steps-block': {
      type Step = { icon?: string; title: string; description?: string };
      const steps = ((b.steps as Step[] | undefined) ?? []).filter((s) => s?.title?.trim());
      return [{
        type: 'steps',
        title: (b.title as string) || undefined,
        subtitle: (b.subtitle as string) || undefined,
        layout: ((b.layout as string) || 'horizontal') as 'horizontal' | 'vertical' | 'cards',
        accentColor: (b.accentColor as string) || undefined,
        steps,
      }];
    }

    case 'announcement-bar-block':
      return [{
        type: 'announcement_bar',
        message: (b.message as string) || '',
        ctaLabel: (b.ctaLabel as string) || undefined,
        ctaHref: (b.ctaHref as string) || undefined,
        style: ((b.style as string) || 'brand') as 'brand' | 'dark' | 'warning' | 'success' | 'info',
        dismissible: b.dismissible !== false,
        icon: (b.icon as string) || undefined,
      }];

    case 'form-block':
      return [{
        type: 'form',
        formId: (b.form as string | number | { id?: string | number } | null | undefined)
          ? (typeof b.form === 'object' && b.form && 'id' in b.form ? (b.form as { id: string | number }).id : b.form as string | number)
          : undefined,
        title: (b.title as string) || undefined,
        description: (b.description as string) || undefined,
        layout: ((b.layout as string) || 'centered') as 'centered' | 'left' | 'card',
        backgroundStyle: ((b.backgroundStyle as string) || 'none') as 'none' | 'light' | 'dark' | 'brand',
      }];

    default:
      return [];
  }
}

export function mapPayloadBlocksToPageBuilderBlocks(blocks: Page['blocks'] | null | undefined): PageBuilderBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((rawBlock) => mapSingleBlock(rawBlock));
}
