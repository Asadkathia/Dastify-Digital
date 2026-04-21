import type { AIProvider } from '@/lib/import-agent/types';

/**
 * Inputs common to every content converter (blog-post, service, case-study).
 * UI sends these to the API route; the route dispatches to the right extractor.
 */
export type ConverterInput = {
  /** Raw HTML pasted by the user, or fetched from `url`. */
  html: string;
  /** Optional source URL (for provenance; used to resolve relative image src). */
  url?: string;
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
};

/**
 * Every extractor returns this envelope so the UI can render errors/warnings
 * uniformly. `data` is the specific extracted shape for that content type.
 */
export type ExtractEnvelope<TData> = {
  ok: boolean;
  error?: string;
  /** Warnings that don't block the import but the user should see (e.g. "1 inline image failed to download"). */
  warnings?: string[];
  /** Raw AI response (truncated) for debugging misbehaving extractors. */
  raw?: string;
  data?: TData;
};
