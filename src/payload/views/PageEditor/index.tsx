'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useEditorStore, serializeBlocksForPayload, deserializeBlocksFromPayload } from './store';
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

function PageEditorCore({ pageId, onSaveDraft, onPublish }: PageEditorCoreProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const addBlock = useEditorStore((s) => s.addBlock);
  const moveBlock = useEditorStore((s) => s.moveBlock);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as { type: string; blockType?: string } | undefined;

    // Palette → canvas: append
    if (activeData?.type === 'palette-block' && activeData.blockType) {
      addBlock(activeData.blockType);
      return;
    }

    // Canvas reorder
    if (activeData?.type === 'canvas-block') {
      const fromIndex = blocks.findIndex((b) => b.id === String(active.id));
      const toIndex = blocks.findIndex((b) => b.id === String(over.id));
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveBlock(fromIndex, toIndex);
      }
    }
  }

  return (
    <>
      <KeyboardShortcuts onSaveDraft={onSaveDraft} onPublish={onPublish} />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <BlockPalette />
          <Canvas />
          <PreviewIframe />
          <ConfigPanel />
        </div>
        <DragOverlay>
          <div style={{ background: '#1e3a4c', border: '1px solid #0ea5e9', borderRadius: '8px', padding: '10px 14px', color: '#7dd3fc', fontSize: '13px' }}>
            Moving block…
          </div>
        </DragOverlay>
      </DndContext>
    </>
  );
}

// ─── Route entry point ────────────────────────────────────────────────────────

type PageEditorViewProps = {
  params?: { id?: string; segments?: string[] };
};

export default function PageEditorView({ params }: PageEditorViewProps) {
  const [pageId, setResolvedPageId] = useState(params?.id ?? params?.segments?.[0] ?? '');

  const setPageId = useEditorStore((s) => s.setPageId);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const setLoading = useEditorStore((s) => s.setLoading);
  const isLoading = useEditorStore((s) => s.isLoading);
  const blocks = useEditorStore((s) => s.blocks);
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
          setBlocks(deserializeBlocksFromPayload(doc.blocks as Record<string, unknown>[]));
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
            blocks: serializeBlocksForPayload(blocks),
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
  }, [saveStatus, blocks, pageId, setSaveStatus, pageTitle]);

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
          blocks: serializeBlocksForPayload(blocks),
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
  }, [pageId, blocks, pageTitle, saveStatus, setSaveStatus, showToast]);

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
          blocks: serializeBlocksForPayload(blocks),
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
  }, [pageId, blocks, pageTitle, saveStatus, setSaveStatus, showToast]);

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
            <PageEditorCore pageId={pageId} onSaveDraft={saveDraft} onPublish={publish} />
          </ErrorBoundary>
        )}
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      {showHistory && <RevisionHistory pageId={pageId} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
