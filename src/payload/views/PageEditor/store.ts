'use client';

import { create } from 'zustand';
import { temporal } from 'zundo';
import type { BlockInstance, BlockStyles, ResponsiveMode, SaveStatus } from './types';
import { createBlockInstance } from './block-registry';

type EditorState = {
  pageId: string | null;
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  saveStatus: SaveStatus;
  responsiveMode: ResponsiveMode;
  iframeReady: boolean;
  isLoading: boolean;
  clipboard: BlockInstance | null;

  // Actions
  setPageId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  addBlock: (blockType: string, atIndex?: number) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  duplicateBlock: (blockId: string) => void;
  copyBlock: (blockId: string) => void;
  pasteBlock: () => void;
  updateBlockData: (blockId: string, field: string, value: unknown) => void;
  updateBlockStyles: (blockId: string, styles: Partial<BlockStyles>) => void;
  updateArrayItem: (blockId: string, arrayField: string, index: number, subField: string, value: unknown) => void;
  addArrayItem: (blockId: string, arrayField: string, newItem: Record<string, unknown>) => void;
  removeArrayItem: (blockId: string, arrayField: string, index: number) => void;
  moveArrayItem: (blockId: string, arrayField: string, fromIndex: number, toIndex: number) => void;
  selectBlock: (blockId: string | null) => void;
  setBlocks: (blocks: BlockInstance[]) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setResponsiveMode: (mode: ResponsiveMode) => void;
  setIframeReady: (ready: boolean) => void;
};

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      pageId: null,
      blocks: [],
      selectedBlockId: null,
      saveStatus: 'saved',
      responsiveMode: 'desktop',
      iframeReady: false,
      isLoading: false,
      clipboard: null,

      setPageId: (id) => set({ pageId: id }),

      setLoading: (isLoading) => set({ isLoading }),

      addBlock: (blockType, atIndex) =>
        set((state) => {
          const instance = createBlockInstance(blockType);
          if (!instance) return state;
          const blocks = [...state.blocks];
          const insertAt = atIndex !== undefined ? atIndex : blocks.length;
          blocks.splice(insertAt, 0, instance);
          return { blocks, selectedBlockId: instance.id, saveStatus: 'dirty' };
        }),

      removeBlock: (blockId) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== blockId),
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
          saveStatus: 'dirty',
        })),

      moveBlock: (fromIndex, toIndex) =>
        set((state) => {
          const blocks = [...state.blocks];
          const [moved] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, moved);
          return { blocks, saveStatus: 'dirty' };
        }),

      duplicateBlock: (blockId) =>
        set((state) => {
          const index = state.blocks.findIndex((b) => b.id === blockId);
          if (index === -1) return state;
          const source = state.blocks[index];
          const duplicate: BlockInstance = {
            id: `${source.blockType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            blockType: source.blockType,
            data: structuredClone(source.data),
            styles: source.styles ? structuredClone(source.styles) : undefined,
          };
          const blocks = [...state.blocks];
          blocks.splice(index + 1, 0, duplicate);
          return { blocks, selectedBlockId: duplicate.id, saveStatus: 'dirty' };
        }),

      copyBlock: (blockId) =>
        set((state) => {
          const block = state.blocks.find((b) => b.id === blockId);
          if (!block) return state;
          return { clipboard: structuredClone(block) };
        }),

      pasteBlock: () =>
        set((state) => {
          if (!state.clipboard) return state;
          const pasted: BlockInstance = {
            ...structuredClone(state.clipboard),
            id: `${state.clipboard.blockType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          };
          const selectedIndex = state.selectedBlockId
            ? state.blocks.findIndex((b) => b.id === state.selectedBlockId)
            : -1;
          const insertAt = selectedIndex !== -1 ? selectedIndex + 1 : state.blocks.length;
          const blocks = [...state.blocks];
          blocks.splice(insertAt, 0, pasted);
          return { blocks, selectedBlockId: pasted.id, saveStatus: 'dirty' };
        }),

      updateBlockData: (blockId, field, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === blockId ? { ...b, data: { ...b.data, [field]: value } } : b,
          ),
          saveStatus: 'dirty',
        })),

      updateBlockStyles: (blockId, styles) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === blockId ? { ...b, styles: { ...b.styles, ...styles } } : b,
          ),
          saveStatus: 'dirty',
        })),

      updateArrayItem: (blockId, arrayField, index, subField, value) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const arr = Array.isArray(b.data[arrayField]) ? [...(b.data[arrayField] as Record<string, unknown>[])] : [];
            arr[index] = { ...arr[index], [subField]: value };
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      addArrayItem: (blockId, arrayField, newItem) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const arr = Array.isArray(b.data[arrayField]) ? [...(b.data[arrayField] as Record<string, unknown>[])] : [];
            return { ...b, data: { ...b.data, [arrayField]: [...arr, newItem] } };
          }),
          saveStatus: 'dirty',
        })),

      removeArrayItem: (blockId, arrayField, index) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const arr = Array.isArray(b.data[arrayField]) ? [...(b.data[arrayField] as Record<string, unknown>[])] : [];
            arr.splice(index, 1);
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      moveArrayItem: (blockId, arrayField, fromIndex, toIndex) =>
        set((state) => ({
          blocks: state.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const arr = Array.isArray(b.data[arrayField]) ? [...(b.data[arrayField] as Record<string, unknown>[])] : [];
            const [item] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, item);
            return { ...b, data: { ...b.data, [arrayField]: arr } };
          }),
          saveStatus: 'dirty',
        })),

      selectBlock: (blockId) => set({ selectedBlockId: blockId }),

      setBlocks: (blocks) => set({ blocks, saveStatus: 'saved' }),

      setSaveStatus: (saveStatus) => set({ saveStatus }),

      setResponsiveMode: (responsiveMode) => set({ responsiveMode }),

      setIframeReady: (iframeReady) => set({ iframeReady }),
    }),
    {
      partialize: (state) => ({ blocks: state.blocks }),
      limit: 50,
    },
  ),
);

// Selectors
export const selectBlocks = (s: EditorState) => s.blocks;
export const selectSelectedBlock = (s: EditorState) =>
  s.selectedBlockId ? s.blocks.find((b) => b.id === s.selectedBlockId) ?? null : null;
export const selectSaveStatus = (s: EditorState) => s.saveStatus;
export const selectResponsiveMode = (s: EditorState) => s.responsiveMode;

// Serialise editor blocks → Payload REST format
export function serializeBlocksForPayload(blocks: BlockInstance[]): Record<string, unknown>[] {
  return blocks.map((b) => ({
    blockType: b.blockType,
    ...b.data,
    // Persist styles as a nested object alongside block data
    ...(b.styles ? { _styles: b.styles } : {}),
  }));
}

// Deserialise Payload REST response → editor blocks
export function deserializeBlocksFromPayload(payloadBlocks: Record<string, unknown>[]): BlockInstance[] {
  return payloadBlocks
    .filter((b) => typeof b.blockType === 'string')
    .map((b) => {
      const { blockType, id: _id, _styles, ...data } = b;
      return {
        id: `${blockType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        blockType: blockType as string,
        data,
        styles: _styles && typeof _styles === 'object' ? (_styles as import('./types').BlockStyles) : undefined,
      };
    });
}
