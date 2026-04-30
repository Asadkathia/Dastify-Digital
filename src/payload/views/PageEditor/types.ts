import type { FieldGroup } from '@/lib/converted-pages/field-labels';

export type EditorFieldType = 'text' | 'textarea' | 'number' | 'select' | 'upload' | 'icon-upload' | 'checkbox' | 'array' | 'link';

export type EditorFieldBase = {
  name: string;
  label: string;
  required?: boolean;
  group?: FieldGroup;
};

export type TextField = EditorFieldBase & { type: 'text' };
export type TextareaField = EditorFieldBase & { type: 'textarea' };
export type SelectField = EditorFieldBase & { type: 'select'; options: Array<{ label: string; value: string }> };
export type UploadField = EditorFieldBase & { type: 'upload' };
export type IconUploadField = EditorFieldBase & { type: 'icon-upload' };
export type NumberField = EditorFieldBase & { type: 'number'; min?: number; max?: number; step?: number };
export type CheckboxField = EditorFieldBase & { type: 'checkbox' };
export type ArrayField = EditorFieldBase & {
  type: 'array';
  subFields: Array<TextField | TextareaField | NumberField | SelectField | UploadField | CheckboxField | LinkField | IconUploadField>;
};

// Structured link value stored in block data
export type LinkValue = {
  label?: string;
  url: string;
  type: 'external' | 'internal' | 'anchor';
  openInNewTab?: boolean;
};

export type LinkField = EditorFieldBase & { type: 'link'; showLabel?: boolean };

export type EditorField = TextField | TextareaField | NumberField | SelectField | UploadField | IconUploadField | CheckboxField | ArrayField | LinkField;

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
  minHeight?: number;
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
  // Min height — the simplest "make this section taller/shorter" control.
  // Applied as CSS min-height so content can still grow past it.
  minHeight?: number;
  // Background position (focal point for background images)
  backgroundPosition?: string;
  // Per-breakpoint overrides (applied on top of base values)
  tablet?: BreakpointOverrides;
  mobile?: BreakpointOverrides;
};

// ─── Hierarchy: Page → Sections → Columns → Blocks ───────────────────────────

// ─── Widget system ────────────────────────────────────────────────────────────

export type WidgetStyles = {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  maxWidth?: number;
  width?: string;
};

export type WidgetInstance = {
  id: string;
  widgetType: string;
  data: Record<string, unknown>;
  styles?: WidgetStyles;
  children?: WidgetInstance[];
  isLocked?: boolean;
  isHidden?: boolean;
};

export type WidgetFieldType = 'text' | 'textarea' | 'select' | 'upload' | 'checkbox' | 'link';

export type WidgetFieldBase = { name: string; label: string; required?: boolean };

export type WidgetTextField = WidgetFieldBase & { type: 'text' };
export type WidgetTextareaField = WidgetFieldBase & { type: 'textarea' };
export type WidgetSelectField = WidgetFieldBase & { type: 'select'; options: Array<{ label: string; value: string }> };
export type WidgetUploadField = WidgetFieldBase & { type: 'upload' };
export type WidgetCheckboxField = WidgetFieldBase & { type: 'checkbox' };
export type WidgetLinkField = WidgetFieldBase & { type: 'link'; showLabel?: boolean };

export type WidgetField =
  | WidgetTextField
  | WidgetTextareaField
  | WidgetSelectField
  | WidgetUploadField
  | WidgetCheckboxField
  | WidgetLinkField;

export type WidgetDefinition = {
  widgetType: string;
  label: string;
  icon: string;
  category: 'Basic' | 'Media' | 'Layout' | 'Interactive';
  isContainer?: boolean;
  fields: WidgetField[];
  defaultData: Record<string, unknown>;
};

// Widget selection target (extends SelectionTarget below)
export type WidgetSelectionTarget = {
  kind: 'widget';
  sectionId: string;
  columnId: string;
  blockId: string;
  widgetId: string;
};

export type BlockInstance = {
  id: string;
  blockType: string;
  data: Record<string, unknown>;
  styles?: BlockStyles;
  widgets?: WidgetInstance[];
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
  | WidgetSelectionTarget
  | null;

// ─── Other editor types ───────────────────────────────────────────────────────

export type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'error';

// ─── Drag-and-drop protocol ───────────────────────────────────────────────────

export type DragPayload =
  | { kind: 'block'; blockId: string; sourceSectionId: string; sourceColumnId: string }
  | { kind: 'section'; sectionId: string }
  | { kind: 'widget'; widgetId: string; blockId: string; parentWidgetId: string | null };

export type DropTarget =
  | { kind: 'block'; targetSectionId: string; targetColumnId: string; targetBlockId: string; position: 'before' | 'after' }
  | { kind: 'column'; targetSectionId: string; targetColumnId: string; position: 'start' | 'end' }
  | { kind: 'section'; targetSectionId: string; position: 'before' | 'after' }
  | { kind: 'widget'; targetBlockId: string; targetWidgetId: string | null; position: 'before' | 'after' | 'inside' };

export type SectionStyleOverrideMap = Record<
  string,
  Partial<Record<'desktop' | 'tablet' | 'mobile', Record<string, string>>>
>;

export type EditorMessage =
  | { type: 'UPDATE_SECTIONS'; sections: SectionInstance[]; responsiveMode: ResponsiveMode; sectionStyleOverrides?: SectionStyleOverrideMap }
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
            /** True when the clicked element was tagged data-image-field="true". */
            isImageField?: boolean;
            /** Dotted path of the alt-text companion field (when isImageField). */
            altField?: string;
            /** Dotted path of the boolean "hide this slot" companion field (when isImageField). */
            hiddenField?: string;
          }
        | null;
    }
  | { type: 'EDITOR_READY' }
  | { type: 'DRAG_COMMIT'; drag: DragPayload; drop: DropTarget }
  | { type: 'WIDGET_CLICKED'; blockId: string; widgetId: string }
  | { type: 'WIDGET_INLINE_EDIT_END'; blockId: string; widgetId: string; fieldName: string; value: string }
  | { type: 'TRIGGER_UNDO' }
  | { type: 'TRIGGER_REDO' };
