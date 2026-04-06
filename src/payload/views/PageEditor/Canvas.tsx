'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from './store';
import { getBlockDefinition } from './block-registry';
import { blockTemplates } from './block-templates';
import type { BlockInstance } from './types';

// ─── Block card in the canvas ───────────────────────────────────────────────

type BlockCardProps = {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

function BlockCard({ block, isSelected, onSelect, onDelete, onDuplicate }: BlockCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { type: 'canvas-block', blockId: block.id },
  });

  const def = getBlockDefinition(block.blockType);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const title = (block.data.title as string | undefined) || def?.label || block.blockType;
  const subtitle = (block.data.eyebrow as string | undefined) || (block.data.subtitle as string | undefined);
  const dataSummary = (() => {
    const arrayItems = Object.values(block.data).find((value) => Array.isArray(value));
    if (Array.isArray(arrayItems)) return `${arrayItems.length} items`;
    if (typeof block.data.content === 'string') return `${Math.min(999, block.data.content.length)} chars`;
    return def?.label ?? block.blockType;
  })();

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: '8px',
          border: isSelected ? '2px solid #0ea5e9' : '1px solid #2a2a2a',
          background: isSelected ? '#0c1a24' : '#161616',
          marginBottom: '6px',
          transition: 'border-color 0.15s, background 0.15s',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          const toolbar = e.currentTarget.querySelector('[data-hover-toolbar]') as HTMLElement | null;
          if (toolbar) toolbar.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const toolbar = e.currentTarget.querySelector('[data-hover-toolbar]') as HTMLElement | null;
          if (toolbar && !isSelected) toolbar.style.opacity = '0';
        }}
      >
        {/* Drag handle + block info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: 'grab',
              color: '#444',
              fontSize: '14px',
              lineHeight: 1,
              flexShrink: 0,
              padding: '2px',
            }}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
          >
            ⠿
          </div>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>{def?.icon || '📦'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: isSelected ? '#7dd3fc' : '#ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </p>
            {subtitle ? (
              <p style={{ margin: 0, fontSize: '11px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                {subtitle}
              </p>
            ) : null}
            <p style={{ margin: 0, fontSize: '10px', color: '#444', marginTop: '2px' }}>{dataSummary}</p>
          </div>
          {isSelected && (
            <span style={{ fontSize: '10px', background: '#0ea5e9', color: '#fff', borderRadius: '4px', padding: '2px 6px', flexShrink: 0, fontWeight: 600 }}>
              Selected
            </span>
          )}
        </div>

        {/* Hover toolbar */}
        <div
          data-hover-toolbar
          style={{
            position: 'absolute',
            top: '6px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.15s',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onDuplicate}
            title="Duplicate block"
            style={toolbarBtnStyle}
          >
            ⧉
          </button>
          <button
            onClick={onDelete}
            title="Delete block"
            style={{ ...toolbarBtnStyle, color: '#f87171' }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

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

// ─── Drop zone ───────────────────────────────────────────────────────────────

function DropZone({ id }: { id: string }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        height: isOver ? '40px' : '8px',
        borderRadius: '6px',
        background: isOver ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
        border: isOver ? '2px dashed #0ea5e9' : '2px dashed transparent',
        transition: 'all 0.15s',
        margin: '2px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isOver && <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: 600 }}>Drop here</span>}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  const addBlock = useEditorStore((s) => s.addBlock);
  const setBlocks = useEditorStore((s) => s.setBlocks);

  function loadTemplate(templateId: string) {
    const tpl = blockTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    const blocks = tpl.blocks();
    setBlocks(blocks);
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 12px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄</div>
        <h3 style={{ margin: '0 0 6px', color: '#ccc', fontSize: '14px', fontWeight: 600 }}>Start building your page</h3>
        <p style={{ margin: 0, color: '#555', fontSize: '12px', lineHeight: 1.5 }}>
          Load a template or drag blocks from the left
        </p>
      </div>

      {/* Templates */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 2px' }}>
          Templates
        </p>
        {blockTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => loadTemplate(tpl.id)}
            style={{
              width: '100%',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '10px 12px',
              textAlign: 'left',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#1e1e1e';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#161616';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{tpl.icon}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#ccc', fontSize: '12px' }}>{tpl.label}</p>
              <p style={{ margin: 0, color: '#555', fontSize: '11px' }}>{tpl.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick add */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 2px' }}>
          Quick Add
        </p>
        {[
          { blockType: 'hero-block', label: '🖼️ Hero' },
          { blockType: 'cta-block', label: '🔔 CTA' },
          { blockType: 'rich-text-block', label: '📝 Rich Text' },
        ].map(({ blockType, label }) => (
          <button
            key={blockType}
            onClick={() => addBlock(blockType)}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px dashed #2a2a2a',
              borderRadius: '6px',
              color: '#555',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '8px 10px',
              textAlign: 'left',
              marginBottom: '4px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#444';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#555';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a2a';
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

export function Canvas() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const removeBlock = useEditorStore((s) => s.removeBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);
  const addBlock = useEditorStore((s) => s.addBlock);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalized = search.trim().toLowerCase();
  const matchingIds = useMemo(() => {
    if (!normalized) return [];
    return blocks
      .filter((block) => {
        const def = getBlockDefinition(block.blockType);
        const title = typeof block.data.title === 'string' ? block.data.title : '';
        const content = typeof block.data.content === 'string' ? block.data.content : '';
        const label = def?.label ?? block.blockType;
        return `${label} ${title} ${content}`.toLowerCase().includes(normalized);
      })
      .map((b) => b.id);
  }, [blocks, normalized]);

  const { setNodeRef } = useDroppable({ id: 'canvas-root' });

  useEffect(() => {
    function focusCanvasSearch() {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }
    window.addEventListener('page-editor-focus-canvas-search', focusCanvasSearch);
    return () => window.removeEventListener('page-editor-focus-canvas-search', focusCanvasSearch);
  }, []);

  function jumpToFirstMatch() {
    if (matchingIds.length === 0) return;
    const targetId = matchingIds[0];
    selectBlock(targetId);
    document.getElementById(`canvas-card-${targetId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div
      style={{
        width: '280px',
        flexShrink: 0,
        background: '#0f0f0f',
        borderRight: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 14px 10px',
          borderBottom: '1px solid #222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Page Structure
        </p>
        <span style={{ fontSize: '11px', color: '#444' }}>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={{ padding: '0 14px 10px', borderBottom: '1px solid #222', display: 'flex', gap: '6px' }}>
        <input
          ref={searchInputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') jumpToFirstMatch();
          }}
          placeholder="Find block (Ctrl+F)"
          style={{
            flex: 1,
            background: '#111',
            border: '1px solid #222',
            borderRadius: '6px',
            color: '#aaa',
            fontSize: '12px',
            padding: '6px 8px',
            outline: 'none',
          }}
        />
        <button onClick={jumpToFirstMatch} style={{ ...toolbarBtnStyle, padding: '6px 8px' }} title="Jump to first match">
          ↵
        </button>
      </div>

      {/* Block list */}
      <div ref={setNodeRef} style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {blocks.length === 0 ? (
          <EmptyState />
        ) : (
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <DropZone id="drop-top" />
            {blocks.map((block, index) => (
              <div key={block.id} id={`canvas-card-${block.id}`}>
                <BlockCard
                  block={block}
                  isSelected={block.id === selectedBlockId}
                  onSelect={() => selectBlock(block.id)}
                  onDelete={() => removeBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                />
                <DropZone id={`drop-after-${index}`} />
              </div>
            ))}
          </SortableContext>
        )}
      </div>

      {/* Add block button */}
      {blocks.length > 0 && (
        <div style={{ padding: '10px 8px', borderTop: '1px solid #222' }}>
          <button
            onClick={() => addBlock('rich-text-block')}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px dashed #333',
              borderRadius: '8px',
              color: '#555',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#aaa';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#555';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#555';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#333';
            }}
          >
            <span>＋</span>
            <span>Add Block</span>
          </button>
        </div>
      )}
    </div>
  );
}
