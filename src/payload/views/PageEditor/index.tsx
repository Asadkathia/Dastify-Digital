'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  useEditorStore,
  serializeSectionsForPayload,
  deserializeSectionsFromPayload,
} from './store';
import {
  getBlockDefinition,
  registerRuntimeBlockDefinitions,
  clearRuntimeBlockDefinitions,
} from './block-registry';
import { BlockPalette } from './BlockPalette';
import { Canvas } from './Canvas';
import { ConfigPanel } from './ConfigPanel';
import { PreviewIframe } from './PreviewIframe';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { ToastContainer, useToast } from './Toast';
import { EditorSkeleton } from './Skeleton';
import { ErrorBoundary } from './ErrorBoundary';
import { RevisionHistory } from './RevisionHistory';
import { homepageDocToSections, sectionsToHomepagePatch } from '../HomepageEditor/homepage-adapter';
import { buildConvertedBlockDefinition, convertedPageContentToSections, sectionsToConvertedPageContent } from '@/lib/converted-pages/editor-adapter';
import type { BlockDefinition } from './types';

type EditorMode = 'pages' | 'homepage' | 'converted';

type ConvertedSectionSpec = {
  key: string;
  label: string;
  icon?: string;
};

type ConvertedContentResponse = {
  page: string;
  sections: ConvertedSectionSpec[];
  content: Record<string, unknown>;
};

type PagesFindResponse = {
  docs?: Array<Record<string, unknown>>;
};

