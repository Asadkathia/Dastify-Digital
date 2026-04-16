import { createAIAdapter } from '@/lib/ai';
import { resolveModel } from '@/lib/ai/default-models';
import { buildConverterPrompt } from './prompt';
import type {
  ConversionAIOutput,
  ConvertedFile,
  ConvertPageRequest,
  ConvertPageResult,
} from './types';

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
      maxTokens: 64000,
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

  // ── Defensive post-processing: strip any footer artifacts from AI output ──
  if (Array.isArray(aiOutput.sections)) {
    const hadFooter = aiOutput.sections.some((s) => s.key === 'footer');
    if (hadFooter) {
      console.warn('[converter] AI generated a footer section — stripping it (footer is global)');
    }
    aiOutput.sections = aiOutput.sections.filter((s) => s.key !== 'footer');
  }
  if (Array.isArray(aiOutput.components)) {
    aiOutput.components = aiOutput.components.filter((c) => !/footer/i.test(c.filename));
  }
  if (aiOutput.editorRegistry && aiOutput.editorRegistry.includes("key: 'footer'")) {
    console.warn('[converter] AI generated footer in editorRegistry — stripping');
    aiOutput.editorRegistry = aiOutput.editorRegistry.replace(/\{\s*key:\s*['"]footer['"][^}]*\},?\s*/g, '');
  }
  if (aiOutput.contentType && /^\s*footer[?]?\s*:/m.test(aiOutput.contentType)) {
    console.warn('[converter] AI generated footer field in contentType — stripping');
    aiOutput.contentType = aiOutput.contentType.replace(/^\s*footer[?]?\s*:[^;]+;?\n?/m, '');
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

  // 3. Content type + defaultContent file
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

  // 4. Editor registry (sections + formDefinitions for CMS upload)
  if (aiOutput.editorRegistry?.trim()) {
    files.push({
      path: `app/(site)/${pageName}/editor-registry.ts`,
      code: aiOutput.editorRegistry,
    });
  }

  const sections = Array.isArray(aiOutput.sections) ? aiOutput.sections : [];

  return {
    ok: true,
    pageName,
    files,
    cssAdditions: aiOutput.globalsCssAdditions ?? '',
    sections,
  };
}

