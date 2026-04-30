import type { ComponentType } from 'react';
import type { FieldGroup } from './field-labels';

export type ConvertedSectionSpec = {
  key: string;
  label: string;
  icon?: string;
  /** Root CSS class name of the rendered <section> — used by the Section Style editor to target overrides. */
  className?: string;
  /** Curated marketing-friendly labels keyed by dotted field path. Wins over smartLabel. */
  fieldLabels?: Record<string, string>;
  /** Curated group overrides keyed by dotted field path. Wins over categorizeField. */
  fieldGroups?: Record<string, FieldGroup>;
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

export type ConvertedPageContent = Record<string, unknown>;

export type ConvertedPageRegistry<TContent extends ConvertedPageContent = ConvertedPageContent> = {
  pageName: string;
  defaultContent: TContent;
  sections: ConvertedSectionRendererSpec[];
};

export type ConvertedPageContentConfig = {
  pageName: string;
  contentFile: string;
  sections: ConvertedSectionSpec[];
};
