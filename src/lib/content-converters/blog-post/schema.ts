/**
 * AI-returned shape. Matches the JSON contract described in prompt.ts.
 */
export type BlogPostAIResponse = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  featuredImageUrl: string | null;
  author: string | null;
  body: string;
  categorySuggestions: string[];
  tagSuggestions: string[];
};

/**
 * What the admin UI receives after AI extraction + media download + category
 * matching. User edits these fields before committing to the Blog Posts
 * collection.
 */
export type BlogPostPreview = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  author: string | null;
  /** Lexical editor state — richText column JSON. */
  bodyLexical: unknown;
  /** Original body HTML (after inline-image rewriting). Used for the preview pane — not committed to CMS. */
  bodyHtml?: string;
  /** Media collection id of the downloaded featured image, or null if download failed / none in HTML. */
  featuredImageId: number | null;
  /** URL-only fallback shown in the UI when the download didn't succeed. */
  featuredImageSourceUrl: string | null;
  /** Full page blocks[] produced by the HTML→blocks pipeline. When populated, /blog/[slug] renders these pixel-perfect. */
  blocks?: unknown[];
  /**
   * Existing Blog Categories matched by slug/title. UI preselects these.
   */
  matchedCategoryIds: number[];
  /**
   * Categories the AI suggested that don't exist yet. UI shows them as
   * "create new?" checkboxes the user can opt into before commit.
   */
  suggestedNewCategories: string[];
  /** Tag suggestions; UI handles similarly but all as opt-in. */
  suggestedNewTags: string[];
  matchedTagIds: number[];
};

/**
 * What the UI sends back on commit. Mirrors BlogPostPreview with the user's
 * final edits — including which suggested-new categories/tags they actually
 * want created.
 */
export type BlogPostCommitInput = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  author: string | null;
  bodyLexical: unknown;
  featuredImageId: number | null;
  /** Blog category ids to associate. May include freshly-created ones submitted in categoriesToCreate. */
  categoryIds: number[];
  /** Category names the user wants the server to create fresh (will be created + added to categoryIds). */
  categoriesToCreate: string[];
  tagIds: number[];
  tagsToCreate: string[];
  /** Full page blocks[] to store on the record. If empty, the detail page falls back to the hardcoded layout. */
  blocks?: unknown[];
};
