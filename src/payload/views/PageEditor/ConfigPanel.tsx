'use client';

import { useRef, useState } from 'react';
import { useEditorStore, selectSelectedBlock } from './store';
import { getBlockDefinition } from './block-registry';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import type { EditorField, BlockStyles } from './types';

function NoSelection() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>👆</div>
      <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
        Select a block on the canvas to edit its content
      </p>
    </div>
  );
}

type FieldEditorProps = {
  blockId: string;
  field: EditorField;
  value: unknown;
};

function UploadFieldEditor({
  blockId,
  fieldName,
  fieldLabel,
  value,
}: {
  blockId: string;
  fieldName: string;
  fieldLabel: string;
  value: unknown;
}) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const block = useEditorStore((s) => s.blocks.find((b) => b.id === blockId));
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
        (typeof block?.data.imageAlt === 'string' && block.data.imageAlt.trim()) ||
        (typeof block?.data.title === 'string' && block.data.title.trim()) ||
        file.name.replace(/\.[^.]+$/, '') ||
        'Uploaded image';

      const formData = new FormData();
      formData.append('file', file);
      // Payload expects non-file fields in multipart under "_payload"
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

      // Some adapters return created doc without url in create response.
      if (!resolvedMedia?.url && resolvedMedia?.id != null) {
        const mediaRes = await fetch(`/api/media/${resolvedMedia.id}`, { credentials: 'include' });
        if (mediaRes.ok) {
          const full = normalizeMediaResponse(await mediaRes.json());
          resolvedMedia = { ...resolvedMedia, ...full };
        }
      }

      if (resolvedMedia?.url) {
        updateBlockData(blockId, fieldName, resolvedMedia);
      } else if (resolvedMedia?.id != null) {
        // fallback to relation id if URL is still unavailable
        updateBlockData(blockId, fieldName, resolvedMedia.id);
      }

      if (typeof block?.data.imageAlt === 'string' && (!block.data.imageAlt || block.data.imageAlt === '')) {
        updateBlockData(blockId, 'imageAlt', resolvedMedia?.alt || fallbackAlt);
      }
    } catch (error) {
      console.error('[VisualEditor] image upload failed', error);
      window.alert(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{fieldLabel}</label>
      {imgSrc ? (
        <div style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={fieldLabel} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : null}
      <input
        type="text"
        value={imgSrc}
        onChange={(e) => updateBlockData(blockId, fieldName, e.target.value)}
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

function FieldEditor({ blockId, field, value }: FieldEditorProps) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);

  if (field.type === 'array') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>
          {field.label}
          {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
        </label>
        <ArrayFieldEditor
          blockId={blockId}
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>
          {field.label}
          {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
        </label>
        <textarea
          value={typeof value === 'string' ? value : ''}
          rows={3}
          onChange={(e) => updateBlockData(blockId, field.name, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          placeholder={`Enter ${field.label.toLowerCase()}…`}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>
          {field.label}
          {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
        </label>
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => updateBlockData(blockId, field.name, e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          id={`${blockId}-${field.name}`}
          checked={value === true}
          onChange={(e) => updateBlockData(blockId, field.name, e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0ea5e9' }}
        />
        <label htmlFor={`${blockId}-${field.name}`} style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
          {field.label}
          {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
        </label>
      </div>
    );
  }

  if (field.type === 'upload') {
    return (
      <UploadFieldEditor blockId={blockId} fieldName={field.name} fieldLabel={field.label} value={value} />
    );
  }

  // Default: text
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label}
        {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
      </label>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => updateBlockData(blockId, field.name, e.target.value)}
        style={inputStyle}
        placeholder={`Enter ${field.label.toLowerCase()}…`}
      />
    </div>
  );
}

function BlockStylesPanel({ blockId, styles }: { blockId: string; styles?: BlockStyles }) {
  const updateBlockStyles = useEditorStore((s) => s.updateBlockStyles);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: '8px', borderTop: '1px solid #1e1e1e', paddingTop: '12px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, width: '100%' }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Spacing &amp; Style
        </span>
        <span style={{ color: '#444', fontSize: '10px', marginLeft: 'auto' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Padding Top (px)</label>
              <input
                type="number"
                min={0}
                max={200}
                value={styles?.paddingTop ?? ''}
                onChange={(e) => updateBlockStyles(blockId, { paddingTop: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, padding: '7px 8px' }}
                placeholder="0"
              />
            </div>
            <div>
              <label style={labelStyle}>Padding Bottom (px)</label>
              <input
                type="number"
                min={0}
                max={200}
                value={styles?.paddingBottom ?? ''}
                onChange={(e) => updateBlockStyles(blockId, { paddingBottom: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, padding: '7px 8px' }}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Background Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={styles?.backgroundColor ?? '#ffffff'}
                onChange={(e) => updateBlockStyles(blockId, { backgroundColor: e.target.value })}
                style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
              />
              <input
                type="text"
                value={styles?.backgroundColor ?? ''}
                onChange={(e) => updateBlockStyles(blockId, { backgroundColor: e.target.value || undefined })}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="#ffffff or transparent"
              />
              {styles?.backgroundColor && (
                <button
                  onClick={() => updateBlockStyles(blockId, { backgroundColor: undefined })}
                  style={{ ...actionBtnStyle, flexShrink: 0 }}
                  title="Clear"
                >✕</button>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Hide on Breakpoints</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['desktop', 'tablet', 'mobile'] as const).map((bp) => {
                const isHidden = styles?.hiddenOn?.includes(bp) ?? false;
                function toggle() {
                  const current = styles?.hiddenOn ?? [];
                  const next = isHidden ? current.filter((x) => x !== bp) : [...current, bp];
                  updateBlockStyles(blockId, { hiddenOn: next.length > 0 ? next : undefined });
                }
                return (
                  <button
                    key={bp}
                    onClick={toggle}
                    title={`${isHidden ? 'Show' : 'Hide'} on ${bp}`}
                    style={{
                      flex: 1,
                      background: isHidden ? '#3b0f0f' : '#1a1a1a',
                      border: `1px solid ${isHidden ? '#7f1d1d' : '#2a2a2a'}`,
                      borderRadius: '5px',
                      color: isHidden ? '#f87171' : '#555',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '5px 4px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {bp === 'desktop' ? '🖥' : bp === 'tablet' ? '📱' : '📲'} {bp}
                  </button>
                );
              })}
            </div>
            {styles?.hiddenOn && styles.hiddenOn.length > 0 && (
              <p style={{ fontSize: '10px', color: '#555', margin: '5px 0 0', lineHeight: 1.4 }}>
                Hidden on: {styles.hiddenOn.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConfigPanel() {
  const selectedBlock = useEditorStore(selectSelectedBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);

  const def = selectedBlock ? getBlockDefinition(selectedBlock.blockType) : null;

  return (
    <aside
      style={{
        width: '280px',
        flexShrink: 0,
        background: '#111',
        borderLeft: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          {def ? `${def.icon} ${def.label}` : 'Properties'}
        </p>
        {selectedBlock && def && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => duplicateBlock(selectedBlock.id)} style={actionBtnStyle} title="Duplicate">⧉</button>
            <button onClick={() => removeBlock(selectedBlock.id)} style={{ ...actionBtnStyle, color: '#f87171' }} title="Delete">✕</button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: selectedBlock ? '16px 14px' : 0 }}>
        {!selectedBlock || !def ? (
          <NoSelection />
        ) : (
          <>
            {def.fields.map((field) => (
              <FieldEditor
                key={field.name}
                blockId={selectedBlock.id}
                field={field}
                value={selectedBlock.data[field.name]}
              />
            ))}
            <BlockStylesPanel blockId={selectedBlock.id} styles={selectedBlock.styles} />
          </>
        )}
      </div>

      {/* Footer hint */}
      {selectedBlock && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid #1a1a1a' }}>
          <p style={{ fontSize: '10px', color: '#333', margin: 0, lineHeight: 1.4 }}>
            Block ID: <span style={{ fontFamily: 'monospace', color: '#444' }}>{selectedBlock.id.slice(-8)}</span>
          </p>
        </div>
      )}
    </aside>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: '#777',
  marginBottom: '5px',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f0f0f',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#ccc',
  fontSize: '13px',
  padding: '7px 10px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const actionBtnStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#666',
  cursor: 'pointer',
  fontSize: '12px',
  lineHeight: 1,
  padding: '4px 6px',
};
