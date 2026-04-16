export type PageContent = {
  nav: {
    logoTextPrimary: string;
    logoTextAccent: string;
    logoTextSecondary: string;
    logoText: string;
    logoHref: string;
    links: { label: string; href: string; active?: boolean }[];
    cta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  hero: {
    chipText: string;
    watermark: string;
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    subtitle: string;
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  methods: {
    items: {
      icon: string;
      color: "purple"|"blue"|"green";
      title: string;
      link?: { label: string; href: string };
      detail: string;
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  contactForm: {
    watermark: string;
    info: {
      title: string;
      titleTag: "h1"|"h2"|"h3"|"h4";
      description: string;
      promises: { icon: string; title: string; text: string }[];
      response: { icon: string; title: string; text: string };
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    };
    form: {
      rows: {
        fields: {
          name: string;
          label: string;
          type: "text"|"email"|"tel"|"select"|"textarea";
          placeholder?: string;
          full?: boolean;
          options?: string[];
        }[];
      }[];
      submitLabel: string;
      privacyText: string;
      privacyLink: { label: string; href: string };
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  map: {
    embedHtml?: string;
    image?: string;
    imageAlt: string;
    imageFit?: string;
    imagePosition?: string;
    imageRadius?: string;
    placeholder: {
      icon: string;
      label: string;
      dimText: string;
      dimensions: string;
      preservePlaceholderChrome: boolean;
      placeholderBackground: string;
      placeholderBorderColor: string;
      placeholderBorderWidth: string;
      placeholderBorderStyle: string;
      placeholderPadding: string;
      placeholderGap: string;
      placeholderRadius: string;
      placeholderShowOverlay: boolean;
      placeholderOverlay: string;
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  faq: {
    chipText: string;
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    description: string;
    callCta: { label: string; href: string };
    items: { question: string; answer: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  cta: {
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
};
