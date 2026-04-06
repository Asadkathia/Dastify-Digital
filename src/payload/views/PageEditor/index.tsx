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
import { useEditorStore, serializeSectionsForPayload, deserializeSectionsFromPayload } from './store';
import { getBlockDefinition } from './block-registry';
import { BlockPalette } from './BlockPalette';
import { Canvas } from './Canvas';
import { ConfigPanel } from './ConfigPanel';
import { PreviewIframe } from './PreviewIframe';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { ToastContainer, useToast } from './Toast';
import { EditorSkeleton } from './Skeleton';
import { ErrorBoundary } from './ErrorBoundary';
import { RevisionHistory } from './RevisionHistory';

// ─── Toolbar ─────────────────────────────────────────────────────────────────

type ToolbarProps = {
  pageTitle: string;
  onPageTitleChange: (title: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onShowHistory: () => void;
};

function Toolbar({ pageTitle, onPageTitleChange, onSaveDraft, onPublish, onShowHistory }: ToolbarProps) {
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
        href="/admin/collections/pages"
        style={{ color: '#555', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #222' }}
      >
        ← Pages
      </a>

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

      <input
        value={pageTitle}
        onChange={(e) => onPageTitleChange(e.target.value)}
        placeholder="Page title"
        style={{
          minWidth: '240px',
          maxWidth: '360px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '6px',
          color: '#ddd',
          fontSize: '12px',
          padding: '6px 8px',
          outline: 'none',
        }}
      />

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

type PageEditorCoreProps = {
  pageId: string;
  onSaveDraft: () => void;
  onPublish: () => void;
};

function PageEditorCore({ onSaveDraft, onPublish }: Omit<PageEditorCoreProps, 'pageId'>) {
  const sections = useEditorStore((s) => s.sections);
  const addBlock = useEditorStore((s) => s.addBlock);
  const moveSection = useEditorStore((s) => s.moveSection);
  const moveBlockWithinColumn = useEditorStore((s) => s.moveBlockWithinColumn);
  const moveBlockBetweenColumns = useEditorStore((s) => s.moveBlockBetweenColumns);
  const moveColumn = useEditorStore((s) => s.moveColumn);

  const [activeDrag, setActiveDrag] = useState<{ type: string; label: string; icon: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as Record<string, unknown> | undefined;
    if (!data) return;

    if (data.type === 'palette-block') {
      const def = getBlockDefinition(String(data.blockType));
      setActiveDrag({ type: 'palette', label: def?.label || String(data.blockType), icon: def?.icon || '📦' });
    } else if (data.type === 'block') {
      const block = sections
        .find((s) => s.id === data.sectionId)
        ?.columns.find((c) => c.id === data.columnId)
        ?.blocks.find((b) => b.id === data.blockId);
      const def = block ? getBlockDefinition(block.blockType) : undefined;
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

    // ── Palette block dropped onto canvas ──────────────────────────────────
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

    // ── Section reorder ────────────────────────────────────────────────────
    if (activeData?.type === 'section') {
      const fromIndex = sections.findIndex((s) => s.id === activeData.sectionId);
      const toIndex = sections.findIndex((s) => s.id === String(over.id).replace('section:', ''));
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) moveSection(fromIndex, toIndex);
      return;
    }

    // ── Column reorder ─────────────────────────────────────────────────────
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

    // ── Block reorder / move ───────────────────────────────────────────────
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
        <BlockPalette />
        <Canvas activeDrag={activeDrag} />
        <PreviewIframe />
        <ConfigPanel />
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

// ─── Route entry point ────────────────────────────────────────────────────────

type PageEditorViewProps = {
  params?: { id?: string; segments?: string[] };
};

export default function PageEditorView({ params }: PageEditorViewProps) {
  const [pageId, setResolvedPageId] = useState(params?.id ?? params?.segments?.[0] ?? '');

  const setPageId = useEditorStore((s) => s.setPageId);
  const setSections = useEditorStore((s) => s.setSections);
  const setLoading = useEditorStore((s) => s.setLoading);
  const isLoading = useEditorStore((s) => s.isLoading);
  const sections = useEditorStore((s) => s.sections);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const { toasts, show: showToast, dismiss } = useToast();

  // Resolve page ID across Payload custom view param shapes
  useEffect(() => {
    if (pageId) return;
    const fromParams = params?.id ?? params?.segments?.[0];
    if (fromParams) {
      setResolvedPageId(fromParams);
      return;
    }
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/\/admin\/visual-editor\/([^/?#]+)/);
      if (match?.[1]) {
        setResolvedPageId(decodeURIComponent(match[1]));
      }
    }
  }, [pageId, params?.id, params?.segments]);

  // Load existing page blocks from Payload on mount
  useEffect(() => {
    if (!pageId) return;
    setPageId(pageId);
    setLoading(true);

    fetch(`/api/pages/${pageId}?draft=true`, { credentials: 'include' })
      .then((r) => r.json())
      .then((doc: Record<string, unknown>) => {
        if (typeof doc.title === 'string') setPageTitle(doc.title);
        if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
          setSections(deserializeSectionsFromPayload(doc.blocks as Record<string, unknown>[]));
        }
      })
      .catch(() => {
        // page may have no blocks yet — that's fine
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  // Navigation guard — warn on unsaved changes
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === 'dirty') {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Auto-save draft every 30s while dirty
  useEffect(() => {
    if (saveStatus !== 'dirty' || !pageId) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: pageTitle.trim() || 'Untitled Page',
            blocks: serializeSectionsForPayload(sections),
            _status: 'draft',
          }),
        });
        setSaveStatus(res.ok ? 'saved' : 'error');
      } catch {
        setSaveStatus('error');
      }
    }, 30_000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [saveStatus, sections, pageId, setSaveStatus, pageTitle]);

  const saveDraft = useCallback(async () => {
    if (!pageId || saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: pageTitle.trim() || 'Untitled Page',
          blocks: serializeSectionsForPayload(sections),
          _status: 'draft',
        }),
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
  }, [pageId, sections, pageTitle, saveStatus, setSaveStatus, showToast]);

  const publish = useCallback(async () => {
    if (!pageId || saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: pageTitle.trim() || 'Untitled Page',
          blocks: serializeSectionsForPayload(sections),
          _status: 'published',
        }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        showToast('Page published successfully', 'success', 4000);
      } else {
        setSaveStatus('error');
        showToast('Publish failed — please try again', 'error');
      }
    } catch {
      setSaveStatus('error');
      showToast('Publish failed — network error', 'error');
    }
  }, [pageId, sections, pageTitle, saveStatus, setSaveStatus, showToast]);

  if (!pageId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f', color: '#555', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>⚠️</p>
          <p style={{ fontSize: '16px', margin: '0 0 8px', color: '#ccc' }}>No page ID provided</p>
          <a href="/admin/collections/pages" style={{ color: '#0ea5e9', fontSize: '13px' }}>← Back to Pages</a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0f0f0f',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#ccc',
        overflow: 'hidden',
      }}
    >
      <Toolbar
        pageTitle={pageTitle}
        onPageTitleChange={(nextTitle) => {
          setPageTitle(nextTitle);
          if (saveStatus !== 'saving') {
            setSaveStatus('dirty');
          }
        }}
        onSaveDraft={saveDraft}
        onPublish={publish}
        onShowHistory={() => setShowHistory(true)}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {isLoading ? (
          <EditorSkeleton />
        ) : (
          <ErrorBoundary label="Editor failed to load">
            <PageEditorCore onSaveDraft={saveDraft} onPublish={publish} />
          </ErrorBoundary>
        )}
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      {showHistory && <RevisionHistory pageId={pageId} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
