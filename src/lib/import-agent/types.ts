// ─── AI Provider Config ───────────────────────────────────────────────────────

export type AIProvider = 'anthropic' | 'openai' | 'google' | 'openrouter' | 'ollama';

export type AIProviderConfig = {
  provider: AIProvider;
  model: string;
  apiKey?: string;   // falls back to env var if omitted
  baseUrl?: string;  // for openrouter/ollama overrides
};

// ─── Parsed HTML structure (pre-AI compression step) ─────────────────────────

export type ParsedSection = {
  index: number;
  tag: string;           // section, header, footer, div, etc.
  id?: string;
  className?: string;
  role?: string;         // hero, nav, cta, faq, etc. — heuristic guess
  headings: string[];
  paragraphs: string[];
  links: Array<{ text: string; href: string }>;
  images: Array<{ src: string; alt: string; isExternal: boolean }>;
  hasForm: boolean;
  hasVideo: boolean;
  hasIframe: boolean;
  rawHtml: string;       // original HTML for AI context
  estimatedTokens: number;
};

export type ParsedPage = {
  title: string;
  description: string;
  sections: ParsedSection[];
  totalEstimatedTokens: number;
  /** Raw CSS extracted from <style> blocks — injected into custom-html-block fallbacks so they render correctly */
  pageStyles?: string;
};

// ─── SEO output ───────────────────────────────────────────────────────────────

export type SeoFields = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalURL?: string;
  noindex?: boolean;
  image?: string;
};

// ─── Payload block shapes (what gets written to pages.blocks) ─────────────────
// These must match the Payload block slugs exactly.

export type PayloadBlock =
  | { blockType: 'hero-block';        [key: string]: unknown }
  | { blockType: 'rich-text-block';   [key: string]: unknown }
  | { blockType: 'text-image-block';  [key: string]: unknown }
  | { blockType: 'cta-block';         [key: string]: unknown }
  | { blockType: 'faq-block';         [key: string]: unknown }
  | { blockType: 'stats-block';       [key: string]: unknown }
  | { blockType: 'testimonials-block';[key: string]: unknown }
  | { blockType: 'pricing-block';     [key: string]: unknown }
  | { blockType: 'card-grid-block';   [key: string]: unknown }
  | { blockType: 'accordion-block';   [key: string]: unknown }
  | { blockType: 'two-col-block';     [key: string]: unknown }
  | { blockType: 'three-col-block';   [key: string]: unknown }
  | { blockType: 'logo-carousel-block'; [key: string]: unknown }
  | { blockType: 'video-embed-block'; [key: string]: unknown }
  | { blockType: 'spacer-block';      [key: string]: unknown }
  | { blockType: 'heading-block';     [key: string]: unknown }
  | { blockType: 'button-block';      [key: string]: unknown }
  | { blockType: 'image-block';       [key: string]: unknown }
  | { blockType: 'alert-block';       [key: string]: unknown }
  | { blockType: 'tabs-block';        [key: string]: unknown }
  | { blockType: 'social-icons-block';[key: string]: unknown }
  | { blockType: 'counter-block';     [key: string]: unknown }
  | { blockType: 'progress-bar-block';[key: string]: unknown }
  | { blockType: 'image-gallery-block'; [key: string]: unknown }
  | { blockType: 'custom-html-block'; html: string; label?: string };

export type PayloadColumnBlock = {
  width: '1/1' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  blocks: PayloadBlock[];
};

export type PayloadSectionBlock = {
  blockType: 'section-block';
  paddingTop?: number;
  paddingBottom?: number;
  backgroundColor?: string;
  columns: PayloadColumnBlock[];
};

// The top-level blocks array on a Page document
export type PageBlocksPayload = Array<PayloadSectionBlock | PayloadBlock>;

// ─── AI mapping output ────────────────────────────────────────────────────────

export type AIBlockMapping = {
  blocks: PageBlocksPayload;
  seo: SeoFields;
  warnings: string[];
  unmappedSections: number[];  // indices of sections that fell back to custom-html-block
};

// ─── Validation result ────────────────────────────────────────────────────────

export type ValidationWarning = {
  blockIndex: number;
  sectionIndex?: number;
  reason: 'unknown_block_type' | 'missing_required_field' | 'invalid_field_type' | 'empty_section' | 'unresolved_image';
  detail: string;
  autoFallback: boolean;  // true = was replaced with custom-html-block
};

export type ValidationResult = {
  blocks: PageBlocksPayload;
  warnings: ValidationWarning[];
  isValid: boolean;
};

// ─── Import report (saved to ImportReports collection) ───────────────────────

export type ImportReport = {
  slug: string;
  title: string;
  provider: AIProvider;
  model: string;
  totalSections: number;
  mappedSections: number;
  fallbackSections: number;
  warnings: ValidationWarning[];
  externalImages: Array<{ src: string; alt: string; blockIndex: number }>;
  seo: SeoFields;
  createdPageId: string;
  importedAt: string;
};

// ─── Import request (what the API route receives) ─────────────────────────────

export type ImportRequest = {
  html: string;
  slug: string;
  title: string;
  publish?: boolean;
  ai: AIProviderConfig;
};

// ─── Import response (what the API route returns) ─────────────────────────────

export type ImportResponse = {
  ok: boolean;
  pageId?: string;
  slug?: string;
  suggestedSlug?: string;
  report?: ImportReport;
  error?: string;
  rawAiResponse?: string;  // included on parse failure for debugging
};
