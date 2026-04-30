'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deserializeSectionsFromPayload, useEditorStore } from './store';
import { getBlockDefinition } from './block-registry';
import { blockTemplates } from './block-templates';
import type { BlockInstance, ColumnInstance, ColumnWidth, SectionInstance } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMN_WIDTH_LABELS: Record<ColumnWidth, string> = {
  '1/1': 'Full',
  '1/2': '1/2',
  '1/3': '1/3',
  '2/3': '2/3',
  '1/4': '1/4',
  '3/4': '3/4',
};

const COLUMN_WIDTH_OPTIONS: ColumnWidth[] = ['1/1', '1/2', '1/3', '2/3', '1/4', '3/4'];

const toolbarBtnStyle: React.CSSProperties = {
  background: '#222',
  border: '1px solid #333',
  borderRadius: '4px',
  color: '#aaa',
  cursor: 'pointer',
  fontSize: '12px',
  lineHeight: 1,
  padding: '4px 6px',
};

// ─── Drag ID conventions ──────────────────────────────────────────────────────
// block:{sectionId}:{columnId}:{blockId}
// column:{sectionId}:{columnId}
// section:{sectionId}

function blockDragId(sectionId: string, columnId: string, blockId: string) {
  return `block:${sectionId}:${columnId}:${blockId}`;
}
function columnDragId(sectionId: string, columnId: string) {
  return `column:${sectionId}:${columnId}`;
}
function sectionDragId(sectionId: string) {
  return `section:${sectionId}`;
}

// ─── Block card ───────────────────────────────────────────────────────────────

type BlockCardProps = {
  sectionId: string;
  columnId: string;
  block: BlockInstance;
  isSelected: boolean;
  isMatch: boolean;
};

