import type { AIProviderConfig } from '@/lib/import-agent/types';

export type ConvertedComponent = {
  filename: string; // e.g. "Hero.tsx"
  code: string;
};

export type ConvertedSectionMeta = {
  key: string;
  label: string;
  icon: string;
  className: string;
};

export type ConversionAIOutput = {
  components: ConvertedComponent[];
  pageFile: string;           // full code for page.tsx
  contentType: string;        // TypeScript type declaration string
  defaultContent: Record<string, unknown>;
  globalsCssAdditions: string;
  /** Full TypeScript code for editor-registry.ts (with formDefinitions if page has a form). */
  editorRegistry: string;
  /** One entry per section — used for auto-registering the page in preview-registry and content-map. */
  sections: ConvertedSectionMeta[];
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
  sections: ConvertedSectionMeta[];
} | {
  ok: false;
  error: string;
  rawAiResponse?: string;
};

