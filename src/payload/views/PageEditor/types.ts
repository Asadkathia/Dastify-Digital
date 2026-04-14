export type EditorFieldType = 'text' | 'textarea' | 'select' | 'upload' | 'checkbox' | 'array' | 'link';

export type EditorFieldBase = {
  name: string;
  label: string;
  required?: boolean;
};

export type TextField = EditorFieldBase & { type: 'text' };
export type TextareaField = EditorFieldBase & { type: 'textarea' };
export type SelectField = EditorFieldBase & { type: 'select'; options: Array<{ label: string; value: string }> };
export type UploadField = EditorFieldBase & { type: 'upload' };
export type CheckboxField = EditorFieldBase & { type: 'checkbox' };
export type ArrayField = EditorFieldBase & {
  type: 'array';
  subFields: Array<TextField | TextareaField | SelectField | UploadField | CheckboxField | LinkField>;
};

// Structured link value stored in block data
export type LinkValue = {
  label?: string;
  url: string;
  type: 'external' | 'internal' | 'anchor';
  openInNewTab?: boolean;
};

export type LinkField = EditorFieldBase & { type: 'link'; showLabel?: boolean };

export type EditorField = TextField | TextareaField | SelectField | UploadField | CheckboxField | ArrayField | LinkField;

export type BlockDefinition = {
  blockType: string;
  label: string;
  icon: string;
  category: 'Layout' | 'Content' | 'Conversion' | 'Media' | 'Homepage';
  fields: EditorField[];
  defaultData: Record<string, unknown>;
};

export type BreakpointOverrides = {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: number;
};

export type BlockStyles = {
  // Spacing
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  // Appearance
  backgroundColor?: string;
  backgroundImage?: string;
  opacity?: number;
  // Border
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  // Shadow
  boxShadow?: string;
  // Typography
  textColor?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  // Responsive
  hiddenOn?: Array<'desktop' | 'tablet' | 'mobile'>;
  // Max width
  maxWidth?: number;
  // Background position (focal point for background images)
  backgroundPosition?: string;
  // Per-breakpoint overrides (applied on top of base values)
  tablet?: BreakpointOverrides;
  mobile?: BreakpointOverrides;
};

// ─── Hierarchy: Page → Sections → Columns → Blocks ───────────────────────────

export type BlockInstance = {
  id: string;
  blockType: string;
  data: Record<string, unknown>;
  styles?: BlockStyles;
  isLocked?: boolean;
  isHidden?: boolean;
};

export type ColumnWidth = '1/1' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

export type ColumnInstance = {
  id: string;
  width: ColumnWidth;
  blocks: BlockInstance[];
};

export type SectionInstance = {
  id: string;
  label?: string;
  columns: ColumnInstance[];
  styles?: BlockStyles;
};

// ─── Selection ────────────────────────────────────────────────────────────────

export type SelectionTarget =
  | { kind: 'block'; sectionId: string; columnId: string; blockId: string }
  | { kind: 'section'; sectionId: string }
  | null;

// ─── Other editor types ───────────────────────────────────────────────────────

export type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'error';

export type EditorMessage =
  | { type: 'UPDATE_SECTIONS'; sections: SectionInstance[]; responsiveMode: ResponsiveMode }
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'BLOCK_CLICKED'; blockId: string }
  | { type: 'INLINE_EDIT_START'; blockId: string; fieldName: string }
  | { type: 'INLINE_EDIT_END'; blockId: string; fieldName: string; value: string }
  | {
      type: 'CONVERTED_NODE_SELECTED';
      node:
        | {
            blockId: string;
            fieldName: string;
            styleField?: string;
            tagField?: string;
            allowedTags?: string[];
            tagName: string;
            className: string;
            textValue: string;
            computedStyles: Record<string, string>;
          }
        | null;
    }
  | { type: 'EDITOR_READY' };
