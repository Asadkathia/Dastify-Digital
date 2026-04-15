/**
 * Form definition — used by editor-registry.ts to declare forms
 * that should be auto-created in Payload when the page is uploaded to CMS.
 */

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox';

export type FormFieldDefinition = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  /** 50 = half width (pairs with adjacent field), 100 = full width. Default: 100 */
  width?: 50 | 100;
  /** Only for select fields */
  options?: Array<{ label: string; value: string }>;
};

export type FormDefinition = {
  /** Used as the Payload form title — should be unique per page e.g. "Demo — Audit Request" */
  title: string;
  fields: FormFieldDefinition[];
  submitButtonLabel?: string;
  confirmationMessage?: string;
};
