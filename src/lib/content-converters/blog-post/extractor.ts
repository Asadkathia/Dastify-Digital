import 'server-only';
import type { AIProviderConfig } from '@/lib/import-agent/types';
import { getPayloadClient } from '@/lib/payload';
import { normalizeSlug } from '@/lib/cms/slug';
import { runJsonCompletion } from '../_shared/ai-client';
import { importMediaFromUrl } from '../_shared/media-importer';
import { downloadInlineImages } from '../_shared/inline-image-importer';
import { htmlToLexical } from '../_shared/html-to-lexical';
import { htmlToBlocks } from '../_shared/html-to-blocks';
import type { ExtractEnvelope } from '../_shared/types';
import { BLOG_POST_SYSTEM_PROMPT, buildBlogPostUserPrompt } from './prompt';
import type { BlogPostAIResponse, BlogPostPreview } from './schema';

/**
 * End-to-end extraction:
 *   1. Call the AI with a JSON-output contract.
 *   2. Validate + normalize the response.
 *   3. Download the featured image (best-effort) → Media collection.
 *   4. Match category/tag suggestions against existing Blog Categories / Tags.
 *   5. Return a preview the UI can show + let the user edit.
 */
export async function extractBlogPostFromHtml(args: {
  html: string;
  sourceUrl?: string;
  aiConfig: AIProviderConfig;
  model: string;
}): Promise<ExtractEnvelope<BlogPostPreview>> {
  const warnings: string[] = [];
  let raw = '';

  if (!args.html || args.html.trim().length < 40) {
    return { ok: false, error: 'HTML is empty or too short to extract.' };
  }

  let aiData: BlogPostAIResponse;
  try {
    const res = await runJsonCompletion<BlogPostAIResponse>({
      config: args.aiConfig,
      model: args.model,
      systemPrompt: BLOG_POST_SYSTEM_PROMPT,
      userPrompt: buildBlogPostUserPrompt(args.html, args.sourceUrl),
      maxTokens: 8000,
    });
    aiData = res.data;
    raw = res.raw;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'AI extraction failed.',
    };
  }

  // Validate the AI payload shape.
  if (!aiData || typeof aiData !== 'object') {
    return { ok: false, error: 'AI returned an unexpected shape.', raw };
  }
  const title = typeof aiData.title === 'string' ? aiData.title.trim() : '';
  const body = typeof aiData.body === 'string' ? aiData.body : '';
  if (!title) {
    return { ok: false, error: 'AI could not identify a blog post title.', raw };
  }
  if (!body) {
    warnings.push('AI returned an empty body; you may need to paste the content manually in the post editor.');
  }

  const slug = normalizeSlug(typeof aiData.slug === 'string' && aiData.slug ? aiData.slug : title);
  const excerpt = typeof aiData.excerpt === 'string' ? aiData.excerpt.trim() : '';
  const publishedAt = normalizeDate(aiData.publishedAt);
  const author = typeof aiData.author === 'string' && aiData.author.trim() ? aiData.author.trim() : null;

  // Download featured image.
  let featuredImageId: number | null = null;
  let featuredImageSourceUrl: string | null = null;
  if (aiData.featuredImageUrl) {
    featuredImageSourceUrl = aiData.featuredImageUrl;
    const imported = await importMediaFromUrl({
      src: aiData.featuredImageUrl,
      alt: title,
      baseUrl: args.sourceUrl,
    });
    if (imported) {
      featuredImageId = imported.id;
    } else {
      warnings.push(`Featured image download failed. Original URL: ${aiData.featuredImageUrl}. You can upload manually after import.`);
    }
  }

  // Download inline images in the body HTML → replace with local Media URLs.
  const inlineResult = await downloadInlineImages({ html: body, baseUrl: args.sourceUrl });
  const localBody = inlineResult.html;
  warnings.push(...inlineResult.warnings);

  // Match categories + tags against existing Blog Categories / Tags.
  const categorySuggestions = Array.isArray(aiData.categorySuggestions)
    ? aiData.categorySuggestions.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];
  const tagSuggestions = Array.isArray(aiData.tagSuggestions)
    ? aiData.tagSuggestions.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];

  const { matchedIds: matchedCategoryIds, unmatched: suggestedNewCategories } = await matchExistingDocs(
    'blog-categories',
    categorySuggestions,
  );
  const { matchedIds: matchedTagIds, unmatched: suggestedNewTags } = await matchExistingDocs('tags', tagSuggestions);

  // Second AI pass: convert the full HTML page into Payload blocks[] so the
  // /blog/[slug] detail page can render pixel-perfect. Failures are non-fatal
  // — the detail page falls back to the hardcoded layout when blocks is empty.
  let pageBlocks: unknown[] = [];
  const blocksResult = await htmlToBlocks({ html: args.html, aiConfig: args.aiConfig });
  if (blocksResult.ok) {
    pageBlocks = blocksResult.blocks;
    warnings.push(...blocksResult.warnings);
    if (blocksResult.unmappedCount > 0) {
      warnings.push(`${blocksResult.unmappedCount} of ${blocksResult.totalSections} sections fell back to custom-html blocks.`);
    }
  } else {
    warnings.push(`Full-page blocks conversion failed; detail page will use the default article layout. Reason: ${blocksResult.error}`);
  }

  const preview: BlogPostPreview = {
    title,
    slug,
    excerpt: excerpt.slice(0, 280),
    publishedAt,
    author,
    bodyLexical: htmlToLexical(localBody),
    bodyHtml: localBody,
    featuredImageId,
    featuredImageSourceUrl,
    matchedCategoryIds,
    suggestedNewCategories,
    matchedTagIds,
    suggestedNewTags,
    blocks: pageBlocks,
  };

  return { ok: true, data: preview, warnings, raw: raw.slice(0, 4000) };
}

