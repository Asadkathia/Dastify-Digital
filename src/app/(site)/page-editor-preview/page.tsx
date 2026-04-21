'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import { Navbar } from '@/app/components/home/Navbar';
import { Hero } from '@/app/components/home/Hero';
import { BrandAcronym } from '@/app/components/home/BrandAcronym';
import { About } from '@/app/components/home/About';
import { FeatureStrip } from '@/app/components/home/FeatureStrip';
import { CaseStudies } from '@/app/components/home/CaseStudies';
import { Services } from '@/app/components/home/Services';
import { Mission } from '@/app/components/home/Mission';
import { Insights } from '@/app/components/home/Insights';
import { Faq } from '@/app/components/home/Faq';
import { Cta } from '@/app/components/home/Cta';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { sectionsToHomepagePatch } from '@/payload/views/HomepageEditor/homepage-adapter';
import { resolveHomepageContent } from '@/lib/resolve-homepage-content';
import { homepageContent, type HomepageContent } from '@/lib/homepage-content';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';
import { generateOverrideCss, type SectionOverrides } from '@/lib/converted-pages/section-overrides';
import { sectionsToConvertedPageContent } from '@/lib/converted-pages/editor-adapter';
import type { EditorMessage, SectionInstance, BlockInstance, DragPayload, DropTarget, WidgetInstance } from '@/payload/views/PageEditor/types';
import { WidgetListRenderer } from '@/components/widgets/WidgetRenderer';
import { SiteNavbar } from '@/components/SiteNavbar';
import type { NavigationData } from '@/lib/cms/queries';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  // homepage fields
  'chip', 'description', 'primaryCta', 'secondaryCta', 'logo', 'cta',
  'tagline', 'copyright', 'note', 'button', 'intro',
  'badgeValue', 'badgeLabel',
];

const INSPECTED_STYLE_KEYS = [
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'color',
  'backgroundColor',
  'borderColor',
  'borderWidth',
  'borderRadius',
  'marginTop',
  'marginBottom',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
] as const;

function sendToParent(msg: EditorMessage) {
  window.parent.postMessage(msg, '*');
}

// ─── Drag engine ─────────────────────────────────────────────────────────────

/** State held by the drag engine (outside React so pointer handlers don't stale-close). */
const dragState = {
  active: false,
  payload: null as DragPayload | null,
  ghostEl: null as HTMLDivElement | null,
  lineEl: null as HTMLDivElement | null,
  rafId: null as number | null,
};

/** Widget-level drag state. */
const widgetDragState = {
  active: false,
  widgetId: null as string | null,
  blockId: null as string | null,
};

/** Update widget insertion line above/below a widget element. */
function updateWidgetInsertionLine(lineEl: HTMLDivElement, x: number, y: number, dragWidgetId?: string) {
  const ghost = document.getElementById('__dnd-ghost__');
  const line = document.getElementById('__dnd-line__');
  if (ghost) ghost.style.display = 'none';
  if (line) line.style.display = 'none';

  const el = document.elementFromPoint(x, y) as HTMLElement | null;

  if (ghost) ghost.style.display = '';
  if (line) line.style.display = '';

  if (!el) { lineEl.style.display = 'none'; return; }

  const widgetEl = findAncestorWithAttr(el, 'widgetId');
  if (widgetEl && widgetEl.dataset.widgetId !== dragWidgetId) {
    const rect = widgetEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const lineY = y < midY ? rect.top - 2 : rect.bottom - 1;
    lineEl.style.display = 'block';
    lineEl.style.top = `${lineY}px`;
    lineEl.style.left = `${rect.left}px`;
    lineEl.style.right = `${document.documentElement.clientWidth - rect.right}px`;
    return;
  }
  lineEl.style.display = 'none';
}

/** Hit-test for widget drop target. */
function hitTestWidgetDrop(x: number, y: number, dragWidgetId?: string, blockId?: string): DropTarget | null {
  const ghost = document.getElementById('__dnd-ghost__');
  const line = document.getElementById('__dnd-line__');
  if (ghost) ghost.style.display = 'none';
  if (line) line.style.display = 'none';

  const el = document.elementFromPoint(x, y) as HTMLElement | null;

  if (ghost) ghost.style.display = '';
  if (line) line.style.display = '';

  if (!el) return null;

  const widgetEl = findAncestorWithAttr(el, 'widgetId');
  if (widgetEl && widgetEl.dataset.widgetId !== dragWidgetId) {
    const targetWidgetId = widgetEl.dataset.widgetId!;
    const targetBlockId = widgetEl.dataset.blockId ?? blockId ?? '';
    const rect = widgetEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    return {
      kind: 'widget',
      targetBlockId,
      targetWidgetId,
      position: y < midY ? 'before' : 'after',
    };
  }

  // Dropped onto the container itself (empty space)
  const containerEl = findAncestorWithAttr(el, 'widgetContainerId');
  if (containerEl) {
    return {
      kind: 'widget',
      targetBlockId: containerEl.dataset.widgetContainerId!,
      targetWidgetId: null,
      position: 'after',
    };
  }

  return null;
}

