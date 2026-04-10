'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorStore } from './store';
import type { EditorMessage, ResponsiveMode } from './types';

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

  const selectedBlockId = selection?.kind === 'block' ? selection.blockId : null;

  // Fallback ready if EDITOR_READY message never arrives
  useEffect(() => {
    const fallback = setTimeout(() => { setFrameLoaded(true); setIframeReady(true); }, 1500);
    return () => clearTimeout(fallback);
  }, [setIframeReady]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
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
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sections, selectBlock, setIframeReady, updateBlockData]);

  // Send sections to iframe (debounced)
  const sendSections = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'UPDATE_SECTIONS', sections, responsiveMode } satisfies EditorMessage,
      '*',
    );
  }, [sections, responsiveMode]);

  useEffect(() => {
    if (!frameLoaded) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(sendSections, DEBOUNCE_MS);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [sections, responsiveMode, frameLoaded, sendSections]);

  // Send selected block to iframe
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !frameLoaded) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'SELECT_BLOCK', blockId: selectedBlockId } satisfies EditorMessage,
      '*',
    );
  }, [selectedBlockId, frameLoaded]);

  function handleLoad() {
    setFrameLoaded(true);
    setIframeReady(true);
    setTimeout(() => {
      sendSections();
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'SELECT_BLOCK', blockId: selectedBlockId } satisfies EditorMessage,
          '*',
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
