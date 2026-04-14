'use client';

import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  BlockInstance,
  BlockStyles,
  ColumnInstance,
  ColumnWidth,
  ResponsiveMode,
  SaveStatus,
  SectionInstance,
  SelectionTarget,
} from './types';
import { createBlockInstance } from './block-registry';
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

type EditorState = {
  pageId: string | null;
  editorMode: 'pages' | 'homepage' | 'converted';
  convertedPageName: string | null;
  sections: SectionInstance[];
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
  updateArrayItem: (blockId: string, arrayField: string, index: number, subField: string, value: unknown) => void;
  addArrayItem: (blockId: string, arrayField: string, newItem: Record<string, unknown>) => void;
  removeArrayItem: (blockId: string, arrayField: string, index: number) => void;
  moveArrayItem: (blockId: string, arrayField: string, fromIndex: number, toIndex: number) => void;
};

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
    backgroundColor: section.styles?.backgroundColor,
    columns: section.columns.map((col) => ({
      id: col.id,
      width: col.width,
      blocks: col.blocks.map((b) => ({
        blockType: b.blockType,
        ...b.data,
        ...(b.styles ? { _styles: b.styles } : {}),
        ...(b.isLocked ? { _isLocked: true } : {}),
        ...(b.isHidden ? { _isHidden: true } : {}),
      })),
    })),
  }));
}

// ─── Deserialize: Payload REST response → editor state ────────────────────────

type PayloadBlock = Record<string, unknown>;

function deserializeLeafBlock(raw: PayloadBlock): BlockInstance {
  const { blockType, id: _id, _styles, _isLocked, _isHidden, ...data } = raw;
  return {
    id: uid(String(blockType)),
    blockType: String(blockType),
    data,
    styles: _styles && typeof _styles === 'object' ? (_styles as BlockStyles) : undefined,
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