function createGhost(label: string, x: number, y: number): HTMLDivElement {
  const el = document.createElement('div');
  el.id = '__dnd-ghost__';
  el.textContent = label;
  Object.assign(el.style, {
    position: 'fixed',
    zIndex: '99999',
    pointerEvents: 'none',
    background: '#0ea5e9',
    color: '#fff',
    fontSize: '12px',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    transform: 'translate(-50%,-110%)',
    left: `${x}px`,
    top: `${y}px`,
    whiteSpace: 'nowrap',
    opacity: '0.95',
  });
  document.body.appendChild(el);
  return el;
}

function createInsertionLine(): HTMLDivElement {
  const el = document.createElement('div');
  el.id = '__dnd-line__';
  Object.assign(el.style, {
    position: 'fixed',
    zIndex: '99998',
    pointerEvents: 'none',
    height: '3px',
    background: '#0ea5e9',
    borderRadius: '2px',
    boxShadow: '0 0 0 2px rgba(14,165,233,0.3)',
    display: 'none',
    left: '0',
    right: '0',
  });
  document.body.appendChild(el);
  return el;
}

let edgeScrollRafId: number | null = null;

function startEdgeScroll(clientY: number) {
  const ZONE = 80;  // px from top/bottom edge triggers scroll
  const MAX_SPEED = 12;
  const vh = window.innerHeight;
  let speed = 0;
  if (clientY < ZONE) speed = -MAX_SPEED * (1 - clientY / ZONE);
  else if (clientY > vh - ZONE) speed = MAX_SPEED * (1 - (vh - clientY) / ZONE);
  if (speed !== 0) window.scrollBy(0, speed);
}

function stopEdgeScroll() {
  if (edgeScrollRafId) { cancelAnimationFrame(edgeScrollRafId); edgeScrollRafId = null; }
}

function clearDragOverlays() {
  if (dragState.ghostEl) { dragState.ghostEl.remove(); dragState.ghostEl = null; }
  if (dragState.lineEl) { dragState.lineEl.remove(); dragState.lineEl = null; }
  if (dragState.rafId) { cancelAnimationFrame(dragState.rafId); dragState.rafId = null; }
  stopEdgeScroll();
}

/** Find the innermost element with a given data attribute walking up from target. */
function findAncestorWithAttr(el: HTMLElement | null, attr: string): HTMLElement | null {
  let cur: HTMLElement | null = el;
  while (cur) {
    if (cur.dataset?.[attr]) return cur;
    cur = cur.parentElement;
  }
  return null;
}

/** Hit-test at (x,y) ignoring ghost/line overlays and the dragged block. */
function hitTestDrop(x: number, y: number, dragBlockId?: string): DropTarget | null {
  const ghost = document.getElementById('__dnd-ghost__');
  const line = document.getElementById('__dnd-line__');
  if (ghost) ghost.style.display = 'none';
  if (line) line.style.display = 'none';

  const el = document.elementFromPoint(x, y) as HTMLElement | null;

  if (ghost) ghost.style.display = '';
  if (line) line.style.display = '';

  if (!el) return null;

  // Try block target first
  const blockEl = findAncestorWithAttr(el, 'dndBlockId');
  if (blockEl) {
    const targetBlockId = blockEl.dataset.dndBlockId!;
    if (targetBlockId === dragBlockId) return null; // same block
    const targetColumnId = blockEl.dataset.dndColumnId!;
    const targetSectionId = blockEl.dataset.dndSectionId!;
    const rect = blockEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    return {
      kind: 'block',
      targetSectionId,
      targetColumnId,
      targetBlockId,
      position: y < midY ? 'before' : 'after',
    };
  }

  // Try column target (empty column)
  const colEl = findAncestorWithAttr(el, 'dndColumnId');
  if (colEl && !findAncestorWithAttr(el, 'dndBlockId')) {
    const targetColumnId = colEl.dataset.dndColumnId!;
    const targetSectionId = colEl.dataset.dndSectionId!;
    const rect = colEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    return {
      kind: 'column',
      targetSectionId,
      targetColumnId,
      position: y < midY ? 'start' : 'end',
    };
  }

  // Section target
  const secEl = findAncestorWithAttr(el, 'dndSectionId');
  if (secEl) {
    const targetSectionId = secEl.dataset.dndSectionId!;
    const rect = secEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    return {
      kind: 'section',
      targetSectionId,
      position: y < midY ? 'before' : 'after',
    };
  }

  return null;
}

/** Show insertion line above/below a target element. */
function updateInsertionLine(lineEl: HTMLDivElement, x: number, y: number, dragBlockId?: string) {
  const ghost = document.getElementById('__dnd-ghost__');
  const line = document.getElementById('__dnd-line__');
  if (ghost) ghost.style.display = 'none';
  if (line) line.style.display = 'none';

  const el = document.elementFromPoint(x, y) as HTMLElement | null;

  if (ghost) ghost.style.display = '';
  if (line) line.style.display = '';

  if (!el) { lineEl.style.display = 'none'; return; }

  const blockEl = findAncestorWithAttr(el, 'dndBlockId');
  if (blockEl && blockEl.dataset.dndBlockId !== dragBlockId) {
    const rect = blockEl.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const lineY = y < midY ? rect.top - 2 : rect.bottom - 1;
    lineEl.style.display = 'block';
    lineEl.style.top = `${lineY}px`;
    lineEl.style.left = `${rect.left}px`;
    lineEl.style.right = `${document.documentElement.clientWidth - rect.right}px`;
    return;
  }

  lineEl.style.display = 'none';
}

