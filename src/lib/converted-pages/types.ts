import type { ComponentType } from 'react';

export type ConvertedSectionSpec = {
  key: string;
  label: string;
  icon?: string;
};

export type ConvertedSectionRendererSpec = ConvertedSectionSpec & {
  Component: ComponentType<{ data: unknown }>;
};

export type ConvertedPageRegistry = {
  pageName: string;
  defaultContent: Record<string, unknown>;
  sections: ConvertedSectionRendererSpec[];
};

export type ConvertedPageContentConfig = {
  pageName: string;
  contentFile: string;
  sections: ConvertedSectionSpec[];
};

