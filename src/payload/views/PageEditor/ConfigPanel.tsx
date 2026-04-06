'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditorStore, selectSelectedBlock } from './store';
import { getBlockDefinition } from './block-registry';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import type { EditorField, BlockStyles, SectionInstance } from './types';

// Local state mirrors the prop; debounces writes to the store by `delay` ms.
function useDebouncedField(
  storeValue: string,
  onCommit: (value: string) => void,
  delay = 300,
) {
  const [local, setLocal] = useState(storeValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(storeValue);
  }, [storeValue]);

  function handleChange(val: string) {
    setLocal(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onCommit(val), delay);
  }

  function handleBlur() {
    if (timer.current) clearTimeout(timer.current);
    onCommit(local);
  }

  return { value: local, onChange: handleChange, onBlur: handleBlur };
}

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
  const block = useEditorStore((s) => {
    for (const sec of s.sections) {
      for (const col of sec.columns) {
        const found = col.blocks.find((b) => b.id === blockId);
        if (found) return found;
      }
    }
    return undefined;
  });
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
        updateBlockData(blockId, fieldName, resolvedMedia);
      } else if (resolvedMedia?.id != null) {
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

function TextFieldEditor({ blockId, field, value }: FieldEditorProps) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const { value: local, onChange, onBlur } = useDebouncedField(
    typeof value === 'string' ? value : '',
    (v) => updateBlockData(blockId, field.name, v),
  );
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label}
        {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
      </label>
      <input
        type="text"
        value={local}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={inputStyle}
        placeholder={`Enter ${field.label.toLowerCase()}…`}
      />
    </div>
  );
}

function TextareaFieldEditor({ blockId, field, value }: FieldEditorProps) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const { value: local, onChange, onBlur } = useDebouncedField(
    typeof value === 'string' ? value : '',
    (v) => updateBlockData(blockId, field.name, v),
  );
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label}
        {field.required ? <span style={{ color: '#f87171', marginLeft: '2px' }}>*</span> : null}
      </label>
      <textarea
        value={local}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        placeholder={`Enter ${field.label.toLowerCase()}…`}
      />
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
    return <TextareaFieldEditor blockId={blockId} field={field} value={value} />;
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

  return <TextFieldEditor blockId={blockId} field={field} value={value} />;
}

// ─── Shared style panel ───────────────────────────────────────────────────────

type StylePanelProps = {
  styles?: BlockStyles;
  onUpdate: (styles: Partial<BlockStyles>) => void;
  label?: string;
  onLabelChange?: (label: string) => void;
};

