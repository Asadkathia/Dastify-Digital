import type { AIProviderAdapter } from '../types';

type OllamaResponse = {
  message?: { content?: string };
  prompt_eval_count?: number;
  eval_count?: number;
  error?: string;
};

export function createOllamaAdapter(baseUrl = 'http://localhost:11434'): AIProviderAdapter {
  return {
    async complete(options) {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.2,
            num_predict: options.maxTokens ?? 8192,
          },
        }),
      });

      const json = (await response.json()) as OllamaResponse;

      if (!response.ok) {
        throw new Error(json.error || `Ollama request failed (${response.status})`);
      }

      return {
        content: json.message?.content ?? '',
        inputTokens: json.prompt_eval_count,
        outputTokens: json.eval_count,
      };
    },
  };
}
