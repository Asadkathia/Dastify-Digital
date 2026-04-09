import type { AIProviderConfig } from '@/lib/import-agent/types';

export type ConvertedComponent = {
  filename: string; // e.g. "Hero.tsx"
  code: string;
};

export type ConversionAIOutput = {
  components: ConvertedComponent[];
  pageFile: string;           // full code for page.tsx
  contentType: string;        // TypeScript type declaration string
  defaultContent: Record<string, unknown>;
  globalsCssAdditions: string;
};

export type ConvertPageRequest = {
  html: string;
  pageName: string;   // slug-style: "services", "about", "contact"
  ai: AIProviderConfig;
};

export type ConvertedFile = {
  path: string;   // relative to project src/
  code: string;
};

export type ConvertPageResult = {
  ok: true;
  pageName: string;
  files: ConvertedFile[];
  cssAdditions: string;
} | {
  ok: false;
  error: string;
  rawAiResponse?: string;
};
