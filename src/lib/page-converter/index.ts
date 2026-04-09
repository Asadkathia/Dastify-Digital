import { createAIAdapter } from '@/lib/ai';
import { resolveModel } from '@/lib/ai/default-models';
import { buildConverterPrompt } from './prompt';
import type { ConversionAIOutput, ConvertedFile, ConvertPageRequest, ConvertPageResult } from './types';

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  // Strip markdown fences if present
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();
  // Take the largest {...} slice
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function toKebab(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toPascal(name: string): string {
  return name.split('-').map(capitalise).join('');
}

export async function convertPage(request: ConvertPageRequest): Promise<ConvertPageResult> {
  const pageName = toKebab(request.pageName);
  if (!pageName) {
    return { ok: false, error: 'Page name is required.' };
  }

  const adapter = createAIAdapter(request.ai);
  const model = resolveModel(request.ai.provider, request.ai.model);
  const messages = buildConverterPrompt(request.html, pageName);

  let rawResponse = '';
  try {
    const result = await adapter.complete({
      model,
      messages,
      maxTokens: 16000,
      temperature: 0.1,
    });
    rawResponse = result.content;
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'AI request failed',
    };
  }

  let aiOutput: ConversionAIOutput;
  try {
    aiOutput = JSON.parse(extractJson(rawResponse)) as ConversionAIOutput;
  } catch {
    return {
      ok: false,
      error: 'Failed to parse AI response as JSON',
      rawAiResponse: rawResponse.slice(0, 4000),
    };
  }

  // Validate minimum shape
  if (!Array.isArray(aiOutput.components) || !aiOutput.pageFile) {
    return {
      ok: false,
      error: 'AI response missing required fields (components or pageFile)',
      rawAiResponse: rawResponse.slice(0, 4000),
    };
  }

  const files: ConvertedFile[] = [];

  // 1. Component files
  for (const component of aiOutput.components) {
    if (!component.filename || !component.code) continue;
    files.push({
      path: `app/(site)/${pageName}/components/${component.filename}`,
      code: component.code,
    });
  }

  // 2. Page entry file
  files.push({
    path: `app/(site)/${pageName}/page.tsx`,
    code: aiOutput.pageFile,
  });

  // 3. Content type file (for reference + future CMS wiring)
  if (aiOutput.contentType) {
    files.push({
      path: `app/(site)/${pageName}/content.ts`,
      code: [
        aiOutput.contentType,
        '',
        `export const defaultContent: ${toPascal(pageName)}Content = ${JSON.stringify(aiOutput.defaultContent ?? {}, null, 2)};`,
      ].join('\n'),
    });
  }

  return {
    ok: true,
    pageName,
    files,
    cssAdditions: aiOutput.globalsCssAdditions ?? '',
  };
}
