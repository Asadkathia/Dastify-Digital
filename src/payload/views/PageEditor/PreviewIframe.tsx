'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorStore } from './store';
import type { EditorMessage, ResponsiveMode, SectionInstance } from './types';

const RESPONSIVE_WIDTHS: Record<ResponsiveMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const DEBOUNCE_MS = 120;

type PreviewIframeProps = {
  src?: string;
};

export function PreviewIframe({ src = '/page-editor-preview' }: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const sections = useEditorStore((s) => s.sections);
  const selection = useEditorStore((s) => s.selection);
  const responsiveMode = useEditorStore((s) => s.responsiveMode);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const setIframeReady = useEditorStore((s) => s.setIframeReady);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);
  const setSelectedNode = useEditorStore((s) => s.setSelectedNode);
  const moveBlockWithinColumn = useEditorStore((s) => s.moveBlockWithinColumn);
  const moveBlockBetweenColumns = useEditorStore((s) => s.moveBlockBetweenColumns);
  const moveSection = useEditorStore((s) => s.moveSection);
  const selectWidget = useEditorStore((s) => s.selectWidget);
  const moveWidgetWithinBlock = useEditorStore((s) => s.moveWidgetWithinBlock);
  const moveWidgetBetweenBlocks = useEditorStore((s) => s.moveWidgetBetweenBlocks);
  const sectionStyleOverrides = useEditorStore((s) => s.sectionStyleOverrides);

  const selectedBlockId = selection?.kind === 'block' ? selection.blockId : null;

  // Fallback ready if EDITOR_READY message never arrives
  useEffect(() => {
    const fallback = setTimeout(() => { setFrameLoaded(true); setIframeReady(true); }, 1500);
    return () => clearTimeout(fallback);
  }, [setIframeReady]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.origin !== window.location.origin) return;
      if (!data?.type) return;

      if (data.type === 'EDITOR_READY') {
        setIframeReady(true);
        setFrameLoaded(true);
      }

      if (data.type === 'BLOCK_CLICKED') {
        // Find the block's section+column to build full selection
        for (const sec of sections) {
          for (const col of sec.columns) {
            if (col.blocks.some((b) => b.id === data.blockId)) {
              selectBlock(sec.id, col.id, data.blockId);
              return;
            }
          }
        }
      }

      if (data.type === 'INLINE_EDIT_END') {
        updateBlockData(data.blockId, data.fieldName, data.value);
      }

      if (data.type === 'TRIGGER_UNDO') {
        useEditorStore.temporal.getState().undo();
      }
      if (data.type === 'TRIGGER_REDO') {
        useEditorStore.temporal.getState().redo();
      }

      if (data.type === 'WIDGET_CLICKED') {
        // Find the block's section+column to build full selection
        for (const sec of sections) {
          for (const col of sec.columns) {
            if (col.blocks.some((b) => b.id === data.blockId)) {
              selectWidget(sec.id, col.id, data.blockId, data.widgetId);
              return;
            }
          }
        }
      }

      if (data.type === 'CONVERTED_NODE_SELECTED') {
        setSelectedNode(data.node);
      }

      if (data.type === 'DRAG_COMMIT') {
        const { drag, drop } = data;

        if (drag.kind === 'block' && drop.kind === 'block') {
          const { blockId, sourceSectionId, sourceColumnId } = drag;
          const { targetSectionId, targetColumnId, targetBlockId, position } = drop;

          // Find indices from current sections state
          const currentSections: SectionInstance[] = sections;
          const srcSection = currentSections.find((s) => s.id === sourceSectionId);
          const srcCol = srcSection?.columns.find((c) => c.id === sourceColumnId);
          const fromIndex = srcCol?.blocks.findIndex((b) => b.id === blockId) ?? -1;
          if (fromIndex === -1) return;

          const tgtSection = currentSections.find((s) => s.id === targetSectionId);
          const tgtCol = tgtSection?.columns.find((c) => c.id === targetColumnId);
          const anchorIndex = tgtCol?.blocks.findIndex((b) => b.id === targetBlockId) ?? -1;
          let toIndex = anchorIndex === -1 ? (tgtCol?.blocks.length ?? 0) : anchorIndex;
          if (position === 'after') toIndex += 1;

          if (sourceSectionId === targetSectionId && sourceColumnId === targetColumnId) {
            moveBlockWithinColumn(sourceSectionId, sourceColumnId, fromIndex, toIndex);
          } else {
            moveBlockBetweenColumns(sourceSectionId, sourceColumnId, fromIndex, targetSectionId, targetColumnId, toIndex);
          }
        }

        if (drag.kind === 'block' && drop.kind === 'column') {
          const { blockId, sourceSectionId, sourceColumnId } = drag;
          const { targetSectionId, targetColumnId, position } = drop;

          const currentSections: SectionInstance[] = sections;
          const srcSection = currentSections.find((s) => s.id === sourceSectionId);
          const srcCol = srcSection?.columns.find((c) => c.id === sourceColumnId);
          const fromIndex = srcCol?.blocks.findIndex((b) => b.id === blockId) ?? -1;
          if (fromIndex === -1) return;

          const tgtSection = currentSections.find((s) => s.id === targetSectionId);
          const tgtCol = tgtSection?.columns.find((c) => c.id === targetColumnId);
          const toIndex = position === 'start' ? 0 : (tgtCol?.blocks.length ?? 0);

          if (sourceSectionId === targetSectionId && sourceColumnId === targetColumnId) {
            moveBlockWithinColumn(sourceSectionId, sourceColumnId, fromIndex, toIndex);
          } else {
            moveBlockBetweenColumns(sourceSectionId, sourceColumnId, fromIndex, targetSectionId, targetColumnId, toIndex);
          }
        }

        if (drag.kind === 'section' && drop.kind === 'section') {
          const { sectionId } = drag;
          const { targetSectionId, position } = drop;
          const currentSections: SectionInstance[] = sections;
          const fromIndex = currentSections.findIndex((s) => s.id === sectionId);
          const anchorIndex = currentSections.findIndex((s) => s.id === targetSectionId);
          if (fromIndex === -1 || anchorIndex === -1) return;
          let toIndex = anchorIndex;
          if (position === 'after') toIndex += 1;
          // Adjust for removal
          if (fromIndex < toIndex) toIndex -= 1;
          moveSection(fromIndex, toIndex);
        }

        if (drag.kind === 'widget' && drop.kind === 'widget') {
          const { widgetId, blockId } = drag;
          const { targetBlockId, targetWidgetId, position } = drop;

          if (blockId === targetBlockId) {
            // Same-block reorder
            const block = sections.flatMap((s) => s.columns.flatMap((c) => c.blocks)).find((b) => b.id === blockId);
            if (!block?.widgets) return;
            const fromIndex = block.widgets.findIndex((w) => w.id === widgetId);
            if (fromIndex === -1) return;
            const anchorIndex = targetWidgetId ? block.widgets.findIndex((w) => w.id === targetWidgetId) : block.widgets.length;
            let toIndex = anchorIndex === -1 ? block.widgets.length : anchorIndex;
            if (position === 'after') toIndex += 1;
            if (fromIndex < toIndex) toIndex -= 1;
            moveWidgetWithinBlock(blockId, fromIndex, toIndex);
          } else if (position === 'before' || position === 'after') {
            // Cross-block move
            moveWidgetBetweenBlocks(blockId, widgetId, targetBlockId, targetWidgetId ?? null, position);
          }
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sections, selectBlock, setIframeReady, setSelectedNode, updateBlockData, moveBlockWithinColumn, moveBlockBetweenColumns, moveSection, selectWidget, moveWidgetWithinBlock, moveWidgetBetweenBlocks]);

  // Send sections to iframe (debounced)
  const sendSections = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'UPDATE_SECTIONS', sections, responsiveMode, sectionStyleOverrides } satisfies EditorMessage,
      window.location.origin,
    );
  }, [sections, responsiveMode, sectionStyleOverrides]);

  useEffect(() => {
    if (!frameLoaded) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(sendSections, DEBOUNCE_MS);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [sections, responsiveMode, sectionStyleOverrides, frameLoaded, sendSections]);

  // Send selected block to iframe
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !frameLoaded) return;
    setSelectedNode(null);
    iframeRef.current.contentWindow.postMessage(
      { type: 'SELECT_BLOCK', blockId: selectedBlockId } satisfies EditorMessage,
      window.location.origin,
    );
  }, [selectedBlockId, frameLoaded, setSelectedNode]);

  function handleLoad() {
    setFrameLoaded(true);
    setIframeReady(true);
    setTimeout(() => {
      sendSections();
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'SELECT_BLOCK', blockId: selectedBlockId } satisfies EditorMessage,
          window.location.origin,
        );
      }
    }, 30);
  }

  const frameWidth = RESPONSIVE_WIDTHS[responsiveMode];
  const isConstrained = responsiveMode !== 'desktop';

  return (
    <div
      style={{
        flex: 1,
        background: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
        padding: isConstrained ? '20px' : 0,
      }}
    >
      <div
        style={{
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
        }}
      >
        {!frameLoaded && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontFamily: 'sans-serif' }}>
            <span style={{ color: '#888', fontSize: '13px' }}>Loading preview…</span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={src}
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: isConstrained ? '80vh' : '100%' }}
          title="Page preview"
        />
      </div>
    </div>
  );
}
