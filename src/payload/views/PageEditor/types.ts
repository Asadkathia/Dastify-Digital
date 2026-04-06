export type EditorFieldType = 'text' | 'textarea' | 'select' | 'upload' | 'checkbox' | 'array';

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
  subFields: Array<TextField | TextareaField | SelectField | UploadField | CheckboxField>;
};

export type EditorField = TextField | TextareaField | SelectField | UploadField | CheckboxField | ArrayField;

export type BlockDefinition = {
  blockType: string;
  label: string;
  icon: string;
  category: 'Layout' | 'Content' | 'Conversion';
  fields: EditorField[];
  defaultData: Record<string, unknown>;
};

export type BlockStyles = {
  paddingTop?: number;
  paddingBottom?: number;
  backgroundColor?: string;
  hiddenOn?: Array<'desktop' | 'tablet' | 'mobile'>;
};

export type BlockInstance = {
  id: string;
  blockType: string;
  data: Record<string, unknown>;
  styles?: BlockStyles;
};

export type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'error';

export type EditorMessage =
  | { type: 'UPDATE_BLOCKS'; blocks: BlockInstance[]; responsiveMode: ResponsiveMode }
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'BLOCK_CLICKED'; blockId: string }
  | { type: 'INLINE_EDIT_START'; blockId: string; fieldName: string }
  | { type: 'INLINE_EDIT_END'; blockId: string; fieldName: string; value: string }
  | { type: 'EDITOR_READY' };
