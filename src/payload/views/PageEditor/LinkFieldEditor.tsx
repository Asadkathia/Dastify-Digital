'use client';

/**
 * LinkFieldEditor — universal link picker used in ConfigPanel.
 *
 * Stores a structured LinkValue in the block data field:
 *   { url, type: 'external'|'internal'|'anchor', openInNewTab, label? }
 *
 * Replaces raw text href inputs across Hero, CTA, Button, Image, etc.
 */

import { useState, useEffect } from 'react';
import { useEditorStore } from './store';
import type { LinkValue } from './types';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#111',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#e5e5e5',
  fontSize: '12px',
  padding: '8px 10px',
  boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#666',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '5px 0',
  fontSize: '11px',
  fontWeight: active ? 600 : 400,
  background: active ? '#1e1e1e' : 'transparent',
  border: 'none',
  borderRadius: '4px',
  color: active ? '#e5e5e5' : '#555',
  cursor: 'pointer',
});

function normaliseValue(raw: unknown): LinkValue {
  if (raw && typeof raw === 'object' && 'url' in (raw as object)) {
    const v = raw as Partial<LinkValue>;
    return {
      url: typeof v.url === 'string' ? v.url : '',
      type: v.type ?? 'external',
      openInNewTab: v.openInNewTab ?? false,
      label: v.label,
    };
  }
  // Legacy: plain string href
  if (typeof raw === 'string') {
    const isAnchor = raw.startsWith('#');
    const isInternal = raw.startsWith('/');
    return {
      url: raw,
      type: isAnchor ? 'anchor' : isInternal ? 'internal' : 'external',
      openInNewTab: false,
    };
  }
  return { url: '', type: 'external', openInNewTab: false };
}

type Props = {
  blockId: string;
  fieldName: string;
  fieldLabel?: string;
  value: unknown;
  /** If true, shows a text field for the link's visible label (useful in array sub-fields) */
  showLabel?: boolean;
  /** Override the default store update; used by array sub-field editors */
  onCommit?: (linkValue: LinkValue) => void;
};

export function LinkFieldEditor({ blockId, fieldName, fieldLabel, value, showLabel = false, onCommit }: Props) {
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const [link, setLink] = useState<LinkValue>(() => normaliseValue(value));

  // Sync if parent resets
  useEffect(() => {
    setLink(normaliseValue(value));
  }, [value]);

  function patch(partial: Partial<LinkValue>) {
    const next = { ...link, ...partial };
    setLink(next);
    if (onCommit) {
      onCommit(next);
    } else {
      updateBlockData(blockId, fieldName, next);
    }
  }

  const placeholder =
    link.type === 'anchor'
      ? '#section-id'
      : link.type === 'internal'
        ? '/about or /services/seo'
        : 'https://example.com';

  return (
    <div style={{ marginBottom: '16px' }}>
      {fieldLabel && <label style={labelStyle}>{fieldLabel}</label>}

      {/* Link type tabs */}
      <div style={{ display: 'flex', gap: '2px', background: '#0a0a0a', borderRadius: '6px', padding: '3px', marginBottom: '8px' }}>
        {(['internal', 'external', 'anchor'] as const).map((t) => (
          <button key={t} type="button" style={tabBtnStyle(link.type === t)} onClick={() => patch({ type: t, url: '' })}>
            {t === 'internal' ? 'Page' : t === 'external' ? 'URL' : 'Anchor'}
          </button>
        ))}
      </div>

      {/* URL / path / anchor input */}
      <input
        type={link.type === 'external' ? 'url' : 'text'}
        value={link.url}
        onChange={(e) => patch({ url: e.target.value })}
        style={inputStyle}
        placeholder={placeholder}
        spellCheck={false}
      />

      {/* Inline hint */}
      <p style={{ fontSize: '10px', color: '#444', margin: '4px 0 8px', lineHeight: 1.4 }}>
        {link.type === 'internal' && 'Use a path starting with /. Example: /services/seo-marketing'}
        {link.type === 'external' && 'Full URL including https://'}
        {link.type === 'anchor' && 'Hash linking to an element id on this page. Example: #contact'}
      </p>

      {/* Optional label field */}
      {showLabel && (
        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Link Label</label>
          <input
            type="text"
            value={link.label ?? ''}
            onChange={(e) => patch({ label: e.target.value })}
            style={inputStyle}
            placeholder="Button or link text…"
          />
        </div>
      )}

      {/* Open in new tab */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          id={`${blockId}-${fieldName}-newtab`}
          checked={link.openInNewTab ?? false}
          onChange={(e) => patch({ openInNewTab: e.target.checked })}
          style={{ width: '14px', height: '14px', accentColor: '#0ea5e9', cursor: 'pointer' }}
        />
        <label htmlFor={`${blockId}-${fieldName}-newtab`} style={{ fontSize: '12px', color: '#888', cursor: 'pointer' }}>
          Open in new tab
        </label>
      </div>
    </div>
  );
}
