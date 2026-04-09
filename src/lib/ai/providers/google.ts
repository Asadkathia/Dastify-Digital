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

      const systemText = options.messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
      const conversation = options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
          contents: conversation,
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            maxOutputTokens: options.maxTokens ?? 8192,
            responseMimeType: 'application/json',
          },
        }),
      });

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