function findInspectableElement(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field) return el;
    el = el.parentElement;
  }
  return null;
}

function buildNodeSelection(blockId: string, element: HTMLElement) {
  const computed = window.getComputedStyle(element);
  const computedStyles = Object.fromEntries(
    INSPECTED_STYLE_KEYS.map((key) => [key, computed[key]]),
  ) as Record<string, string>;

  return {
    blockId,
    fieldName: element.dataset.field ?? '',
    styleField: element.dataset.styleField || undefined,
    tagField: element.dataset.tagField || undefined,
    allowedTags: element.dataset.allowedTags?.split(',').map((tag) => tag.trim()).filter(Boolean),
    tagName: element.tagName.toLowerCase(),
    className: element.className,
    textValue: element.innerText || element.textContent || '',
    computedStyles,
  };
}

// ─── Shared block click/inline-edit wrapper ───────────────────────────────────

function BlockWrapper({
  block,
  isSelected,
  responsiveMode,
  sectionId,
  columnId,
  children,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  sectionId: string;
  columnId: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const styles = block.styles;

  const hiddenOn = styles?.hiddenOn ?? [];
  if (hiddenOn.includes(responsiveMode as 'desktop' | 'tablet' | 'mobile')) return null;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    // Block default navigation on <a>/<Link> clicks so a user single-click on a
    // CTA doesn't navigate the preview iframe away before dblclick can fire
    // (which would break inline editing). We still capture the selection.
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      e.preventDefault();
    }
    sendToParent({ type: 'BLOCK_CLICKED', blockId: block.id });
    const inspectable = findInspectableElement(target, ref.current);
    if (inspectable) {
      sendToParent({ type: 'CONVERTED_NODE_SELECTED', node: buildNodeSelection(block.id, inspectable) });
    } else {
      sendToParent({ type: 'CONVERTED_NODE_SELECTED', node: null });
    }
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
      el = findNearestTextField(target, ref.current);
    }
    if (!el?.dataset?.field) return;
    const fieldName = el.dataset.field;
    if (!fieldName) return;
    if (!block.blockType.startsWith('cp-') && !INLINE_TEXT_FIELDS.includes(fieldName)) return;

    // Snapshot the original plain-text content before editing begins.
    // We'll restore it on blur so React sees a clean DOM to reconcile against.
    const originalText = el.innerText || el.textContent || '';

    el.contentEditable = 'true';
    el.focus();
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (range) { const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }

    function handleBlur() {
      if (!el) return;
      const isRich = el.dataset.richText === 'true';
      const value = isRich ? el.innerHTML : (el.innerText || el.textContent || '');

      // Turn off editing first
      el.contentEditable = 'false';

      // Restore the element to its original plain-text content so React can
      // reconcile without fighting browser-extension-injected span nodes.
      // The store update will immediately re-render with the new value.
      if (!isRich) {
        el.textContent = originalText;
      }

      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeyDown);

      // Defer the store update one tick so the DOM has fully settled
      // (contentEditable cleanup, extension span removal) before React re-renders.
      requestAnimationFrame(() => {
        sendToParent({ type: 'INLINE_EDIT_END', blockId: block.id, fieldName: fieldName!, value });
      });
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

  // Merge breakpoint overrides on top of base styles
  const bpOverrides = responsiveMode === 'mobile'
    ? (styles?.mobile ?? {})
    : responsiveMode === 'tablet'
      ? (styles?.tablet ?? {})
      : {};
  const effective = { ...styles, ...bpOverrides };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(effective.paddingTop != null ? { paddingTop: `${effective.paddingTop}px` } : {}),
    ...(effective.paddingBottom != null ? { paddingBottom: `${effective.paddingBottom}px` } : {}),
    ...(effective.paddingLeft != null ? { paddingLeft: `${effective.paddingLeft}px` } : {}),
    ...(effective.paddingRight != null ? { paddingRight: `${effective.paddingRight}px` } : {}),
    ...(effective.marginTop != null ? { marginTop: `${effective.marginTop}px` } : {}),
    ...(effective.marginBottom != null ? { marginBottom: `${effective.marginBottom}px` } : {}),
    ...(effective.backgroundColor ? { backgroundColor: effective.backgroundColor } : {}),
    ...(effective.backgroundImage ? { backgroundImage: `url(${effective.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: effective.backgroundPosition ?? 'center' } : {}),
    ...(effective.opacity != null && effective.opacity !== 1 ? { opacity: effective.opacity } : {}),
    ...(effective.borderRadius != null ? { borderRadius: `${effective.borderRadius}px` } : {}),
    ...(effective.borderWidth != null ? { borderWidth: `${effective.borderWidth}px`, borderStyle: 'solid', borderColor: effective.borderColor ?? '#000' } : {}),
    ...(effective.boxShadow ? { boxShadow: effective.boxShadow } : {}),
    ...(effective.textColor ? { color: effective.textColor } : {}),
    ...(effective.fontSize != null ? { fontSize: `${effective.fontSize}px` } : {}),
    ...(effective.textAlign ? { textAlign: effective.textAlign } : {}),
    ...(effective.fontWeight ? { fontWeight: fontWeightMap[effective.fontWeight] } : {}),
    ...(effective.maxWidth != null ? { maxWidth: `${effective.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
  };

  function handleDragHandlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const handle = e.currentTarget as HTMLElement;
    try { handle.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events can't capture */ }

    dragState.active = true;
    dragState.payload = { kind: 'block', blockId: block.id, sourceSectionId: sectionId, sourceColumnId: columnId };
    dragState.ghostEl = createGhost(block.blockType.replace('cp-', '').replace('hp-', '').replace(/-/g, ' '), e.clientX, e.clientY);
    dragState.lineEl = createInsertionLine();

    function onPointerMove(me: PointerEvent) {
      if (!dragState.active) return;
      startEdgeScroll(me.clientY);
      if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
      dragState.rafId = requestAnimationFrame(() => {
        if (dragState.ghostEl) {
          dragState.ghostEl.style.left = `${me.clientX}px`;
          dragState.ghostEl.style.top = `${me.clientY}px`;
        }
        if (dragState.lineEl) {
          updateInsertionLine(dragState.lineEl, me.clientX, me.clientY, block.id);
        }
      });
    }

    function onPointerUp(ue: PointerEvent) {
      if (!dragState.active) { cleanup(); return; }
      const drop = hitTestDrop(ue.clientX, ue.clientY, block.id);
      clearDragOverlays();
      dragState.active = false;
      const payload = dragState.payload;
      dragState.payload = null;
      cleanup();
      if (drop && payload) {
        sendToParent({ type: 'DRAG_COMMIT', drag: payload, drop });
      }
    }

    function onPointerCancel() {
      clearDragOverlays();
      dragState.active = false;
      dragState.payload = null;
      cleanup();
    }

    function cleanup() {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
    }

    // Listen on document so events fire even outside the handle element
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
  }

  return (
    <div
      ref={ref}
      id={`block-${block.id}`}
      data-dnd-block-id={block.id}
      data-dnd-section-id={sectionId}
      data-dnd-column-id={columnId}
      style={wrapperStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', outline: isSelected ? '2px solid #0ea5e9' : '2px solid transparent', outlineOffset: '-2px', transition: 'outline-color 0.15s' }} />
      {/* Drag handle — visible on hover via CSS */}
      <div
        className="dnd-handle"
        onPointerDown={handleDragHandlePointerDown}
        title="Drag to reorder"
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          zIndex: 30,
          width: '22px',
          height: '22px',
          borderRadius: '4px',
          background: 'rgba(14,165,233,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 0.15s',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="4" cy="3" r="1" fill="white"/>
          <circle cx="8" cy="3" r="1" fill="white"/>
          <circle cx="4" cy="6" r="1" fill="white"/>
          <circle cx="8" cy="6" r="1" fill="white"/>
          <circle cx="4" cy="9" r="1" fill="white"/>
          <circle cx="8" cy="9" r="1" fill="white"/>
        </svg>
      </div>
      {isSelected && (
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, background: '#0ea5e9', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderBottomRightRadius: '6px', pointerEvents: 'none', fontFamily: 'sans-serif' }}>
          Selected · Click element to inspect · Double-click text to edit
        </div>
      )}
      {children}
    </div>
  );
}

