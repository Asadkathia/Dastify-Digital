import type { AIProviderAdapter } from '../types';

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  error?: { message?: string };
};

export function createGoogleAdapter(apiKey: string): AIProviderAdapter {
  if (!apiKey) {
    throw new Error('Missing Google API key');
  }

  return {
    async complete(options) {
      const model = options.model || 'gemini-1.5-pro';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const isGemini1 = model.startsWith('gemini-1');
      const maxOutputTokens = isGemini1
        ? Math.min(options.maxTokens ?? 8192, 8192)
        : (options.maxTokens ?? 16384);

      const systemText = options.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
      const conversation = options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60_000);

      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
            contents: conversation,
            generationConfig: {
              temperature: options.temperature ?? 0.2,
              maxOutputTokens,
              responseMimeType: 'application/json',
            },
          }),
        });
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error('Google Gemini request timed out after 60 seconds');
        }
        throw err;
      }
      clearTimeout(timeoutId);

      const json = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        throw new Error(json.error?.message || `Google Gemini request failed (${response.status})`);
      }

      const content = (json.candidates?.[0]?.content?.parts ?? [])
        .map((part) => part.text ?? '')
        .join('')
        .trim();

      return {
        content,
        inputTokens: json.usageMetadata?.promptTokenCount,
        outputTokens: json.usageMetadata?.candidatesTokenCount,
      };
    },
  };
}
