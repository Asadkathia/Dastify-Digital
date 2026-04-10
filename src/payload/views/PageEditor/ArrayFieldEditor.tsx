'use client';

import { useRef, useState } from 'react';
import type { ArrayField, UploadField } from './types';
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

  const newItemDefaults = Object.fromEntries(
    field.subFields.map((sf) => {
      if (sf.type === 'checkbox') return [sf.name, false];
      if (sf.type === 'select') return [sf.name, sf.options[0]?.value ?? ''];
      if (sf.type === 'upload') return [sf.name, null];
      return [sf.name, ''];
    }),
  );

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
            const rawSubValue = item[subField.name];

            if (subField.type === 'upload') {
              return (
                <ArrayUploadSubFieldEditor
                  key={subField.name}
                  arrayFieldName={field.name}
                  blockId={blockId}
                  field={subField}
                  index={index}
                  item={item}
                  value={rawSubValue}
                />
              );
            }

            if (subField.type === 'checkbox') {
              return (
                <div key={subField.name} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id={`${blockId}-${field.name}-${index}-${subField.name}`}
                    checked={rawSubValue === true}
                    onChange={(e) => updateArrayItem(blockId, field.name, index, subField.name, e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0ea5e9' }}
                  />
                  <label htmlFor={`${blockId}-${field.name}-${index}-${subField.name}`} style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
                    {subField.label}
                    {subField.required ? ' *' : ''}
                  </label>
                </div>
              );
            }

            if (subField.type === 'select') {
              return (
                <div key={subField.name} style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>{subField.label}{subField.required ? ' *' : ''}</label>
                  <select
                    value={typeof rawSubValue === 'string' ? rawSubValue : (subField.options[0]?.value ?? '')}
                    onChange={(e) => updateArrayItem(blockId, field.name, index, subField.name, e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {subField.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }

            const subValue = String(rawSubValue ?? '');
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

function ArrayUploadSubFieldEditor({
  blockId,
  arrayFieldName,
  field,
  index,
  item,
  value,
}: {
  blockId: string;
  arrayFieldName: string;
  field: UploadField;
  index: number;
  item: Record<string, unknown>;
  value: unknown;
}) {
  const updateArrayItem = useEditorStore((s) => s.updateArrayItem);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgSrc =
    value && typeof value === 'object' && 'url' in (value as object)
      ? String((value as { url?: string }).url ?? '')
      : value && typeof value === 'object' && 'filename' in (value as object)
        ? `/media/${String((value as { filename?: string }).filename ?? '')}`
        : typeof value === 'string'
          ? value
          : '';

  const companionAltField =
    field.name.endsWith('image')
      ? 'imageAlt'
      : null;

  function normalizeMediaResponse(raw: unknown): { id?: string | number; url?: string; alt?: string; filename?: string } {
    if (!raw || typeof raw !== 'object') return {};
    const direct = raw as Record<string, unknown>;
    const maybeDoc =
      (direct.doc && typeof direct.doc === 'object' ? (direct.doc as Record<string, unknown>) : null) ||
      (direct.result && typeof direct.result === 'object' ? (direct.result as Record<string, unknown>) : null) ||
      direct;
    const filename =
      typeof maybeDoc.filename === 'string' && maybeDoc.filename.trim()
        ? maybeDoc.filename.trim()
        : undefined;
    const explicitURL =
      typeof maybeDoc.url === 'string' && maybeDoc.url.trim()
        ? maybeDoc.url.trim()
        : undefined;
    return {
      id: (typeof maybeDoc.id === 'string' || typeof maybeDoc.id === 'number') ? maybeDoc.id : undefined,
      url: explicitURL || (filename ? `/media/${filename}` : undefined),
      alt: typeof maybeDoc.alt === 'string' ? maybeDoc.alt : undefined,
      filename,
    };
  }

  async function handleFileSelect(file: File | null) {
    if (!file) return;
    setIsUploading(true);
    try {
      const fallbackAlt =
        (typeof item.imageAlt === 'string' && item.imageAlt.trim()) ||
        file.name.replace(/\.[^.]+$/, '') ||
        'Uploaded image';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('_payload', JSON.stringify({ alt: fallbackAlt }));

      const res = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        let reason = 'Upload failed';
        try {
          const err = await res.json() as { errors?: Array<{ message?: string }> };
          reason = err.errors?.[0]?.message || reason;
        } catch {
          // no-op
        }
        throw new Error(reason);
      }

      const mediaRaw = await res.json();
      let resolvedMedia = normalizeMediaResponse(mediaRaw);

      if (!resolvedMedia?.url && resolvedMedia?.id != null) {
        const mediaRes = await fetch(`/api/media/${resolvedMedia.id}`, { credentials: 'include' });
        if (mediaRes.ok) {
          const full = normalizeMediaResponse(await mediaRes.json());
          resolvedMedia = { ...resolvedMedia, ...full };
        }
      }

      if (resolvedMedia?.url) {
        updateArrayItem(blockId, arrayFieldName, index, field.name, resolvedMedia);
      } else if (resolvedMedia?.id != null) {
        updateArrayItem(blockId, arrayFieldName, index, field.name, resolvedMedia.id);
      }

      if (
        companionAltField &&
        typeof item[companionAltField] === 'string' &&
        !String(item[companionAltField] ?? '').trim()
      ) {
        updateArrayItem(blockId, arrayFieldName, index, companionAltField, resolvedMedia?.alt || fallbackAlt);
      }
    } catch (error) {
      console.error('[VisualEditor] array image upload failed', error);
      window.alert(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={labelStyle}>{field.label}{field.required ? ' *' : ''}</label>
      {imgSrc ? (
        <div style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={field.label} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : null}
      <input
        type="text"
        value={imgSrc}
        onChange={(e) => updateArrayItem(blockId, arrayFieldName, index, field.name, e.target.value)}
        style={inputStyle}
        placeholder="Enter image URL or upload below…"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            ...actionBtnStyle,
            borderRadius: '6px',
            padding: '7px 10px',
            color: isUploading ? '#555' : '#9ca3af',
            cursor: isUploading ? 'default' : 'pointer',
          }}
        >
          {isUploading ? 'Uploading…' : 'Upload Image'}
        </button>
        <span style={{ fontSize: '10px', color: '#444', lineHeight: 1.3 }}>
          Uses Payload Media library
        </span>
      </div>
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

const actionBtnStyle: React.CSSProperties = {
  background: '#141414',
  border: '1px solid #2a2a2a',
  color: '#9ca3af',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.04em',
};
