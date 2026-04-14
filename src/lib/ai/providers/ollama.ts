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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);

      let response: Response;
      try {
        response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
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
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error(
            `Ollama server at ${baseUrl} did not respond within 15 seconds. Make sure Ollama is running: ollama serve`,
          );
        }
        throw err;
      }
      clearTimeout(timeoutId);

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
