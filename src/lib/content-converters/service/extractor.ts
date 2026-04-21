import 'server-only';
import type { AIProviderConfig } from '@/lib/import-agent/types';
import { normalizeSlug } from '@/lib/cms/slug';
import { runJsonCompletion } from '../_shared/ai-client';
import { importMediaFromUrl } from '../_shared/media-importer';
import { downloadInlineImages } from '../_shared/inline-image-importer';
import { htmlToLexical } from '../_shared/html-to-lexical';
import { htmlToBlocks } from '../_shared/html-to-blocks';
import type { ExtractEnvelope } from '../_shared/types';
import { SERVICE_SYSTEM_PROMPT, buildServiceUserPrompt } from './prompt';
import type { ServiceAIResponse, ServicePreview } from './schema';

export async function extractServiceFromHtml(args: {
  html: string;
  sourceUrl?: string;
  aiConfig: AIProviderConfig;
  model: string;
}): Promise<ExtractEnvelope<ServicePreview>> {
  const warnings: string[] = [];
  let raw = '';

  if (!args.html || args.html.trim().length < 40) {
    return { ok: false, error: 'HTML is empty or too short to extract.' };
  }

  let aiData: ServiceAIResponse;
  try {
    const res = await runJsonCompletion<ServiceAIResponse>({
      config: args.aiConfig,
      model: args.model,
      systemPrompt: SERVICE_SYSTEM_PROMPT,
      userPrompt: buildServiceUserPrompt(args.html, args.sourceUrl),
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
    return { ok: false, error: 'AI could not identify a service title.', raw };
  }

  const slug = normalizeSlug(typeof aiData.slug === 'string' && aiData.slug ? aiData.slug : title);
  const tagline = typeof aiData.tagline === 'string' ? aiData.tagline.trim() : '';
  const excerpt = typeof aiData.excerpt === 'string' ? aiData.excerpt.trim().slice(0, 280) : '';
  const outcomesTitle = typeof aiData.outcomesTitle === 'string' && aiData.outcomesTitle.trim()
    ? aiData.outcomesTitle.trim()
    : 'What you get';
  const outcomes = Array.isArray(aiData.outcomes)
    ? aiData.outcomes.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim())
    : [];
  const cta = aiData.cta && typeof aiData.cta === 'object'
    ? { label: String(aiData.cta.label || 'Learn more →'), href: String(aiData.cta.href || '/contact') }
    : { label: 'Learn more →', href: '/contact' };
  const displayOrder = typeof aiData.displayOrder === 'number' && !Number.isNaN(aiData.displayOrder)
    ? Math.round(aiData.displayOrder)
    : 10;
  const body = typeof aiData.body === 'string' ? aiData.body : '';
  if (!body) {
    warnings.push('AI returned an empty body; you may need to add the content manually in the service editor.');
  }

  const inlineResult = await downloadInlineImages({ html: body, baseUrl: args.sourceUrl });
  const localBody = inlineResult.html;
  warnings.push(...inlineResult.warnings);

  let heroImageId: number | null = null;
  let heroImageSourceUrl: string | null = null;
  if (aiData.featuredImageUrl) {
    heroImageSourceUrl = aiData.featuredImageUrl;
    const imported = await importMediaFromUrl({
      src: aiData.featuredImageUrl,
      alt: title,
      baseUrl: args.sourceUrl,
    });
    if (imported) {
      heroImageId = imported.id;
    } else {
      warnings.push(`Hero image download failed. Original URL: ${aiData.featuredImageUrl}. Upload manually after import.`);
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

  const preview: ServicePreview = {
    title,
    slug,
    tagline,
    excerpt,
    outcomesTitle,
    outcomes,
    cta,
    bodyLexical: htmlToLexical(localBody),
    bodyHtml: localBody,
    heroImageId,
    heroImageSourceUrl,
    displayOrder,
    blocks: pageBlocks,
  };

  return { ok: true, data: preview, warnings, raw: raw.slice(0, 4000) };
}