function inferConvertedPageNameFromPathname(pathname: string): string | null {
  const match = pathname.match(/\/admin\/edit-converted-page\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function formatPageName(pageName: string): string {
  return pageName
    .split('-')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

type ToolbarProps = {
  mode: EditorMode;
  pageTitle: string;
  convertedPageName: string | null;
  canShowHistory: boolean;
  onPageTitleChange: (title: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onShowHistory: () => void;
};

function Toolbar({
  mode,
  pageTitle,
  convertedPageName,
  canShowHistory,
  onPageTitleChange,
  onSaveDraft,
  onPublish,
  onShowHistory,
}: ToolbarProps) {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const responsiveMode = useEditorStore((s) => s.responsiveMode);
  const setResponsiveMode = useEditorStore((s) => s.setResponsiveMode);
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const statusLabel: Record<string, { text: string; color: string }> = {
    saved: { text: 'Saved', color: '#4ade80' },
    saving: { text: 'Saving…', color: '#facc15' },
    dirty: { text: 'Unsaved changes', color: '#fb923c' },
    error: { text: 'Save failed', color: '#f87171' },
  };
  const { text: statusText, color: statusColor } = statusLabel[saveStatus] ?? statusLabel.saved;

  const backHref =
    mode === 'homepage'
      ? '/admin/globals/homepage'
      : mode === 'converted'
        ? '/admin/converted-pages'
        : '/admin/collections/pages';

  const backLabel =
    mode === 'homepage'
      ? '← Homepage'
      : mode === 'converted'
        ? '← Converted Pages'
        : '← Pages';

  const titleLabel =
    mode === 'homepage'
      ? '🏠 Homepage Visual Editor'
      : mode === 'converted'
        ? `✦ ${formatPageName(convertedPageName ?? 'Converted Page')} Visual Editor`
        : '';

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
      <Link
        href={backHref}
        style={{
          color: '#555',
          textDecoration: 'none',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid #222',
        }}
      >
        {backLabel}
      </Link>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      <button onClick={() => undo()} disabled={!canUndo} style={tbBtn(!canUndo)} title="Undo (Ctrl+Z)">
        ↩
      </button>
      <button onClick={() => redo()} disabled={!canRedo} style={tbBtn(!canRedo)} title="Redo (Ctrl+Shift+Z)">
        ↪
      </button>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      {(['desktop', 'tablet', 'mobile'] as const).map((responsive) => (
        <button
          key={responsive}
          onClick={() => setResponsiveMode(responsive)}
          title={`${responsive.charAt(0).toUpperCase() + responsive.slice(1)} preview`}
          style={{
            ...tbBtn(false),
            background: responsiveMode === responsive ? '#1e3a4c' : 'transparent',
            borderColor: responsiveMode === responsive ? '#0ea5e9' : '#222',
            color: responsiveMode === responsive ? '#7dd3fc' : '#666',
          }}
        >
          {responsive === 'desktop' ? '🖥' : responsive === 'tablet' ? '📱' : '📲'}
        </button>
      ))}

      {mode === 'pages' ? (
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
      ) : (
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.03em' }}>
          {titleLabel}
        </span>
      )}

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: '11px', color: statusColor }}>{statusText}</span>

      <div style={{ width: '1px', height: '20px', background: '#222', margin: '0 2px' }} />

      <button
        onClick={onShowHistory}
        disabled={!canShowHistory}
        style={{ ...tbBtn(!canShowHistory), padding: '6px 10px', fontSize: '12px' }}
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
  onSaveDraft: () => void;
  onPublish: () => void;
};

type LeftPanelTab = 'blocks' | 'structure' | 'inspector';

const leftPanelBtnBase: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: '1px solid #222',
  borderRadius: '8px',
  color: '#666',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  padding: '8px 10px',
  textTransform: 'uppercase',
};

function PageEditorCore({ onSaveDraft, onPublish }: PageEditorCoreProps) {
  const sections = useEditorStore((s) => s.sections);
  const addBlock = useEditorStore((s) => s.addBlock);
  const moveSection = useEditorStore((s) => s.moveSection);
  const moveBlockWithinColumn = useEditorStore((s) => s.moveBlockWithinColumn);
  const moveBlockBetweenColumns = useEditorStore((s) => s.moveBlockBetweenColumns);
  const moveColumn = useEditorStore((s) => s.moveColumn);
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);

  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('structure');

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
      setActiveDrag({
        type: 'block',
        label: (block?.data?.title as string) || def?.label || 'Block',
        icon: def?.icon || '📦',
      });
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
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveColumn(sectionId, fromIndex, toIndex);
      }
      return;
    }

    if (activeData?.type === 'block') {
      const { sectionId: fromSec, columnId: fromCol, blockId } = activeData as {
        sectionId: string;
        columnId: string;
        blockId: string;
      };
      const overId = String(over.id);
      let toSec: string;
      let toCol: string;
      let toIndex: number;

      if (overId.startsWith('col-drop:')) {
        const [, s, c] = overId.split(':');
        toSec = s;
        toCol = c;
        const col = sections.find((sec) => sec.id === s)?.columns.find((colItem) => colItem.id === c);
        toIndex = col?.blocks.length ?? 0;
      } else if (overId.startsWith('block:')) {
        const [, s, c, targetBlockId] = overId.split(':');
        toSec = s;
        toCol = c;
        const col = sections.find((sec) => sec.id === s)?.columns.find((colItem) => colItem.id === c);
        toIndex = col?.blocks.findIndex((b) => b.id === targetBlockId) ?? 0;
      } else {
        return;
      }

      if (fromSec === toSec && fromCol === toCol) {
        const col = sections.find((s) => s.id === fromSec)?.columns.find((c) => c.id === fromCol);
        const fromIndex = col?.blocks.findIndex((b) => b.id === blockId) ?? -1;
        if (fromIndex !== -1 && fromIndex !== toIndex) {
          moveBlockWithinColumn(fromSec, fromCol, fromIndex, toIndex);
        }
      } else {
        const col = sections.find((s) => s.id === fromSec)?.columns.find((c) => c.id === fromCol);
        const fromIndex = col?.blocks.findIndex((b) => b.id === blockId) ?? -1;
        if (fromIndex !== -1) {
          moveBlockBetweenColumns(fromSec, fromCol, fromIndex, toSec, toCol, toIndex);
        }
      }
    }
  }

  const previewSrc =
    editorMode === 'homepage'
      ? '/page-editor-preview?mode=homepage'
      : (editorMode === 'converted' || (editorMode === 'pages' && Boolean(convertedPageName)))
        ? `/page-editor-preview?mode=converted-page&page=${encodeURIComponent(convertedPageName ?? '')}`
        : '/page-editor-preview';

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <KeyboardShortcuts onSaveDraft={onSaveDraft} onPublish={onPublish} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside
          style={{
            width: '380px',
            flexShrink: 0,
            background: '#0b0b0b',
            borderRight: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <div style={{ padding: '10px', borderBottom: '1px solid #1a1a1a', background: '#0a0a0a' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([
                ['blocks', 'Blocks'],
                ['structure', 'Structure'],
                ['inspector', 'Inspector'],
              ] as const).map(([tab, label]) => {
                const active = leftPanelTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setLeftPanelTab(tab)}
                    style={{
                      ...leftPanelBtnBase,
                      background: active ? '#111827' : 'transparent',
                      borderColor: active ? '#0ea5e9' : '#222',
                      color: active ? '#7dd3fc' : '#666',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {leftPanelTab === 'blocks' ? (
              <BlockPalette embedded />
            ) : leftPanelTab === 'structure' ? (
              <Canvas activeDrag={activeDrag} embedded />
            ) : (
              <ConfigPanel embedded />
            )}
          </div>
        </aside>
        <PreviewIframe src={previewSrc} />
      </div>
      <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
        {activeDrag && (
          <div
            style={{
              background: '#0c1a24',
              border: '2px solid #0ea5e9',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          >
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
  mode?: EditorMode;
};

export default function PageEditorView({ params, mode = 'pages' }: PageEditorViewProps) {
  const [pageId, setResolvedPageId] = useState(params?.id ?? params?.segments?.[0] ?? '');
  const [pageTitle, setPageTitle] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [convertedBaseContent, setConvertedBaseContent] = useState<Record<string, unknown> | null>(null);

  const setPageId = useEditorStore((s) => s.setPageId);
  const setEditorMode = useEditorStore((s) => s.setEditorMode);
  const editorMode = useEditorStore((s) => s.editorMode);
  const convertedPageName = useEditorStore((s) => s.convertedPageName);
  const setConvertedPageName = useEditorStore((s) => s.setConvertedPageName);
  const setSections = useEditorStore((s) => s.setSections);
  const setLoading = useEditorStore((s) => s.setLoading);
  const isLoading = useEditorStore((s) => s.isLoading);
  const sections = useEditorStore((s) => s.sections);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toasts, show: showToast, dismiss } = useToast();

  useEffect(() => {
    setEditorMode(mode);
  }, [mode, setEditorMode]);

  useEffect(() => {
    if (editorMode === 'converted' && !convertedPageName && typeof window !== 'undefined') {
      const inferred = inferConvertedPageNameFromPathname(window.location.pathname);
      if (inferred) setConvertedPageName(inferred);
    }
  }, [editorMode, convertedPageName, setConvertedPageName]);

  useEffect(() => {
    if (editorMode !== 'pages' || pageId) return;

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
  }, [editorMode, pageId, params?.id, params?.segments]);

  useEffect(() => {
    let cancelled = false;

    async function loadPagesMode() {
      if (!pageId) return;
      setPageId(pageId);
      setLoading(true);
      clearRuntimeBlockDefinitions('cp-');
      try {
        // NOTE: do not request draft overlays here; historical versions can
        // duplicate stale block rows in the API response for legacy records.
        const res = await fetch(`/api/pages/${pageId}`, { credentials: 'include' });
        const doc = (await res.json()) as Record<string, unknown>;
        if (cancelled) return;
        if (typeof doc.title === 'string') setPageTitle(doc.title);

        const convertedName =
          typeof doc.convertedPageName === 'string' && doc.convertedPageName
            ? doc.convertedPageName
            : null;
        const convertedContent =
          doc.convertedContent && typeof doc.convertedContent === 'object'
            ? (doc.convertedContent as Record<string, unknown>)
            : null;

        if (convertedName) {
          const convertedRes = await fetch(
            `/api/admin/converted-page-content?page=${encodeURIComponent(convertedName)}`,
            { credentials: 'include' },
          );

          if (convertedRes.ok) {
            const convertedPayload = (await convertedRes.json()) as ConvertedContentResponse;
            const effectiveContent = convertedContent ?? convertedPayload.content;
            const nextSections = convertedPageContentToSections(
              convertedName,
              effectiveContent,
              convertedPayload.sections,
            );

            const specByKey = new Map(convertedPayload.sections.map((spec) => [spec.key, spec]));
            const runtimeDefinitions: Record<string, BlockDefinition> = {};

            for (const section of nextSections) {
              for (const column of section.columns) {
                for (const block of column.blocks) {
                  const keyPart = block.blockType.replace(`cp-${convertedName}-`, '');
                  const spec = specByKey.get(keyPart);
                  runtimeDefinitions[block.blockType] = buildConvertedBlockDefinition(
                    block.blockType,
                    spec?.label ?? section.label ?? keyPart,
                    spec?.icon ?? '🧩',
                    block.data as Record<string, unknown>,
                  );
                }
              }
            }

            registerRuntimeBlockDefinitions(runtimeDefinitions);
            setConvertedPageName(convertedName);
            setConvertedBaseContent(effectiveContent);
            setSections(nextSections);
            return;
          }
        }

        setConvertedPageName(null);
        setConvertedBaseContent(null);

        if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
          const parsedSections = deserializeSectionsFromPayload(doc.blocks as Record<string, unknown>[]);
          setSections(parsedSections);
        } else {
          setSections([]);
        }
      } catch {
        if (!cancelled) setSections([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadHomepageMode() {
      setLoading(true);
      setPageId('homepage-global');
      try {
        const res = await fetch('/api/globals/homepage?draft=true', { credentials: 'include' });
        const doc = (await res.json()) as Record<string, unknown>;
        if (cancelled) return;
        setSections(homepageDocToSections(doc));
      } catch {
        if (!cancelled) setSections([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadConvertedMode() {
      if (!convertedPageName) return;
      setLoading(true);
      setPageId(`converted-${convertedPageName}`);
      clearRuntimeBlockDefinitions(`cp-${convertedPageName}-`);

      try {
        const [convertedRes, pageRes] = await Promise.all([
          fetch(
            `/api/admin/converted-page-content?page=${encodeURIComponent(convertedPageName)}`,
            { credentials: 'include' },
          ),
          fetch(
            `/api/pages?where[convertedPageName][equals]=${encodeURIComponent(convertedPageName)}&limit=1&depth=0`,
            { credentials: 'include' },
          ),
        ]);

        if (!convertedRes.ok) {
          throw new Error('Failed to load converted page content');
        }
        const payload = (await convertedRes.json()) as ConvertedContentResponse;
        const pagePayload = pageRes.ok
          ? (await pageRes.json()) as PagesFindResponse
          : null;

        const pageDoc = pagePayload?.docs?.[0];
        const convertedContent =
          pageDoc?.convertedContent && typeof pageDoc.convertedContent === 'object'
            ? (pageDoc.convertedContent as Record<string, unknown>)
            : null;

        if (cancelled) return;

        if (pageDoc?.id != null) {
          setResolvedPageId(String(pageDoc.id));
        }
        if (typeof pageDoc?.title === 'string') {
          setPageTitle(pageDoc.title);
        }

        const nextSections = convertedPageContentToSections(
          convertedPageName,
          convertedContent ?? payload.content,
          payload.sections,
        );

        const specByKey = new Map(payload.sections.map((spec) => [spec.key, spec]));
        const runtimeDefinitions: Record<string, BlockDefinition> = {};

        for (const section of nextSections) {
          for (const column of section.columns) {
            for (const block of column.blocks) {
              const keyPart = block.blockType.replace(`cp-${convertedPageName}-`, '');
              const spec = specByKey.get(keyPart);
              runtimeDefinitions[block.blockType] = buildConvertedBlockDefinition(
                block.blockType,
                spec?.label ?? section.label ?? keyPart,
                spec?.icon ?? '🧩',
                block.data as Record<string, unknown>,
              );
            }
          }
        }

        registerRuntimeBlockDefinitions(runtimeDefinitions);
        setConvertedBaseContent(convertedContent ?? payload.content);
        setSections(nextSections);
      } catch {
        if (!cancelled) {
          setSections([]);
          setConvertedBaseContent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (editorMode === 'pages') {
      void loadPagesMode();
    } else if (editorMode === 'homepage') {
      void loadHomepageMode();
    } else {
      void loadConvertedMode();
    }

    return () => {
      cancelled = true;
    };
  }, [
    editorMode,
    pageId,
    convertedPageName,
    setLoading,
    setPageId,
    setSections,
    setConvertedPageName,
  ]);

  useEffect(() => {
    return () => {
      clearRuntimeBlockDefinitions('cp-');
    };
  }, []);

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

  const persist = useCallback(
    async ({ status, notify }: { status: 'draft' | 'published'; notify: boolean }) => {
      if (saveStatus === 'saving') return false;

      if (editorMode === 'pages' && !pageId) return false;
      if ((editorMode === 'converted' || (editorMode === 'pages' && convertedPageName)) && !convertedPageName) {
        return false;
      }

      setSaveStatus('saving');

      try {
        let res: Response;

        if (editorMode === 'homepage') {
          const patch = sectionsToHomepagePatch(sections);
          res = await fetch('/api/globals/homepage', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              ...patch,
              _status: status,
            }),
          });
        } else if (editorMode === 'converted' || (editorMode === 'pages' && convertedPageName)) {
          const base = convertedBaseContent ?? {};
          const nextContent = sectionsToConvertedPageContent(base, sections);
          res = await fetch(`/api/pages/${pageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: pageTitle.trim() || 'Untitled Page',
              convertedPageName,
              convertedContent: nextContent,
              blocks: [],
              _status: status,
            }),
          });
        } else {
          res = await fetch(`/api/pages/${pageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: pageTitle.trim() || 'Untitled Page',
              blocks: serializeSectionsForPayload(sections),
              _status: status,
            }),
          });
        }

        if (!res.ok) {
          setSaveStatus('error');
          if (notify) {
            showToast(
              status === 'published' ? 'Publish failed — please try again' : 'Save failed — please try again',
              'error',
            );
          }
          return false;
        }

        setSaveStatus('saved');
        if (notify) {
          if (editorMode === 'converted') {
            showToast('Converted page content updated', 'success');
          } else if (editorMode === 'pages' && convertedPageName) {
            showToast(
              status === 'published' ? 'Converted CMS page published successfully' : 'Converted CMS page saved',
              'success',
            );
          } else {
            showToast(
              status === 'published' ? 'Page published successfully' : 'Draft saved',
              'success',
              status === 'published' ? 4000 : 2500,
            );
          }
        }
        return true;
      } catch {
        setSaveStatus('error');
        if (notify) {
          showToast(
            status === 'published' ? 'Publish failed — network error' : 'Save failed — network error',
            'error',
          );
        }
        return false;
      }
    },
    [
      saveStatus,
      editorMode,
      pageId,
      convertedPageName,
      convertedBaseContent,
      sections,
      pageTitle,
      setSaveStatus,
      showToast,
    ],
  );

  useEffect(() => {
    if (saveStatus !== 'dirty') return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      void persist({ status: 'draft', notify: false });
    }, 30_000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [saveStatus, persist]);

  const saveDraft = useCallback(async () => {
    await persist({ status: 'draft', notify: true });
  }, [persist]);

  const publish = useCallback(async () => {
    await persist({ status: 'published', notify: true });
  }, [persist]);

  const showMissingPageId = editorMode === 'pages' && !pageId;

  const historyPageId = useMemo(() => {
    if (editorMode === 'pages') return pageId;
    if (editorMode === 'homepage') return 'homepage-global';
    return null;
  }, [editorMode, pageId]);

  if (showMissingPageId) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0f0f0f',
          color: '#555',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>⚠️</p>
          <p style={{ fontSize: '16px', margin: '0 0 8px', color: '#ccc' }}>No page ID provided</p>
          <Link href="/admin/collections/pages" style={{ color: '#0ea5e9', fontSize: '13px' }}>
            ← Back to Pages
          </Link>
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
        mode={editorMode}
        pageTitle={pageTitle}
        convertedPageName={convertedPageName}
        canShowHistory={Boolean(historyPageId)}
        onPageTitleChange={(nextTitle) => {
          setPageTitle(nextTitle);
          if (saveStatus !== 'saving') {
            setSaveStatus('dirty');
          }
        }}
        onSaveDraft={saveDraft}
        onPublish={publish}
        onShowHistory={() => {
          if (historyPageId) setShowHistory(true);
        }}
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
      {showHistory && historyPageId && (
        <RevisionHistory pageId={historyPageId} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