function findNearestTextField(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field && ['p', 'h1', 'h2', 'h3', 'h4', 'span', 'a', 'li'].includes(el.tagName.toLowerCase())) return el;
    el = el.parentElement;
  }
  return null;
}

// ─── Widget container renderer (widget-container block type) ─────────────────

function WidgetItem({
  widget,
  blockId,
  selectedWidgetId,
  onWidgetClick,
}: {
  widget: WidgetInstance;
  blockId: string;
  selectedWidgetId: string | null;
  onWidgetClick: (id: string) => void;
}) {
  const isSelected = selectedWidgetId === widget.id;

  function handleWidgetDragHandlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const handle = e.currentTarget as HTMLElement;
    try { handle.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }

    widgetDragState.active = true;
    widgetDragState.widgetId = widget.id;
    widgetDragState.blockId = blockId;

    dragState.ghostEl = createGhost(widget.widgetType, e.clientX, e.clientY);
    dragState.lineEl = createInsertionLine();

    const payload: DragPayload = { kind: 'widget', widgetId: widget.id, blockId, parentWidgetId: null };

    function onPointerMove(me: PointerEvent) {
      if (!widgetDragState.active) return;
      startEdgeScroll(me.clientY);
      if (dragState.rafId) cancelAnimationFrame(dragState.rafId);
      dragState.rafId = requestAnimationFrame(() => {
        if (dragState.ghostEl) {
          dragState.ghostEl.style.left = `${me.clientX}px`;
          dragState.ghostEl.style.top = `${me.clientY}px`;
        }
        if (dragState.lineEl) {
          updateWidgetInsertionLine(dragState.lineEl, me.clientX, me.clientY, widget.id);
        }
      });
    }

    function onPointerUp(ue: PointerEvent) {
      if (!widgetDragState.active) { cleanup(); return; }
      const drop = hitTestWidgetDrop(ue.clientX, ue.clientY, widget.id, blockId);
      clearDragOverlays();
      widgetDragState.active = false;
      widgetDragState.widgetId = null;
      widgetDragState.blockId = null;
      cleanup();
      if (drop && payload) {
        sendToParent({ type: 'DRAG_COMMIT', drag: payload, drop });
      }
    }

    function onPointerCancel() {
      clearDragOverlays();
      widgetDragState.active = false;
      widgetDragState.widgetId = null;
      widgetDragState.blockId = null;
      cleanup();
    }

    function cleanup() {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
    }

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
  }

  return (
    <div
      data-widget-id={widget.id}
      data-block-id={blockId}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #3b82f6' : '1px dashed transparent',
        outlineOffset: '1px',
        borderRadius: '2px',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(widget.id);
        sendToParent({ type: 'WIDGET_CLICKED', blockId, widgetId: widget.id });
      }}
    >
      {/* Widget drag handle */}
      <div
        className="widget-dnd-handle"
        onPointerDown={handleWidgetDragHandlePointerDown}
        title="Drag widget"
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          zIndex: 30,
          width: '18px',
          height: '18px',
          borderRadius: '3px',
          background: 'rgba(59,130,246,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 0.15s',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="3" cy="2" r="1" fill="white"/>
          <circle cx="7" cy="2" r="1" fill="white"/>
          <circle cx="3" cy="5" r="1" fill="white"/>
          <circle cx="7" cy="5" r="1" fill="white"/>
          <circle cx="3" cy="8" r="1" fill="white"/>
          <circle cx="7" cy="8" r="1" fill="white"/>
        </svg>
      </div>
      <WidgetListRenderer
        widgets={[widget]}
        editorMode={false}
        blockId={blockId}
      />
    </div>
  );
}

