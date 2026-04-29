'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditorStore, selectSelectedBlock } from './store';
import { getBlockDefinition } from './block-registry';
import { getWidgetDefinition } from './widget-registry';
import { widgetCategories } from './widget-registry';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import { LinkFieldEditor } from './LinkFieldEditor';
import { MediaLibraryModal } from './MediaLibraryModal';
import type { EditorField, BlockStyles, BreakpointOverrides, SectionInstance, WidgetInstance, WidgetField, WidgetStyles } from './types';
import { getValueAtPath } from '@/lib/converted-pages/object-path';

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
  const [showLibrary, setShowLibrary] = useState(false);
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
    fieldName.endsWith('.image')
      ? `${fieldName.slice(0, -'.image'.length)}.imageAlt`
      : fieldName === 'image'
        ? 'imageAlt'
        : null;

  // Focal point: stored as `objectPosition` CSS string (e.g. "60% 30%") so
  // it maps directly to the objectPosition prop every block renderer expects.
  const focalPointField =
    fieldName === 'image' ? 'objectPosition'
    : fieldName.endsWith('Image') ? 'objectPosition'
    : null;

  const currentObjectPosition = focalPointField ? (block?.data[focalPointField] as string | undefined) : undefined;
  const focalParts = currentObjectPosition?.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  const focalX = focalParts ? Number(focalParts[1]) / 100 : 0.5;
  const focalY = focalParts ? Number(focalParts[2]) / 100 : 0.5;

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

      if (
        companionAltField &&
        typeof block?.data[companionAltField] === 'string' &&
        (!block.data[companionAltField] || block.data[companionAltField] === '')
      ) {
        updateBlockData(blockId, companionAltField, resolvedMedia?.alt || fallbackAlt);
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
        <div
          style={{ marginBottom: '8px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a2a', position: 'relative', cursor: focalPointField ? 'crosshair' : 'default', height: '100px' }}
          title={focalPointField ? 'Click to set focal point' : undefined}
          onClick={focalPointField ? (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
            updateBlockData(blockId, focalPointField, `${x}% ${y}%`);
          } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={fieldLabel}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: focalPointField ? `${focalX * 100}% ${focalY * 100}%` : 'center',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
          {focalPointField && currentObjectPosition && (
            <div
              style={{
                position: 'absolute',
                left: `${focalX * 100}%`,
                top: `${focalY * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#0ea5e9',
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px #0ea5e9',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      ) : null}
      {focalPointField && imgSrc && (
        <p style={{ fontSize: '10px', color: '#444', margin: '-4px 0 6px', lineHeight: 1.3 }}>
          Click image to set focal point · {Math.round(focalX * 100)}%, {Math.round(focalY * 100)}%
          {currentObjectPosition && (
            <button
              type="button"
              onClick={() => updateBlockData(blockId, focalPointField, null)}
              style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '10px', padding: 0 }}
            >
              Reset
            </button>
          )}
        </p>
      )}
      <input
        type="text"
        value={imgSrc}
        onChange={(e) => updateBlockData(blockId, fieldName, e.target.value)}
        style={inputStyle}
        placeholder="Enter image URL or upload below…"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
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
          {isUploading ? 'Uploading…' : 'Upload'}
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          style={{
            ...actionBtnStyle,
            borderRadius: '6px',
            padding: '7px 10px',
            color: '#0ea5e9',
            cursor: 'pointer',
            border: '1px solid #0ea5e9',
          }}
        >
          Browse Library
        </button>
        {imgSrc && (
          <button
            type="button"
            onClick={() => updateBlockData(blockId, fieldName, null)}
            style={{ ...actionBtnStyle, borderRadius: '6px', padding: '7px 10px', color: '#f87171', cursor: 'pointer' }}
          >
            Remove
          </button>
        )}
      </div>

      {showLibrary && (
        <MediaLibraryModal
          onSelect={(media) => {
            const url = media.url || (media.filename ? `/media/${media.filename}` : '');
            updateBlockData(blockId, fieldName, { id: media.id, url, alt: media.alt || '', filename: media.filename });
            if (companionAltField && typeof block?.data[companionAltField] === 'string' && !block.data[companionAltField]) {
              updateBlockData(blockId, companionAltField, media.alt || media.filename.replace(/\.[^.]+$/, '') || '');
            }
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {/* Focal Point — always shown when this field supports it, regardless of thumbnail */}
      {focalPointField && (
        <div style={{ marginTop: '8px' }}>
          <label style={labelStyle}>Image Focal Point</label>
          <select
            value={currentObjectPosition ?? 'center'}
            onChange={(e) => updateBlockData(blockId, focalPointField, e.target.value === 'center' ? null : e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="center">Center (default)</option>
            <option value="top center">Top</option>
            <option value="bottom center">Bottom</option>
            <option value="center left">Left</option>
            <option value="center right">Right</option>
            <option value="top left">Top Left</option>
            <option value="top right">Top Right</option>
            <option value="bottom left">Bottom Left</option>
            <option value="bottom right">Bottom Right</option>
            <option value="20% 30%">Upper Left (20% 30%)</option>
            <option value="80% 30%">Upper Right (80% 30%)</option>
            <option value="20% 70%">Lower Left (20% 70%)</option>
            <option value="80% 70%">Lower Right (80% 70%)</option>
          </select>
          <p style={{ fontSize: '10px', color: '#444', margin: '3px 0 0', lineHeight: 1.3 }}>
            Or click the thumbnail above to set a precise focal point.
          </p>
        </div>
      )}
    </div>
  );
}

function IconUploadFieldEditor({ blockId, field, value }: FieldEditorProps) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const strVal = typeof value === 'string' ? value : '';
  const isImage = strVal.startsWith('/') || strVal.startsWith('http');

  async function handleFileSelect(file: File | null) {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('_payload', JSON.stringify({ alt: field.label }));
      const res = await fetch('/api/media', { method: 'POST', credentials: 'include', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const raw = await res.json() as Record<string, unknown>;
      const doc = (raw.doc ?? raw) as Record<string, unknown>;
      const url = typeof doc.url === 'string' ? doc.url : (typeof doc.filename === 'string' ? `/media/${doc.filename}` : null);
      if (url) updateBlockData(blockId, field.name, url);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{field.label}</label>
      {/* Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={strVal} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '24px' }}>{strVal || '?'}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            type="text"
            value={strVal}
            onChange={(e) => updateBlockData(blockId, field.name, e.target.value)}
            style={{ ...inputStyle, marginBottom: '4px' }}
            placeholder="Emoji or image URL…"
          />
          <p style={{ fontSize: '10px', color: '#444', margin: 0 }}>Type an emoji or upload an image below</p>
        </div>
      </div>
      {/* Upload controls */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)} />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
          style={{ ...actionBtnStyle, borderRadius: '6px', padding: '6px 10px', color: isUploading ? '#555' : '#9ca3af', cursor: isUploading ? 'default' : 'pointer' }}>
          {isUploading ? 'Uploading…' : 'Upload Image'}
        </button>
        <button type="button" onClick={() => setShowLibrary(true)}
          style={{ ...actionBtnStyle, borderRadius: '6px', padding: '6px 10px', color: '#0ea5e9', border: '1px solid #0ea5e9', cursor: 'pointer' }}>
          Browse Library
        </button>
        {isImage && (
          <button type="button" onClick={() => updateBlockData(blockId, field.name, '')}
            style={{ ...actionBtnStyle, borderRadius: '6px', padding: '6px 10px', color: '#f87171', cursor: 'pointer' }}>
            Remove
          </button>
        )}
      </div>
      {showLibrary && (
        <MediaLibraryModal
          onSelect={(media) => {
            const url = media.url || (media.filename ? `/media/${media.filename}` : '');
            if (url) updateBlockData(blockId, field.name, url);
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      )}
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

  if (field.type === 'icon-upload') {
    return <IconUploadFieldEditor blockId={blockId} field={field} value={value} />;
  }

  if (field.type === 'link') {
    return (
      <LinkFieldEditor
        blockId={blockId}
        fieldName={field.name}
        fieldLabel={field.label}
        value={value}
        showLabel={'showLabel' in field ? (field as { showLabel?: boolean }).showLabel : false}
      />
    );
  }

  return <TextFieldEditor blockId={blockId} field={field} value={value} />;
}

// ─── Section Height panel — unified bidirectional slider ──────────────────────
// One control for "make this section taller or shorter", driven by a single
// signed value:
//    v < 0  → shrink by overriding the block's built-in padding (reduces height)
//    v = 0  → no override (natural section height)
//    v > 0  → grow by setting min-height
// Tabs switch which breakpoint the value targets (desktop / tablet / mobile).

type BreakpointKey = 'desktop' | 'tablet' | 'mobile';

const SECTION_HEIGHT_MIN = -240;
const SECTION_HEIGHT_MAX = 800;
const SECTION_HEIGHT_STEP = 10;
/** Assumed default top/bottom padding of most brand-book .sp blocks — used
 *  when translating the slider's negative zone into padding overrides. */
const APPROX_DEFAULT_PAD = 120;
/** Baseline min-height when the slider is in the positive zone (the user's
 *  grow delta is added on top). Picked to feel like "make it at least big
 *  enough to fill a reasonable hero". */
const GROW_BASELINE = 400;

type SectionHeightValues = {
  paddingTop?: number;
  paddingBottom?: number;
  minHeight?: number;
};

function readSectionHeight(values: SectionHeightValues | undefined | null): number {
  if (!values) return 0;
  if (values.minHeight != null && values.minHeight > 0) {
    // Grow zone.
    return Math.max(1, values.minHeight - GROW_BASELINE);
  }
  const pt = values.paddingTop;
  const pb = values.paddingBottom;
  // Treat symmetric padding overrides as shrink.
  if (pt != null && pb != null && pt === pb) {
    if (pt >= APPROX_DEFAULT_PAD) return 0;
    // v = 2 * (pad - default). At pad=0: v=-240. At pad=120: v=0.
    return Math.max(SECTION_HEIGHT_MIN, Math.round(2 * (pt - APPROX_DEFAULT_PAD)));
  }
  return 0;
}

function writeSectionHeight(v: number): SectionHeightValues {
  if (v === 0) return {};
  if (v < 0) {
    // Shrink: symmetric padding override. pad = max(0, default + v/2).
    // At v=-240: pad=0. At v=-120: pad=60. At v=0: pad=120 (default).
    const pad = Math.max(0, APPROX_DEFAULT_PAD + Math.floor(v / 2));
    return { paddingTop: pad, paddingBottom: pad, minHeight: undefined };
  }
  // Grow: min-height baseline + delta.
  return { paddingTop: undefined, paddingBottom: undefined, minHeight: GROW_BASELINE + v };
}

type SectionHeightPanelProps = {
  styles?: BlockStyles;
  onUpdate: (styles: Partial<BlockStyles>) => void;
};

function SectionHeightPanel({ styles, onUpdate }: SectionHeightPanelProps) {
  const [activeBp, setActiveBp] = useState<BreakpointKey>('desktop');

  // Read the raw per-breakpoint values for the active tab.
  const activeValues: SectionHeightValues = (() => {
    if (activeBp === 'desktop') {
      return {
        paddingTop: styles?.paddingTop,
        paddingBottom: styles?.paddingBottom,
        minHeight: styles?.minHeight,
      };
    }
    const bp = activeBp === 'tablet' ? styles?.tablet : styles?.mobile;
    return {
      paddingTop: bp?.paddingTop,
      paddingBottom: bp?.paddingBottom,
      minHeight: bp?.minHeight,
    };
  })();

  const sliderValue = readSectionHeight(activeValues);

  function applyValue(v: number) {
    const next = writeSectionHeight(v);
    if (activeBp === 'desktop') {
      onUpdate({
        paddingTop: next.paddingTop,
        paddingBottom: next.paddingBottom,
        minHeight: next.minHeight,
      });
      return;
    }
    // Write into the tablet / mobile sub-object. Merge with existing overrides
    // so other fields (paddingLeft, marginTop, etc.) aren't clobbered.
    const existing = activeBp === 'tablet' ? styles?.tablet : styles?.mobile;
    const merged = { ...existing, ...next };
    // Strip undefined so BreakpointOverrides stays clean.
    const cleaned: Record<string, number | string | undefined> = {};
    for (const [key, val] of Object.entries(merged)) {
      if (val !== undefined) cleaned[key] = val;
    }
    onUpdate({ [activeBp]: Object.keys(cleaned).length > 0 ? cleaned : undefined } as Partial<BlockStyles>);
  }

  const readout = (() => {
    if (sliderValue === 0) return 'default';
    if (sliderValue < 0) {
      const pad = Math.max(0, APPROX_DEFAULT_PAD + Math.floor(sliderValue / 2));
      return pad === 0 ? 'shrink: tightest' : `shrink: pad ${pad}px`;
    }
    return `grow: min ${GROW_BASELINE + sliderValue}px`;
  })();

  const hasOverrideOnOtherBreakpoint = (key: BreakpointKey): boolean => {
    if (key === 'desktop') {
      return styles?.paddingTop != null || styles?.paddingBottom != null || styles?.minHeight != null;
    }
    const bp = key === 'tablet' ? styles?.tablet : styles?.mobile;
    return bp?.paddingTop != null || bp?.paddingBottom != null || bp?.minHeight != null;
  };

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #1e3a5f',
        borderRadius: '6px',
        background: '#0c1a24',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Breakpoint tabs */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {(['desktop', 'tablet', 'mobile'] as const).map((bp) => {
          const active = activeBp === bp;
          const hasOverride = hasOverrideOnOtherBreakpoint(bp);
          return (
            <button
              key={bp}
              onClick={() => setActiveBp(bp)}
              style={{
                flex: 1,
                padding: '6px 8px',
                border: `1px solid ${active ? '#0ea5e9' : '#1e3a5f'}`,
                background: active ? '#1e3a5f' : 'transparent',
                color: active ? '#7dd3fc' : '#64748b',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {bp === 'desktop' ? '🖥 Desktop' : bp === 'tablet' ? '📱 Tablet' : '📲 Mobile'}
              {hasOverride ? (
                <span style={{ marginLeft: 4, color: '#0ea5e9' }}>●</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <label style={{ ...labelStyle, color: '#7dd3fc', margin: 0 }}>Section Height</label>
          <span style={{ color: '#7dd3fc', fontFamily: 'var(--admin-font-mono, monospace)', fontSize: 10 }}>
            {readout}
          </span>
        </div>
        <input
          type="range"
          min={SECTION_HEIGHT_MIN}
          max={SECTION_HEIGHT_MAX}
          step={SECTION_HEIGHT_STEP}
          value={sliderValue}
          onChange={(e) => applyValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#0ea5e9' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#555', marginTop: 2 }}>
          <span>shrink</span>
          <span>default</span>
          <span>grow</span>
        </div>
      </div>

      {sliderValue !== 0 && (
        <button
          onClick={() => applyValue(0)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid #1e3a5f',
            color: '#64748b',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
          }}
          title={`Reset ${activeBp} section height to default`}
        >
          Reset {activeBp}
        </button>
      )}
    </div>
  );
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
  const [showBgLibrary, setShowBgLibrary] = useState(false);

  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: 'spacing', label: 'Spacing' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'typography', label: 'Typography' },
  ];

  function numField(key: keyof BlockStyles, lbl: string, max = 200, min = 0) {
    const val = styles?.[key] as number | undefined;
    return (
      <div>
        <label style={labelStyle}>{lbl}</label>
        <input
          type="number"
          min={min}
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
        <>
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
              <SectionHeightPanel styles={styles} onUpdate={onUpdate} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {numField('paddingTop', 'Pad Top (px)')}
                {numField('paddingBottom', 'Pad Bottom (px)')}
                {numField('paddingLeft', 'Pad Left (px)')}
                {numField('paddingRight', 'Pad Right (px)')}
                {/* Margins allow negatives so editors can pull sections up/overlap. */}
                {numField('marginTop', 'Margin Top (px)', 300, -200)}
                {numField('marginBottom', 'Margin Bottom (px)', 300, -200)}
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
                <ColorSwatches onSelect={(c) => onUpdate({ backgroundColor: c === 'transparent' ? 'transparent' : c })} />
              </div>
              {/* Background Image */}
              <div>
                <label style={labelStyle}>Background Image</label>
                {styles?.backgroundImage && (
                  <div style={{ marginBottom: '6px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a2a', height: '60px', background: '#0a0a0a' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={styles.backgroundImage} alt="Background preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <input
                  type="text"
                  value={styles?.backgroundImage ?? ''}
                  onChange={(e) => onUpdate({ backgroundImage: e.target.value || undefined })}
                  style={inputStyle}
                  placeholder="/media/bg.jpg or https://…"
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowBgLibrary(true)}
                    style={{ ...actionBtnStyle, flex: 1, borderRadius: '6px', padding: '5px 8px', border: '1px solid #0ea5e9', color: '#0ea5e9' }}
                  >
                    Browse Library
                  </button>
                  {styles?.backgroundImage && (
                    <button
                      type="button"
                      onClick={() => onUpdate({ backgroundImage: undefined })}
                      style={{ ...actionBtnStyle, borderRadius: '6px', padding: '5px 8px', color: '#f87171', border: '1px solid #333' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              {showBgLibrary && (
                <MediaLibraryModal
                  onSelect={(media) => {
                    const src = media.url || (media.filename ? `/media/${media.filename}` : '');
                    if (src) onUpdate({ backgroundImage: src });
                    setShowBgLibrary(false);
                  }}
                  onClose={() => setShowBgLibrary(false)}
                />
              )}
              {/* Background Position (focal point) */}
              {styles?.backgroundImage && (
                <div>
                  <label style={labelStyle}>Background Position (Focal Point)</label>
                  <select
                    value={styles?.backgroundPosition ?? 'center'}
                    onChange={(e) => onUpdate({ backgroundPosition: e.target.value === 'center' ? undefined : e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="center">Center (default)</option>
                    <option value="top">Top</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="center left">Center Left</option>
                    <option value="center right">Center Right</option>
                    <option value="bottom">Bottom</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                    <option value="25% 25%">25% 25%</option>
                    <option value="75% 25%">75% 25%</option>
                    <option value="25% 75%">25% 75%</option>
                    <option value="75% 75%">75% 75%</option>
                  </select>
                </div>
              )}
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
                <ColorSwatches onSelect={(c) => onUpdate({ borderColor: c === 'transparent' ? undefined : c })} />
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
                <ColorSwatches onSelect={(c) => onUpdate({ textColor: c === 'transparent' ? undefined : c })} />
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

        {/* ── Breakpoint Overrides ── */}
        <BreakpointOverridesSection styles={styles} onUpdate={onUpdate} />
        </>
      )}
    </div>
  );
}

// ─── Breakpoint Overrides ─────────────────────────────────────────────────────

function BreakpointOverridesSection({
  styles,
  onUpdate,
}: {
  styles?: BlockStyles;
  onUpdate: (styles: Partial<BlockStyles>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [bp, setBp] = useState<'tablet' | 'mobile'>('mobile');

  const overrides = styles?.[bp] ?? {};

  function patchBreakpoint(partial: Partial<BreakpointOverrides>) {
    onUpdate({ [bp]: { ...overrides, ...partial } });
  }

  function clearBreakpoint() {
    onUpdate({ [bp]: undefined });
  }

  const hasTabletOverrides = Object.keys(styles?.tablet ?? {}).length > 0;
  const hasMobileOverrides = Object.keys(styles?.mobile ?? {}).length > 0;
  const hasAny = hasTabletOverrides || hasMobileOverrides;

  function numOverride(key: keyof BreakpointOverrides, lbl: string) {
    const val = overrides[key] as number | undefined;
    return (
      <div key={key}>
        <label style={labelStyle}>{lbl}</label>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="number"
            min={0}
            max={200}
            value={val ?? ''}
            onChange={(e) => patchBreakpoint({ [key]: e.target.value === '' ? undefined : Number(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
            placeholder="—"
          />
          {val != null && (
            <button onClick={() => patchBreakpoint({ [key]: undefined })} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '8px', borderTop: '1px solid #1a1a1a', paddingTop: '8px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 0',
          color: hasAny ? '#7dd3fc' : '#555',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        <span>
          📱 Responsive Overrides{hasAny ? ' ●' : ''}
        </span>
        <span style={{ fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ paddingTop: '8px' }}>
          {/* Breakpoint selector */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {(['tablet', 'mobile'] as const).map((b) => {
              const hasOvr = Object.keys(styles?.[b] ?? {}).length > 0;
              const active = bp === b;
              return (
                <button
                  key={b}
                  onClick={() => setBp(b)}
                  style={{
                    flex: 1,
                    background: active ? '#111827' : 'transparent',
                    border: `1px solid ${active ? '#0ea5e9' : '#222'}`,
                    borderRadius: '6px',
                    color: active ? '#7dd3fc' : hasOvr ? '#fbbf24' : '#555',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '5px 8px',
                  }}
                >
                  {b === 'tablet' ? '📱 Tablet' : '📲 Mobile'}
                  {hasOvr ? ' ●' : ''}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: '10px', color: '#444', margin: '0 0 10px', lineHeight: 1.4 }}>
            These values override the base styles for {bp} screens only.
            Leave blank to inherit from base.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            {numOverride('paddingTop', 'Pad Top')}
            {numOverride('paddingBottom', 'Pad Bottom')}
            {numOverride('paddingLeft', 'Pad Left')}
            {numOverride('paddingRight', 'Pad Right')}
            {numOverride('marginTop', 'Margin Top')}
            {numOverride('marginBottom', 'Margin Bottom')}
            {numOverride('fontSize', 'Font Size')}
            {numOverride('maxWidth', 'Max Width')}
          </div>

          {/* Text align override */}
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Text Align</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => patchBreakpoint({ textAlign: overrides.textAlign === align ? undefined : align })}
                  style={{
                    flex: 1,
                    background: overrides.textAlign === align ? '#0ea5e9' : '#1a1a1a',
                    border: `1px solid ${overrides.textAlign === align ? '#0ea5e9' : '#2a2a2a'}`,
                    borderRadius: '5px',
                    color: overrides.textAlign === align ? '#fff' : '#555',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '6px 4px',
                  }}
                  title={align}
                >
                  {align === 'left' ? '⬅' : align === 'center' ? '⬛' : '➡'}
                </button>
              ))}
              {overrides.textAlign && (
                <button onClick={() => patchBreakpoint({ textAlign: undefined })} style={{ ...actionBtnStyle, fontSize: '11px' }} title="Clear">✕</button>
              )}
            </div>
          </div>

          {Object.keys(overrides).length > 0 && (
            <button
              onClick={clearBreakpoint}
              style={{ ...actionBtnStyle, width: '100%', borderRadius: '6px', padding: '6px', color: '#f87171', fontSize: '11px', border: '1px solid #333' }}
            >
              Clear {bp} overrides
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section editor panel ─────────────────────────────────────────────────────

function ConvertedRedirectNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0c1a24',
        border: '1px solid #1e3a5f',
        borderRadius: '6px',
        padding: '10px 12px',
        margin: '8px 0',
        fontSize: '11px',
        color: '#7dd3fc',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

function SectionPanel({ section }: { section: SectionInstance }) {
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);
  const isConverted = editorMode === 'converted' || (editorMode === 'pages' && Boolean(convertedPageName));

  if (isConverted) {
    return (
      <div style={{ padding: '16px 14px' }}>
        <ConvertedRedirectNote>
          Section spacing, breakpoints, and layout for converted pages live in the <strong>Sections</strong> tab on the left.
          Per-element style overrides live in the Selected Element panel below the field editors.
        </ConvertedRedirectNote>
      </div>
    );
  }

  return <NativeSectionPanel section={section} />;
}

function NativeSectionPanel({ section }: { section: SectionInstance }) {
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

function readImageSlot(blockData: Record<string, unknown>, fieldName: string): { url: string; mediaId?: number | string } {
  const raw = getValueAtPath(blockData, fieldName);
  if (typeof raw === 'string') return { url: raw };
  if (raw && typeof raw === 'object') {
    const v = raw as Record<string, unknown>;
    const url = typeof v.url === 'string' ? v.url
      : typeof v.src === 'string' ? v.src
      : typeof v.filename === 'string' ? `/media/${v.filename}`
      : '';
    const mediaId = (typeof v.mediaId === 'number' || typeof v.mediaId === 'string') ? v.mediaId as number | string
      : (typeof v.id === 'number' || (typeof v.id === 'string' && v.id)) ? v.id as number | string
      : undefined;
    return { url, mediaId };
  }
  return { url: '' };
}

function ConvertedImageInspector({
  blockId,
  blockData,
  node,
}: {
  blockId: string;
  blockData: Record<string, unknown>;
  node: {
    blockId: string;
    fieldName: string;
    altField?: string;
    hiddenField?: string;
  };
}) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { url, mediaId } = readImageSlot(blockData, node.fieldName);
  const altPath = node.altField ?? `${node.fieldName}.alt`;
  const hiddenPath = node.hiddenField;
  // Converted-page blockData is a flat record keyed by dotted paths
  // (e.g. "editor.nodes.hero_image.hidden"). Older nested-shaped data may
  // also exist, so check both representations when reading.
  const isHidden = hiddenPath
    ? blockData[hiddenPath] === true || getValueAtPath(blockData, hiddenPath) === true
    : false;
  function setHidden(next: boolean) {
    if (!hiddenPath) return;
    updateBlockData(blockId, hiddenPath, next || undefined);
  }
  const altValue = (() => {
    const v = getValueAtPath(blockData, altPath);
    if (typeof v === 'string') return v;
    // If alt is co-located inside the EditableImage object, expose it.
    const slot = getValueAtPath(blockData, node.fieldName);
    if (slot && typeof slot === 'object' && 'alt' in (slot as object)) {
      const a = (slot as { alt?: unknown }).alt;
      return typeof a === 'string' ? a : '';
    }
    return '';
  })();

  function writeImage(value: { mediaId?: number | string; url?: string; alt?: string } | null) {
    // Detect whether the slot is currently stored as a string or object — keep the same shape.
    const current = getValueAtPath(blockData, node.fieldName);
    const isStringSlot = typeof current === 'string' || current == null;
    if (value == null) {
      if (isStringSlot) {
        updateBlockData(blockId, node.fieldName, '');
      } else {
        updateBlockData(blockId, node.fieldName, { mediaId: undefined, url: '', alt: typeof altValue === 'string' ? altValue : '' });
      }
      return;
    }
    if (isStringSlot) {
      // Promote to EditableImage object so we can persist mediaId.
      updateBlockData(blockId, node.fieldName, {
        mediaId: value.mediaId,
        url: value.url ?? '',
        alt: value.alt ?? altValue ?? '',
      });
    } else {
      updateBlockData(blockId, node.fieldName, {
        mediaId: value.mediaId,
        url: value.url ?? '',
        alt: value.alt ?? altValue ?? '',
      });
    }
  }

  function writeAlt(next: string) {
    // Always write to altField if it's an explicit external path; if the alt
    // path is `<image>.alt` and the slot is currently a string, promote it.
    const current = getValueAtPath(blockData, node.fieldName);
    if (altPath !== `${node.fieldName}.alt`) {
      updateBlockData(blockId, altPath, next);
      return;
    }
    if (typeof current === 'string' || current == null) {
      // Promote to EditableImage so alt can ride alongside.
      updateBlockData(blockId, node.fieldName, {
        url: typeof current === 'string' ? current : '',
        alt: next,
      });
    } else {
      updateBlockData(blockId, altPath, next);
    }
  }

  async function handleFileSelect(file: File | null) {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('_payload', JSON.stringify({ alt: altValue || file.name.replace(/\.[^.]+$/, '') }));
      const res = await fetch('/api/media', { method: 'POST', credentials: 'include', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const raw = await res.json() as { doc?: { id: number | string; url?: string; filename?: string; alt?: string } };
      const doc = raw.doc;
      if (!doc) throw new Error('Upload returned no doc');
      const resolvedUrl = doc.url || (doc.filename ? `/media/${doc.filename}` : '');
      writeImage({ mediaId: doc.id, url: resolvedUrl, alt: altValue || doc.alt || '' });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: '14px', padding: '10px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Image Slot
      </p>
      <div style={{ height: '120px', background: '#000', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '8px', border: '1px solid #1e1e1e' }}>
        {url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={url} alt={altValue} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ color: '#444', fontSize: '11px' }}>No image — placeholder shown on site</span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }}
      />
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ ...actionBtnStyle, padding: '7px 10px', borderRadius: '6px', color: isUploading ? '#555' : '#9ca3af', cursor: isUploading ? 'default' : 'pointer', flex: 1 }}
        >
          {isUploading ? 'Uploading…' : 'Upload File'}
        </button>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          style={{ ...actionBtnStyle, padding: '7px 10px', borderRadius: '6px', color: '#0ea5e9', cursor: 'pointer', border: '1px solid #0ea5e9', flex: 1 }}
        >
          Browse Library
        </button>
        {url ? (
          <button
            type="button"
            onClick={() => writeImage(null)}
            style={{ ...actionBtnStyle, padding: '7px 10px', borderRadius: '6px', color: '#f87171', cursor: 'pointer' }}
          >
            Remove
          </button>
        ) : null}
      </div>
      {hiddenPath ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) => setHidden(e.target.checked)}
            style={{ accentColor: '#0ea5e9' }}
          />
          <span>Hide this image slot on the live site (no placeholder shown)</span>
        </label>
      ) : null}
      <div style={{ marginBottom: '4px' }}>
        <label style={labelStyle}>Alt text</label>
        <input
          type="text"
          value={altValue}
          onChange={(e) => writeAlt(e.target.value)}
          placeholder="Describe the image for accessibility"
          style={inputStyle}
        />
      </div>
      {mediaId != null ? (
        <p style={{ margin: '6px 0 0', fontSize: '10px', color: '#444' }}>Media ID: <span style={{ fontFamily: 'monospace', color: '#666' }}>{String(mediaId)}</span></p>
      ) : null}

      {showLibrary ? (
        <MediaLibraryModal
          onSelect={(media) => {
            const resolvedUrl = media.url || (media.filename ? `/media/${media.filename}` : '');
            writeImage({ mediaId: media.id, url: resolvedUrl, alt: altValue || media.alt || '' });
            setShowLibrary(false);
          }}
          onClose={() => setShowLibrary(false)}
        />
      ) : null}
    </div>
  );
}

function ConvertedNodeInspector({
  blockId,
  blockData,
  node,
}: {
  blockId: string;
  blockData: Record<string, unknown>;
  node: {
    blockId: string;
    fieldName: string;
    styleField?: string;
    tagField?: string;
    allowedTags?: string[];
    tagName: string;
    className: string;
    textValue: string;
    computedStyles: Record<string, string>;
    isImageField?: boolean;
    altField?: string;
    hiddenField?: string;
  };
}) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const contentValue = getValueAtPath(blockData, node.fieldName);
  const tagValue = node.tagField ? getValueAtPath(blockData, node.tagField) : undefined;

  const styleValue = node.styleField
    ? ((getValueAtPath(blockData, node.styleField) as Record<string, unknown> | undefined) ?? {})
    : {};

  function updateStyle(name: string, value: string) {
    if (!node.styleField) return;
    updateBlockData(blockId, `${node.styleField}.${name}`, value || undefined);
  }

  return (
    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e1e1e' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
        Selected Element
      </p>

      {node.isImageField ? (
        <ConvertedImageInspector blockId={blockId} blockData={blockData} node={node} />
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div>
          <label style={labelStyle}>Tag</label>
          <input value={node.tagName} readOnly style={{ ...inputStyle, color: '#888' }} />
        </div>
        <div>
          <label style={labelStyle}>Classes</label>
          <input value={node.className || '(none)'} readOnly style={{ ...inputStyle, color: '#888' }} />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Bound Field</label>
        <input value={node.fieldName} readOnly style={{ ...inputStyle, color: '#888' }} />
      </div>

      {!node.isImageField && typeof contentValue === 'string' ? (
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Current Text</label>
          <textarea value={contentValue} readOnly rows={2} style={{ ...inputStyle, color: '#888', resize: 'vertical' }} />
        </div>
      ) : null}

      {node.tagField && node.allowedTags && node.allowedTags.length > 0 ? (
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Semantic Tag</label>
          <select
            value={typeof tagValue === 'string' ? tagValue : node.tagName}
            onChange={(e) => updateBlockData(blockId, node.tagField!, e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {node.allowedTags.map((tag) => (
              <option key={tag} value={tag}>{tag.toUpperCase()}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {[
          ['color', 'Text Color'],
          ['backgroundColor', 'Background'],
          ['fontSize', 'Font Size'],
          ['fontWeight', 'Font Weight'],
          ['lineHeight', 'Line Height'],
          ['letterSpacing', 'Letter Spacing'],
          ['marginTop', 'Margin Top'],
          ['marginBottom', 'Margin Bottom'],
          ['paddingTop', 'Pad Top'],
          ['paddingBottom', 'Pad Bottom'],
          ['borderWidth', 'Border Width'],
          ['borderRadius', 'Radius'],
        ].map(([key, label]) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              value={typeof styleValue[key] === 'string' ? String(styleValue[key]) : ''}
              placeholder={node.computedStyles[key] || ''}
              onChange={(e) => updateStyle(key, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Text Transform</label>
        <select
          value={typeof styleValue.textTransform === 'string' ? String(styleValue.textTransform) : ''}
          onChange={(e) => updateStyle('textTransform', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">Use computed ({node.computedStyles.textTransform || 'none'})</option>
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <details>
        <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#777', marginBottom: '8px' }}>
          Computed Style Snapshot
        </summary>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {Object.entries(node.computedStyles).map(([key, value]) => (
            <div key={key} style={{ background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: '6px', padding: '8px' }}>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>{key}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', wordBreak: 'break-word' }}>{value}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function BlockStylesPanel({ blockId, styles }: { blockId: string; styles?: BlockStyles }) {
  const updateBlockStyles = useEditorStore((s) => s.updateBlockStyles);
  return (
    <StylesPanel
      styles={styles}
      onUpdate={(s) => updateBlockStyles(blockId, s)}
    />
  );
}

// ─── Widget field editor ──────────────────────────────────────────────────────

function WidgetFieldEditorItem({ blockId, widgetId, field, value }: {
  blockId: string;
  widgetId: string;
  field: WidgetField;
  value: unknown;
}) {
  const updateWidgetData = useEditorStore((s) => s.updateWidgetData);
  const strVal = typeof value === 'string' ? value : (value != null ? String(value) : '');

  if (field.type === 'select') {
    return (
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{field.label}</label>
        <select
          value={strVal}
          onChange={(e) => updateWidgetData(blockId, widgetId, field.name, e.target.value)}
          style={inputStyle}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>{field.label}</label>
        <textarea
          value={strVal}
          rows={4}
          onChange={(e) => updateWidgetData(blockId, widgetId, field.name, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => updateWidgetData(blockId, widgetId, field.name, e.target.checked)}
        />
        <label style={{ ...labelStyle, margin: 0 }}>{field.label}</label>
      </div>
    );
  }

  if (field.type === 'link') {
    return (
      <LinkFieldEditor
        blockId={blockId}
        fieldName={field.name}
        fieldLabel={field.label}
        value={value}
        showLabel={false}
        onCommit={(val) => updateWidgetData(blockId, widgetId, field.name, val)}
      />
    );
  }

  // text default
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{field.label}</label>
      <input
        type="text"
        value={strVal}
        onChange={(e) => updateWidgetData(blockId, widgetId, field.name, e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

// ─── Widget styles panel ──────────────────────────────────────────────────────

function WidgetStylesPanel({ blockId, widgetId, styles }: {
  blockId: string;
  widgetId: string;
  styles?: WidgetStyles;
}) {
  const updateWidgetStyles = useEditorStore((s) => s.updateWidgetStyles);
  const clearWidgetStyle   = useEditorStore((s) => s.clearWidgetStyle);
  const [tab, setTab] = useState<'spacing' | 'appearance' | 'typography'>('spacing');

  const upd = (patch: Partial<WidgetStyles>) => updateWidgetStyles(blockId, widgetId, patch);
  const clr = (key: keyof WidgetStyles) => clearWidgetStyle(blockId, widgetId, key);

  const tabs = [
    { id: 'spacing' as const,    label: 'Spacing'    },
    { id: 'appearance' as const, label: 'Appearance' },
    { id: 'typography' as const, label: 'Typography' },
  ];

  function numField(key: keyof WidgetStyles, lbl: string, max = 200) {
    const val = styles?.[key] as number | undefined;
    return (
      <div key={String(key)}>
        <label style={labelStyle}>{lbl}</label>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="number" min={0} max={max}
            value={val ?? ''}
            onChange={(e) => upd({ [key]: e.target.value === '' ? undefined : Number(e.target.value) })}
            style={{ ...inputStyle, padding: '7px 8px', flex: 1 }}
            placeholder="0"
          />
          {val != null && (
            <button onClick={() => clr(key)} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '12px', borderTop: '1px solid #1e1e1e', paddingTop: '12px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
        Styles
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '12px', background: '#0a0a0a', borderRadius: '6px', padding: '3px' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, background: tab === t.id ? '#1e1e1e' : 'transparent', border: 'none',
            borderRadius: '4px', color: tab === t.id ? '#ccc' : '#555', cursor: 'pointer',
            fontSize: '10px', fontWeight: 600, padding: '5px 4px', textTransform: 'capitalize',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Spacing */}
      {tab === 'spacing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {numField('paddingTop',    'Pad Top')}
            {numField('paddingBottom', 'Pad Bottom')}
            {numField('paddingLeft',   'Pad Left')}
            {numField('paddingRight',  'Pad Right')}
            {numField('marginTop',     'Margin Top')}
            {numField('marginBottom',  'Margin Bottom')}
          </div>
          <div>
            <label style={labelStyle}>Max Width (px)</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="number" min={0} max={2560}
                value={styles?.maxWidth ?? ''}
                onChange={(e) => upd({ maxWidth: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, padding: '7px 8px', flex: 1 }}
                placeholder="—"
              />
              {styles?.maxWidth != null && (
                <button onClick={() => clr('maxWidth')} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appearance */}
      {tab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Background color */}
          <div>
            <label style={labelStyle}>Background Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={styles?.backgroundColor ?? '#ffffff'}
                onChange={(e) => upd({ backgroundColor: e.target.value })}
                style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
              />
              <input
                type="text"
                value={styles?.backgroundColor ?? ''}
                onChange={(e) => upd({ backgroundColor: e.target.value || undefined })}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="transparent"
              />
              {styles?.backgroundColor && (
                <button onClick={() => clr('backgroundColor')} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
              )}
            </div>
            <ColorSwatches onSelect={(c) => upd({ backgroundColor: c === 'transparent' ? undefined : c })} />
          </div>
          {/* Border */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Border Radius (px)</label>
              <input
                type="number" min={0} max={100}
                value={styles?.borderRadius ?? ''}
                onChange={(e) => upd({ borderRadius: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, padding: '7px 8px' }} placeholder="0"
              />
            </div>
            <div>
              <label style={labelStyle}>Border Width (px)</label>
              <input
                type="number" min={0} max={20}
                value={styles?.borderWidth ?? ''}
                onChange={(e) => upd({ borderWidth: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, padding: '7px 8px' }} placeholder="0"
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Border Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={styles?.borderColor ?? '#000000'}
                onChange={(e) => upd({ borderColor: e.target.value })}
                style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
              />
              <input
                type="text"
                value={styles?.borderColor ?? ''}
                onChange={(e) => upd({ borderColor: e.target.value || undefined })}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="#000000"
              />
            </div>
            <ColorSwatches onSelect={(c) => upd({ borderColor: c === 'transparent' ? undefined : c })} />
          </div>
        </div>
      )}

      {/* Typography */}
      {tab === 'typography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Text Color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={styles?.textColor ?? '#000000'}
                onChange={(e) => upd({ textColor: e.target.value })}
                style={{ width: '32px', height: '32px', padding: '2px', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', background: '#0f0f0f' }}
              />
              <input
                type="text"
                value={styles?.textColor ?? ''}
                onChange={(e) => upd({ textColor: e.target.value || undefined })}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="#333333"
              />
              {styles?.textColor && (
                <button onClick={() => clr('textColor')} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
              )}
            </div>
            <ColorSwatches onSelect={(c) => upd({ textColor: c === 'transparent' ? undefined : c })} />
          </div>
          <div>
            <label style={labelStyle}>Font Size (px)</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="number" min={8} max={200}
                value={styles?.fontSize ?? ''}
                onChange={(e) => upd({ fontSize: e.target.value === '' ? undefined : Number(e.target.value) })}
                style={{ ...inputStyle, flex: 1 }} placeholder="16"
              />
              {styles?.fontSize != null && (
                <button onClick={() => clr('fontSize')} style={{ ...actionBtnStyle, flexShrink: 0 }} title="Clear">✕</button>
              )}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Font Weight</label>
            <select
              value={styles?.fontWeight ?? ''}
              onChange={(e) => upd({ fontWeight: (e.target.value || undefined) as WidgetStyles['fontWeight'] })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Default</option>
              <option value="normal">Normal (400)</option>
              <option value="medium">Medium (500)</option>
              <option value="semibold">Semibold (600)</option>
              <option value="bold">Bold (700)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Text Align</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => upd({ textAlign: styles?.textAlign === align ? undefined : align })}
                  style={{
                    flex: 1,
                    background: styles?.textAlign === align ? '#0ea5e9' : '#1a1a1a',
                    border: `1px solid ${styles?.textAlign === align ? '#0ea5e9' : '#2a2a2a'}`,
                    borderRadius: '5px', color: styles?.textAlign === align ? '#fff' : '#555',
                    cursor: 'pointer', fontSize: '14px', padding: '6px 4px',
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
  );
}

// ─── Widget add palette ───────────────────────────────────────────────────────

function WidgetPalette({ blockId, label = 'Add Widget' }: { blockId: string; label?: string }) {
  const addWidget = useEditorStore((s) => s.addWidget);
  return (
    <div>
      <p style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>{label}</p>
      {widgetCategories.map((cat) => (
        <div key={cat.name} style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '10px', color: '#444', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {cat.widgets.map((wdef) => (
              <button
                key={wdef.widgetType}
                type="button"
                onClick={() => addWidget(blockId, wdef.widgetType)}
                style={{
                  background: '#1a1a1a', border: '1px solid #333', color: '#ccc',
                  borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
                title={`Add ${wdef.label}`}
              >
                {wdef.icon} {wdef.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Widget inspector ─────────────────────────────────────────────────────────

function WidgetInspector({ blockId, widgetId }: { blockId: string; widgetId: string }) {
  const sections        = useEditorStore((s) => s.sections);
  const removeWidget    = useEditorStore((s) => s.removeWidget);
  const duplicateWidget = useEditorStore((s) => s.duplicateWidget);
  const toggleWidgetHidden = useEditorStore((s) => s.toggleWidgetHidden);
  const clearSelection  = useEditorStore((s) => s.clearSelection);
  const [tab, setTab]   = useState<'content' | 'style'>('content');

  let widget: WidgetInstance | null = null;
  for (const sec of sections) {
    for (const col of sec.columns) {
      const block = col.blocks.find((b) => b.id === blockId);
      if (block?.widgets) {
        widget = block.widgets.find((w) => w.id === widgetId) ?? null;
        if (widget) break;
      }
    }
    if (widget) break;
  }

  const def = widget ? getWidgetDefinition(widget.widgetType) : null;

  if (!widget || !def) {
    return <div style={{ padding: '16px', color: '#555', fontSize: '13px' }}>Widget not found.</div>;
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>
          {def.icon} {def.label}
          {widget.isHidden ? <span style={{ marginLeft: '6px', color: '#fbbf24', fontSize: '10px' }}>(hidden)</span> : null}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => toggleWidgetHidden(blockId, widgetId)}
            style={{ ...actionBtnStyle, color: widget.isHidden ? '#fbbf24' : '#555' }}
            title={widget.isHidden ? 'Show widget' : 'Hide widget'}
          >
            👁
          </button>
          <button
            type="button"
            onClick={() => duplicateWidget(blockId, widgetId)}
            style={actionBtnStyle}
            title="Duplicate widget"
          >
            ⧉
          </button>
          <button
            type="button"
            onClick={() => { removeWidget(blockId, widgetId); clearSelection(); }}
            style={{ ...actionBtnStyle, color: '#f87171' }}
            title="Remove widget"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content / Style tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '14px', background: '#0a0a0a', borderRadius: '6px', padding: '3px' }}>
        {(['content', 'style'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: tab === t ? '#1e1e1e' : 'transparent', border: 'none',
            borderRadius: '4px', color: tab === t ? '#ccc' : '#555', cursor: 'pointer',
            fontSize: '10px', fontWeight: 600, padding: '5px 4px', textTransform: 'capitalize',
          }}>
            {t === 'content' ? 'Content' : 'Style'}
          </button>
        ))}
      </div>

      {tab === 'content' ? (
        <>
          {def.fields.length > 0 ? (
            def.fields.map((field) => (
              <WidgetFieldEditorItem
                key={field.name}
                blockId={blockId}
                widgetId={widgetId}
                field={field}
                value={widget!.data[field.name]}
              />
            ))
          ) : (
            <p style={{ fontSize: '12px', color: '#555', margin: '0 0 12px' }}>No content fields for this widget.</p>
          )}
          <hr style={{ border: 'none', borderTop: '1px solid #1e1e1e', margin: '16px 0' }} />
          <WidgetPalette blockId={blockId} label="Add Widget Below" />
        </>
      ) : (
        <WidgetStylesPanel blockId={blockId} widgetId={widgetId} styles={widget.styles} />
      )}
    </div>
  );
}

// ─── Widget container panel ───────────────────────────────────────────────────

function WidgetContainerPanel({ blockId }: { blockId: string }) {
  const sections = useEditorStore((s) => s.sections);
  let widgetCount = 0;
  for (const sec of sections) {
    for (const col of sec.columns) {
      const block = col.blocks.find((b) => b.id === blockId);
      if (block) { widgetCount = block.widgets?.length ?? 0; break; }
    }
  }

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 14px' }}>
        {widgetCount} widget{widgetCount !== 1 ? 's' : ''} · Click a widget in the preview to edit it
      </p>
      <WidgetPalette blockId={blockId} label="Add Widget" />
    </div>
  );
}

type ConfigPanelProps = {
  embedded?: boolean;
};

export function ConfigPanel({ embedded = false }: ConfigPanelProps) {
  const selectedBlock = useEditorStore(selectSelectedBlock);
  const selection = useEditorStore((s) => s.selection);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const selectedNode = useEditorStore((s) => s.selectedNode);

  const blockSelection = selection?.kind === 'block' ? selection : null;
  const sectionSelection = selection?.kind === 'section' ? selection : null;
  const widgetSelection = selection?.kind === 'widget' ? selection : null;
  const def = selectedBlock ? getBlockDefinition(selectedBlock.blockType) : null;
  const toggleBlockLocked = useEditorStore((s) => s.toggleBlockLocked);
  const toggleBlockHidden = useEditorStore((s) => s.toggleBlockHidden);

  // Subscribe to only the selected section, not the full sections array.
  // Prevents ConfigPanel re-renders when any other section changes.
  const selectedSection = useEditorStore((s) =>
    sectionSelection ? s.sections.find((sec) => sec.id === sectionSelection.sectionId) ?? null : null,
  );

  return (
    <aside
      style={{
        width: embedded ? '100%' : '280px',
        flex: embedded ? 1 : undefined,
        flexShrink: 0,
        background: '#111',
        borderLeft: embedded ? 'none' : '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          {selectedSection ? '▦ Section' : widgetSelection ? '⊞ Widget' : def ? `${def.icon} ${def.label}` : 'Properties'}
        </p>
        {selectedBlock && def && blockSelection && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => toggleBlockHidden(selectedBlock.id)}
              style={{ ...actionBtnStyle, color: selectedBlock.isHidden ? '#fbbf24' : '#666' }}
              title={selectedBlock.isHidden ? 'Show block' : 'Hide block'}
            >
              {selectedBlock.isHidden ? '👁' : '👁'}
            </button>
            <button
              onClick={() => toggleBlockLocked(selectedBlock.id)}
              style={{ ...actionBtnStyle, color: selectedBlock.isLocked ? '#0ea5e9' : '#666' }}
              title={selectedBlock.isLocked ? 'Unlock block' : 'Lock block (prevents editing)'}
            >
              {selectedBlock.isLocked ? '🔒' : '🔓'}
            </button>
            <button onClick={() => duplicateBlock(blockSelection.sectionId, blockSelection.columnId, selectedBlock.id)} style={actionBtnStyle} title="Duplicate">⧉</button>
            <button onClick={() => removeBlock(blockSelection.sectionId, blockSelection.columnId, selectedBlock.id)} style={{ ...actionBtnStyle, color: '#f87171' }} title="Delete">✕</button>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: (selectedBlock || selectedSection || widgetSelection) ? '16px 14px' : 0 }}>
        {widgetSelection ? (
          <WidgetInspector blockId={widgetSelection.blockId} widgetId={widgetSelection.widgetId} />
        ) : selectedSection ? (
          <SectionPanel section={selectedSection} />
        ) : !selectedBlock || !def ? (
          <NoSelection />
        ) : (
          <>
            {selectedBlock.isHidden && (
              <div style={{ background: '#1c1200', border: '1px solid #854d0e', borderRadius: '6px', padding: '8px 10px', marginBottom: '12px', fontSize: '11px', color: '#fbbf24' }}>
                This block is hidden from visitors. Toggle visibility in the toolbar above.
              </div>
            )}
            {selectedBlock.isLocked ? (
              <div style={{ background: '#0c1a24', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '12px', marginBottom: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>🔒</div>
                <p style={{ margin: 0, fontSize: '12px', color: '#7dd3fc' }}>Block is locked</p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#555' }}>Unlock to edit content and styles.</p>
              </div>
            ) : selectedBlock.blockType === 'widget-container' ? (
              <WidgetContainerPanel blockId={selectedBlock.id} />
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
                {selectedNode && selectedNode.blockId === selectedBlock.id && selectedBlock.blockType.startsWith('cp-') ? (
                  <ConvertedNodeInspector blockId={selectedBlock.id} blockData={selectedBlock.data} node={selectedNode} />
                ) : null}
                {selectedBlock.blockType.startsWith('cp-') ? (
                  <ConvertedRedirectNote>
                    Section spacing &amp; breakpoints live in the <strong>Sections</strong> tab.
                    Per-element style overrides live in the Selected Element panel above.
                  </ConvertedRedirectNote>
                ) : (
                  <BlockStylesPanel blockId={selectedBlock.id} styles={selectedBlock.styles} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {selectedBlock && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '10px', color: '#333', margin: 0, lineHeight: 1.4, flex: 1 }}>
            ID: <span style={{ fontFamily: 'monospace', color: '#444' }}>{selectedBlock.id.slice(-8)}</span>
          </p>
          {selectedBlock.isLocked && (
            <span style={{ fontSize: '10px', background: '#0c1a24', color: '#7dd3fc', border: '1px solid #1e3a5f', borderRadius: '4px', padding: '1px 6px' }}>Locked</span>
          )}
          {selectedBlock.isHidden && (
            <span style={{ fontSize: '10px', background: '#1c1200', color: '#fbbf24', border: '1px solid #854d0e', borderRadius: '4px', padding: '1px 6px' }}>Hidden</span>
          )}
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

// ─── Brand Palette & Color Swatches ──────────────────────────────────────────

const BRAND_PALETTE: Array<{ label: string; value: string }> = [
  // Primary brand
  { label: 'Brand Blue', value: '#0ea5e9' },
  { label: 'Brand Dark', value: '#0369a1' },
  { label: 'Brand Light', value: '#bae6fd' },
  // Neutrals
  { label: 'White', value: '#ffffff' },
  { label: 'Off White', value: '#f8fafc' },
  { label: 'Light Gray', value: '#e2e8f0' },
  { label: 'Mid Gray', value: '#94a3b8' },
  { label: 'Dark Gray', value: '#334155' },
  { label: 'Near Black', value: '#0f172a' },
  { label: 'Black', value: '#000000' },
  // Status / accent
  { label: 'Success', value: '#10b981' },
  { label: 'Warning', value: '#f59e0b' },
  { label: 'Danger', value: '#ef4444' },
  { label: 'Transparent', value: 'transparent' },
];

function ColorSwatches({ onSelect }: { onSelect: (color: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
      {BRAND_PALETTE.map((swatch) => (
        <button
          key={swatch.value}
          type="button"
          onClick={() => onSelect(swatch.value)}
          title={swatch.label}
          style={{
            width: '20px',
            height: '20px',
            background: swatch.value === 'transparent'
              ? 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 / 8px 8px'
              : swatch.value,
            border: '1px solid #333',
            borderRadius: '3px',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
