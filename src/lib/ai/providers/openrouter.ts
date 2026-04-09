import type { AIProviderAdapter } from '../types';
import { createOpenAIAdapter } from './openai';

export function createOpenRouterAdapter(apiKey: string, baseUrl = 'https://openrouter.ai/api/v1'): AIProviderAdapter {
  return createOpenAIAdapter(apiKey, baseUrl);
}
