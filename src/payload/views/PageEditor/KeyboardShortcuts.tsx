'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from './store';

type KeyboardShortcutsProps = {
  onSaveDraft: () => void;
  onPublish: () => void;
};

export function KeyboardShortcuts({ onSaveDraft, onPublish }: KeyboardShortcutsProps) {
  const storeRef = useRef(useEditorStore.getState);
  storeRef.current = useEditorStore.getState;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const store = storeRef.current();
      const {
        selection,
        sections,
        removeBlock,
        duplicateBlock,
        copyBlock,
        pasteBlock,
        clipboard,
        moveBlockWithinColumn,
        clearSelection,
      } = store;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isEditing =
        tag === 'input' || tag === 'textarea' || tag === 'select' ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isEditing) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo — Ctrl+Z
      if (ctrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        useEditorStore.temporal.getState().undo();
        return;
      }

      // Redo — Ctrl+Shift+Z or Ctrl+Y
      if ((ctrl && e.shiftKey && e.key === 'z') || (ctrl && e.key === 'y')) {
        e.preventDefault();
        useEditorStore.temporal.getState().redo();
        return;
      }

      // Save draft — Ctrl+S
      if (ctrl && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        onSaveDraft();
        return;
      }

      // Find in canvas — Ctrl+F
      if (ctrl && e.key === 'f') {
        e.preventDefault();
        window.dispatchEvent(new Event('page-editor-focus-canvas-search'));
        return;
      }

      // Publish — Ctrl+Shift+S
      if (ctrl && e.shiftKey && e.key === 's') {
        e.preventDefault();
        onPublish();
        return;
      }

      // Escape — deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
      }

      // Block-level shortcuts — only when a block is selected
      if (selection?.kind !== 'block') return;
      const { sectionId, columnId, blockId } = selection;

      // Delete / Backspace — delete selected block
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeBlock(sectionId, columnId, blockId);
        return;
      }

      // Ctrl+D — duplicate
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        duplicateBlock(sectionId, columnId, blockId);
        return;
      }

      // Ctrl+C — copy
      if (ctrl && e.key === 'c') {
        e.preventDefault();
        copyBlock(sectionId, columnId, blockId);
        return;
      }

      // Ctrl+V — paste into same column
      if (ctrl && e.key === 'v' && clipboard) {
        e.preventDefault();
        pasteBlock(sectionId, columnId);
        return;
      }

      // ArrowUp / ArrowDown — move block within column
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !ctrl) {
        e.preventDefault();
        const col = sections
          .find((s) => s.id === sectionId)
          ?.columns.find((c) => c.id === columnId);
        if (!col) return;
        const idx = col.blocks.findIndex((b) => b.id === blockId);
        if (e.key === 'ArrowUp' && idx > 0) moveBlockWithinColumn(sectionId, columnId, idx, idx - 1);
        if (e.key === 'ArrowDown' && idx !== -1 && idx < col.blocks.length - 1) moveBlockWithinColumn(sectionId, columnId, idx, idx + 1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSaveDraft, onPublish]);

  return null;
}