function normalizeDate(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = String(input).trim();
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/**
 * For each suggested name, look up a matching doc in the collection by
 * slug or title (case-insensitive). Returns the ids of matches and the list
 * of names that have no existing doc yet (caller presents those as
 * "create new?" options in the UI).
 */
async function matchExistingDocs(
  collection: 'blog-categories' | 'tags',
  suggestions: string[],
): Promise<{ matchedIds: number[]; unmatched: string[] }> {
  if (suggestions.length === 0) return { matchedIds: [], unmatched: [] };

  try {
    const payload = await getPayloadClient();
    const slugs = suggestions.map((s) => normalizeSlug(s)).filter(Boolean);
    const titles = suggestions.map((s) => s.trim());

    const res = await payload.find({
      collection,
      depth: 0,
      limit: 100,
      where: {
        or: [
          { slug: { in: slugs } },
          { title: { in: titles } },
        ],
      } as never,
    });

    const matchedByKey = new Map<string, number>();
    for (const doc of res.docs ?? []) {
      const d = doc as unknown as { id: number; slug?: string; title?: string };
      if (typeof d.slug === 'string') matchedByKey.set(d.slug.toLowerCase(), d.id);
      if (typeof d.title === 'string') matchedByKey.set(d.title.toLowerCase(), d.id);
    }

    const matchedIds: number[] = [];
    const unmatched: string[] = [];
    const seen = new Set<number>();
    for (const suggestion of suggestions) {
      const byTitle = matchedByKey.get(suggestion.toLowerCase());
      const bySlug = matchedByKey.get(normalizeSlug(suggestion).toLowerCase());
      const id = byTitle ?? bySlug;
      if (id !== undefined && !seen.has(id)) {
        matchedIds.push(id);
        seen.add(id);
      } else if (id === undefined) {
        unmatched.push(suggestion);
      }
    }

    return { matchedIds, unmatched };
  } catch (err) {
    console.error(`[blog-post extractor] match ${collection} failed:`, err);
    return { matchedIds: [], unmatched: suggestions };
  }
}
