import 'server-only';
import type { AIProviderConfig } from '@/lib/import-agent/types';
import { createAIAdapter } from '@/lib/ai';

/**
 * Runs a single JSON-output AI call. Wraps the existing multi-provider adapter
 * with a retry-on-parse-failure loop — if the first response isn't valid JSON,
 * re-ask with an explicit "respond with valid JSON only" nudge.
 */
export async function runJsonCompletion<T>(args: {
  config: AIProviderConfig;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ data: T; raw: string }> {
  const adapter = createAIAdapter(args.config);

  const res = await adapter.complete({
    model: args.model,
    temperature: args.temperature ?? 0.2,
    maxTokens: args.maxTokens ?? 8000,
    messages: [
      { role: 'system', content: args.systemPrompt },
      { role: 'user', content: args.userPrompt },
    ],
  });

  const raw = res.content ?? '';
  const data = extractJson<T>(raw);
  if (data !== null) return { data, raw };

  // One retry with a stricter instruction.
  const retry = await adapter.complete({
    model: args.model,
    temperature: 0,
    maxTokens: args.maxTokens ?? 8000,
    messages: [
      { role: 'system', content: args.systemPrompt },
      { role: 'user', content: args.userPrompt },
      { role: 'assistant', content: raw },
      {
        role: 'user',
        content:
          'Your previous response was not valid JSON. Respond again with ONLY a JSON object — no prose, no markdown code fences, no preamble.',
      },
    ],
  });

  const retryRaw = retry.content ?? '';
  const retryData = extractJson<T>(retryRaw);
  if (retryData !== null) return { data: retryData, raw: retryRaw };

  throw new Error(`AI did not return valid JSON after retry. Last response: ${retryRaw.slice(0, 300)}`);
}

/**
 * Tolerant JSON parser. Strips markdown code fences, grabs the first balanced
 * JSON object, and returns null if it can't find one.
 */
function extractJson<T>(text: string): T | null {
  if (!text) return null;
  const stripped = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  // Try direct parse first.
  try {
    return JSON.parse(stripped) as T;
  } catch {
    // fall through
  }

  // Find the first balanced { … } block.
  const start = stripped.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(stripped.slice(start, i + 1)) as T;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
