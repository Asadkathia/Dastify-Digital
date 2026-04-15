'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from './store';
import type { SectionStyleOverrides } from './store';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

type StylePropertyKey =
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'marginTop'
  | 'marginBottom'
  | 'minHeight'
  | 'gap';

type PropertyDef = {
  key: StylePropertyKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
};

const PROPERTY_GROUPS: Array<{ label: string; props: PropertyDef[] }> = [
  {
    label: 'Padding',
    props: [
      { key: 'paddingTop', label: 'Top', min: 0, max: 300, step: 2, unit: 'px' },
      { key: 'paddingBottom', label: 'Bottom', min: 0, max: 300, step: 2, unit: 'px' },
      { key: 'paddingLeft', label: 'Left', min: 0, max: 300, step: 2, unit: 'px' },
      { key: 'paddingRight', label: 'Right', min: 0, max: 300, step: 2, unit: 'px' },
    ],
  },
  {
    label: 'Margin',
    props: [
      { key: 'marginTop', label: 'Top', min: -100, max: 300, step: 2, unit: 'px' },
      { key: 'marginBottom', label: 'Bottom', min: -100, max: 300, step: 2, unit: 'px' },
    ],
  },
  {
    label: 'Size',
    props: [
      { key: 'minHeight', label: 'Min height', min: 0, max: 100, step: 1, unit: 'vh' },
      { key: 'gap', label: 'Gap', min: 0, max: 120, step: 2, unit: 'px' },
    ],
  },
];

const BREAKPOINT_OPTIONS: Array<{ value: Breakpoint; label: string; hint: string }> = [
  { value: 'desktop', label: 'Desktop', hint: '> 1100px' },
  { value: 'tablet', label: 'Tablet', hint: '≤ 1100px' },
  { value: 'mobile', label: 'Mobile', hint: '≤ 768px' },
];

/** Parse a CSS value string → numeric value if it ends with the expected unit, else null */
function parseNumeric(val: string, unit: string): number | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed.endsWith(unit)) {
    const n = parseFloat(trimmed.slice(0, -unit.length));
    return isNaN(n) ? null : n;
  }
  // Unitless number
  const n = parseFloat(trimmed);
  return isNaN(n) ? null : n;
}

type SectionStylePanelProps = {
  embedded?: boolean;
};

