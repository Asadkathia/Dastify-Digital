import type { AIProviderAdapter } from '../types';

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

function prefersMaxCompletionTokens(model: string): boolean {
  return /^o\d/i.test(model) || /^gpt-5/i.test(model);
}

function buildBody(
  options: {
    model: string;
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    maxTokens?: number;
    temperature?: number;
  },
  useMaxCompletionTokens: boolean,
) {
  return {
    model: options.model,
    messages: options.messages,
    ...(useMaxCompletionTokens
      ? { max_completion_tokens: options.maxTokens }
      : { max_tokens: options.maxTokens, temperature: options.temperature }),
  };
}

async function postCompletion(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ response: Response; json: OpenAIResponse }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await response.json()) as OpenAIResponse;
  return { response, json };
}

export function createOpenAIAdapter(apiKey: string, baseUrl = 'https://api.openai.com/v1'): AIProviderAdapter {
  if (!apiKey) {
    throw new Error('Missing OpenAI-compatible API key');
  }

  return {
    async complete(options) {
      const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
      const firstTryUsesMaxCompletion = prefersMaxCompletionTokens(options.model);
      let { response, json } = await postCompletion(
        url,
        apiKey,
        buildBody(options, firstTryUsesMaxCompletion),
      );

      // Some providers/models reject one token-limit parameter and require the other.
      if (!response.ok && json.error?.message) {
        const message = json.error.message;
        if (!firstTryUsesMaxCompletion && /max_completion_tokens/i.test(message)) {
          ({ response, json } = await postCompletion(
            url,
            apiKey,
            buildBody(options, true),
          ));
        } else if (firstTryUsesMaxCompletion && /max_tokens/i.test(message)) {
          ({ response, json } = await postCompletion(
            url,
            apiKey,
            buildBody(options, false),
          ));
        }
      }

      if (!response.ok) {
        throw new Error(json.error?.message || `OpenAI request failed (${response.status})`);
      }

      return {
        content: json.choices?.[0]?.message?.content ?? '',
        inputTokens: json.usage?.prompt_tokens,
        outputTokens: json.usage?.completion_tokens,
      };
    },
  };
}
