export type ServiceAIResponse = {
  title: string;
  slug: string;
  tagline: string;
  excerpt: string;
  outcomesTitle: string;
  outcomes: string[];
  cta: { label: string; href: string };
  featuredImageUrl: string | null;
  body: string;
  displayOrder: number;
};

export type ServicePreview = {
  title: string;
  slug: string;
  tagline: string;
  excerpt: string;
  outcomesTitle: string;
  outcomes: string[];
  cta: { label: string; href: string };
  bodyLexical: unknown;
  bodyHtml?: string;
  heroImageId: number | null;
  heroImageSourceUrl: string | null;
  displayOrder: number;
  /** Full page blocks[] produced by the HTML→blocks pipeline. */
  blocks?: unknown[];
};

export type ServiceCommitInput = {
  title: string;
  slug: string;
  tagline: string;
  excerpt: string;
  outcomesTitle: string;
  outcomes: string[];
  cta: { label: string; href: string };
  bodyLexical: unknown;
  heroImageId: number | null;
  displayOrder: number;
  blocks?: unknown[];
};
