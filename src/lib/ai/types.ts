export type AIMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export type AICompletionOptions = {
  model: string;
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
};

export type AICompletionResult = {
  content: string;
  inputTokens?: number;
  outputTokens?: number;
};

export type AIProviderAdapter = {
  complete(options: AICompletionOptions): Promise<AICompletionResult>;
};
