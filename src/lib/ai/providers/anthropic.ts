import Anthropic from '@anthropic-ai/sdk';
import type { AIProviderAdapter } from '../types';

export function createAnthropicAdapter(apiKey: string): AIProviderAdapter {
  if (!apiKey) {
    throw new Error('Missing Anthropic API key');
  }

  const client = new Anthropic({ apiKey });

  return {
    async complete(options) {
      const system = options.messages.find((m) => m.role === 'system')?.content;
      const messages = options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const response = await client.messages.create({
        model: options.model,
        max_tokens: options.maxTokens ?? 8192,
        system,
        messages,
      });

      const first = response.content[0];

      return {
        content: first && first.type === 'text' ? first.text : '',
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      };
    },
  };
}
