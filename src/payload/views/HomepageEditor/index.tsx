'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useEditorStore } from '../PageEditor/store';
import { getBlockDefinition } from '../PageEditor/block-registry';
import { homepageDocToSections, sectionsToHomepagePatch } from './homepage-adapter';
import { BlockPalette } from '../PageEditor/BlockPalette';
import { Canvas } from '../PageEditor/Canvas';
import { ConfigPanel } from '../PageEditor/ConfigPanel';
import { KeyboardShortcuts } from '../PageEditor/KeyboardShortcuts';
import { ToastContainer, useToast } from '../PageEditor/Toast';
import { EditorSkeleton } from '../PageEditor/Skeleton';
import { ErrorBoundary } from '../PageEditor/ErrorBoundary';
import { RevisionHistory } from '../PageEditor/RevisionHistory';

// ─── Toolbar ─────────────────────────────────────────────────────────────────

type ToolbarProps = {
  onSaveDraft: () => void;
  onPublish: () => void;
  onShowHistory: () => void;
};

function Toolbar({ onSaveDraft, onPublish, onShowHistory }: ToolbarProps) {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const responsiveMode = useEditorStore((s) => s.responsiveMode);
  const setResponsiveMode = useEditorStore((s) => s.setResponsiveMode);
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const statusLabel: Record<string, { text: string; color: string }> = {
    saved:  { text: 'Saved',            color: '#4ade80' },
    saving: { text: 'Saving…',          color: '#facc15' },
    dirty:  { text: 'Unsaved changes',  color: '#fb923c' },
    error:  { text: 'Save failed',      color: '#f87171' },
  };
  const { text: statusText, color: statusColor } = statusLabel[saveStatus] ?? statusLabel.saved;

  return (
    <header
      style={{
        height: '48px',
        background: '#0a0a0a',
        borderBottom: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '8px',
        flexShrink: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <a
        href="/admin/globals/homepage"
        style={{ color: '#555', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #222' }}
      >
        ← Homepage
      </a>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.03em' }}>
        🏠 Homepage Visual Editor
      </span>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      <button onClick={() => undo()} disabled={!canUndo} style={tbBtn(!canUndo)} title="Undo (Ctrl+Z)">↩</button>
      <button onClick={() => redo()} disabled={!canRedo} style={tbBtn(!canRedo)} title="Redo (Ctrl+Shift+Z)">↪</button>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => setResponsiveMode(mode)}
          title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} preview`}
          style={{
            ...tbBtn(false),
            background: responsiveMode === mode ? '#1e3a4c' : 'transparent',
            borderColor: responsiveMode === mode ? '#0ea5e9' : '#222',
            color: responsiveMode === mode ? '#7dd3fc' : '#666',
          }}
        >
          {mode === 'desktop' ? '🖥' : mode === 'tablet' ? '📱' : '📲'}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: '11px', color: statusColor }}>{statusText}</span>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      <button
        onClick={onShowHistory}
        style={{ ...tbBtn(false), padding: '6px 10px', fontSize: '12px' }}
        title="Revision History"
      >
        🕓
      </button>

      <button
        onClick={onSaveDraft}
        disabled={saveStatus === 'saving'}
        style={{ ...tbBtn(saveStatus === 'saving'), padding: '6px 12px', fontSize: '12px' }}
        title="Save Draft (Ctrl+S)"
      >
        Save Draft
      </button>

      <button
        onClick={onPublish}
        disabled={saveStatus === 'saving'}
        title="Publish (Ctrl+Shift+S)"
        style={{
          background: saveStatus === 'saving' ? '#064e3b' : '#065f46',
          border: '1px solid #059669',
          borderRadius: '6px',
          color: saveStatus === 'saving' ? '#6ee7b7' : '#a7f3d0',
          cursor: saveStatus === 'saving' ? 'default' : 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          padding: '6px 14px',
          opacity: saveStatus === 'saving' ? 0.7 : 1,
        }}
      >
        Publish
      </button>
    </header>
  );
}

const tbBtn = (disabled: boolean): React.CSSProperties => ({
  background: 'transparent',
  border: '1px solid #222',
  borderRadius: '6px',
  color: disabled ? '#333' : '#666',
  cursor: disabled ? 'default' : 'pointer',
  fontSize: '13px',
  lineHeight: 1,
  padding: '6px 8px',
  opacity: disabled ? 0.5 : 1,
});

// ─── Core editor (inside DnD context) ────────────────────────────────────────

function HomepageEditorCore({
  onSaveDraft,
  onPublish,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  const sections = useEditorStore((s) => s.sections);
  const addBlock = useEditorStore((s) => s.addBlock);
  const moveSection = useEditorStore((s) => s.moveSection);
  const moveBlockWithinColumn = useEditorStore((s) => s.moveBlockWithinColumn);
  const moveBlockBetweenColumns = useEditorStore((s) => s.moveBlockBetweenColumns);
  const moveColumn = useEditorStore((s) => s.moveColumn);

  const [activeDrag, setActiveDrag] = useState<{ type: string; label: string; icon: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function resolveBlockDef(blockType: string) {
    // getBlockDefinition already covers hp-* types via the static import merge
    return getBlockDefinition(blockType);
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as Record<string, unknown> | undefined;
    if (!data) return;

    if (data.type === 'palette-block') {
      const def = resolveBlockDef(String(data.blockType));
      setActiveDrag({ type: 'palette', label: def?.label || String(data.blockType), icon: def?.icon || '📦' });
    } else if (data.type === 'block') {
      const block = sections
        .find((s) => s.id === data.sectionId)
        ?.columns.find((c) => c.id === data.columnId)
        ?.blocks.find((b) => b.id === data.blockId);
      const def = block ? resolveBlockDef(block.blockType) : undefined;
      setActiveDrag({ type: 'block', label: (block?.data?.title as string) || def?.label || 'Block', icon: def?.icon || '📦' });
    } else if (data.type === 'section') {
      setActiveDrag({ type: 'section', label: 'Section', icon: '▦' });
    } else if (data.type === 'column') {
      setActiveDrag({ type: 'column', label: 'Column', icon: '▥' });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current as Record<string, unknown> | undefined;

    if (activeData?.type === 'palette-block' && activeData.blockType) {
      const overId = String(over.id);
      if (overId.startsWith('col-drop:')) {
        const [, secId, colId] = overId.split(':');
        addBlock(String(activeData.blockType), secId, colId);
      } else if (overId.startsWith('block:')) {
        const [, secId, colId] = overId.split(':');
        addBlock(String(activeData.blockType), secId, colId);
      }
      return;
    }

    if (activeData?.type === 'section') {
      const fromIndex = sections.findIndex((s) => s.id === activeData.sectionId);
      const toIndex = sections.findIndex((s) => s.id === String(over.id).replace('section:', ''));
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) moveSection(fromIndex, toIndex);
      return;
    }

    if (activeData?.type === 'column') {
      const sectionId = String(activeData.sectionId);
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;
      const fromIndex = section.columns.findIndex((c) => c.id === activeData.columnId);
      const toColId = String(over.id).replace(`column:${sectionId}:`, '');
      const toIndex = section.columns.findIndex((c) => c.id === toColId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) moveColumn(sectionId, fromIndex, toIndex);
      return;
    }

    if (activeData?.type === 'block') {
      const { sectionId: fromSec, columnId: fromCol, blockId } = activeData as { sectionId: string; columnId: string; blockId: string };
      const overId = String(over.id);
      let toSec: string, toCol: string, toIndex: number;

      if (overId.startsWith('col-drop:')) {
        const [, s, c] = overId.split(':');
        toSec = s; toCol = c;
        const col = sections.find((sec) => sec.id === s)?.columns.find((col) => col.id === c);
        toIndex = col?.blocks.length ?? 0;
      } else if (overId.startsWith('block:')) {
        const [, s, c, targetBlockId] = overId.split(':');
        toSec = s; toCol = c;
        const col = sections.find((sec) => sec.id === s)?.columns.find((col) => col.id === c);
        toIndex = col?.blocks.findIndex((b) => b.id === targetBlockId) ?? 0;
      } else {
        return;
      }

      if (fromSec === toSec && fromCol === toCol) {
        const col = sections.find((s) => s.id === fromSec)?.columns.find((c) => c.id === fromCol);
        const fromIndex = col?.blocks.findIndex((b) => b.id === blockId) ?? -1;
        if (fromIndex !== -1 && fromIndex !== toIndex) moveBlockWithinColumn(fromSec, fromCol, fromIndex, toIndex);
      } else {
        const col = sections.find((s) => s.id === fromSec)?.columns.find((c) => c.id === fromCol);
        const fromIndex = col?.blocks.findIndex((b) => b.id === blockId) ?? -1;
        if (fromIndex !== -1) moveBlockBetweenColumns(fromSec, fromCol, fromIndex, toSec, toCol, toIndex);
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveDrag(null)}>
      <KeyboardShortcuts onSaveDraft={onSaveDraft} onPublish={onPublish} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <HomepageBlockPalette />
        <Canvas activeDrag={activeDrag} />
        <HomepagePreviewIframe />
        <HomepageConfigPanel />
      </div>
      <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
        {activeDrag && (
          <div style={{
            background: '#0c1a24',
            border: '2px solid #0ea5e9',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: '16px' }}>{activeDrag.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#7dd3fc' }}>{activeDrag.label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Homepage-aware BlockPalette (shows homepage blocks first) ────────────────

function HomepageBlockPalette() {
  // We use the standard BlockPalette which reads from block-registry.
  // The homepage blocks are registered there via the merged registry approach.
  // For the palette we want to show homepage-specific blocks prominently.
  return <BlockPalette />;
}

// ─── Homepage-aware PreviewIframe (points to ?mode=homepage) ─────────────────

function HomepagePreviewIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const sections = useEditorStore((s) => s.sections);
  const selection = useEditorStore((s) => s.selection);
  const responsiveMode = useEditorStore((s) => s.responsiveMode);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const setIframeReady = useEditorStore((s) => s.setIframeReady);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);

  const RESPONSIVE_WIDTHS: Record<string, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const selectedBlockId = selection?.kind === 'block' ? selection.blockId : null;
  const frameWidth = RESPONSIVE_WIDTHS[responsiveMode] ?? '100%';
  const isConstrained = responsiveMode !== 'desktop';

  // Fallback ready
  useEffect(() => {
    const fallback = setTimeout(() => { setFrameLoaded(true); setIframeReady(true); }, 1500);
    return () => clearTimeout(fallback);
  }, [setIframeReady]);

  // Listen for messages from iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as { type: string; blockId?: string; fieldName?: string; value?: unknown };
      if (!data?.type) return;
      if (data.type === 'EDITOR_READY') { setIframeReady(true); setFrameLoaded(true); }
      if (data.type === 'BLOCK_CLICKED' && data.blockId) {
        for (const sec of sections) {
          for (const col of sec.columns) {
            if (col.blocks.some((b) => b.id === data.blockId)) {
              selectBlock(sec.id, col.id, data.blockId);
              return;
            }
          }
        }
      }
      if (data.type === 'INLINE_EDIT_END' && data.blockId && data.fieldName !== undefined) {
        updateBlockData(data.blockId, data.fieldName, data.value);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sections, selectBlock, setIframeReady, updateBlockData]);

  // Send sections whenever they change
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!frameLoaded) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'UPDATE_SECTIONS', sections, responsiveMode },
        '*',
      );
    }, 120);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [sections, responsiveMode, frameLoaded]);

  // Send selected block
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !frameLoaded) return;
    iframeRef.current.contentWindow.postMessage({ type: 'SELECT_BLOCK', blockId: selectedBlockId }, '*');
  }, [selectedBlockId, frameLoaded]);

  function handleLoad() {
    setFrameLoaded(true);
    setIframeReady(true);
    setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'UPDATE_SECTIONS', sections, responsiveMode },
        '*',
      );
    }, 30);
  }

  return (
    <div style={{
      flex: 1,
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'auto',
      padding: isConstrained ? '20px' : 0,
    }}>
      <div style={{
        width: frameWidth,
        maxWidth: '100%',
        flex: isConstrained ? 'none' : 1,
        height: isConstrained ? 'auto' : '100%',
        minHeight: isConstrained ? '80vh' : undefined,
        background: '#fff',
        borderRadius: isConstrained ? '8px' : 0,
        overflow: 'hidden',
        boxShadow: isConstrained ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
        transition: 'width 0.25s ease',
        position: 'relative',
      }}>
        {!frameLoaded && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <span style={{ color: '#888', fontSize: '13px', fontFamily: 'sans-serif' }}>Loading homepage preview…</span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/page-editor-preview?mode=homepage"
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: isConstrained ? '80vh' : '100%' }}
          title="Homepage preview"
        />
      </div>
    </div>
  );
}

// ─── Homepage ConfigPanel (wraps standard ConfigPanel with hp-block awareness) ─

function HomepageConfigPanel() {
  // The standard ConfigPanel uses `getBlockDefinition` internally.
  // Since we registered homepage blocks in the merged registry (below),
  // it will automatically resolve labels/fields for hp-* block types too.
  return <ConfigPanel />;
}

// ─── Root view ────────────────────────────────────────────────────────────────

export default function HomepageEditorView() {
  const setSections = useEditorStore((s) => s.setSections);
  const setLoading = useEditorStore((s) => s.setLoading);
  const isLoading = useEditorStore((s) => s.isLoading);
  const sections = useEditorStore((s) => s.sections);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  // Load homepage on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/globals/homepage?draft=true', { credentials: 'include' })
      .then((r) => r.json())
      .then((doc: Record<string, unknown>) => {
        const sections = homepageDocToSections(doc);
        setSections(sections);
      })
      .catch(() => {
        // no-op — show empty editor
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigation guard
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === 'dirty') { e.preventDefault(); e.returnValue = ''; }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Auto-save draft every 30s while dirty
  useEffect(() => {
    if (saveStatus !== 'dirty') return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const patch = sectionsToHomepagePatch(sections);
        const res = await fetch('/api/globals/homepage', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...patch, _status: 'draft' }),
        });
        setSaveStatus(res.ok ? 'saved' : 'error');
      } catch {
        setSaveStatus('error');
      }
    }, 30_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [saveStatus, sections, setSaveStatus]);

  const saveDraft = useCallback(async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const patch = sectionsToHomepagePatch(sections);
      const res = await fetch('/api/globals/homepage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...patch, _status: 'draft' }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        showToast('Draft saved', 'success');
      } else {
        setSaveStatus('error');
        showToast('Save failed — please try again', 'error');
      }
    } catch {
      setSaveStatus('error');
      showToast('Save failed — network error', 'error');
    }
  }, [sections, saveStatus, setSaveStatus, showToast]);

  const publish = useCallback(async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const patch = sectionsToHomepagePatch(sections);
      const res = await fetch('/api/globals/homepage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...patch, _status: 'published' }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        showToast('Homepage published successfully 🎉', 'success', 4000);
      } else {
        setSaveStatus('error');
        showToast('Publish failed — please try again', 'error');
      }
    } catch {
      setSaveStatus('error');
      showToast('Publish failed — network error', 'error');
    }
  }, [sections, saveStatus, setSaveStatus, showToast]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f0f0f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#ccc',
      overflow: 'hidden',
    }}>
      <Toolbar
        onSaveDraft={saveDraft}
        onPublish={publish}
        onShowHistory={() => setShowHistory(true)}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {isLoading ? (
          <EditorSkeleton />
        ) : (
          <ErrorBoundary label="Homepage editor failed to load">
            <HomepageEditorCore onSaveDraft={saveDraft} onPublish={publish} />
          </ErrorBoundary>
        )}
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      {showHistory && (
        <RevisionHistory pageId="homepage-global" onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
