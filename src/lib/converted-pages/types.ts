import type { ComponentType } from 'react';

export type ConvertedSectionSpec = {
  key: string;
  label: string;
  icon?: string;
  /** Root CSS class name of the rendered <section> — used by the Section Style editor to target overrides. */
  className?: string;
};

export type ConvertedEditableTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

export type ConvertedNodeStyles = {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  textAlign?: 'left' | 'center' | 'right';
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
};

export type ConvertedEditorNodeState = {
  tag?: ConvertedEditableTag;
  styles?: ConvertedNodeStyles;
};

export type ConvertedSectionEditorState = {
  nodes?: Record<string, ConvertedEditorNodeState>;
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