const BlockCard = memo(function BlockCard({ sectionId, columnId, block, isSelected, isMatch }: BlockCardProps) {
  const blockId = block.id;
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);

  const dndId = blockDragId(sectionId, columnId, blockId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dndId,
    data: { type: 'block', sectionId, columnId, blockId },
  });

  const def = getBlockDefinition(block.blockType);
  const title = (block.data.title as string | undefined) || def?.label || block.blockType;
  const subtitle = (block.data.eyebrow as string | undefined) || (block.data.subtitle as string | undefined);
  const dataSummary = (() => {
    const arrayItems = Object.values(block.data).find((v) => Array.isArray(v));
    if (Array.isArray(arrayItems)) return `${arrayItems.length} items`;
    if (typeof block.data.content === 'string') return `${Math.min(999, block.data.content.length)} chars`;
    return def?.label ?? block.blockType;
  })();

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : block.isHidden ? 0.45 : 1 }}
      onClick={() => selectBlock(sectionId, columnId, blockId)}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '6px',
          border: isSelected
            ? '2px solid #0ea5e9'
            : isMatch
            ? '2px solid #f59e0b'
            : block.isHidden
            ? '1px dashed #854d0e'
            : block.isLocked
            ? '1px solid #1e3a5f'
            : '1px solid #2a2a2a',
          background: isSelected ? '#0c1a24' : '#161616',
          marginBottom: '4px',
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={(e) => {
          const t = e.currentTarget.querySelector('[data-hover-toolbar]') as HTMLElement | null;
          if (t) t.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget.querySelector('[data-hover-toolbar]') as HTMLElement | null;
          if (t && !isSelected) t.style.opacity = '0';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab', color: '#444', fontSize: '13px', flexShrink: 0, padding: '2px' }}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
          >
            ⠿
          </div>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>{def?.icon || '📦'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: isSelected ? '#7dd3fc' : '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </p>
            {subtitle && (
              <p style={{ margin: 0, fontSize: '10px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                {subtitle}
              </p>
            )}
            <p style={{ margin: 0, fontSize: '10px', color: '#3a3a3a', marginTop: '1px' }}>{dataSummary}</p>
          </div>
          {block.isLocked && (
            <span style={{ fontSize: '10px', flexShrink: 0, color: '#0ea5e9' }} title="Locked">🔒</span>
          )}
          {block.isHidden && (
            <span style={{ fontSize: '10px', flexShrink: 0, color: '#fbbf24' }} title="Hidden">🚫</span>
          )}
          {isSelected && (
            <span style={{ fontSize: '9px', background: '#0ea5e9', color: '#fff', borderRadius: '3px', padding: '2px 5px', flexShrink: 0, fontWeight: 600 }}>
              ●
            </span>
          )}
        </div>
        <div
          data-hover-toolbar
          style={{ position: 'absolute', top: '4px', right: '6px', display: 'flex', gap: '3px', opacity: isSelected ? 1 : 0, transition: 'opacity 0.15s' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => duplicateBlock(sectionId, columnId, blockId)} style={toolbarBtnStyle} title="Duplicate">⧉</button>
          <button onClick={() => removeBlock(sectionId, columnId, blockId)} style={{ ...toolbarBtnStyle, color: '#f87171' }} title="Delete">✕</button>
        </div>
      </div>
    </div>
  );
});

// ─── Column ───────────────────────────────────────────────────────────────────

type ColumnProps = {
  sectionId: string;
  column: ColumnInstance;
  totalCols: number;
  selectedBlockId: string | null;
  searchMatchIds: Set<string>;
  addBlock: (blockType: string, sectionId: string, columnId: string) => void;
};

const Column = memo(function Column({ sectionId, column, totalCols, selectedBlockId, searchMatchIds, addBlock }: ColumnProps) {
  const removeColumn = useEditorStore((s) => s.removeColumnFromSection);
  const updateWidth = useEditorStore((s) => s.updateColumnWidth);

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `col-drop:${sectionId}:${column.id}` });

  const blockDragIds = column.blocks.map((b) => blockDragId(sectionId, column.id, b.id));

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: '#111',
        borderRadius: '6px',
        border: isOver ? '1px solid #0ea5e9' : '1px solid #1e1e1e',
        transition: 'border-color 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 8px', borderBottom: '1px solid #1a1a1a' }}>
        <select
          value={column.width}
          onChange={(e) => updateWidth(sectionId, column.id, e.target.value as ColumnWidth)}
          style={{ flex: 1, background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#666', fontSize: '10px', padding: '2px 4px', cursor: 'pointer' }}
        >
          {COLUMN_WIDTH_OPTIONS.map((w) => (
            <option key={w} value={w}>{COLUMN_WIDTH_LABELS[w]}</option>
          ))}
        </select>
        {totalCols > 1 && (
          <button
            onClick={() => removeColumn(sectionId, column.id)}
            style={{ ...toolbarBtnStyle, padding: '2px 5px', color: '#555', fontSize: '10px' }}
            title="Remove column"
          >✕</button>
        )}
      </div>

      {/* Blocks */}
      <div ref={setDropRef} style={{ flex: 1, padding: '6px', minHeight: '48px' }}>
        <SortableContext items={blockDragIds} strategy={verticalListSortingStrategy}>
          {column.blocks.map((block) => (
            <BlockCard
              key={block.id}
              sectionId={sectionId}
              columnId={column.id}
              block={block}
              isSelected={block.id === selectedBlockId}
              isMatch={searchMatchIds.has(block.id)}
            />
          ))}
        </SortableContext>
        {column.blocks.length === 0 && (
          <div
            style={{
              border: '1px dashed #2a2a2a',
              borderRadius: '6px',
              padding: '10px 8px',
              textAlign: 'center',
              color: '#333',
              fontSize: '11px',
            }}
          >
            Drop blocks here
          </div>
        )}
      </div>

      {/* Add block shortcut */}
      <button
        onClick={() => addBlock('rich-text-block', sectionId, column.id)}
        style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '11px', padding: '5px', borderTop: '1px solid #1a1a1a', transition: 'color 0.15s' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#333'; }}
        title="Add text block"
      >
        ＋ block
      </button>
    </div>
  );
});

// ─── Section card ─────────────────────────────────────────────────────────────

