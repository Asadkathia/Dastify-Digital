import { createAIAdapter } from '@/lib/ai';
import { buildImportPrompt } from '@/lib/ai/prompt';
import { resolveModel } from '@/lib/ai/default-models';
import { serializeParsedPage } from './parse-html';
import type { AIBlockMapping, AIProviderConfig, ParsedPage } from './types';

export class AIParseError extends Error {
  rawAiResponse?: string;

  constructor(message: string, rawAiResponse?: string) {
    super(message);
    this.name = 'AIParseError';
    this.rawAiResponse = rawAiResponse;
  }
}

function extractLikelyJson(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // Common model output format: ```json ... ```
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  // Fallback: take the largest object-like slice.
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

function parseAiMapping(raw: string): AIBlockMapping {
  const direct = raw.trim();
  try {
    return JSON.parse(direct) as AIBlockMapping;
  } catch {
    const extracted = extractLikelyJson(direct);
    return JSON.parse(extracted) as AIBlockMapping;
  }
}

export async function mapToBlocks(page: ParsedPage, config: AIProviderConfig): Promise<AIBlockMapping & { _pageStyles?: string }> {
  const serialized = serializeParsedPage(page);
  const messages = buildImportPrompt(serialized);
  const adapter = createAIAdapter(config);
  const model = resolveModel(config.provider, config.model);

  const result = await adapter.complete({
    model,
    messages,
    maxTokens: 8192,
    temperature: 0.2,
  });

  try {
    const mapping = parseAiMapping(result.content);
    // Carry page styles through so the validator can inject them into fallbacks
    return { ...mapping, _pageStyles: page.pageStyles };
  } catch {
    throw new AIParseError('Failed to parse AI response as JSON', result.content);
  }
}
