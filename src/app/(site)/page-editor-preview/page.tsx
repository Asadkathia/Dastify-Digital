'use client';

import { useEffect, useRef, useState } from 'react';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import type { EditorMessage, BlockInstance } from '@/payload/views/PageEditor/types';

function buildPayloadShape(blocks: BlockInstance[]): Record<string, unknown>[] {
  return blocks.map((b) => ({ blockType: b.blockType, ...b.data }));
}

// Text fields that support inline editing
const INLINE_TEXT_FIELDS = [
  'title',
  'subtitle',
  'eyebrow',
  'content',
  'text',
  'buttonLabel',
  'primaryCtaLabel',
  'secondaryCtaLabel',
  'leftTitle',
  'leftText',
  'rightTitle',
  'rightText',
  'col1Title',
  'col1Text',
  'col2Title',
  'col2Text',
  'col3Title',
  'col3Text',
];

function sendToParent(msg: EditorMessage) {
  window.parent.postMessage(msg, '*');
}

// ─── Inline editable wrapper ─────────────────────────────────────────────────
// Wraps the block content and intercepts double-clicks on text nodes.
// When the user double-clicks a text element, it becomes contenteditable.

function BlockWrapper({
  instanceId,
  isSelected,
  blockData,
  blockStyles,
  children,
}: {
  instanceId: string;
  isSelected: boolean;
  blockData: Record<string, unknown>;
  blockStyles?: import('@/payload/views/PageEditor/types').BlockStyles;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    sendToParent({ type: 'BLOCK_CLICKED', blockId: instanceId });
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;

    // Find an ancestor-or-self that has a data-field attribute
    let el: HTMLElement | null = target;
    while (el && el !== ref.current) {
      if (el.dataset?.field) break;
      el = el.parentElement;
    }

    if (!el || !el.dataset?.field) {
      // No field target — fall back to making the nearest text node editable
      const textEl = findNearestTextElement(target, ref.current);
      if (!textEl || !textEl.dataset?.field) return;
      el = textEl;
    }

    const fieldName = el.dataset.field ?? '';
    if (!fieldName || !INLINE_TEXT_FIELDS.includes(fieldName)) return;

    el.contentEditable = 'true';
    el.focus();

    // Place cursor at click position
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (range) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    function handleBlur() {
      if (!el) return;
      el.contentEditable = 'false';
      const newValue = el.textContent ?? '';
      sendToParent({ type: 'INLINE_EDIT_END', blockId: instanceId, fieldName: fieldName, value: newValue });
      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(ke: KeyboardEvent) {
      if (ke.key === 'Escape' || (ke.key === 'Enter' && !ke.shiftKey)) {
        ke.preventDefault();
        (ke.currentTarget as HTMLElement).blur();
      }
    }

    el.addEventListener('blur', handleBlur);
    el.addEventListener('keydown', handleKeyDown);
  }

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(blockStyles?.paddingTop != null ? { paddingTop: blockStyles.paddingTop } : {}),
    ...(blockStyles?.paddingBottom != null ? { paddingBottom: blockStyles.paddingBottom } : {}),
    ...(blockStyles?.backgroundColor ? { backgroundColor: blockStyles.backgroundColor } : {}),
  };

  return (
    <div
      ref={ref}
      id={`block-${instanceId}`}
      style={wrapperStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection outline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          outline: isSelected ? '2px solid #0ea5e9' : '2px solid transparent',
          outlineOffset: '-2px',
          transition: 'outline-color 0.15s',
        }}
      />
      {/* Selected label */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 20,
            background: '#0ea5e9',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderBottomRightRadius: '6px',
            pointerEvents: 'none',
            fontFamily: 'sans-serif',
          }}
        >
          Selected · Double-click text to edit inline
        </div>
      )}
      {children}
    </div>
  );
}

function findNearestTextElement(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field && ['p', 'h1', 'h2', 'h3', 'span', 'a'].includes(el.tagName.toLowerCase())) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

// ─── Main preview page ────────────────────────────────────────────────────────

export default function PageEditorPreview() {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [responsiveMode, setResponsiveMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
      if (!data?.type) return;

      if (data.type === 'UPDATE_BLOCKS') {
        setBlocks(data.blocks);
        setResponsiveMode(data.responsiveMode);
      }

      if (data.type === 'SELECT_BLOCK') {
        setSelectedBlockId(data.blockId);
        if (data.blockId) {
          const el = document.getElementById(`block-${data.blockId}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    window.addEventListener('message', handleMessage);
    sendToParent({ type: 'EDITOR_READY' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const visibleBlocks = blocks.filter((b) => !b.styles?.hiddenOn?.includes(responsiveMode));
  const payloadBlocks = buildPayloadShape(visibleBlocks);
  const pageBlocks = mapPayloadBlocksToPageBuilderBlocks(payloadBlocks as never);

  if (visibleBlocks.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          color: '#999',
          fontFamily: 'sans-serif',
        }}
      >
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>📄</p>
        <p style={{ fontSize: '16px', margin: 0 }}>Add blocks to see your page preview</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {pageBlocks.map((block, index) => {
        const instance = visibleBlocks[index];
        if (!instance) return null;
        return (
          <BlockWrapper
            key={instance.id}
            instanceId={instance.id}
            isSelected={instance.id === selectedBlockId}
            blockData={instance.data}
            blockStyles={instance.styles}
          >
            <PageBlocksRenderer blocks={[block]} />
          </BlockWrapper>
        );
      })}
    </div>
  );
}