export function SectionStylePanel({ embedded }: SectionStylePanelProps) {
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);
  const overrides = useEditorStore((s) => s.sectionStyleOverrides);
  const activeKey = useEditorStore((s) => s.activeSectionKey);
  const activeBp = useEditorStore((s) => s.activeSectionBreakpoint);
  const updateOverride = useEditorStore((s) => s.updateSectionStyleOverride);
  const clearBp = useEditorStore((s) => s.clearSectionStyleBreakpoint);
  const setActiveKey = useEditorStore((s) => s.setActiveSectionKey);
  const setActiveBp = useEditorStore((s) => s.setActiveSectionBreakpoint);

  const [registry, setRegistry] = useState<ConvertedPageRegistry | null>(null);

  const isConverted = editorMode === 'converted' || (editorMode === 'pages' && Boolean(convertedPageName));

  useEffect(() => {
    if (!isConverted || !convertedPageName) {
      setRegistry(null);
      return;
    }
    let cancelled = false;
    loadConvertedPageRegistry(convertedPageName).then((reg) => {
      if (!cancelled) setRegistry(reg);
    });
    return () => { cancelled = true; };
  }, [isConverted, convertedPageName]);

  useEffect(() => {
    if (registry && !activeKey && registry.sections.length > 0) {
      setActiveKey(registry.sections[0].key);
    }
  }, [registry, activeKey, setActiveKey]);

  if (!isConverted) {
    return (
      <div style={{ ...panelStyle(embedded), color: '#64748b', fontSize: 12, padding: 20 }}>
        Section styles are only available on converted pages (About, Services).
      </div>
    );
  }

  if (!registry) {
    return <div style={{ ...panelStyle(embedded), color: '#64748b', fontSize: 12, padding: 20 }}>Loading sections…</div>;
  }

  const activeSection = registry.sections.find((s) => s.key === activeKey) ?? registry.sections[0];
  const values = overrides[activeSection.key]?.[activeBp] ?? {};
  const hasAnyForBp = Object.keys(values).length > 0;

  return (
    <div style={panelStyle(embedded)}>
      {/* Section picker */}
      <div style={sectionHeaderStyle}>Section</div>
      <div style={{ padding: '8px 10px 0' }}>
        <select
          value={activeSection.key}
          onChange={(e) => setActiveKey(e.target.value)}
          style={selectStyle}
        >
          {registry.sections.map((s) => {
            const hasOverrides = Boolean(
              overrides[s.key] &&
                (overrides[s.key]?.desktop || overrides[s.key]?.tablet || overrides[s.key]?.mobile),
            );
            return (
              <option key={s.key} value={s.key}>
                {s.icon ? `${s.icon} ` : ''}
                {s.label}
                {hasOverrides ? ' •' : ''}
              </option>
            );
          })}
        </select>
        {activeSection.className && (
          <div style={classHintStyle}>
            <code>.{activeSection.className}</code>
          </div>
        )}
      </div>

      {/* Breakpoint tabs */}
      <div style={sectionHeaderStyle}>Breakpoint</div>
      <div style={bpRowStyle}>
        {BREAKPOINT_OPTIONS.map((opt) => {
          const active = activeBp === opt.value;
          const hasThis = Boolean(overrides[activeSection.key]?.[opt.value]);
          return (
            <button
              key={opt.value}
              onClick={() => setActiveBp(opt.value)}
              style={{
                ...bpBtnStyle,
                background: active ? '#1e3a8a' : '#0f172a',
                color: active ? '#bfdbfe' : hasThis ? '#e2e8f0' : '#64748b',
                borderColor: active ? '#1d4ed8' : hasThis ? '#334155' : '#1e293b',
              }}
              title={opt.hint}
            >
              <div style={{ fontWeight: 600 }}>{opt.label}</div>
              <div style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>{opt.hint}</div>
              {hasThis && <div style={dotStyle} />}
            </button>
          );
        })}
      </div>

      {/* Property groups */}
      <div style={{ padding: '0 10px 12px' }}>
        {PROPERTY_GROUPS.map((group) => (
          <div key={group.label} style={groupStyle}>
            <div style={groupLabelStyle}>{group.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.props.map((p) => (
                <StyleRow
                  key={p.key}
                  prop={p}
                  value={values[p.key] ?? ''}
                  onChange={(val) => updateOverride(activeSection.key, activeBp, p.key, val)}
                />
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={!hasAnyForBp}
          onClick={() => clearBp(activeSection.key, activeBp)}
          style={{
            ...resetBtnStyle,
            opacity: hasAnyForBp ? 1 : 0.4,
            cursor: hasAnyForBp ? 'pointer' : 'default',
          }}
        >
          Reset {BREAKPOINT_OPTIONS.find((o) => o.value === activeBp)?.label} overrides
        </button>

        <div style={hintStyle}>
          Slider uses <code>px</code> / <code>vh</code> by default. Type any CSS value in the text box (<code>4rem</code>, <code>clamp(...)</code>, <code>auto</code>). Leave empty to inherit.
        </div>
      </div>
    </div>
  );
}

// ─── StyleRow ────────────────────────────────────────────────────────────────

type StyleRowProps = {
  prop: PropertyDef;
  value: string;
  onChange: (val: string) => void;
};

function StyleRow({ prop, value, onChange }: StyleRowProps) {
  const numericVal = parseNumeric(value, prop.unit);
  const sliderVal = numericVal !== null ? Math.min(Math.max(numericVal, prop.min), prop.max) : prop.min;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${e.target.value}${prop.unit}`);
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const filled = value !== '';
  const pct = ((sliderVal - prop.min) / (prop.max - prop.min)) * 100;

  return (
    <div style={rowWrapStyle}>
      <div style={rowTopStyle}>
        <span style={rowLabelStyle}>{prop.label}</span>
        <input
          type="text"
          value={value}
          placeholder={`${prop.min}–${prop.max}${prop.unit}`}
          onChange={handleText}
          style={{ ...textInputStyle, borderColor: filled ? '#334155' : '#1e293b', color: filled ? '#e2e8f0' : '#64748b' }}
        />
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={prop.min}
          max={prop.max}
          step={prop.step}
          value={sliderVal}
          onChange={handleSlider}
          style={{ ...rangeStyle, '--pct': `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function panelStyle(embedded?: boolean): React.CSSProperties {
  return {
    background: embedded ? 'transparent' : '#0b0b0b',
    height: '100%',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#e2e8f0',
    minHeight: 0,
  };
}

const sectionHeaderStyle: React.CSSProperties = {
  padding: '14px 14px 6px',
  fontSize: 10,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#e2e8f0',
  padding: '8px 10px',
  fontSize: 13,
  cursor: 'pointer',
};

const classHintStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 10,
  color: '#475569',
  fontFamily: 'ui-monospace, monospace',
};

const bpRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 6,
  padding: '4px 10px 8px',
};

const bpBtnStyle: React.CSSProperties = {
  position: 'relative',
  padding: '8px 4px',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#64748b',
  fontSize: 11,
  cursor: 'pointer',
  transition: 'all .15s',
};

const dotStyle: React.CSSProperties = {
  position: 'absolute',
  top: 4,
  right: 4,
  width: 5,
  height: 5,
  borderRadius: '50%',
  background: '#7c3aed',
};

const groupStyle: React.CSSProperties = {
  marginTop: 14,
};

const groupLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
};

const rowWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const rowTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  width: 52,
  flexShrink: 0,
};

const textInputStyle: React.CSSProperties = {
  flex: 1,
  background: '#0a0a0a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#64748b',
  padding: '5px 7px',
  fontSize: 11,
  fontFamily: 'ui-monospace, monospace',
  boxSizing: 'border-box',
};

const rangeStyle: React.CSSProperties = {
  width: '100%',
  accentColor: '#6d28d9',
  cursor: 'pointer',
  height: 4,
};

const resetBtnStyle: React.CSSProperties = {
  marginTop: 14,
  width: '100%',
  background: '#1a0f0f',
  border: '1px solid #450a0a',
  borderRadius: 4,
  color: '#fca5a5',
  padding: '7px 10px',
  fontSize: 11,
  fontWeight: 600,
};

const hintStyle: React.CSSProperties = {
  marginTop: 12,
  padding: '8px 10px',
  background: '#0a0a0a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#64748b',
  fontSize: 10,
  lineHeight: 1.6,
};