function WidgetContainerBlock({
  block,
  isSelected,
  responsiveMode,
  sectionId,
  columnId,
  selectedWidgetId,
  onWidgetClick,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  sectionId: string;
  columnId: string;
  selectedWidgetId: string | null;
  onWidgetClick: (widgetId: string) => void;
}) {
  const widgets = block.widgets ?? [];

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode} sectionId={sectionId} columnId={columnId}>
      <div
        data-widget-container-id={block.id}
        style={{
          minHeight: '60px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {widgets.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px', color: '#94a3b8', fontSize: '13px', border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
            Drop widgets here
          </div>
        ) : (
          widgets.map((widget) => (
            <WidgetItem
              key={widget.id}
              widget={widget}
              blockId={block.id}
              selectedWidgetId={selectedWidgetId}
              onWidgetClick={onWidgetClick}
            />
          ))
        )}
      </div>
    </BlockWrapper>
  );
}

// ─── Generic page blocks renderer (existing Pages flow) ───────────────────────

function GenericBlockWrapper({
  block,
  isSelected,
  responsiveMode,
  sectionId,
  columnId,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  sectionId: string;
  columnId: string;
}) {
  const payloadShape = buildPayloadShape(block);
  const [pageBlock] = mapPayloadBlocksToPageBuilderBlocks([payloadShape] as never);

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode} sectionId={sectionId} columnId={columnId}>
      {pageBlock ? <PageBlocksRenderer blocks={[pageBlock]} /> : null}
    </BlockWrapper>
  );
}

// ─── Homepage section renderer ────────────────────────────────────────────────

function buildHomepagePreviewContent(sections: SectionInstance[]): HomepageContent {
  const patch = sectionsToHomepagePatch(sections);
  const globalLike = { ...homepageContent, ...patch } as Record<string, unknown>;
  return resolveHomepageContent(globalLike);
}

function HomepageSectionBlock({
  block,
  isSelected,
  responsiveMode,
  sectionId,
  columnId,
  homepage,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  sectionId: string;
  columnId: string;
  homepage: HomepageContent;
}) {
  let section: React.ReactNode;
  switch (block.blockType) {
    case 'hp-nav':
      section = <Navbar data={homepage.nav} />;
      break;
    case 'hp-hero':
      section = <Hero data={homepage.hero} />;
      break;
    case 'hp-brand-acronym':
      section = <BrandAcronym data={homepage.brandAcronym} />;
      break;
    case 'hp-about':
      section = <About data={homepage.about} />;
      break;
    case 'hp-features':
      section = <FeatureStrip data={homepage.features} />;
      break;
    case 'hp-case-studies':
      section = <CaseStudies data={homepage.caseStudies} />;
      break;
    case 'hp-services':
      section = <Services data={homepage.services} />;
      break;
    case 'hp-mission':
      section = <Mission data={homepage.mission} />;
      break;
    case 'hp-insights':
      section = <Insights data={homepage.insights} />;
      break;
    case 'hp-faq':
      section = <Faq data={homepage.faq} />;
      break;
    case 'hp-cta':
      section = <Cta data={homepage.cta} />;
      break;
    case 'hp-footer':
      // Footer is now a global SiteFooter rendered outside sections — skip in preview
      section = null;
      break;
    default:
      section = (
        <div style={{ padding: '24px', margin: '2px 0', fontFamily: 'sans-serif', color: '#666', fontSize: '13px', textAlign: 'center', border: '1px dashed #ddd' }}>
          {block.blockType} section
        </div>
      );
      break;
  }

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode} sectionId={sectionId} columnId={columnId}>
      {section}
    </BlockWrapper>
  );
}

