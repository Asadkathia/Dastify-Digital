import type { AIProvider } from '@/lib/import-agent/types';

export const MODEL_OPTIONS_BY_PROVIDER: Record<AIProvider, string[]> = {
  anthropic: [
    'claude-sonnet-4-6',
    'claude-3-7-sonnet-latest',
    'claude-3-5-sonnet-latest',
    'claude-3-5-haiku-latest',
  ],
  openai: [
    'gpt-5.4',
    'gpt-5.4-mini',
    'gpt-5.4-nano',
    'gpt-5.4-pro',
    'o4-mini',
    'gpt-4o-mini',
  ],
  google: [
    'gemini-2.5-pro',
    'gemini-3.0-pro',
    'gemini-3.1-pro',
    'gemini-2.5-pro-preview-03-25',
    'gemini-1.5-pro',
  ],
  openrouter: [
    'openai/gpt-5.4',
    'openai/gpt-5.4-mini',
    'openai/o4-mini',
    'anthropic/claude-sonnet-4-6',
    'google/gemini-2.5-pro',
  ],
  ollama: [
    'llama3.1',
    'qwen2.5-coder',
    'deepseek-r1',
    'mistral-small3.1',
  ],
};

export const DEFAULT_MODEL_BY_PROVIDER: Record<AIProvider, string> = {
  anthropic: MODEL_OPTIONS_BY_PROVIDER.anthropic[0],
  openai: MODEL_OPTIONS_BY_PROVIDER.openai[1],
  google: MODEL_OPTIONS_BY_PROVIDER.google[0],
  openrouter: MODEL_OPTIONS_BY_PROVIDER.openrouter[1],
  ollama: MODEL_OPTIONS_BY_PROVIDER.ollama[0],
};

function envModel(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'openai':
      return process.env.NEXT_PUBLIC_OPENAI_MODEL || process.env.OPENAI_MODEL;
    case 'google':
      return process.env.NEXT_PUBLIC_GOOGLE_MODEL || process.env.GOOGLE_MODEL;
    case 'anthropic':
      return process.env.NEXT_PUBLIC_ANTHROPIC_MODEL || process.env.ANTHROPIC_MODEL;
    case 'openrouter':
      return process.env.NEXT_PUBLIC_OPENROUTER_MODEL || process.env.OPENROUTER_MODEL;
    case 'ollama':
      return process.env.NEXT_PUBLIC_OLLAMA_MODEL || process.env.OLLAMA_MODEL;
    default:
      return undefined;
  }
}

export function resolveModel(provider: AIProvider, explicitModel?: string): string {
  const model = explicitModel?.trim();
  if (model) return model;
  const fromEnv = envModel(provider)?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_MODEL_BY_PROVIDER[provider];
}
