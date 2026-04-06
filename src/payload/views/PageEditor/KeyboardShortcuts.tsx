'use client';

import { useEffect } from 'react';
import { useEditorStore } from './store';

type KeyboardShortcutsProps = {
  onSaveDraft: () => void;
  onPublish: () => void;
};

export function KeyboardShortcuts({ onSaveDraft, onPublish }: KeyboardShortcutsProps) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const blocks = useEditorStore((s) => s.blocks);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const copyBlock = useEditorStore((s) => s.copyBlock);
  const pasteBlock = useEditorStore((s) => s.pasteBlock);
  const clipboard = useEditorStore((s) => s.clipboard);
  const moveBlock = useEditorStore((s) => s.moveBlock);
  const selectBlock = useEditorStore((s) => s.selectBlock);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire shortcuts when typing in an input/textarea/select
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isEditing = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target as HTMLElement)?.isContentEditable;
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

      // Block-level shortcuts — only when a block is selected
      if (!selectedBlockId) return;

      // Delete / Backspace — delete selected block
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeBlock(selectedBlockId);
        return;
      }

      // Escape — deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        selectBlock(null);
        return;
      }

      // Ctrl+D — duplicate selected block
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
        return;
      }

      // Ctrl+C — copy selected block
      if (ctrl && e.key === 'c') {
        e.preventDefault();
        copyBlock(selectedBlockId);
        return;
      }

      // Ctrl+V — paste copied block
      if (ctrl && e.key === 'v' && clipboard) {
        e.preventDefault();
        pasteBlock();
        return;
      }

      // ArrowUp — move block up
      if (e.key === 'ArrowUp' && !ctrl) {
        e.preventDefault();
        const idx = blocks.findIndex((b) => b.id === selectedBlockId);
        if (idx > 0) moveBlock(idx, idx - 1);
        return;
      }

      // ArrowDown — move block down
      if (e.key === 'ArrowDown' && !ctrl) {
        e.preventDefault();
        const idx = blocks.findIndex((b) => b.id === selectedBlockId);
        if (idx !== -1 && idx < blocks.length - 1) moveBlock(idx, idx + 1);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, blocks, removeBlock, duplicateBlock, copyBlock, pasteBlock, clipboard, moveBlock, selectBlock, onSaveDraft, onPublish]);

  return null;
}
