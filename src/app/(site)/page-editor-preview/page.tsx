'use client';

import { useEffect, useRef, useState } from 'react';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import type { EditorMessage, SectionInstance, BlockInstance } from '@/payload/views/PageEditor/types';

// Per-column width → individual CSS fraction
const COL_FRACTION: Record<string, string> = {
  '1/1': '1fr',
  '1/2': '1fr',
  '1/3': '1fr',
  '2/3': '2fr',
  '1/4': '1fr',
  '3/4': '3fr',
};

function buildPayloadShape(block: BlockInstance): Record<string, unknown> {
  return { blockType: block.blockType, ...block.data };
}

const INLINE_TEXT_FIELDS = [
  'title', 'subtitle', 'eyebrow', 'content', 'text', 'buttonLabel',
  'leftTitle', 'leftText', 'rightTitle', 'rightText',
  'col1Title', 'col1Text', 'col2Title', 'col2Text', 'col3Title', 'col3Text',
];

function sendToParent(msg: EditorMessage) {
  window.parent.postMessage(msg, '*');
}

// ─── Inline-editable block wrapper ───────────────────────────────────────────

function BlockWrapper({
  block,
  isSelected,
  responsiveMode,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const styles = block.styles;

  // Hide block on current breakpoint
  const hiddenOn = styles?.hiddenOn ?? [];
  if (hiddenOn.includes(responsiveMode as 'desktop' | 'tablet' | 'mobile')) {
    return null;
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    sendToParent({ type: 'BLOCK_CLICKED', blockId: block.id });
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    let el: HTMLElement | null = target;
    while (el && el !== ref.current) {
      if (el.dataset?.field) break;
      el = el.parentElement;
    }
    if (!el || !el.dataset?.field) {
      el = findNearestTextElement(target, ref.current);
    }
    if (!el?.dataset?.field) return;
    const fieldName = el.dataset.field;
    if (!INLINE_TEXT_FIELDS.includes(fieldName)) return;

    el.contentEditable = 'true';
    el.focus();
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (range) { const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }

    function handleBlur() {
      if (!el) return;
      el.contentEditable = 'false';
      sendToParent({ type: 'INLINE_EDIT_END', blockId: block.id, fieldName: fieldName!, value: el.textContent ?? '' });
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

  const fontWeightMap: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(styles?.paddingTop != null ? { paddingTop: `${styles.paddingTop}px` } : {}),
    ...(styles?.paddingBottom != null ? { paddingBottom: `${styles.paddingBottom}px` } : {}),
    ...(styles?.paddingLeft != null ? { paddingLeft: `${styles.paddingLeft}px` } : {}),
    ...(styles?.paddingRight != null ? { paddingRight: `${styles.paddingRight}px` } : {}),
    ...(styles?.marginTop != null ? { marginTop: `${styles.marginTop}px` } : {}),
    ...(styles?.marginBottom != null ? { marginBottom: `${styles.marginBottom}px` } : {}),
    ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
    ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
    ...(styles?.opacity != null && styles.opacity !== 1 ? { opacity: styles.opacity } : {}),
    ...(styles?.borderRadius != null ? { borderRadius: `${styles.borderRadius}px` } : {}),
    ...(styles?.borderWidth != null ? { borderWidth: `${styles.borderWidth}px`, borderStyle: 'solid', borderColor: styles.borderColor ?? '#000' } : {}),
    ...(styles?.boxShadow ? { boxShadow: styles.boxShadow } : {}),
    ...(styles?.textColor ? { color: styles.textColor } : {}),
    ...(styles?.fontSize != null ? { fontSize: `${styles.fontSize}px` } : {}),
    ...(styles?.textAlign ? { textAlign: styles.textAlign } : {}),
    ...(styles?.fontWeight ? { fontWeight: fontWeightMap[styles.fontWeight] } : {}),
    ...(styles?.maxWidth != null ? { maxWidth: `${styles.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
  };

  const payloadShape = buildPayloadShape(block);
  const [pageBlock] = mapPayloadBlocksToPageBuilderBlocks([payloadShape] as never);

  return (
    <div
      ref={ref}
      id={`block-${block.id}`}
      style={wrapperStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection outline */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', outline: isSelected ? '2px solid #0ea5e9' : '2px solid transparent', outlineOffset: '-2px', transition: 'outline-color 0.15s' }} />
      {isSelected && (
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, background: '#0ea5e9', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderBottomRightRadius: '6px', pointerEvents: 'none', fontFamily: 'sans-serif' }}>
          Selected · Double-click to edit
        </div>
      )}
      {pageBlock ? <PageBlocksRenderer blocks={[pageBlock]} /> : null}
    </div>
  );
}

function findNearestTextElement(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field && ['p', 'h1', 'h2', 'h3', 'span', 'a'].includes(el.tagName.toLowerCase())) return el;
    el = el.parentElement;
  }
  return null;
}

// ─── Main preview page ────────────────────────────────────────────────────────

export default function PageEditorPreview() {
  const [sections, setSections] = useState<SectionInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [responsiveMode, setResponsiveMode] = useState('desktop');

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
      if (!data?.type) return;

      if (data.type === 'UPDATE_SECTIONS') {
        setSections(data.sections);
        setResponsiveMode(data.responsiveMode);
      }

      if (data.type === 'SELECT_BLOCK') {
        setSelectedBlockId(data.blockId);
        if (data.blockId) {
          document.getElementById(`block-${data.blockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    window.addEventListener('message', handleMessage);
    sendToParent({ type: 'EDITOR_READY' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const hasBlocks = sections.some((s) => s.columns.some((c) => c.blocks.length > 0));

  if (!hasBlocks) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', color: '#999', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>📄</p>
        <p style={{ fontSize: '16px', margin: 0 }}>Add blocks to see your page preview</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {sections.map((section) => {
        const sectionStyles = section.styles;
        const gridTemplate = section.columns.length === 1
          ? undefined
          : section.columns.map((c) => COL_FRACTION[c.width] ?? '1fr').join(' ');

        return (
          <div
            key={section.id}
            style={{
              ...(sectionStyles?.paddingTop != null ? { paddingTop: `${sectionStyles.paddingTop}px` } : {}),
              ...(sectionStyles?.paddingBottom != null ? { paddingBottom: `${sectionStyles.paddingBottom}px` } : {}),
              ...(sectionStyles?.paddingLeft != null ? { paddingLeft: `${sectionStyles.paddingLeft}px` } : {}),
              ...(sectionStyles?.paddingRight != null ? { paddingRight: `${sectionStyles.paddingRight}px` } : {}),
              ...(sectionStyles?.backgroundColor ? { backgroundColor: sectionStyles.backgroundColor } : {}),
              ...(sectionStyles?.backgroundImage ? { backgroundImage: `url(${sectionStyles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
              ...(sectionStyles?.opacity != null && sectionStyles.opacity !== 1 ? { opacity: sectionStyles.opacity } : {}),
              ...(sectionStyles?.borderWidth != null ? { borderWidth: `${sectionStyles.borderWidth}px`, borderStyle: 'solid', borderColor: sectionStyles.borderColor ?? '#000' } : {}),
              ...(sectionStyles?.boxShadow ? { boxShadow: sectionStyles.boxShadow } : {}),
              ...(sectionStyles?.maxWidth != null ? { maxWidth: `${sectionStyles.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
            }}
          >
            <div
              style={section.columns.length > 1 ? {
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                gap: '0',
              } : undefined}
            >
              {section.columns.map((col) => (
                <div key={col.id}>
                  {col.blocks.map((block) => (
                    <BlockWrapper
                      key={block.id}
                      block={block}
                      isSelected={block.id === selectedBlockId}
                      responsiveMode={responsiveMode}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
