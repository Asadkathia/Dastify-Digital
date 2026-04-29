'use client';

import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  BlockInstance,
  BlockStyles,
  BreakpointOverrides,
  ColumnInstance,
  ColumnWidth,
  ResponsiveMode,
  SaveStatus,
  SectionInstance,
  SelectionTarget,
  WidgetInstance,
  WidgetStyles,
} from './types';
import { createBlockInstance } from './block-registry';
import { createWidgetInstance } from './widget-registry';
import { setValueAtPath } from '@/lib/converted-pages/object-path';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getJsonFieldSet(data: Record<string, unknown>) {
  const fields = data.__jsonFields;
  return new Set(Array.isArray(fields) ? fields.filter((value): value is string => typeof value === 'string') : []);
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function updateNestedBlockData(data: Record<string, unknown>, field: string, value: unknown) {
  const next = structuredClone(data);
  const [root, ...rest] = field.split('.');

  if (!root || rest.length === 0) {
    next[field] = value;
    return next;
  }

  const jsonFields = getJsonFieldSet(next);
  if (jsonFields.has(root)) {
    const parsed = parseJsonValue(next[root]);
    const container =
      parsed && typeof parsed === 'object'
        ? structuredClone(parsed as Record<string, unknown>)
        : (/^\d+$/.test(rest[0] ?? '') ? [] : {});

    setValueAtPath(container as Record<string, unknown>, rest.join('.'), value);
    next[root] = JSON.stringify(container, null, 2);
    return next;
  }

  // Converted-page blocks store data as a flat record keyed by dotted paths
  // (e.g. "form.note", "info.contact.items"). For an exact flat-key match we
  // update in place — running setValueAtPath would create a parallel nested
  // `form` object that overwrites the sibling flat keys on the next rebuild.
  if (Object.prototype.hasOwnProperty.call(next, field)) {
    next[field] = value;
    return next;
  }

  // For deeper paths into a flat-storage block (e.g. inline-editing
  // "info.contact.items.0.value" when the flat key is "info.contact.items"
  // holding the full array), walk up the dotted path to find the longest
  // existing flat-key prefix and mutate inside its value, then write back
  // under that same flat key. Without this, setValueAtPath would create a
  // sibling nested object at "info"; on save, sectionsToConvertedPageContent
  // iterates Object.entries and writes that nested "info" last, wiping
  // every other flat key under the same root (so editing one contact item
  // would silently delete the others).
  const isFlatStorage =
    '__sectionKey' in next || Object.keys(next).some((key) => key.includes('.'));
  if (isFlatStorage) {
    const parts = field.split('.');
    for (let i = parts.length - 1; i >= 1; i -= 1) {
      const prefix = parts.slice(0, i).join('.');
      if (!Object.prototype.hasOwnProperty.call(next, prefix)) continue;
      const tail = parts.slice(i).join('.');
      const existing = next[prefix];
      const container =
        existing && typeof existing === 'object'
          ? structuredClone(existing as Record<string, unknown>)
          : (/^\d+$/.test(parts[i] ?? '') ? [] : {});
      setValueAtPath(container as Record<string, unknown>, tail, value);
      next[prefix] = container;
      return next;
    }
    next[field] = value;
    return next;
  }

  setValueAtPath(next, field, value);
  return next;
}

function makeSingleColSection(overrides?: Partial<SectionInstance>): SectionInstance {
  return {
    id: uid('section'),
    columns: [{ id: uid('col'), width: '1/1', blocks: [] }],
    ...overrides,
  };
}

// ─── State shape ──────────────────────────────────────────────────────────────

type SectionOverrideBreakpoint = 'desktop' | 'tablet' | 'mobile';

type SectionOverrideValues = {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  minHeight?: string;
  gap?: string;
};

export type SectionStyleOverrides = Record<
  string,
  Partial<Record<SectionOverrideBreakpoint, SectionOverrideValues>>
>;

/** Synthetic instance metadata for duplicated converted-page sections. */
export type ConvertedSectionInstancesMap = Record<
  string,
  { templateKey: string; label?: string }
>;

type EditorState = {
  pageId: string | null;
  editorMode: 'pages' | 'homepage' | 'converted';
  convertedPageName: string | null;
  sections: SectionInstance[];
  /** Final ordered list of section keys for the converted page. Mirrors the
   *  visual order of `sections` for `cp-*` blocks. Persisted as
   *  `__sectionOrder` on convertedContent. Empty for non-converted modes. */
  convertedSectionOrder: string[];
  /** Synthetic instance map for duplicate sections. Persisted as
   *  `__sectionInstances`. Keys are synthetic section keys (e.g. `services-2`),
   *  values point at the original registry section the duplicate was cloned from. */
  convertedSectionInstances: ConvertedSectionInstancesMap;
  /** Soft-deleted section keys. Their data stays on convertedContent so a
   *  marketing user can restore them; they're just filtered out of the
   *  active editor / public renderer. Persisted as `__deletedSections`. */
  convertedDeletedSections: string[];
  /** Cached registry order snapshot used when restoring a deleted section to
   *  its original position. Set on load; not persisted. */
  convertedRegistryOrder: string[];
  /** Per-section, per-breakpoint spacing/size overrides for converted pages. */
  sectionStyleOverrides: SectionStyleOverrides;
  /** Currently active section key in the Sections panel. */
  activeSectionKey: string | null;
  /** Breakpoint currently selected in the Sections panel. */
  activeSectionBreakpoint: SectionOverrideBreakpoint;
  selection: SelectionTarget;
  saveStatus: SaveStatus;
  responsiveMode: ResponsiveMode;
  iframeReady: boolean;
  isLoading: boolean;
  clipboard: BlockInstance | null;
  selectedNode:
    | {
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
      }
    | null;

  // ── Page-level ────────────────────────────────────────────────────────────
  setPageId: (id: string) => void;
  setEditorMode: (mode: 'pages' | 'homepage' | 'converted') => void;
  setConvertedPageName: (name: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSections: (sections: SectionInstance[]) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setResponsiveMode: (mode: ResponsiveMode) => void;
  setIframeReady: (ready: boolean) => void;
  setSelectedNode: (node: EditorState['selectedNode']) => void;

  // ── Converted-page section meta (order / duplicate / soft-delete) ────────
  setConvertedSectionMeta: (meta: {
    order: string[];
    instances: ConvertedSectionInstancesMap;
    deleted: string[];
    registryOrder: string[];
  }) => void;
  /** Move a converted-page section block up one slot. No-op if first or not found. */
  moveConvertedSectionUp: (blockId: string) => void;
  /** Move a converted-page section block down one slot. No-op if last or not found. */
  moveConvertedSectionDown: (blockId: string) => void;
  /** Clone a converted-page section. Inserts the duplicate immediately below
   *  the original; new instance key is `<templateKey>-<n>` (next available). */
  duplicateConvertedSection: (blockId: string) => void;
  /** Soft-delete a converted-page section: drop it from `sections` and append
   *  its key to `convertedDeletedSections`. Restoration is reversible because
   *  the section's data still lives in `convertedContent`. */
  deleteConvertedSection: (blockId: string) => void;
  /** Restore a previously soft-deleted converted-page section. Re-inserts it
   *  at its original registry position (or at the end for instance keys). */
  restoreConvertedSection: (sectionKey: string) => void;
  /** Mode-aware dispatcher: in converted mode, call the converted variant; in
   *  pages/homepage modes, fall through to the existing block-tree action. */
  moveSectionUpDispatch: (blockOrSectionId: string) => void;
  moveSectionDownDispatch: (blockOrSectionId: string) => void;
  duplicateSectionDispatch: (blockOrSectionId: string) => void;
  deleteSectionDispatch: (blockOrSectionId: string) => void;
  /** Mode-aware drag-reorder: routes to native moveSection (pages/homepage) or
   *  to a converted variant that updates `convertedSectionOrder`. The id is the
   *  section id (for native) or any section id (for converted — we resolve the
   *  underlying cp-* block from the section). `newIndex` is the destination
   *  index in the current section list. */
  moveSectionToIndexDispatch: (sectionId: string, newIndex: number) => void;

  // ── Section style overrides (converted pages) ────────────────────────────
  setSectionStyleOverrides: (overrides: SectionStyleOverrides) => void;
  updateSectionStyleOverride: (
    sectionKey: string,
    breakpoint: SectionOverrideBreakpoint,
    property: keyof SectionOverrideValues,
    value: string | undefined,
  ) => void;
  clearSectionStyleBreakpoint: (sectionKey: string, breakpoint: SectionOverrideBreakpoint) => void;
  setActiveSectionKey: (key: string | null) => void;
  setActiveSectionBreakpoint: (bp: SectionOverrideBreakpoint) => void;

  // ── Selection ─────────────────────────────────────────────────────────────
  selectBlock: (sectionId: string, columnId: string, blockId: string) => void;
  selectSection: (sectionId: string) => void;
  clearSelection: () => void;

  // ── Section actions ───────────────────────────────────────────────────────
  addSection: (atIndex?: number) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  updateSectionStyles: (sectionId: string, styles: Partial<BlockStyles>) => void;
  updateSectionLabel: (sectionId: string, label: string) => void;
  addColumnToSection: (sectionId: string) => void;
  removeColumnFromSection: (sectionId: string, columnId: string) => void;
  updateColumnWidth: (sectionId: string, columnId: string, width: ColumnWidth) => void;
  moveColumn: (sectionId: string, fromIndex: number, toIndex: number) => void;

  // ── Block actions ─────────────────────────────────────────────────────────
  addBlock: (blockType: string, sectionId: string, columnId: string, atIndex?: number) => void;
  removeBlock: (sectionId: string, columnId: string, blockId: string) => void;
  moveBlockWithinColumn: (sectionId: string, columnId: string, fromIndex: number, toIndex: number) => void;
  moveBlockBetweenColumns: (
    fromSectionId: string, fromColumnId: string, fromIndex: number,
    toSectionId: string, toColumnId: string, toIndex: number,
  ) => void;
  duplicateBlock: (sectionId: string, columnId: string, blockId: string) => void;
  copyBlock: (sectionId: string, columnId: string, blockId: string) => void;
  pasteBlock: (sectionId: string, columnId: string) => void;
  updateBlockData: (blockId: string, field: string, value: unknown) => void;
  updateBlockStyles: (blockId: string, styles: Partial<BlockStyles>) => void;
  toggleBlockLocked: (blockId: string) => void;
  toggleBlockHidden: (blockId: string) => void;
  /** Converted-page parity for `toggleBlockHidden`: flips the `__sectionHidden`
   *  meta flag on the synthetic block's flat data. The adapter promotes it to
   *  `__hidden` on the persisted section on save. */
  toggleSectionHidden: (blockId: string) => void;
  updateArrayItem: (blockId: string, arrayField: string, index: number, subField: string, value: unknown) => void;
  addArrayItem: (blockId: string, arrayField: string, newItem: Record<string, unknown>) => void;
  removeArrayItem: (blockId: string, arrayField: string, index: number) => void;
  moveArrayItem: (blockId: string, arrayField: string, fromIndex: number, toIndex: number) => void;

  // ── Widget actions ────────────────────────────────────────────────────────
  selectWidget: (sectionId: string, columnId: string, blockId: string, widgetId: string) => void;
  addWidget: (blockId: string, widgetType: string, atIndex?: number, parentWidgetId?: string) => void;
  removeWidget: (blockId: string, widgetId: string, parentWidgetId?: string) => void;
  duplicateWidget: (blockId: string, widgetId: string) => void;
  toggleWidgetHidden: (blockId: string, widgetId: string) => void;
  updateWidgetData: (blockId: string, widgetId: string, field: string, value: unknown) => void;
  updateWidgetStyles: (blockId: string, widgetId: string, styles: Partial<WidgetStyles>) => void;
  clearWidgetStyle: (blockId: string, widgetId: string, key: keyof WidgetStyles) => void;
  moveWidgetWithinBlock: (blockId: string, fromIndex: number, toIndex: number, parentWidgetId?: string) => void;
  moveWidgetBetweenBlocks: (sourceBlockId: string, widgetId: string, targetBlockId: string, targetWidgetId: string | null, position: 'before' | 'after') => void;
  setBlockWidgets: (blockId: string, widgets: WidgetInstance[]) => void;
};

// ─── Widget helpers ───────────────────────────────────────────────────────────

function mapWidget(
  widgets: WidgetInstance[],
  widgetId: string,
  fn: (w: WidgetInstance) => WidgetInstance,
): WidgetInstance[] {
  return widgets.map((w) => {
    if (w.id === widgetId) return fn(w);
    if (w.children && w.children.length > 0) {
      return { ...w, children: mapWidget(w.children, widgetId, fn) };
    }
    return w;
  });
}

function removeWidgetById(widgets: WidgetInstance[], widgetId: string): WidgetInstance[] {
  return widgets
    .filter((w) => w.id !== widgetId)
    .map((w) =>
      w.children && w.children.length > 0
        ? { ...w, children: removeWidgetById(w.children, widgetId) }
        : w,
    );
}

function cloneWidget(w: WidgetInstance): WidgetInstance {
  const newId = `widget-${w.widgetType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    ...structuredClone(w),
    id: newId,
    children: w.children ? w.children.map(cloneWidget) : undefined,
  };
}

function insertAfterWidget(widgets: WidgetInstance[], widgetId: string, clone: WidgetInstance): WidgetInstance[] {
  const idx = widgets.findIndex((w) => w.id === widgetId);
  if (idx !== -1) {
    const next = [...widgets];
    next.splice(idx + 1, 0, clone);
    return next;
  }
  return widgets.map((w) =>
    w.children && w.children.length > 0
      ? { ...w, children: insertAfterWidget(w.children, widgetId, clone) }
      : w,
  );
}

// ─── Immutable block-level helpers ───────────────────────────────────────────
// These operate on a sections array and return a new one.

function mapBlock(
  sections: SectionInstance[],
  blockId: string,
  fn: (block: BlockInstance) => BlockInstance,
): SectionInstance[] {
  return sections.map((sec) => ({
    ...sec,
    columns: sec.columns.map((col) => ({
      ...col,
      blocks: col.blocks.map((b) => (b.id === blockId ? fn(b) : b)),
    })),
  }));
}

function findBlock(
  sections: SectionInstance[],
  blockId: string,
): { block: BlockInstance; sectionId: string; columnId: string } | null {
  for (const sec of sections) {
    for (const col of sec.columns) {
      const block = col.blocks.find((b) => b.id === blockId);
      if (block) return { block, sectionId: sec.id, columnId: col.id };
    }
  }
  return null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      pageId: null,
      editorMode: 'pages',
      convertedPageName: null,
      sections: [],
      convertedSectionOrder: [],
      convertedSectionInstances: {},
      convertedDeletedSections: [],
      convertedRegistryOrder: [],
      sectionStyleOverrides: {},
      activeSectionKey: null,
      activeSectionBreakpoint: 'desktop',
      selection: null,
      saveStatus: 'saved',
      responsiveMode: 'desktop',
      iframeReady: false,
      isLoading: false,
      clipboard: null,
      selectedNode: null,

      // ── Page-level ──────────────────────────────────────────────────────
      setPageId: (id) => set({ pageId: id }),
      setEditorMode: (editorMode) => set({ editorMode }),
      setConvertedPageName: (convertedPageName) => set({ convertedPageName }),
      setLoading: (isLoading) => set({ isLoading }),
      setSections: (sections) => set({ sections, saveStatus: 'saved' }),
      setSaveStatus: (saveStatus) => set({ saveStatus }),
      setResponsiveMode: (responsiveMode) => set({ responsiveMode }),
      setIframeReady: (iframeReady) => set({ iframeReady }),
      setSelectedNode: (selectedNode) => set({ selectedNode }),

      // ── Section style overrides ─────────────────────────────────────────
      setSectionStyleOverrides: (sectionStyleOverrides) => set({ sectionStyleOverrides }),
      updateSectionStyleOverride: (sectionKey, breakpoint, property, value) =>
        set((state) => {
          const prevForSection = state.sectionStyleOverrides[sectionKey] ?? {};
          const prevForBp = prevForSection[breakpoint] ?? {};
          const nextForBp: SectionOverrideValues = { ...prevForBp };
          if (value == null || value === '') delete nextForBp[property];
          else nextForBp[property] = value;

          const nextForSection = { ...prevForSection };
          if (Object.keys(nextForBp).length === 0) delete nextForSection[breakpoint];
          else nextForSection[breakpoint] = nextForBp;

          const next = { ...state.sectionStyleOverrides };
          if (Object.keys(nextForSection).length === 0) delete next[sectionKey];
          else next[sectionKey] = nextForSection;

          return { sectionStyleOverrides: next, saveStatus: 'dirty' };
        }),
      clearSectionStyleBreakpoint: (sectionKey, breakpoint) =>
        set((state) => {
          const prev = state.sectionStyleOverrides[sectionKey];
          if (!prev || !prev[breakpoint]) return {};
          const nextForSection = { ...prev };
          delete nextForSection[breakpoint];
          const next = { ...state.sectionStyleOverrides };
          if (Object.keys(nextForSection).length === 0) delete next[sectionKey];
          else next[sectionKey] = nextForSection;
          return { sectionStyleOverrides: next, saveStatus: 'dirty' };
        }),
      setActiveSectionKey: (activeSectionKey) => set({ activeSectionKey }),
      setActiveSectionBreakpoint: (activeSectionBreakpoint) => set({ activeSectionBreakpoint }),

      // ── Converted-page section meta (Option 2) ──────────────────────────
      setConvertedSectionMeta: ({ order, instances, deleted, registryOrder }) =>
        set({
          convertedSectionOrder: order,
          convertedSectionInstances: instances,
          convertedDeletedSections: deleted,
          convertedRegistryOrder: registryOrder,
        }),

      moveConvertedSectionUp: (blockId) =>
        set((state) => {
          // Find the section index that contains this block. For converted
          // pages each section holds exactly one cp-* block. Also accept a
          // section id directly so callers don't have to drill into columns.
          const idx = state.sections.findIndex((s) =>
            s.id === blockId || s.columns.some((c) => c.blocks.some((b) => b.id === blockId)),
          );
          if (idx <= 0) return state;
          const sections = [...state.sections];
          [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
          const order = sections
            .map((s) => {
              const block = s.columns[0]?.blocks[0];
              return block ? String(block.data.__sectionKey ?? '') : '';
            })
            .filter(Boolean);
          return { sections, convertedSectionOrder: order, saveStatus: 'dirty' };
        }),

      moveConvertedSectionDown: (blockId) =>
        set((state) => {
          const idx = state.sections.findIndex((s) =>
            s.id === blockId || s.columns.some((c) => c.blocks.some((b) => b.id === blockId)),
          );
          if (idx === -1 || idx >= state.sections.length - 1) return state;
          const sections = [...state.sections];
          [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
          const order = sections
            .map((s) => {
              const block = s.columns[0]?.blocks[0];
              return block ? String(block.data.__sectionKey ?? '') : '';
            })
            .filter(Boolean);
          return { sections, convertedSectionOrder: order, saveStatus: 'dirty' };
        }),

      duplicateConvertedSection: (blockId) =>
        set((state) => {
          const idx = state.sections.findIndex((s) =>
            s.id === blockId || s.columns.some((c) => c.blocks.some((b) => b.id === blockId)),
          );
          if (idx === -1) return state;
          const source = state.sections[idx];
          const block = source.columns[0]?.blocks[0];
          if (!block) return state;
          const sourceKey = String(block.data.__sectionKey ?? '');
          if (!sourceKey) return state;

          // Resolve template: if the source is itself a duplicate, the new
          // duplicate clones from the same template; otherwise the template
          // is the source's own key.
          const sourceTemplate =
            (block.data.__templateKey as string | undefined) ?? sourceKey;
          const sourceLabel =
            typeof block.data.__sectionLabel === 'string'
              ? (block.data.__sectionLabel as string)
              : sourceTemplate;

          // Find next available instance key. We scan both existing instance
          // keys and current sections so the suffix never collides.
          const existingKeys = new Set<string>([
            ...Object.keys(state.convertedSectionInstances),
            ...state.sections.flatMap((s) =>
              s.columns.flatMap((c) =>
                c.blocks.map((b) => String(b.data.__sectionKey ?? '')),
              ),
            ),
          ]);
          let n = 2;
          while (existingKeys.has(`${sourceTemplate}-${n}`)) n += 1;
          const newKey = `${sourceTemplate}-${n}`;

          const clonedData = structuredClone(block.data) as Record<string, unknown>;
          clonedData.__sectionKey = newKey;
          clonedData.__templateKey = sourceTemplate;
          delete clonedData.__sectionHidden;

          const duplicate: SectionInstance = {
            id: `cp-section-${newKey}`,
            label: `${source.label ?? sourceLabel} (copy)`,
            columns: [
              {
                id: `cp-col-${newKey}`,
                width: '1/1',
                blocks: [
                  {
                    id: `cp-block-${newKey}`,
                    blockType: block.blockType, // same blockType → same field config
                    data: clonedData,
                  },
                ],
              },
            ],
          };

          const sections = [...state.sections];
          sections.splice(idx + 1, 0, duplicate);
          const order = sections
            .map((s) => {
              const b = s.columns[0]?.blocks[0];
              return b ? String(b.data.__sectionKey ?? '') : '';
            })
            .filter(Boolean);

          const instances: ConvertedSectionInstancesMap = {
            ...state.convertedSectionInstances,
            [newKey]: {
              templateKey: sourceTemplate,
              label: `${sourceLabel} (copy)`,
            },
          };

          return {
            sections,
            convertedSectionOrder: order,
            convertedSectionInstances: instances,
            saveStatus: 'dirty',
          };
        }),

      deleteConvertedSection: (blockId) =>
        set((state) => {
          const idx = state.sections.findIndex((s) =>
            s.id === blockId || s.columns.some((c) => c.blocks.some((b) => b.id === blockId)),
          );
          if (idx === -1) return state;
          const block = state.sections[idx].columns[0]?.blocks[0];
          if (!block) return state;
          const sectionKey = String(block.data.__sectionKey ?? '');
          if (!sectionKey) return state;

          const sections = state.sections.filter((_, i) => i !== idx);
          const order = sections
            .map((s) => {
              const b = s.columns[0]?.blocks[0];
              return b ? String(b.data.__sectionKey ?? '') : '';
            })
            .filter(Boolean);
          const deleted = state.convertedDeletedSections.includes(sectionKey)
            ? state.convertedDeletedSections
            : [...state.convertedDeletedSections, sectionKey];

          // Clear active section pointer if it referenced the deleted key.
          const nextActive =
            state.activeSectionKey === sectionKey ? null : state.activeSectionKey;

          return {
            sections,
            convertedSectionOrder: order,
            convertedDeletedSections: deleted,
            activeSectionKey: nextActive,
            selection: null,
            saveStatus: 'dirty',
          };
        }),

      restoreConvertedSection: (sectionKey) =>
        set((state) => {
          if (!state.convertedDeletedSections.includes(sectionKey)) return state;
          const deleted = state.convertedDeletedSections.filter((k) => k !== sectionKey);

          // Compute an insertion index honouring the original registry order
          // for native keys; instance keys go to the end of the array.
          const registryIndex = state.convertedRegistryOrder.indexOf(sectionKey);
          let insertAt = state.sections.length;
          if (registryIndex !== -1) {
            // Walk current sections; place the restored section just before
            // the first section whose registry-rank is greater.
            for (let i = 0; i < state.sections.length; i += 1) {
              const otherKey = String(
                state.sections[i].columns[0]?.blocks[0]?.data.__sectionKey ?? '',
              );
              const otherRank = state.convertedRegistryOrder.indexOf(otherKey);
              if (otherRank === -1) continue; // ignore instance keys for ranking
              if (otherRank > registryIndex) {
                insertAt = i;
                break;
              }
            }
          }

          // The restored section's flat data isn't in the editor right now —
          // we trigger a reload by appending the key to the order. The next
          // load (post-save) will rebuild the flat block from convertedContent.
          // For an immediate visual restore we'd need the convertedBaseContent;
          // until then surface a save-required state.
          const order = [...state.convertedSectionOrder];
          if (!order.includes(sectionKey)) {
            // Insert into order at the same logical position.
            const before = order.slice(0, insertAt);
            const after = order.slice(insertAt);
            order.splice(0, order.length, ...before, sectionKey, ...after);
          }
          return {
            convertedDeletedSections: deleted,
            convertedSectionOrder: order,
            saveStatus: 'dirty',
          };
        }),

      moveSectionUpDispatch: (id) => {
        const state = get();
        if (state.editorMode === 'converted' || (state.editorMode === 'pages' && state.convertedPageName)) {
          state.moveConvertedSectionUp(id);
          return;
        }
        const idx = state.sections.findIndex((s) => s.id === id);
        if (idx > 0) state.moveSection(idx, idx - 1);
      },
      moveSectionDownDispatch: (id) => {
        const state = get();
        if (state.editorMode === 'converted' || (state.editorMode === 'pages' && state.convertedPageName)) {
          state.moveConvertedSectionDown(id);
          return;
        }
        const idx = state.sections.findIndex((s) => s.id === id);
        if (idx !== -1 && idx < state.sections.length - 1) state.moveSection(idx, idx + 1);
      },
      duplicateSectionDispatch: (id) => {
        const state = get();
        if (state.editorMode === 'converted' || (state.editorMode === 'pages' && state.convertedPageName)) {
          state.duplicateConvertedSection(id);
          return;
        }
        state.duplicateSection(id);
      },
      deleteSectionDispatch: (id) => {
        const state = get();
        if (state.editorMode === 'converted' || (state.editorMode === 'pages' && state.convertedPageName)) {
          state.deleteConvertedSection(id);
          return;
        }
        state.removeSection(id);
      },

      moveSectionToIndexDispatch: (sectionId, newIndex) =>
        set((state) => {
          const fromIndex = state.sections.findIndex((s) => s.id === sectionId);
          if (fromIndex === -1) return state;
          const clamped = Math.max(0, Math.min(newIndex, state.sections.length - 1));
          if (clamped === fromIndex) return state;
          const sections = [...state.sections];
          const [moved] = sections.splice(fromIndex, 1);
          sections.splice(clamped, 0, moved);
          const isConverted =
            state.editorMode === 'converted' ||
            (state.editorMode === 'pages' && Boolean(state.convertedPageName));
          if (!isConverted) {
            return { sections, saveStatus: 'dirty' };
          }
          // Recompute convertedSectionOrder from the new section ordering.
          const order = sections
            .map((s) => {
              const block = s.columns[0]?.blocks[0];
              return block ? String(block.data.__sectionKey ?? '') : '';
            })
            .filter(Boolean);
          return { sections, convertedSectionOrder: order, saveStatus: 'dirty' };
        }),

      // ── Selection ────────────────────────────────────────────────────────
      selectBlock: (sectionId, columnId, blockId) =>
        set({ selection: { kind: 'block', sectionId, columnId, blockId } }),
      selectSection: (sectionId) =>
        set({ selection: { kind: 'section', sectionId } }),
      clearSelection: () => set({ selection: null, selectedNode: null }),

      // ── Section actions ──────────────────────────────────────────────────
      addSection: (atIndex) =>
        set((state) => {
          const section = makeSingleColSection();
          const sections = [...state.sections];
          const insertAt = atIndex !== undefined ? atIndex : sections.length;
          sections.splice(insertAt, 0, section);
          return { sections, selection: { kind: 'section', sectionId: section.id }, saveStatus: 'dirty' };
        }),

      removeSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.filter((s) => s.id !== sectionId),
          selection:
            state.selection?.kind === 'section' && state.selection.sectionId === sectionId
              ? null
              : state.selection?.kind === 'block' && state.selection.sectionId === sectionId
              ? null
              : state.selection,
          saveStatus: 'dirty',
        })),

      moveSection: (fromIndex, toIndex) =>
        set((state) => {
          const sections = [...state.sections];
          const [moved] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, moved);
          return { sections, saveStatus: 'dirty' };
        }),

      duplicateSection: (sectionId) =>
        set((state) => {
          const index = state.sections.findIndex((s) => s.id === sectionId);
          if (index === -1) return state;
          const source = structuredClone(state.sections[index]);
          const duplicate: SectionInstance = {
            ...source,
            id: uid('section'),
            columns: source.columns.map((col) => ({
              ...col,
              id: uid('col'),
              blocks: col.blocks.map((b) => ({ ...b, id: uid(b.blockType) })),
            })),
          };
          const sections = [...state.sections];
          sections.splice(index + 1, 0, duplicate);
          return { sections, selection: { kind: 'section', sectionId: duplicate.id }, saveStatus: 'dirty' };
        }),

      updateSectionStyles: (sectionId, styles) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId ? { ...s, styles: { ...s.styles, ...styles } } : s,
          ),
          saveStatus: 'dirty',
        })),

      updateSectionLabel: (sectionId, label) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId ? { ...s, label } : s,
          ),
          saveStatus: 'dirty',
        })),

      addColumnToSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId
              ? { ...s, columns: [...s.columns, { id: uid('col'), width: '1/2' as ColumnWidth, blocks: [] }] }
              : s,
          ),
          saveStatus: 'dirty',
        })),

      removeColumnFromSection: (sectionId, columnId) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId
              ? { ...s, columns: s.columns.filter((c) => c.id !== columnId) }
              : s,
          ),
          selection:
            state.selection?.kind === 'block' && state.selection.columnId === columnId
              ? null
              : state.selection,
          saveStatus: 'dirty',
        })),

      updateColumnWidth: (sectionId, columnId, width) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId
              ? { ...s, columns: s.columns.map((c) => (c.id === columnId ? { ...c, width } : c)) }
              : s,
          ),
          saveStatus: 'dirty',
        })),

      moveColumn: (sectionId, fromIndex, toIndex) =>
        set((state) => ({
          sections: state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const columns = [...s.columns];
            const [moved] = columns.splice(fromIndex, 1);
            columns.splice(toIndex, 0, moved);
            return { ...s, columns };
          }),
          saveStatus: 'dirty',
        })),

      // ── Block actions ────────────────────────────────────────────────────
      addBlock: (blockType, sectionId, columnId, atIndex) =>
        set((state) => {
          const instance = createBlockInstance(blockType);
          if (!instance) return state;
          const sections = state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== columnId) return c;
                const blocks = [...c.blocks];
                const insertAt = atIndex !== undefined ? atIndex : blocks.length;
                blocks.splice(insertAt, 0, instance);
                return { ...c, blocks };
              }),
            };
          });
          return {
            sections,
            selection: { kind: 'block', sectionId, columnId, blockId: instance.id },
            saveStatus: 'dirty',
          };
        }),

      removeBlock: (sectionId, columnId, blockId) =>
        set((state) => ({
          sections: state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== columnId) return c;
                return { ...c, blocks: c.blocks.filter((b) => b.id !== blockId) };
              }),
            };
          }),
          selection:
            state.selection?.kind === 'block' && state.selection.blockId === blockId
              ? null
              : state.selection,
          saveStatus: 'dirty',
        })),

      moveBlockWithinColumn: (sectionId, columnId, fromIndex, toIndex) =>
        set((state) => ({
          sections: state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== columnId) return c;
                const blocks = [...c.blocks];
                const [moved] = blocks.splice(fromIndex, 1);
                blocks.splice(toIndex, 0, moved);
                return { ...c, blocks };
              }),
            };
          }),
          saveStatus: 'dirty',
        })),

      moveBlockBetweenColumns: (fromSectionId, fromColumnId, fromIndex, toSectionId, toColumnId, toIndex) =>
        set((state) => {
          let movedBlock: BlockInstance | null = null;
          // Remove from source
          let sections = state.sections.map((s) => {
            if (s.id !== fromSectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== fromColumnId) return c;
                const blocks = [...c.blocks];
                [movedBlock] = blocks.splice(fromIndex, 1);
                return { ...c, blocks };
              }),
            };
          });
          if (!movedBlock) return state;
          const block = movedBlock as BlockInstance;
          // Insert into target
          sections = sections.map((s) => {
            if (s.id !== toSectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== toColumnId) return c;
                const blocks = [...c.blocks];
                blocks.splice(toIndex, 0, block);
                return { ...c, blocks };
              }),
            };
          });
          return {
            sections,
            selection: { kind: 'block', sectionId: toSectionId, columnId: toColumnId, blockId: block.id },
            saveStatus: 'dirty',
          };
        }),

      duplicateBlock: (sectionId, columnId, blockId) =>
        set((state) => {
          const sections = state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== columnId) return c;
                const index = c.blocks.findIndex((b) => b.id === blockId);
                if (index === -1) return c;
                const source = c.blocks[index];
                const duplicate: BlockInstance = {
                  id: uid(source.blockType),
                  blockType: source.blockType,
                  data: structuredClone(source.data),
                  styles: source.styles ? structuredClone(source.styles) : undefined,
                };
                const blocks = [...c.blocks];
                blocks.splice(index + 1, 0, duplicate);
                return { ...c, blocks };
              }),
            };
          });
          // Find the new duplicate's id by re-scanning (simplest approach)
          let newId: string | null = null;
          for (const s of sections) {
            if (s.id !== sectionId) continue;
            for (const c of s.columns) {
              if (c.id !== columnId) continue;
              const idx = c.blocks.findIndex((b) => b.id === blockId);
              if (idx !== -1 && c.blocks[idx + 1]) newId = c.blocks[idx + 1].id;
            }
          }
          return {
            sections,
            selection: newId ? { kind: 'block', sectionId, columnId, blockId: newId } : state.selection,
            saveStatus: 'dirty',
          };
        }),

      copyBlock: (sectionId, columnId, blockId) =>
        set((state) => {
          const result = findBlock(state.sections, blockId);
          if (!result) return state;
          return { clipboard: structuredClone(result.block) };
        }),

      pasteBlock: (sectionId, columnId) =>
        set((state) => {
          if (!state.clipboard) return state;
          const pasted: BlockInstance = {
            ...structuredClone(state.clipboard),
            id: uid(state.clipboard.blockType),
          };
          const sections = state.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((c) => {
                if (c.id !== columnId) return c;
                // Insert after selected block if it's in this column, else append
                const selBlockId =
                  state.selection?.kind === 'block' && state.selection.columnId === columnId
                    ? state.selection.blockId
                    : null;
                const idx = selBlockId ? c.blocks.findIndex((b) => b.id === selBlockId) : -1;
                const insertAt = idx !== -1 ? idx + 1 : c.blocks.length;
                const blocks = [...c.blocks];
                blocks.splice(insertAt, 0, pasted);
                return { ...c, blocks };
              }),
            };
          });
          return {
            sections,
            selection: { kind: 'block', sectionId, columnId, blockId: pasted.id },
            saveStatus: 'dirty',
          };
        }),

      updateBlockData: (blockId, field, value) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            data: !field.includes('.')
              ? { ...b.data, [field]: value }
              : updateNestedBlockData(b.data, field, value),
          })),
          saveStatus: 'dirty',
        })),

      updateBlockStyles: (blockId, styles) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            styles: { ...b.styles, ...styles },
          })),
          saveStatus: 'dirty',
        })),

      toggleBlockLocked: (blockId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            isLocked: !b.isLocked,
          })),
          saveStatus: 'dirty',
        })),

      toggleBlockHidden: (blockId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            isHidden: !b.isHidden,
          })),
          saveStatus: 'dirty',
        })),

      toggleSectionHidden: (blockId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            data: { ...b.data, __sectionHidden: !b.data.__sectionHidden },
          })),
          saveStatus: 'dirty',
        })),

      updateArrayItem: (blockId, arrayField, index, subField, value) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            const arr = Array.isArray(b.data[arrayField])
              ? [...(b.data[arrayField] as Record<string, unknown>[])]
              : [];
            arr[index] = { ...arr[index], [subField]: value };
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      addArrayItem: (blockId, arrayField, newItem) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            const arr = Array.isArray(b.data[arrayField])
              ? [...(b.data[arrayField] as Record<string, unknown>[])]
              : [];
            return { ...b, data: { ...b.data, [arrayField]: [...arr, newItem] } };
          }),
          saveStatus: 'dirty',
        })),

      removeArrayItem: (blockId, arrayField, index) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            const arr = Array.isArray(b.data[arrayField])
              ? [...(b.data[arrayField] as Record<string, unknown>[])]
              : [];
            arr.splice(index, 1);
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      moveArrayItem: (blockId, arrayField, fromIndex, toIndex) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            const arr = Array.isArray(b.data[arrayField])
              ? [...(b.data[arrayField] as Record<string, unknown>[])]
              : [];
            const [item] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, item);
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      // ── Widget actions ──────────────────────────────────────────────────────
      selectWidget: (sectionId, columnId, blockId, widgetId) =>
        set({ selection: { kind: 'widget', sectionId, columnId, blockId, widgetId } }),

      addWidget: (blockId, widgetType, atIndex, parentWidgetId) =>
        set((state) => {
          const instance = createWidgetInstance(widgetType);
          if (!instance) return state;
          const sections = mapBlock(state.sections, blockId, (b) => {
            if (parentWidgetId) {
              // Add into a container widget's children
              const newWidgets = mapWidget(b.widgets ?? [], parentWidgetId, (parent) => {
                const children = [...(parent.children ?? [])];
                const insertAt = atIndex !== undefined ? atIndex : children.length;
                children.splice(insertAt, 0, instance);
                return { ...parent, children };
              });
              return { ...b, widgets: newWidgets };
            }
            const widgets = [...(b.widgets ?? [])];
            const insertAt = atIndex !== undefined ? atIndex : widgets.length;
            widgets.splice(insertAt, 0, instance);
            return { ...b, widgets };
          });
          return { sections, saveStatus: 'dirty' };
        }),

      removeWidget: (blockId, widgetId, _parentWidgetId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            widgets: removeWidgetById(b.widgets ?? [], widgetId),
          })),
          selection:
            state.selection?.kind === 'widget' && state.selection.widgetId === widgetId
              ? { kind: 'block', sectionId: state.selection.sectionId, columnId: state.selection.columnId, blockId }
              : state.selection,
          saveStatus: 'dirty',
        })),

      updateWidgetData: (blockId, widgetId, field, value) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            widgets: mapWidget(b.widgets ?? [], widgetId, (w) => ({
              ...w,
              data: { ...w.data, [field]: value },
            })),
          })),
          saveStatus: 'dirty',
        })),

      updateWidgetStyles: (blockId, widgetId, styles) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            widgets: mapWidget(b.widgets ?? [], widgetId, (w) => ({
              ...w,
              styles: { ...w.styles, ...styles },
            })),
          })),
          saveStatus: 'dirty',
        })),

      moveWidgetWithinBlock: (blockId, fromIndex, toIndex, parentWidgetId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            if (parentWidgetId) {
              const newWidgets = mapWidget(b.widgets ?? [], parentWidgetId, (parent) => {
                const children = [...(parent.children ?? [])];
                const [moved] = children.splice(fromIndex, 1);
                children.splice(toIndex, 0, moved);
                return { ...parent, children };
              });
              return { ...b, widgets: newWidgets };
            }
            const widgets = [...(b.widgets ?? [])];
            const [moved] = widgets.splice(fromIndex, 1);
            widgets.splice(toIndex, 0, moved);
            return { ...b, widgets };
          }),
          saveStatus: 'dirty',
        })),

      setBlockWidgets: (blockId, widgets) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({ ...b, widgets })),
          saveStatus: 'dirty',
        })),

      duplicateWidget: (blockId, widgetId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => {
            const clone = (() => {
              const flat = b.widgets ?? [];
              const found = flat.find((w) => w.id === widgetId);
              return found ? cloneWidget(found) : null;
            })();
            if (!clone) return b;
            return { ...b, widgets: insertAfterWidget(b.widgets ?? [], widgetId, clone) };
          }),
          saveStatus: 'dirty',
        })),

      toggleWidgetHidden: (blockId, widgetId) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            widgets: mapWidget(b.widgets ?? [], widgetId, (w) => ({ ...w, isHidden: !w.isHidden })),
          })),
          saveStatus: 'dirty',
        })),

      clearWidgetStyle: (blockId, widgetId, key) =>
        set((state) => ({
          sections: mapBlock(state.sections, blockId, (b) => ({
            ...b,
            widgets: mapWidget(b.widgets ?? [], widgetId, (w) => {
              const styles = { ...(w.styles ?? {}) };
              delete styles[key];
              return { ...w, styles };
            }),
          })),
          saveStatus: 'dirty',
        })),

      moveWidgetBetweenBlocks: (sourceBlockId, widgetId, targetBlockId, targetWidgetId, position) =>
        set((state) => {
          // Step 1: find the widget in the source block
          let movedWidget: WidgetInstance | null = null;
          const findWidget = (widgets: WidgetInstance[]): WidgetInstance | null => {
            for (const w of widgets) {
              if (w.id === widgetId) return w;
              if (w.children) {
                const found = findWidget(w.children);
                if (found) return found;
              }
            }
            return null;
          };
          const sourceBlock = (() => {
            for (const sec of state.sections) {
              for (const col of sec.columns) {
                for (const b of col.blocks) {
                  if (b.id === sourceBlockId) return b;
                }
              }
            }
            return null;
          })();
          if (sourceBlock) movedWidget = findWidget(sourceBlock.widgets ?? []);
          if (!movedWidget) return state;

          const widget = movedWidget;

          // Step 2: insert widget into target block
          const insertWidget = (widgets: WidgetInstance[], targetId: string | null, pos: 'before' | 'after'): WidgetInstance[] => {
            if (!targetId) return [...widgets, widget];
            const idx = widgets.findIndex((w) => w.id === targetId);
            if (idx !== -1) {
              const next = [...widgets];
              next.splice(pos === 'before' ? idx : idx + 1, 0, widget);
              return next;
            }
            return widgets.map((w) =>
              w.children ? { ...w, children: insertWidget(w.children, targetId, pos) } : w,
            );
          };

          const sections = state.sections.map((sec) => ({
            ...sec,
            columns: sec.columns.map((col) => ({
              ...col,
              blocks: col.blocks.map((b) => {
                if (b.id === sourceBlockId) {
                  return { ...b, widgets: removeWidgetById(b.widgets ?? [], widgetId) };
                }
                if (b.id === targetBlockId) {
                  return { ...b, widgets: insertWidget(b.widgets ?? [], targetWidgetId, position) };
                }
                return b;
              }),
            })),
          }));

          return { sections, saveStatus: 'dirty' };
        }),
    }),
    {
      partialize: (state) => ({ sections: state.sections }),
      limit: 50,
    },
  ),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export function selectSelectedBlock(state: EditorState): BlockInstance | null {
  if (state.selection?.kind !== 'block') return null;
  return findBlock(state.sections, state.selection.blockId)?.block ?? null;
}

export function selectSelectedSection(state: EditorState): SectionInstance | null {
  if (!state.selection) return null;
  const sectionId =
    state.selection.kind === 'section'
      ? state.selection.sectionId
      : state.selection.sectionId;
  return state.sections.find((s) => s.id === sectionId) ?? null;
}

// ─── Serialize: editor state → Payload REST body ──────────────────────────────

export function serializeSectionsForPayload(sections: SectionInstance[]): Record<string, unknown>[] {
  return sections.map((section) => ({
    blockType: 'section-block',
    label: section.label,
    paddingTop: section.styles?.paddingTop,
    paddingBottom: section.styles?.paddingBottom,
    paddingLeft: section.styles?.paddingLeft,
    paddingRight: section.styles?.paddingRight,
    marginTop: section.styles?.marginTop,
    marginBottom: section.styles?.marginBottom,
    maxWidth: section.styles?.maxWidth,
    minHeight: section.styles?.minHeight,
    // Per-breakpoint overrides — persisted as one JSON blob so future fields
    // can be added without schema migrations.
    breakpointStyles: (section.styles?.tablet || section.styles?.mobile)
      ? { tablet: section.styles?.tablet, mobile: section.styles?.mobile }
      : undefined,
    backgroundColor: section.styles?.backgroundColor,
    columns: section.columns.map((col) => ({
      id: col.id,
      width: col.width,
      blocks: col.blocks.map((b) => ({
        blockType: b.blockType,
        ...b.data,
        ...(b.styles ? { _styles: b.styles } : {}),
        ...(b.widgets ? { _widgets: JSON.stringify(b.widgets) } : {}),
        ...(b.isLocked ? { _isLocked: true } : {}),
        ...(b.isHidden ? { _isHidden: true } : {}),
      })),
    })),
  }));
}

// ─── Deserialize: Payload REST response → editor state ────────────────────────

type PayloadBlock = Record<string, unknown>;

function deserializeLeafBlock(raw: PayloadBlock): BlockInstance {
  const { blockType, id: _id, _styles, _widgets, _isLocked, _isHidden, ...data } = raw;
  let widgets: WidgetInstance[] | undefined;
  if (typeof _widgets === 'string') {
    try { widgets = JSON.parse(_widgets) as WidgetInstance[]; } catch { widgets = undefined; }
  }
  return {
    id: uid(String(blockType)),
    blockType: String(blockType),
    data,
    styles: _styles && typeof _styles === 'object' ? (_styles as BlockStyles) : undefined,
    widgets,
    isLocked: _isLocked === true ? true : undefined,
    isHidden: _isHidden === true ? true : undefined,
  };
}

export function deserializeSectionsFromPayload(payloadBlocks: PayloadBlock[]): SectionInstance[] {
  // Normalize duplicate rows that can appear after legacy imports/reimports.
  const deduped = Array.from(
    new Map(
      payloadBlocks.map((block, index) => {
        const idPart = typeof block.id === 'string' || typeof block.id === 'number' ? String(block.id) : `idx-${index}`;
        const key = `${String(block.blockType ?? 'unknown')}::${idPart}`;
        return [key, block] as const;
      }),
    ).values(),
  );

  // If an imported live iframe block exists, prioritize those over stale snapshots.
  const liveIframeBlocks = deduped.filter((block) => {
    if (block.blockType !== 'custom-html-block') return false;
    const html = block.html;
    return typeof html === 'string' && /<iframe\b/i.test(html);
  });

  const normalizedBlocks = liveIframeBlocks.length > 0 ? liveIframeBlocks : deduped;
  const sections: SectionInstance[] = [];

  for (const raw of normalizedBlocks) {
    if (!raw.blockType) continue;

    if (raw.blockType === 'section-block') {
      // New format: proper section
      const rawColumns = Array.isArray(raw.columns) ? (raw.columns as PayloadBlock[]) : [];
      const columns: ColumnInstance[] = rawColumns.map((col) => ({
        id: String(col.id ?? uid('col')),
        width: (col.width as ColumnWidth) ?? '1/1',
        blocks: Array.isArray(col.blocks)
          ? (col.blocks as PayloadBlock[]).filter((b) => typeof b.blockType === 'string').map(deserializeLeafBlock)
          : [],
      }));
      sections.push({
        id: uid('section'),
        label: typeof raw.label === 'string' ? raw.label : undefined,
        columns: columns.length > 0 ? columns : [{ id: uid('col'), width: '1/1', blocks: [] }],
        styles: {
          paddingTop: typeof raw.paddingTop === 'number' ? raw.paddingTop : undefined,
          paddingBottom: typeof raw.paddingBottom === 'number' ? raw.paddingBottom : undefined,
          paddingLeft: typeof raw.paddingLeft === 'number' ? raw.paddingLeft : undefined,
          paddingRight: typeof raw.paddingRight === 'number' ? raw.paddingRight : undefined,
          marginTop: typeof raw.marginTop === 'number' ? raw.marginTop : undefined,
          marginBottom: typeof raw.marginBottom === 'number' ? raw.marginBottom : undefined,
          maxWidth: typeof raw.maxWidth === 'number' ? raw.maxWidth : undefined,
          minHeight: typeof raw.minHeight === 'number' ? raw.minHeight : undefined,
          ...(raw.breakpointStyles && typeof raw.breakpointStyles === 'object'
            ? {
                tablet: (raw.breakpointStyles as Record<string, unknown>).tablet as BreakpointOverrides | undefined,
                mobile: (raw.breakpointStyles as Record<string, unknown>).mobile as BreakpointOverrides | undefined,
              }
            : {}),
          backgroundColor: typeof raw.backgroundColor === 'string' ? raw.backgroundColor : undefined,
        },
      });
    } else {
      // Legacy format: flat block — wrap in a single-column section (migration on read)
      sections.push({
        id: uid('section'),
        columns: [{ id: uid('col'), width: '1/1', blocks: [deserializeLeafBlock(raw)] }],
      });
    }
  }

  const hasRenderableSections = sections.some((section) =>
    section.columns.some((column) => column.blocks.length > 0),
  );

  if (!hasRenderableSections) return sections;

  // Some legacy imported records can leave empty section shells in storage.
  // When renderable blocks exist, hide those shells in the visual editor.
  return sections.filter((section) =>
    section.columns.some((column) => column.blocks.length > 0),
  );
}
