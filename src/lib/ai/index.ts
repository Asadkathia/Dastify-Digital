import type { AIProviderConfig } from '@/lib/import-agent/types';
import type { AIProviderAdapter } from './types';
import { createAnthropicAdapter } from './providers/anthropic';
import { createOpenAIAdapter } from './providers/openai';
import { createGoogleAdapter } from './providers/google';
import { createOllamaAdapter } from './providers/ollama';
import { createOpenRouterAdapter } from './providers/openrouter';

function requireValue(value: string, name: string): string {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function createAIAdapter(config: AIProviderConfig): AIProviderAdapter {
  switch (config.provider) {
    case 'anthropic':
      return createAnthropicAdapter(requireValue(config.apiKey ?? process.env.ANTHROPIC_API_KEY ?? '', 'ANTHROPIC_API_KEY'));
    case 'openai':
      return createOpenAIAdapter(requireValue(config.apiKey ?? process.env.OPENAI_API_KEY ?? '', 'OPENAI_API_KEY'), config.baseUrl);
    case 'openrouter':
      return createOpenRouterAdapter(
        requireValue(config.apiKey ?? process.env.OPENROUTER_API_KEY ?? '', 'OPENROUTER_API_KEY'),
        config.baseUrl ?? 'https://openrouter.ai/api/v1',
      );
    case 'google':
      return createGoogleAdapter(requireValue(config.apiKey ?? process.env.GOOGLE_API_KEY ?? '', 'GOOGLE_API_KEY'));
    case 'ollama':
      return createOllamaAdapter(config.baseUrl);
    default:
      throw new Error(`Unknown AI provider: ${(config as { provider?: string }).provider}`);
  }
}
