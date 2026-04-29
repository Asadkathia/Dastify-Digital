'use client';

import { useEffect, useRef, useState } from 'react';
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

const BREAKPOINT_OPTIONS: Array<{ value: Breakpoint; label: string; hint: string }> = [
  { value: 'desktop', label: 'Desktop', hint: '> 1100px' },
  { value: 'tablet', label: 'Tablet', hint: '≤ 1100px' },
  { value: 'mobile', label: 'Mobile', hint: '≤ 768px' },
];

// ─── Slider definitions ──────────────────────────────────────────────────────
//
// Each "control" writes to one or more `paddingTop|...` properties at once.
// Vertical-padding writes paddingTop+paddingBottom together; horizontal writes
// left+right; vertical-margin writes marginTop+marginBottom.

type SliderDef = {
  id: string;
  label: string;
  // Properties this slider drives (all set to the same value when the slider
  // moves; reading uses the first property and falls back through the rest).
  targets: StylePropertyKey[];
  min: number;
  max: number;
  step: number;
  unit: 'px';
  defaultPlaceholder: string;
  advanced?: boolean;
};

const SPACING_SLIDERS: SliderDef[] = [
  {
    id: 'verticalPadding',
    label: 'Vertical padding',
    targets: ['paddingTop', 'paddingBottom'],
    min: 0,
    max: 240,
    step: 4,
    unit: 'px',
    defaultPlaceholder: 'inherit',
  },
  {
    id: 'horizontalPadding',
    label: 'Horizontal padding',
    targets: ['paddingLeft', 'paddingRight'],
    min: 0,
    max: 240,
    step: 4,
    unit: 'px',
    defaultPlaceholder: 'inherit',
    advanced: true,
  },
  {
    id: 'verticalMargin',
    label: 'Vertical margin',
    targets: ['marginTop', 'marginBottom'],
    min: -120,
    max: 240,
    step: 4,
    unit: 'px',
    defaultPlaceholder: '0px',
  },
];

const SIZE_SLIDERS: SliderDef[] = [
  {
    id: 'minHeight',
    label: 'Min height',
    targets: ['minHeight'],
    min: 0,
    max: 1200,
    step: 8,
    unit: 'px',
    defaultPlaceholder: 'auto',
  },
  {
    id: 'gap',
    label: 'Gap',
    targets: ['gap'],
    min: 0,
    max: 96,
    step: 4,
    unit: 'px',
    defaultPlaceholder: 'default',
  },
];

// ─── Presets ──────────────────────────────────────────────────────────────────

type Preset = {
  id: 'compact' | 'default' | 'spacious';
  label: string;
  values: Partial<Record<StylePropertyKey, string>>;
};

const PRESETS: Preset[] = [
  {
    id: 'compact',
    label: 'Compact',
    values: { paddingTop: '40px', paddingBottom: '40px', gap: '16px', marginTop: '0px', marginBottom: '0px' },
  },
  {
    id: 'default',
    label: 'Default',
    values: { paddingTop: '96px', paddingBottom: '96px', gap: '32px', marginTop: '0px', marginBottom: '0px' },
  },
  {
    id: 'spacious',
    label: 'Spacious',
    values: { paddingTop: '160px', paddingBottom: '160px', gap: '48px', marginTop: '0px', marginBottom: '0px' },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsePx(val: string | undefined): number | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed.endsWith('px')) {
    const n = parseFloat(trimmed.slice(0, -2));
    return isNaN(n) ? null : n;
  }
  const n = parseFloat(trimmed);
  return isNaN(n) ? null : n;
}

