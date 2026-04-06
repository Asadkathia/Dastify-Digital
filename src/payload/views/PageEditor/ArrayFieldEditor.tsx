'use client';

import type { ArrayField, TextField, TextareaField } from './types';
import { useEditorStore } from './store';

type ArrayFieldEditorProps = {
  blockId: string;
  field: ArrayField;
  value: Record<string, unknown>[];
};

export function ArrayFieldEditor({ blockId, field, value = [] }: ArrayFieldEditorProps) {
  const updateArrayItem = useEditorStore((s) => s.updateArrayItem);
  const addArrayItem = useEditorStore((s) => s.addArrayItem);
  const removeArrayItem = useEditorStore((s) => s.removeArrayItem);
  const moveArrayItem = useEditorStore((s) => s.moveArrayItem);

  const newItemDefaults = Object.fromEntries(field.subFields.map((sf) => [sf.name, '']));

  return (
    <div>
      {value.map((item, index) => (
        <div
          key={index}
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '8px',
          }}
        >
          {/* Item header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>
              {field.label} {index + 1}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                disabled={index === 0}
                onClick={() => moveArrayItem(blockId, field.name, index, index - 1)}
                style={itemBtnStyle(index === 0)}
                title="Move up"
              >
                ↑
              </button>
              <button
                disabled={index === value.length - 1}
                onClick={() => moveArrayItem(blockId, field.name, index, index + 1)}
                style={itemBtnStyle(index === value.length - 1)}
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => removeArrayItem(blockId, field.name, index)}
                style={{ ...itemBtnStyle(false), color: '#f87171' }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sub-fields */}
          {field.subFields.map((subField) => {
            const subValue = String(item[subField.name] ?? '');
            if (subField.type === 'textarea') {
              return (
                <div key={subField.name} style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>{subField.label}{subField.required ? ' *' : ''}</label>
                  <textarea
                    value={subValue}
                    rows={2}
                    onChange={(e) => updateArrayItem(blockId, field.name, index, subField.name, e.target.value)}
                    style={textareaStyle}
                  />
                </div>
              );
            }
            return (
              <div key={subField.name} style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>{subField.label}{subField.required ? ' *' : ''}</label>
                <input
                  type="text"
                  value={subValue}
                  onChange={(e) => updateArrayItem(blockId, field.name, index, subField.name, e.target.value)}
                  style={inputStyle}
                />
              </div>
            );
          })}
        </div>
      ))}

      <button
        onClick={() => addArrayItem(blockId, field.name, { ...newItemDefaults })}
        style={{
          width: '100%',
          background: 'transparent',
          border: '1px dashed #333',
          borderRadius: '8px',
          color: '#666',
          cursor: 'pointer',
          fontSize: '12px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '4px',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#555';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#666';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#333';
        }}
      >
        <span>＋</span>
        <span>Add {field.label}</span>
      </button>
    </div>
  );
}

const itemBtnStyle = (disabled: boolean): React.CSSProperties => ({
  background: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '4px',
  color: disabled ? '#333' : '#666',
  cursor: disabled ? 'default' : 'pointer',
  fontSize: '11px',
  lineHeight: 1,
  padding: '3px 6px',
  opacity: disabled ? 0.5 : 1,
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: '#666',
  marginBottom: '4px',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f0f0f',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#ccc',
  fontSize: '12px',
  padding: '6px 8px',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
};
