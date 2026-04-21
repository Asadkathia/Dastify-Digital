export type CaseStudyAIResponse = {
  title: string;
  slug: string;
  client: string | null;
  excerpt: string;
  filterTag: string | null;
  stats: Array<{ value: string; label: string }>;
  featuredImageUrl: string | null;
  body: string;
  featured: boolean;
};

export type CaseStudyPreview = {
  title: string;
  slug: string;
  client: string | null;
  excerpt: string;
  filterTag: string | null;
  stats: Array<{ value: string; label: string }>;
  bodyLexical: unknown;
  bodyHtml?: string;
  featuredImageId: number | null;
  featuredImageSourceUrl: string | null;
  featured: boolean;
  /** Full page blocks[] produced by the HTML→blocks pipeline. */
  blocks?: unknown[];
};

export type CaseStudyCommitInput = {
  title: string;
  slug: string;
  client: string | null;
  excerpt: string;
  filterTag: string | null;
  stats: Array<{ value: string; label: string }>;
  bodyLexical: unknown;
  featuredImageId: number | null;
  featured: boolean;
  blocks?: unknown[];
};
