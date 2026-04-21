import 'server-only';
import type { AIProviderConfig } from '@/lib/import-agent/types';
import { normalizeSlug } from '@/lib/cms/slug';
import { runJsonCompletion } from '../_shared/ai-client';
import { importMediaFromUrl } from '../_shared/media-importer';
import { downloadInlineImages } from '../_shared/inline-image-importer';
import { htmlToLexical } from '../_shared/html-to-lexical';
import { htmlToBlocks } from '../_shared/html-to-blocks';
import type { ExtractEnvelope } from '../_shared/types';
import { CASE_STUDY_SYSTEM_PROMPT, buildCaseStudyUserPrompt } from './prompt';
import type { CaseStudyAIResponse, CaseStudyPreview } from './schema';

export async function extractCaseStudyFromHtml(args: {
  html: string;
  sourceUrl?: string;
  aiConfig: AIProviderConfig;
  model: string;
}): Promise<ExtractEnvelope<CaseStudyPreview>> {
  const warnings: string[] = [];
  let raw = '';

  if (!args.html || args.html.trim().length < 40) {
    return { ok: false, error: 'HTML is empty or too short to extract.' };
  }

  let aiData: CaseStudyAIResponse;
  try {
    const res = await runJsonCompletion<CaseStudyAIResponse>({
      config: args.aiConfig,
      model: args.model,
      systemPrompt: CASE_STUDY_SYSTEM_PROMPT,
      userPrompt: buildCaseStudyUserPrompt(args.html, args.sourceUrl),
      maxTokens: 8000,
    });
    aiData = res.data;
    raw = res.raw;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'AI extraction failed.' };
  }

  if (!aiData || typeof aiData !== 'object') {
    return { ok: false, error: 'AI returned an unexpected shape.', raw };
  }

  const title = typeof aiData.title === 'string' ? aiData.title.trim() : '';
  if (!title) {
    return { ok: false, error: 'AI could not identify a case study title.', raw };
  }

  const slug = normalizeSlug(typeof aiData.slug === 'string' && aiData.slug ? aiData.slug : title);
  const client = typeof aiData.client === 'string' && aiData.client.trim() ? aiData.client.trim() : null;
  const excerpt = typeof aiData.excerpt === 'string' ? aiData.excerpt.trim().slice(0, 280) : '';
  const filterTag = typeof aiData.filterTag === 'string' && aiData.filterTag.trim()
    ? normalizeSlug(aiData.filterTag.trim())
    : null;
  const featured = aiData.featured === true;

  const rawStats = Array.isArray(aiData.stats) ? aiData.stats : [];
  const stats = rawStats
    .filter((s): s is { value: string; label: string } =>
      s && typeof s === 'object' && typeof s.value === 'string' && typeof s.label === 'string',
    )
    .slice(0, 5)
    .map((s) => ({ value: s.value.trim(), label: s.label.trim() }));

  const body = typeof aiData.body === 'string' ? aiData.body : '';
  if (!body) {
    warnings.push('AI returned an empty body; add content manually in the case study editor.');
  }

  const inlineResult = await downloadInlineImages({ html: body, baseUrl: args.sourceUrl });
  const localBody = inlineResult.html;
  warnings.push(...inlineResult.warnings);

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
      warnings.push(`Featured image download failed. Original URL: ${aiData.featuredImageUrl}. Upload manually after import.`);
    }
  }

  // Full-page blocks for pixel-perfect detail rendering. Non-fatal on failure.
  let pageBlocks: unknown[] = [];
  const blocksResult = await htmlToBlocks({ html: args.html, aiConfig: args.aiConfig });
  if (blocksResult.ok) {
    pageBlocks = blocksResult.blocks;
    warnings.push(...blocksResult.warnings);
    if (blocksResult.unmappedCount > 0) {
      warnings.push(`${blocksResult.unmappedCount} of ${blocksResult.totalSections} sections fell back to custom-html blocks.`);
    }
  } else {
    warnings.push(`Full-page blocks conversion failed; detail page will use the default layout. Reason: ${blocksResult.error}`);
  }

  const preview: CaseStudyPreview = {
    title,
    slug,
    client,
    excerpt,
    filterTag,
    stats,
    bodyLexical: htmlToLexical(localBody),
    bodyHtml: localBody,
    featuredImageId,
    featuredImageSourceUrl,
    featured,
    blocks: pageBlocks,
  };

  return { ok: true, data: preview, warnings, raw: raw.slice(0, 4000) };
}