function StylesPanel({ styles, onUpdate, label, onLabelChange }: StylePanelProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'spacing' | 'appearance' | 'typography'>('spacing');

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'spacing', label: 'Spacing' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'typography', label: 'Typography' },
  ];

  function numField(key: keyof BlockStyles, lbl: string, max = 200) {
    const val = styles?.[key] as number | undefined;
    return (
      <div>
        <label style={labelStyle}>{lbl}</label>
        <input
          type="number"
          min={0}
          max={max}
          value={val ?? ''}
          onChange={(e) => onUpdate({ [key]: e.target.value === '' ? undefined : Number(e.target.value) })}
          style={{ ...inputStyle, padding: '7px 8px' }}
          placeholder="0"
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '8px', borderTop: '1px solid #1e1e1e', paddingTop: '12px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, width: '100%' }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Styles
        </span>
        <span style={{ color: '#444', fontSize: '10px', marginLeft: 'auto' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '12px' }}>
          {/* Label field for sections */}
          {onLabelChange !== undefined && (
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Section Label</label>
              <input
                type="text"
                value={label ?? ''}
                onChange={(e) => onLabelChange(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Hero, About, CTA…"
              />
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '12px', background: '#0a0a0a', borderRadius: '6px', padding: '3px' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  background: tab === t.id ? '#1e1e1e' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: tab === t.id ? '#ccc' : '#555',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '5px 4px',
                  textTransform: 'capitalize',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Spacing tab */}
          {tab === 'spacing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {numField('paddingTop', 'Pad Top (px)')}
                {numField('paddingBottom', 'Pad Bottom (px)')}
                {numField('paddingLeft', 'Pad Left (px)')}
                {numField('paddingRight', 'Pad Right (px)')}
                {numField('marginTop', 'Margin Top (px)')}
                {numField('marginBottom', 'Margin Bottom (px)')}
              </div>
              <div>
                <label style={labelStyle}>Max Width (px)</label>
                <input
                  type="number"
                  min={0}
                  max={2560}
                  value={styles?.maxWidth ?? ''}
                  onChange={(e) => onUpdate({ maxWidth: e.target.value === '' ? undefined : Number(e.target.value) })}
                  style={{ ...inputStyle, padding: '7px 8px' }}
                  placeholder="1200"
                />
              </div>
              {/* Responsive visibility */}
              <div>
                <label style={labelStyle}>Hide on Breakpoints</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['desktop', 'tablet', 'mobile'] as const).map((bp) => {
                    const isHidden = styles?.hiddenOn?.includes(bp) ?? false;
                    function toggle() {
                      const current = styles?.hiddenOn ?? [];
                      const next = isHidden ? current.filter((x) => x !== bp) : [...current, bp];
                      onUpdate({ hiddenOn: next.length > 0 ? next : undefined });
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
              </div>
            </div>
          )}

          {/* Appearance tab */}
          {tab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Background Color */}
              <div>
                <label style={labelStyle}>Background Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={styles?.backgroundColor ?? '#ffffff'}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
                  />
                  <input
                    type="text"
                    value={styles?.backgroundColor ?? ''}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value || undefined })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="#ffffff or transparent"
                  />
                  {styles?.backgroundColor && (
                    <button onClick={() => onUpdate({ backgroundColor: undefined })} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
                  )}
                </div>
              </div>
              {/* Background Image */}
              <div>
                <label style={labelStyle}>Background Image URL</label>
                <input
                  type="text"
                  value={styles?.backgroundImage ?? ''}
                  onChange={(e) => onUpdate({ backgroundImage: e.target.value || undefined })}
                  style={inputStyle}
                  placeholder="/media/bg.jpg or https://…"
                />
              </div>
              {/* Opacity */}
              <div>
                <label style={labelStyle}>Opacity ({styles?.opacity != null ? `${Math.round((styles.opacity ?? 1) * 100)}%` : '100%'})</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={styles?.opacity ?? 1}
                  onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#0ea5e9' }}
                />
              </div>
              {/* Border */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={labelStyle}>Border Radius (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={styles?.borderRadius ?? ''}
                    onChange={(e) => onUpdate({ borderRadius: e.target.value === '' ? undefined : Number(e.target.value) })}
                    style={{ ...inputStyle, padding: '7px 8px' }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Border Width (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={styles?.borderWidth ?? ''}
                    onChange={(e) => onUpdate({ borderWidth: e.target.value === '' ? undefined : Number(e.target.value) })}
                    style={{ ...inputStyle, padding: '7px 8px' }}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Border Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={styles?.borderColor ?? '#000000'}
                    onChange={(e) => onUpdate({ borderColor: e.target.value })}
                    style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
                  />
                  <input
                    type="text"
                    value={styles?.borderColor ?? ''}
                    onChange={(e) => onUpdate({ borderColor: e.target.value || undefined })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="#000000"
                  />
                </div>
              </div>
              {/* Box shadow */}
              <div>
                <label style={labelStyle}>Box Shadow</label>
                <select
                  value={styles?.boxShadow ?? ''}
                  onChange={(e) => onUpdate({ boxShadow: e.target.value || undefined })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">None</option>
                  <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                  <option value="0 4px 6px rgba(0,0,0,0.15)">Medium</option>
                  <option value="0 10px 25px rgba(0,0,0,0.2)">Large</option>
                  <option value="0 20px 60px rgba(0,0,0,0.3)">X-Large</option>
                  <option value="inset 0 2px 4px rgba(0,0,0,0.3)">Inset</option>
                </select>
              </div>
            </div>
          )}

          {/* Typography tab */}
          {tab === 'typography' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Text color */}
              <div>
                <label style={labelStyle}>Text Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={styles?.textColor ?? '#000000'}
                    onChange={(e) => onUpdate({ textColor: e.target.value })}
                    style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
                  />
                  <input
                    type="text"
                    value={styles?.textColor ?? ''}
                    onChange={(e) => onUpdate({ textColor: e.target.value || undefined })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="#333333"
                  />
                  {styles?.textColor && (
                    <button onClick={() => onUpdate({ textColor: undefined })} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
                  )}
                </div>
              </div>
              {/* Font size */}
              <div>
                <label style={labelStyle}>Font Size (px)</label>
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={styles?.fontSize ?? ''}
                  onChange={(e) => onUpdate({ fontSize: e.target.value === '' ? undefined : Number(e.target.value) })}
                  style={inputStyle}
                  placeholder="16"
                />
              </div>
              {/* Font weight */}
              <div>
                <label style={labelStyle}>Font Weight</label>
                <select
                  value={styles?.fontWeight ?? ''}
                  onChange={(e) => onUpdate({ fontWeight: (e.target.value || undefined) as BlockStyles['fontWeight'] })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Default</option>
                  <option value="normal">Normal (400)</option>
                  <option value="medium">Medium (500)</option>
                  <option value="semibold">Semibold (600)</option>
                  <option value="bold">Bold (700)</option>
                </select>
              </div>
              {/* Text align */}
              <div>
                <label style={labelStyle}>Text Align</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => onUpdate({ textAlign: styles?.textAlign === align ? undefined : align })}
                      style={{
                        flex: 1,
                        background: styles?.textAlign === align ? '#0ea5e9' : '#1a1a1a',
                        border: `1px solid ${styles?.textAlign === align ? '#0ea5e9' : '#2a2a2a'}`,
                        borderRadius: '5px',
                        color: styles?.textAlign === align ? '#fff' : '#555',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '6px 4px',
                      }}
                      title={align}
                    >
                      {align === 'left' ? '⬅' : align === 'center' ? '⬛' : '➡'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section editor panel ─────────────────────────────────────────────────────

function SectionPanel({ section }: { section: SectionInstance }) {
  const updateSectionStyles = useEditorStore((s) => s.updateSectionStyles);
  const updateSectionLabel = useEditorStore((s) => s.updateSectionLabel);
  const removeSection = useEditorStore((s) => s.removeSection);
  const duplicateSection = useEditorStore((s) => s.duplicateSection);
  const addColumnToSection = useEditorStore((s) => s.addColumnToSection);
  const removeColumnFromSection = useEditorStore((s) => s.removeColumnFromSection);
  const updateColumnWidth = useEditorStore((s) => s.updateColumnWidth);

  return (
    <div style={{ padding: '16px 14px' }}>
      {/* Column layout controls */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={labelStyle}>Columns ({section.columns.length})</label>
          {section.columns.length < 4 && (
            <button
              onClick={() => addColumnToSection(section.id)}
              style={{ ...actionBtnStyle, fontSize: '11px', padding: '3px 8px', color: '#0ea5e9' }}
            >
              + Add Column
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {section.columns.map((col, i) => (
            <div key={col.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#444', width: '16px', flexShrink: 0 }}>{i + 1}</span>
              <select
                value={col.width}
                onChange={(e) => updateColumnWidth(section.id, col.id, e.target.value as import('./types').ColumnWidth)}
                style={{ ...inputStyle, flex: 1, padding: '5px 8px', fontSize: '12px' }}
              >
                {[['1/1', 'Full'], ['1/2', '1/2'], ['1/3', '1/3'], ['2/3', '2/3'], ['1/4', '1/4'], ['3/4', '3/4']].map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              {section.columns.length > 1 && (
                <button
                  onClick={() => removeColumnFromSection(section.id, col.id)}
                  style={{ ...actionBtnStyle, color: '#f87171', padding: '4px 6px' }}
                  title="Remove column"
                >✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <StylesPanel
        styles={section.styles}
        onUpdate={(s) => updateSectionStyles(section.id, s)}
        label={section.label}
        onLabelChange={(lbl) => updateSectionLabel(section.id, lbl)}
      />

      {/* Section actions */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: '6px' }}>
        <button
          onClick={() => duplicateSection(section.id)}
          style={{ ...actionBtnStyle, flex: 1, fontSize: '11px', padding: '6px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ⧉ Duplicate
        </button>
        <button
          onClick={() => removeSection(section.id)}
          style={{ ...actionBtnStyle, flex: 1, fontSize: '11px', padding: '6px', color: '#f87171', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
}

// ─── Block styles panel (wrapper around StylesPanel for blocks) ───────────────

function BlockStylesPanel({ blockId, styles }: { blockId: string; styles?: BlockStyles }) {
  const updateBlockStyles = useEditorStore((s) => s.updateBlockStyles);
  return (
    <StylesPanel
      styles={styles}
      onUpdate={(s) => updateBlockStyles(blockId, s)}
    />
  );
}

export function ConfigPanel() {
  const selectedBlock = useEditorStore(selectSelectedBlock);
  const selection = useEditorStore((s) => s.selection);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const sections = useEditorStore((s) => s.sections);

  const blockSelection = selection?.kind === 'block' ? selection : null;
  const sectionSelection = selection?.kind === 'section' ? selection : null;
  const def = selectedBlock ? getBlockDefinition(selectedBlock.blockType) : null;

  const selectedSection = sectionSelection
    ? sections.find((s) => s.id === sectionSelection.sectionId)
    : null;

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
          {selectedSection ? '▦ Section' : def ? `${def.icon} ${def.label}` : 'Properties'}
        </p>
        {selectedBlock && def && blockSelection && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => duplicateBlock(blockSelection.sectionId, blockSelection.columnId, selectedBlock.id)} style={actionBtnStyle} title="Duplicate">⧉</button>
            <button onClick={() => removeBlock(blockSelection.sectionId, blockSelection.columnId, selectedBlock.id)} style={{ ...actionBtnStyle, color: '#f87171' }} title="Delete">✕</button>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: (selectedBlock || selectedSection) ? '16px 14px' : 0 }}>
        {selectedSection ? (
          <SectionPanel section={selectedSection} />
        ) : !selectedBlock || !def ? (
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

      {/* Footer */}
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
