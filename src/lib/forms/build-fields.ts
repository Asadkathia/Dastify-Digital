import type { FormFieldDefinition } from './types';

/**
 * Convert our FormFieldDefinition[] into Payload form builder field blocks.
 * Payload supports: text, email, number, textarea, select, checkbox, country, state.
 * tel and url map to text (no native support in Payload form builder).
 */
export function buildPayloadFormFields(
  fields: FormFieldDefinition[],
): Record<string, unknown>[] {
  return fields.map((field) => {
    const base = {
      name: field.name,
      label: field.label,
      required: field.required ?? false,
      width: field.width ?? 100,
    };

    switch (field.type) {
      case 'email':
        return { ...base, blockType: 'email' };

      case 'number':
        return { ...base, blockType: 'number', placeholder: field.placeholder };

      case 'textarea':
        return { ...base, blockType: 'textarea', placeholder: field.placeholder };

      case 'checkbox':
        return { ...base, blockType: 'checkbox' };

      case 'select':
        return {
          ...base,
          blockType: 'select',
          placeholder: field.placeholder,
          options: (field.options ?? []).map((opt) => ({
            label: opt.label,
            value: opt.value,
          })),
        };

      // tel, url, text → all map to Payload 'text' block
      default:
        return { ...base, blockType: 'text', placeholder: field.placeholder };
    }
  });
}