function ConvertedSectionBlock({
  block,
  isSelected,
  responsiveMode,
  sectionId,
  columnId,
  registry,
  content,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  sectionId: string;
  columnId: string;
  registry: ConvertedPageRegistry;
  content: Record<string, unknown>;
}) {
  const sectionKey = String(block.data.__sectionKey ?? '');
  // nav is now a global — rendered outside sections, not per-block
  if (sectionKey === 'nav') return null;
  const entry = registry.sections.find((s) => s.key === sectionKey);
  if (!entry) {
    return (
      <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode} sectionId={sectionId} columnId={columnId}>
        <div style={{ padding: '24px', margin: '2px 0', fontFamily: 'sans-serif', color: '#666', fontSize: '13px', textAlign: 'center', border: '1px dashed #ddd' }}>
          Missing renderer for {sectionKey || block.blockType}
        </div>
      </BlockWrapper>
    );
  }

  const Component = entry.Component as React.ComponentType<{ data: unknown }>;
  const sectionData = content[entry.key] as Record<string, unknown>;

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode} sectionId={sectionId} columnId={columnId}>
      <Component data={sectionData} />
    </BlockWrapper>
  );
}

// ─── Sections layout ──────────────────────────────────────────────────────────

function SectionsLayout({
  sections,
  selectedBlockId,
  selectedWidgetId,
  responsiveMode,
  isHomepageMode,
  isConvertedMode,
  convertedRegistry,
  navData,
  onWidgetClick,
}: {
  sections: SectionInstance[];
  selectedBlockId: string | null;
  selectedWidgetId: string | null;
  responsiveMode: string;
  isHomepageMode: boolean;
  isConvertedMode: boolean;
  convertedRegistry: ConvertedPageRegistry | null;
  navData: NavigationData | null;
  onWidgetClick: (widgetId: string) => void;
}) {
  // Homepage preview has two paths:
  //   - hp-* blocks (legacy): build structured content via the adapter and
  //     hand it to HomepageSectionBlock for rendering.
  //   - general page-builder blocks (unified): fall through to the generic
  //     renderer, same as pages.
  const hasLegacyHpBlocks = isHomepageMode && sections.some((s) =>
    s.columns.some((c) => c.blocks.some((b) => b.blockType.startsWith('hp-'))),
  );
  const homepage = hasLegacyHpBlocks ? buildHomepagePreviewContent(sections) : null;
  const convertedContent = (isConvertedMode && convertedRegistry)
    ? sectionsToConvertedPageContent(convertedRegistry.defaultContent, sections)
    : null;
  const hasBlocks = sections.some((s) => s.columns.some((c) => c.blocks.length > 0));

  if (!hasBlocks) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', color: '#999', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>
          {isHomepageMode ? '🏠' : isConvertedMode ? '✦' : '📄'}
        </p>
        <p style={{ fontSize: '16px', margin: 0 }}>
          {isConvertedMode
            ? 'Converted page sections loading…'
            : 'Add blocks to see your page preview'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {isHomepageMode ? (
        <>
          <NavbarScrollState selector=".nav" solidClass="solid" offset={60} />
          <ScrollRevealController />
        </>
      ) : null}
      {isConvertedMode ? <ScrollRevealController /> : null}
      {isConvertedMode && navData ? (
        <SiteNavbar
          nav={navData}
          navClassName={convertedRegistry?.pageName === 'about' ? 'about-nav' : undefined}
          linkListClassName={
            convertedRegistry?.pageName === 'about'
              ? 'about-nav-links'
              : convertedRegistry?.pageName === 'services-convert'
                ? 'svc-convert-nav-links'
                : undefined
          }
          ctaClassName={
            convertedRegistry?.pageName === 'services-convert'
              ? 'svc-convert-btn-nav'
              : 'about-btn-nav'
          }
        />
      ) : null}
      {sections.map((section) => {
        const sectionStyles = section.styles;
        const gridTemplate = section.columns.length === 1
          ? undefined
          : section.columns.map((c) => COL_FRACTION[c.width] ?? '1fr').join(' ');

        // Emit scoped !important CSS targeting the inner block so the preview
        // can actually reduce the section (overriding the child's class CSS).
        // Keep all other styling (background, opacity, etc.) as wrapper inline.
        const innerDecls: string[] = [];
        if (sectionStyles?.paddingTop != null) innerDecls.push(`padding-top: ${sectionStyles.paddingTop}px !important`);
        if (sectionStyles?.paddingBottom != null) innerDecls.push(`padding-bottom: ${sectionStyles.paddingBottom}px !important`);
        if (sectionStyles?.paddingLeft != null) innerDecls.push(`padding-left: ${sectionStyles.paddingLeft}px !important`);
        if (sectionStyles?.paddingRight != null) innerDecls.push(`padding-right: ${sectionStyles.paddingRight}px !important`);
        if (sectionStyles?.maxWidth != null) {
          innerDecls.push(`max-width: ${sectionStyles.maxWidth}px !important`);
          innerDecls.push('margin-left: auto !important');
          innerDecls.push('margin-right: auto !important');
        }
        const scopedCss = innerDecls.length > 0
          ? `[data-dnd-section-id="${section.id}"] > div > :is(section, div, article, main) { ${innerDecls.join('; ')}; }`
          : '';

        return (
          <div
            key={section.id}
            data-dnd-section-id={section.id}
            style={{
              position: 'relative',
              ...(sectionStyles?.marginTop != null ? { marginTop: `${sectionStyles.marginTop}px` } : {}),
              ...(sectionStyles?.marginBottom != null ? { marginBottom: `${sectionStyles.marginBottom}px` } : {}),
              ...(sectionStyles?.backgroundColor ? { backgroundColor: sectionStyles.backgroundColor } : {}),
              ...(sectionStyles?.backgroundImage ? { backgroundImage: `url(${sectionStyles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: sectionStyles.backgroundPosition ?? 'center' } : {}),
              ...(sectionStyles?.opacity != null && sectionStyles.opacity !== 1 ? { opacity: sectionStyles.opacity } : {}),
              ...(sectionStyles?.borderWidth != null ? { borderWidth: `${sectionStyles.borderWidth}px`, borderStyle: 'solid', borderColor: sectionStyles.borderColor ?? '#000' } : {}),
              ...(sectionStyles?.boxShadow ? { boxShadow: sectionStyles.boxShadow } : {}),
            }}
          >
            {scopedCss ? <style dangerouslySetInnerHTML={{ __html: scopedCss }} /> : null}
            <div style={section.columns.length > 1 ? { display: 'grid', gridTemplateColumns: gridTemplate, gap: '0' } : undefined}>
              {section.columns.map((col) => (
                <div
                  key={col.id}
                  data-dnd-column-id={col.id}
                  data-dnd-section-id={section.id}
                  style={{ minHeight: '40px' }}
                >
                  {col.blocks.filter((block) => !block.isHidden).map((block) => {
                    const isHp = block.blockType.startsWith('hp-');
                    const isConverted = block.blockType.startsWith('cp-');
                    const isWidgetContainer = block.blockType === 'widget-container';
                    return isWidgetContainer ? (
                      <WidgetContainerBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        sectionId={section.id}
                        columnId={col.id}
                        selectedWidgetId={selectedWidgetId}
                        onWidgetClick={onWidgetClick}
                      />
                    ) : isHp ? (
                      <HomepageSectionBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        sectionId={section.id}
                        columnId={col.id}
                        homepage={homepage!}
                      />
                    ) : isConverted && convertedRegistry && convertedContent ? (
                      <ConvertedSectionBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        sectionId={section.id}
                        columnId={col.id}
                        registry={convertedRegistry}
                        content={convertedContent}
                      />
                    ) : (
                      <GenericBlockWrapper
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        sectionId={section.id}
                        columnId={col.id}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function PreviewInner() {
  const searchParams = useSearchParams();
  const isHomepageMode = searchParams.get('mode') === 'homepage';
  const isConvertedMode = searchParams.get('mode') === 'converted-page';
  const convertedPage = searchParams.get('page') ?? '';

  const [sections, setSections] = useState<SectionInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [responsiveMode, setResponsiveMode] = useState('desktop');
  const [convertedRegistry, setConvertedRegistry] = useState<ConvertedPageRegistry | null>(null);
  const [navData, setNavData] = useState<NavigationData | null>(null);
  const [sectionStyleOverrides, setSectionStyleOverrides] = useState<SectionOverrides>({});

  useEffect(() => {
    if (!isConvertedMode || !convertedPage) {
      setConvertedRegistry(null);
      return;
    }
    let active = true;
    loadConvertedPageRegistry(convertedPage).then((registry) => {
      if (active) setConvertedRegistry(registry);
    });
    return () => {
      active = false;
    };
  }, [isConvertedMode, convertedPage]);

  useEffect(() => {
    if (!isConvertedMode) return;
    let active = true;
    fetch('/api/globals/navigation')
      .then((r) => r.json())
      .then((doc: Record<string, unknown>) => {
        if (!active || !doc) return;
        const links = Array.isArray(doc.links)
          ? (doc.links as Array<{ label?: unknown; href?: unknown }>)
              .filter((l) => typeof l.label === 'string' && typeof l.href === 'string')
              .map((l) => ({ label: String(l.label), href: String(l.href) }))
          : [];
        setNavData({
          logoText: typeof doc.logoText === 'string' && doc.logoText ? doc.logoText : 'Dastify',
          logoAccent: typeof doc.logoAccent === 'string' && doc.logoAccent ? doc.logoAccent : '.Digital',
          logoHref: typeof doc.logoHref === 'string' && doc.logoHref ? doc.logoHref : '/',
          links: links.length > 0 ? links : [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Work', href: '/work' },
            { label: 'Insights', href: '/insights' },
            { label: 'Contact', href: '/contact' },
          ],
          ctaLabel: typeof doc.ctaLabel === 'string' && doc.ctaLabel ? doc.ctaLabel : 'Book a Call',
          ctaHref: typeof doc.ctaHref === 'string' && doc.ctaHref ? doc.ctaHref : '/contact',
        });
      })
      .catch(() => {
        if (!active) return;
        setNavData({
          logoText: 'Dastify',
          logoAccent: '.Digital',
          logoHref: '/',
          links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Work', href: '/work' },
            { label: 'Insights', href: '/insights' },
            { label: 'Contact', href: '/contact' },
          ],
          ctaLabel: 'Book a Call',
          ctaHref: '/contact',
        });
      });
    return () => { active = false; };
  }, [isConvertedMode]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
      if (!data?.type) return;

      if (data.type === 'UPDATE_SECTIONS') {
        setSections(data.sections);
        if (data.responsiveMode) setResponsiveMode(data.responsiveMode);
        setSectionStyleOverrides((data.sectionStyleOverrides as SectionOverrides | undefined) ?? {});
      }

      if (data.type === 'SELECT_BLOCK') {
        setSelectedBlockId(data.blockId ?? null);
        setSelectedWidgetId(null);
        if (data.blockId) {
          const el = document.getElementById(`block-${data.blockId}`);
          if (el) {
            // Only scroll if the element is not already (mostly) in view.
            // Scrolling during a user-initiated click disrupts the second
            // click of a double-click sequence and breaks inline editing.
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const inView = rect.top < vh && rect.bottom > 0;
            if (!inView) {
              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
      }
    }

    window.addEventListener('message', handleMessage);
    sendToParent({ type: 'EDITOR_READY' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Document-level dblclick handler for inline text editing. Runs in capture
  // phase so it's reliable even when React re-renders or other handlers run.
  useEffect(() => {
    function handleDocDoubleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find the closest ancestor with data-field
      let fieldEl: HTMLElement | null = target;
      while (fieldEl && !fieldEl.dataset?.field) {
        fieldEl = fieldEl.parentElement;
      }
      if (!fieldEl?.dataset?.field) return;
      const fieldName = fieldEl.dataset.field;

      // Find the containing block wrapper (has data-dnd-block-id)
      let blockEl: HTMLElement | null = fieldEl;
      while (blockEl && !blockEl.dataset?.dndBlockId) {
        blockEl = blockEl.parentElement;
      }
      if (!blockEl?.dataset?.dndBlockId) return;
      const blockId = blockEl.dataset.dndBlockId;

      // Look up blockType from sections to gate the INLINE_TEXT_FIELDS check
      let blockType = '';
      for (const sec of sections) {
        for (const col of sec.columns) {
          const found = col.blocks.find((b) => b.id === blockId);
          if (found) { blockType = found.blockType; break; }
        }
        if (blockType) break;
      }
      if (!blockType.startsWith('cp-') && !INLINE_TEXT_FIELDS.includes(fieldName)) return;

      // Already editing this element — let the user keep typing
      if (fieldEl.isContentEditable) return;

      // Prevent the default word-selection so we control the caret
      e.preventDefault();
      e.stopPropagation();

      const originalText = fieldEl.innerText || fieldEl.textContent || '';
      fieldEl.contentEditable = 'true';
      fieldEl.focus();

      const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
      if (range) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }

      const handleBlur = () => {
        if (!fieldEl) return;
        const isRich = fieldEl.dataset.richText === 'true';
        const value = isRich ? fieldEl.innerHTML : (fieldEl.innerText || fieldEl.textContent || '');
        fieldEl.contentEditable = 'false';
        if (!isRich) fieldEl.textContent = originalText;
        fieldEl.removeEventListener('blur', handleBlur);
        fieldEl.removeEventListener('keydown', handleKeyDown);
        requestAnimationFrame(() => {
          sendToParent({ type: 'INLINE_EDIT_END', blockId, fieldName, value });
        });
      };
      const handleKeyDown = (ke: KeyboardEvent) => {
        if (ke.key === 'Escape' || (ke.key === 'Enter' && !ke.shiftKey)) {
          ke.preventDefault();
          (ke.currentTarget as HTMLElement).blur();
        }
      };
      fieldEl.addEventListener('blur', handleBlur);
      fieldEl.addEventListener('keydown', handleKeyDown);
    }

    document.addEventListener('dblclick', handleDocDoubleClick, true);
    return () => document.removeEventListener('dblclick', handleDocDoubleClick, true);
  }, [sections]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => {
        el.classList.add('revealed');
      });

      document.querySelectorAll<HTMLElement>('.img-reveal').forEach((el) => {
        el.classList.add('revealed');
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [sections, responsiveMode, isHomepageMode, isConvertedMode, convertedPage, convertedRegistry]);

  function handleWidgetClick(widgetId: string) {
    setSelectedWidgetId(widgetId);
  }

  const sectionOverrideCss = isConvertedMode && convertedRegistry
    ? generateOverrideCss(convertedRegistry, sectionStyleOverrides)
    : '';

  return (
    <>
      <style>{`
        [data-dnd-block-id]:hover > .dnd-handle { opacity: 1 !important; }
        [data-dnd-block-id]:hover { cursor: default; }
        [data-widget-id]:hover > .widget-dnd-handle { opacity: 1 !important; }
        [data-widget-id]:hover { outline: 1px dashed #93c5fd !important; cursor: default; }
      `}</style>
      {sectionOverrideCss ? (
        <style dangerouslySetInnerHTML={{ __html: sectionOverrideCss }} />
      ) : null}
      <SectionsLayout
        sections={sections}
        selectedBlockId={selectedBlockId}
        selectedWidgetId={selectedWidgetId}
        responsiveMode={responsiveMode}
        isHomepageMode={isHomepageMode}
        isConvertedMode={isConvertedMode}
        convertedRegistry={convertedRegistry}
        navData={navData}
        onWidgetClick={handleWidgetClick}
      />
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PageEditorPreview() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafafa' }} />}>
      <PreviewInner />
    </Suspense>
  );
}