type SectionCardProps = {
  section: SectionInstance;
  selectedBlockId: string | null;
  selectedSectionId: string | null;
  searchMatchIds: Set<string>;
  isFirst: boolean;
  isLast: boolean;
};

const SectionCard = memo(function SectionCard({ section, selectedBlockId, selectedSectionId, searchMatchIds, isFirst, isLast }: SectionCardProps) {
  const addBlock = useEditorStore((s) => s.addBlock);
  const removeSection = useEditorStore((s) => s.deleteSectionDispatch);
  const duplicateSection = useEditorStore((s) => s.duplicateSectionDispatch);
  const addColumn = useEditorStore((s) => s.addColumnToSection);
  const selectSection = useEditorStore((s) => s.selectSection);
  const moveSectionUp = useEditorStore((s) => s.moveSectionUpDispatch);
  const moveSectionDown = useEditorStore((s) => s.moveSectionDownDispatch);

  const isSelected = section.id === selectedSectionId;

  const columnDragIds = section.columns.map((c) => columnDragId(section.id, c.id));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionDragId(section.id),
    data: { type: 'section', sectionId: section.id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1, marginBottom: '8px' }}
    >
      <div
        style={{
          borderRadius: '8px',
          border: isSelected ? '1px solid #334155' : '1px solid #1e1e1e',
          background: '#0c0c0c',
          overflow: 'hidden',
        }}
        onClick={() => selectSection(section.id)}
      >
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px', borderBottom: '1px solid #1a1a1a', background: '#111' }}>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab', color: '#333', fontSize: '13px', flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
            title="Drag section"
          >
            ⠿⠿
          </div>
          <span style={{ flex: 1, fontSize: '11px', color: '#555', fontWeight: 500 }}>
            {section.label || 'Section'}
          </span>
          <span style={{ fontSize: '10px', color: '#333' }}>{section.columns.length} col{section.columns.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: '3px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); if (!isFirst) moveSectionUp(section.id); }}
              disabled={isFirst}
              style={{ ...toolbarBtnStyle, opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'default' : 'pointer' }}
              aria-label="Move section up"
              title="Move section up"
            >↑</button>
            <button
              onClick={(e) => { e.stopPropagation(); if (!isLast) moveSectionDown(section.id); }}
              disabled={isLast}
              style={{ ...toolbarBtnStyle, opacity: isLast ? 0.3 : 1, cursor: isLast ? 'default' : 'pointer' }}
              aria-label="Move section down"
              title="Move section down"
            >↓</button>
            <button onClick={() => addColumn(section.id)} style={{ ...toolbarBtnStyle, fontSize: '10px' }} title="Add column">+ col</button>
            <button onClick={() => duplicateSection(section.id)} style={toolbarBtnStyle} title="Duplicate section">⧉</button>
            <button onClick={() => removeSection(section.id)} style={{ ...toolbarBtnStyle, color: '#f87171' }} title="Delete section">✕</button>
          </div>
        </div>

        {/* Columns */}
        <div style={{ padding: '6px', display: 'flex', gap: '6px' }}>
          <SortableContext items={columnDragIds} strategy={horizontalListSortingStrategy}>
            {section.columns.map((col) => (
              <Column
                key={col.id}
                sectionId={section.id}
                column={col}
                totalCols={section.columns.length}
                selectedBlockId={selectedBlockId}
                searchMatchIds={searchMatchIds}
                addBlock={addBlock}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
});

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  const addSection = useEditorStore((s) => s.addSection);
  const setSections = useEditorStore((s) => s.setSections);

  function loadTemplate(templateId: string) {
    const tpl = blockTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    const blocks = tpl.blocks();
    const fakePayload = blocks.map((b) => ({ blockType: b.blockType, ...b.data }));
    setSections(deserializeSectionsFromPayload(fakePayload));
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📄</div>
        <h3 style={{ margin: '0 0 6px', color: '#ccc', fontSize: '13px', fontWeight: 600 }}>Start building your page</h3>
        <p style={{ margin: '0 0 12px', color: '#555', fontSize: '11px' }}>Load a template or add a section</p>
        <button
          onClick={() => addSection()}
          style={{ background: '#0ea5e9', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: '8px 16px' }}
        >
          + Add Section
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 2px' }}>
          Templates
        </p>
        {blockTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => loadTemplate(tpl.id)}
            style={{
              width: '100%', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '8px',
              color: '#aaa', cursor: 'pointer', fontSize: '12px', padding: '10px 12px', textAlign: 'left',
              marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1e1e1e'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#161616'; }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{tpl.icon}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#ccc', fontSize: '12px' }}>{tpl.label}</p>
              <p style={{ margin: 0, color: '#555', fontSize: '11px' }}>{tpl.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

type CanvasProps = {
  activeDrag: { type: string; label: string; icon: string } | null;
  embedded?: boolean;
};

export function Canvas({ activeDrag: _activeDrag, embedded = false }: CanvasProps) {
  void _activeDrag;
  const sections = useEditorStore((s) => s.sections);
  const selection = useEditorStore((s) => s.selection);
  const addSection = useEditorStore((s) => s.addSection);

  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalized = search.trim().toLowerCase();

  const selectedBlockId = selection?.kind === 'block' ? selection.blockId : null;
  const selectedSectionId = selection?.kind === 'section' ? selection.sectionId : selection?.kind === 'block' ? selection.sectionId : null;

  // Block IDs that match the search
  const searchMatchIds = useMemo<Set<string>>(() => {
    if (!normalized) return new Set();
    const ids = new Set<string>();
    for (const sec of sections) {
      for (const col of sec.columns) {
        for (const block of col.blocks) {
          const def = getBlockDefinition(block.blockType);
          const title = typeof block.data.title === 'string' ? block.data.title : '';
          const content = typeof block.data.content === 'string' ? block.data.content : '';
          const label = def?.label ?? block.blockType;
          if ([title, content, label, block.blockType].some((s) => s.toLowerCase().includes(normalized))) {
            ids.add(block.id);
          }
        }
      }
    }
    return ids;
  }, [normalized, sections]);

  // Ctrl+F → focus canvas search
  useEffect(() => {
    function handler() { searchInputRef.current?.focus(); searchInputRef.current?.select(); }
    window.addEventListener('page-editor-focus-canvas-search', handler);
    return () => window.removeEventListener('page-editor-focus-canvas-search', handler);
  }, []);

  const sectionDragIds = sections.map((s) => sectionDragId(s.id));

  return (
    <div
      style={{
        width: embedded ? '100%' : '300px',
        flex: embedded ? 1 : undefined,
        flexShrink: 0,
        background: '#0f0f0f',
        borderRight: embedded ? 'none' : '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Page Structure
        </p>
        <span style={{ fontSize: '11px', color: '#444' }}>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Search */}
      <div style={{ padding: '6px 10px 8px', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
        <input
          ref={searchInputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find block (Ctrl+F)"
          style={{
            width: '100%', background: '#111', border: '1px solid #222', borderRadius: '6px',
            color: '#aaa', fontSize: '12px', padding: '5px 8px', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sections.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ padding: '8px' }}>
            <SortableContext items={sectionDragIds} strategy={verticalListSortingStrategy}>
              {sections.map((section, idx, arr) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  selectedBlockId={selectedBlockId}
                  selectedSectionId={selectedSectionId}
                  searchMatchIds={searchMatchIds}
                  isFirst={idx === 0}
                  isLast={idx === arr.length - 1}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>

      {/* Footer */}
      {sections.length > 0 && (
        <div style={{ padding: '8px', borderTop: '1px solid #1a1a1a', flexShrink: 0 }}>
          <button
            onClick={() => addSection()}
            style={{
              width: '100%', background: 'transparent', border: '1px dashed #333', borderRadius: '8px',
              color: '#555', cursor: 'pointer', fontSize: '12px', padding: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#aaa'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#555'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#555'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#333'; }}
          >
            <span>＋</span><span>Add Section</span>
          </button>
        </div>
      )}
    </div>
  );
}
