export type PageContent = {
  nav: {
    logoText: string;
    logoDot: string;
    logoHref: string;
    links: { label: string; href: string }[];
    cta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  hero: {
    watermark: string;
    badge: string;
    title: string;
    titleTag?: "h1" | "h2" | "h3";
    subtitle: string;
    formId?: string | number | null;
    deliverables: { number: string; color: "purple" | "blue" | "green"; title: string; description: string }[];
    trustItems: { icon: string; label: string }[];
    form: {
      title: string;
      subtitle: string;
      rows: {
        fields: {
          name: string;
          label: string;
          type: "text" | "email" | "tel" | "url" | "select";
          placeholder: string;
          full?: boolean;
          options?: string[];
        }[];
      }[];
      submitLabel: string;
      note: string;
      noteLink: { label: string; href: string };
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  process: {
    watermark: string;
    chip: string;
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    steps: { number: string; title: string; description: string; time: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  results: {
    chip: string;
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    items: { stat: string; label: string; description: string; clientBadge: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  testimonial: {
    quoteMark: string;
    quote: string;
    name: string;
    role: string;
    avatar: {
      image?: string;
      imageAlt?: string;
      placeholderIcon: string;
      placeholderLabel: string;
      placeholderDimensions: string;
      imageFit?: string;
      imagePosition?: string;
      imageRadius?: string;
      preservePlaceholderChrome?: boolean;
      placeholderBackground?: string;
      placeholderBorderColor?: string;
      placeholderBorderWidth?: string;
      placeholderBorderStyle?: string;
      placeholderPadding?: string;
      placeholderGap?: string;
      placeholderRadius?: string;
      placeholderShowOverlay?: boolean;
      placeholderOverlay?: string;
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  urgency: {
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  footer: {
    brandName: string;
    brandDot: string;
    brandDescription: string;
    socialLinks: { label: string; href: string }[];
    columns: {
      title: string;
      links: { label: string; href: string; emphasis?: boolean }[];
    }[];
    copy: string;
    badges: string[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
};