/** Read the effective slider value: first defined target, parsed as px. */
function readSliderValue(
  values: Partial<Record<StylePropertyKey, string>>,
  targets: StylePropertyKey[],
): number | null {
  for (const t of targets) {
    const parsed = parsePx(values[t]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function isSliderSet(
  values: Partial<Record<StylePropertyKey, string>>,
  targets: StylePropertyKey[],
): boolean {
  return targets.some((t) => {
    const v = values[t];
    return v != null && v !== '';
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

type SectionStylePanelProps = {
  embedded?: boolean;
};

export function SectionStylePanel({ embedded }: SectionStylePanelProps) {
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);
  const overrides = useEditorStore((s) => s.sectionStyleOverrides);
  const activeKey = useEditorStore((s) => s.activeSectionKey);
  const activeBp = useEditorStore((s) => s.activeSectionBreakpoint);
  const sections = useEditorStore((s) => s.sections);
  const updateOverride = useEditorStore((s) => s.updateSectionStyleOverride);
  const setOverrides = useEditorStore((s) => s.setSectionStyleOverrides);
  const clearBp = useEditorStore((s) => s.clearSectionStyleBreakpoint);
  const setActiveKey = useEditorStore((s) => s.setActiveSectionKey);
  const setActiveBp = useEditorStore((s) => s.setActiveSectionBreakpoint);
  const toggleSectionHidden = useEditorStore((s) => s.toggleSectionHidden);
  // ── Reorder / duplicate / delete (Option 2) ────────────────────────────
  const moveSectionUp = useEditorStore((s) => s.moveSectionUpDispatch);
  const moveSectionDown = useEditorStore((s) => s.moveSectionDownDispatch);
  const duplicateSectionDispatch = useEditorStore((s) => s.duplicateSectionDispatch);
  const deleteSectionDispatch = useEditorStore((s) => s.deleteSectionDispatch);
  const restoreConvertedSection = useEditorStore((s) => s.restoreConvertedSection);
  const convertedDeletedSections = useEditorStore((s) => s.convertedDeletedSections);
  const convertedSectionInstances = useEditorStore((s) => s.convertedSectionInstances);

  const sectionMeta = (() => {
    const map = new Map<string, { blockId: string; isHidden: boolean }>();
    for (const sec of sections) {
      for (const col of sec.columns) {
        for (const block of col.blocks) {
          if (!block.blockType.startsWith('cp-')) continue;
          const key = String(block.data.__sectionKey ?? '');
          if (!key) continue;
          map.set(key, { blockId: block.id, isHidden: block.data.__sectionHidden === true });
        }
      }
    }
    return map;
  })();

  const [registry, setRegistry] = useState<ConvertedPageRegistry | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [undoBanner, setUndoBanner] = useState<{ label: string; previous: SectionStyleOverrides } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  }, []);

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

  // Build the picker option list: registry sections + live duplicate
  // instances, in the same order they appear in `state.sections`. A section
  // marked as deleted is hidden from the picker (and offered for restore at
  // the bottom of the panel instead).
  type PickerOption = {
    key: string;
    label: string;
    icon?: string;
    className?: string;
    isDuplicate: boolean;
  };
  const pickerOptions: PickerOption[] = [];
  for (const sec of sections) {
    const block = sec.columns[0]?.blocks[0];
    if (!block?.blockType.startsWith('cp-')) continue;
    const key = String(block.data.__sectionKey ?? '');
    if (!key) continue;
    const templateKey =
      typeof block.data.__templateKey === 'string'
        ? (block.data.__templateKey as string)
        : key;
    const baseSpec = registry.sections.find((s) => s.key === templateKey);
    pickerOptions.push({
      key,
      label:
        typeof block.data.__sectionLabel === 'string'
          ? (block.data.__sectionLabel as string)
          : baseSpec?.label ?? key,
      icon: baseSpec?.icon,
      className: baseSpec?.className,
      isDuplicate: templateKey !== key,
    });
  }
  // Resolve active option: prefer the picker entry; fall back to the first
  // registry section. (We never select a deleted key — that's filtered out.)
  const activeOption: PickerOption =
    pickerOptions.find((o) => o.key === activeKey) ??
    pickerOptions[0] ?? {
      key: registry.sections[0].key,
      label: registry.sections[0].label,
      icon: registry.sections[0].icon,
      className: registry.sections[0].className,
      isDuplicate: false,
    };
  const activeSection = {
    key: activeOption.key,
    label: activeOption.label,
    icon: activeOption.icon,
    className: activeOption.className,
  };
  const activeMeta = sectionMeta.get(activeOption.key);
  const activeIndex = sections.findIndex((s) =>
    s.columns.some((c) => c.blocks.some((b) => b.id === activeMeta?.blockId)),
  );
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === -1 || activeIndex >= sections.length - 1;
  const canMutate = Boolean(activeMeta?.blockId);
  const values = overrides[activeOption.key]?.[activeBp] ?? {};
  const hasAnyForBp = Object.keys(values).length > 0;

  const handleDelete = () => {
    if (!activeMeta?.blockId) return;
    const ok = window.confirm(
      'Delete section? You can restore it from the Sections panel.',
    );
    if (!ok) return;
    deleteSectionDispatch(activeMeta.blockId);
  };

  // ── Slider write helpers (rAF-throttled live preview, temporal-aware) ────
  const writeTargets = (targets: StylePropertyKey[], value: string | undefined) => {
    for (const t of targets) updateOverride(activeSection.key, activeBp, t, value);
  };

  const applyPreset = (preset: Preset) => {
    // Snapshot previous overrides for undo
    const prev = JSON.parse(JSON.stringify(overrides)) as SectionStyleOverrides;
    const nextSection = { ...(overrides[activeSection.key] ?? {}) };
    const nextBp = { ...(nextSection[activeBp] ?? {}), ...preset.values };
    nextSection[activeBp] = nextBp;
    const next: SectionStyleOverrides = { ...overrides, [activeSection.key]: nextSection };
    setOverrides(next);

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoBanner({ label: preset.label, previous: prev });
    undoTimerRef.current = setTimeout(() => setUndoBanner(null), 5000);
  };

  const undoPreset = () => {
    if (!undoBanner) return;
    setOverrides(undoBanner.previous);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoBanner(null);
  };

  const applyToAllBreakpoints = (targets: StylePropertyKey[]) => {
    const sectionOv = overrides[activeSection.key] ?? {};
    const sourceBp = sectionOv[activeBp] ?? {};
    const nextSection = { ...sectionOv };
    for (const bp of ['desktop', 'tablet', 'mobile'] as Breakpoint[]) {
      if (bp === activeBp) continue;
      const bpVals = { ...(nextSection[bp] ?? {}) };
      for (const t of targets) {
        const v = sourceBp[t];
        if (v == null || v === '') delete bpVals[t];
        else bpVals[t] = v;
      }
      if (Object.keys(bpVals).length === 0) delete nextSection[bp];
      else nextSection[bp] = bpVals;
    }
    setOverrides({ ...overrides, [activeSection.key]: nextSection });
  };

  const resetSlider = (targets: StylePropertyKey[]) => {
    for (const t of targets) updateOverride(activeSection.key, activeBp, t, undefined);
  };

  return (
    <div style={panelStyle(embedded)}>
      <style>{`
        .cp-section-delete-btn:not(:disabled):hover {
          background: #7f1d1d !important;
          border-color: #b91c1c !important;
          color: #fecaca !important;
        }
      `}</style>
      {/* ── Header strip (other agent owns this — DO NOT touch) ─────────── */}
      <div style={sectionHeaderStyle}>Section</div>
      <div style={{ padding: '8px 10px 0' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
          <select
            value={activeSection.key}
            onChange={(e) => setActiveKey(e.target.value)}
            style={{ ...selectStyle, flex: 1 }}
          >
            {pickerOptions.map((s) => {
              const hasOverrides = Boolean(
                overrides[s.key] &&
                  (overrides[s.key]?.desktop || overrides[s.key]?.tablet || overrides[s.key]?.mobile),
              );
              const hidden = sectionMeta.get(s.key)?.isHidden;
              return (
                <option key={s.key} value={s.key}>
                  {s.icon ? `${s.icon} ` : ''}
                  {s.label}
                  {s.isDuplicate ? ' ↗' : ''}
                  {hidden ? ' (hidden)' : ''}
                  {hasOverrides ? ' •' : ''}
                </option>
              );
            })}
          </select>
          {(() => {
            const meta = sectionMeta.get(activeSection.key);
            const hidden = meta?.isHidden ?? false;
            const disabled = !meta?.blockId;
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => meta?.blockId && toggleSectionHidden(meta.blockId)}
                title={hidden ? 'Show section on the public site' : 'Hide section on the public site'}
                style={{
                  ...hideBtnStyle,
                  background: hidden ? '#7c2d12' : '#0f172a',
                  color: hidden ? '#fdba74' : '#94a3b8',
                  borderColor: hidden ? '#9a3412' : '#1e293b',
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.4 : 1,
                }}
                aria-label={hidden ? 'Unhide section' : 'Hide section'}
              >
                {hidden ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            );
          })()}
        </div>
        {/* ── Section actions row (reorder / duplicate / delete) ──────── */}
        <div style={actionRowStyle}>
          <button
            type="button"
            disabled={!canMutate || isFirst}
            onClick={() => activeMeta?.blockId && moveSectionUp(activeMeta.blockId)}
            title={isFirst ? 'Already first' : 'Move section up'}
            aria-label="Move section up"
            style={{
              ...actionBtnStyle,
              opacity: !canMutate || isFirst ? 0.35 : 1,
              cursor: !canMutate || isFirst ? 'default' : 'pointer',
            }}
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            disabled={!canMutate || isLast}
            onClick={() => activeMeta?.blockId && moveSectionDown(activeMeta.blockId)}
            title={isLast ? 'Already last' : 'Move section down'}
            aria-label="Move section down"
            style={{
              ...actionBtnStyle,
              opacity: !canMutate || isLast ? 0.35 : 1,
              cursor: !canMutate || isLast ? 'default' : 'pointer',
            }}
          >
            <ArrowDownIcon />
          </button>
          <button
            type="button"
            disabled={!canMutate}
            onClick={() => activeMeta?.blockId && duplicateSectionDispatch(activeMeta.blockId)}
            title="Duplicate this section"
            aria-label="Duplicate section"
            style={{
              ...actionBtnStyle,
              opacity: canMutate ? 1 : 0.35,
              cursor: canMutate ? 'pointer' : 'default',
            }}
          >
            <DuplicateIcon />
          </button>
          <button
            type="button"
            disabled={!canMutate}
            onClick={handleDelete}
            title="Delete section (recoverable)"
            aria-label="Delete section"
            className="cp-section-delete-btn"
            style={{
              ...actionBtnStyle,
              opacity: canMutate ? 1 : 0.35,
              cursor: canMutate ? 'pointer' : 'default',
            }}
          >
            <TrashIcon />
          </button>
          <div style={{ flex: 1 }} />
          {activeOption.isDuplicate && (
            <span style={duplicateBadgeStyle} title="This is a duplicated section">
              copy
            </span>
          )}
        </div>

        {activeSection.className && (
          <div style={classHintStyle}>
            <code>.{activeSection.className}</code>
          </div>
        )}
        {sectionMeta.get(activeSection.key)?.isHidden && (
          <div style={hiddenNoticeStyle}>
            This section is hidden on the public site. It still renders here so you can edit it.
          </div>
        )}
      </div>

      {/* ── Breakpoint tabs ─────────────────────────────────────────────── */}
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

      {/* ── Body: presets + sliders ─────────────────────────────────────── */}
      <div style={{ padding: '0 10px 12px' }}>
        {/* Preset chips */}
        <div style={groupLabelStyle}>Presets</div>
        <div style={presetsRowStyle}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              style={presetBtnStyle}
              title={`Apply ${p.label} spacing to ${activeBp}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {undoBanner && (
          <div style={undoBannerStyle}>
            <span>Switched to {undoBanner.label}</span>
            <button type="button" onClick={undoPreset} style={undoBtnStyle}>
              undo
            </button>
          </div>
        )}

        {/* Spacing sliders */}
        <div style={groupStyle}>
          <div style={groupLabelStyle}>Spacing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SPACING_SLIDERS.filter((s) => !s.advanced).map((slider) => (
              <SliderRow
                key={slider.id}
                slider={slider}
                values={values}
                onWrite={(v) => writeTargets(slider.targets, v)}
                onReset={() => resetSlider(slider.targets)}
                onApplyToAll={() => applyToAllBreakpoints(slider.targets)}
              />
            ))}

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              style={advancedToggleStyle}
            >
              {showAdvanced ? '▾' : '▸'} Advanced
            </button>

            {showAdvanced &&
              SPACING_SLIDERS.filter((s) => s.advanced).map((slider) => (
                <SliderRow
                  key={slider.id}
                  slider={slider}
                  values={values}
                  onWrite={(v) => writeTargets(slider.targets, v)}
                  onReset={() => resetSlider(slider.targets)}
                  onApplyToAll={() => applyToAllBreakpoints(slider.targets)}
                />
              ))}
          </div>
        </div>

        {/* Size sliders */}
        <div style={groupStyle}>
          <div style={groupLabelStyle}>Size</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SIZE_SLIDERS.map((slider) => (
              <SliderRow
                key={slider.id}
                slider={slider}
                values={values}
                onWrite={(v) => writeTargets(slider.targets, v)}
                onReset={() => resetSlider(slider.targets)}
                onApplyToAll={() => applyToAllBreakpoints(slider.targets)}
              />
            ))}
          </div>
        </div>

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
          Sliders write px values. Use the ↺ button to clear a single slider; use{' '}
          <strong>Apply to all</strong> to copy the current value across desktop, tablet, mobile.
        </div>

        {/* ── Restore deleted sections disclosure ───────────────────────── */}
        {convertedDeletedSections.length > 0 && (
          <details style={restoreDetailsStyle}>
            <summary style={restoreSummaryStyle}>
              Restore deleted sections ({convertedDeletedSections.length})
            </summary>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {convertedDeletedSections.map((key) => {
                const inst = convertedSectionInstances[key];
                const templateKey = inst?.templateKey ?? key;
                const baseSpec = registry.sections.find((s) => s.key === templateKey);
                const label =
                  inst?.label ?? baseSpec?.label ?? key;
                return (
                  <div key={key} style={restoreRowStyle}>
                    <span style={{ flex: 1, color: '#cbd5e1', fontSize: 12 }}>
                      {baseSpec?.icon ? `${baseSpec.icon} ` : ''}
                      {label}
                      {inst ? ' ↗' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => restoreConvertedSection(key)}
                      style={restoreBtnStyle}
                      title="Restore this section"
                    >
                      Restore
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: '#64748b' }}>
              Tip: section data is preserved. Restoring puts it back at its original position.
              For full visual restore, save the page after restoring.
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// ─── SliderRow ───────────────────────────────────────────────────────────────

type SliderRowProps = {
  slider: SliderDef;
  values: Partial<Record<StylePropertyKey, string>>;
  onWrite: (value: string | undefined) => void;
  onReset: () => void;
  onApplyToAll: () => void;
};

function SliderRow({ slider, values, onWrite, onReset, onApplyToAll }: SliderRowProps) {
  const { min, max, step, unit, label, targets, defaultPlaceholder } = slider;
  const numericVal = readSliderValue(values, targets);
  const set = isSliderSet(values, targets);
  const sliderVal = numericVal !== null ? Math.min(Math.max(numericVal, min), max) : 0;
  const pct = ((sliderVal - min) / (max - min)) * 100;

  // rAF-throttled live preview during drag.
  const pendingValue = useRef<string | null>(null);
  const rafId = useRef<number | null>(null);
  const isDragging = useRef(false);

  const flushPending = () => {
    rafId.current = null;
    if (pendingValue.current !== null) {
      onWrite(pendingValue.current);
      pendingValue.current = null;
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    isDragging.current = true;
    pendingValue.current = `${(e.target as HTMLInputElement).value}${unit}`;
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(flushPending);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Final commit on release. Cancel any pending rAF so we don't double-write.
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    pendingValue.current = null;
    isDragging.current = false;
    onWrite(`${e.target.value}${unit}`);
  };

  return (
    <div style={rowWrapStyle}>
      <div style={rowTopStyle}>
        <span style={rowLabelStyle}>{label}</span>
        <span style={rowValueStyle}>
          {set && numericVal !== null ? `${numericVal}${unit}` : <span style={{ opacity: 0.5 }}>{defaultPlaceholder}</span>}
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={!set}
          title="Reset to default"
          style={{ ...iconBtnStyle, opacity: set ? 1 : 0.3, cursor: set ? 'pointer' : 'default' }}
          aria-label={`Reset ${label}`}
        >
          ↺
        </button>
        <button
          type="button"
          onClick={onApplyToAll}
          disabled={!set}
          title="Apply this value to desktop, tablet, and mobile"
          style={{ ...iconBtnStyle, opacity: set ? 1 : 0.3, cursor: set ? 'pointer' : 'default', fontSize: 10 }}
          aria-label={`Apply ${label} to all breakpoints`}
        >
          ⤢
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderVal}
          onInput={handleInput}
          onChange={handleChange}
          style={{ ...rangeStyle, '--pct': `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 4.24A10 10 0 0 1 12 4c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.06 3.94" />
      <path d="M6.6 6.6A17.4 17.4 0 0 0 2 11s3.5 7 10 7a10 10 0 0 0 4.4-1" />
      <path d="M9.5 9.5a3 3 0 0 0 4.24 4.24" />
      <path d="m2 2 20 20" />
    </svg>
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

const hideBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#94a3b8',
  padding: 0,
  transition: 'all .15s',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginTop: 8,
};

const actionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#94a3b8',
  padding: 0,
  transition: 'all .15s',
};

const duplicateBadgeStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  background: '#1e3a8a',
  color: '#bfdbfe',
  padding: '3px 6px',
  borderRadius: 999,
};

const restoreDetailsStyle: React.CSSProperties = {
  marginTop: 14,
  padding: '8px 10px',
  background: '#0a0a0a',
  border: '1px solid #1e293b',
  borderRadius: 4,
};

const restoreSummaryStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#cbd5e1',
  cursor: 'pointer',
  userSelect: 'none',
};

const restoreRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 0',
};

const restoreBtnStyle: React.CSSProperties = {
  background: '#064e3b',
  border: '1px solid #059669',
  borderRadius: 4,
  color: '#a7f3d0',
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

const hiddenNoticeStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '6px 8px',
  background: '#1c0f06',
  border: '1px solid #7c2d12',
  borderRadius: 4,
  color: '#fdba74',
  fontSize: 10,
  lineHeight: 1.5,
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
  marginTop: 14,
};

const presetsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 6,
};

const presetBtnStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 999,
  color: '#cbd5e1',
  padding: '7px 8px',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .15s',
};

const undoBannerStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '6px 10px',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 11,
  color: '#cbd5e1',
};

const undoBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#7c3aed',
  fontSize: 11,
  fontWeight: 700,
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
};

const advancedToggleStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#64748b',
  fontSize: 11,
  fontWeight: 600,
  textAlign: 'left',
  padding: '4px 0',
  cursor: 'pointer',
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
  fontSize: 11,
  color: '#94a3b8',
  fontWeight: 500,
  flex: 1,
  minWidth: 0,
};

const rowValueStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#e2e8f0',
  fontFamily: 'ui-monospace, monospace',
  minWidth: 50,
  textAlign: 'right',
};

const iconBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 4,
  color: '#94a3b8',
  fontSize: 12,
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
  transition: 'all .15s',
};

const rangeStyle: React.CSSProperties = {
  width: '100%',
  accentColor: '#7c3aed',
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
