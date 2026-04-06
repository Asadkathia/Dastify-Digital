'use client';

import { memo, useMemo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { blockCategories } from './block-registry';
import type { BlockDefinition } from './types';

type DraggablePaletteItemProps = {
  block: BlockDefinition;
};

const DraggablePaletteItem = memo(function DraggablePaletteItem({ block }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${block.blockType}`,
    data: { type: 'palette-block', blockType: block.blockType },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        background: isDragging ? '#2a2a2a' : '#1a1a1a',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
        transition: 'background 0.15s, border-color 0.15s',
        marginBottom: '6px',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLDivElement).style.background = '#222';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#3a3a3a';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = isDragging ? '#2a2a2a' : '#1a1a1a';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a';
      }}
    >
      <span style={{ fontSize: '16px', lineHeight: 1 }}>{block.icon}</span>
      <span style={{ fontSize: '13px', color: '#ccc', fontWeight: 500 }}>{block.label}</span>
    </div>
  );
});

export function BlockPalette() {
  const [search, setSearch] = useState('');
  const normalized = search.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalized) return blockCategories;
    return blockCategories
      .map((category) => ({
        ...category,
        blocks: category.blocks.filter((block) => block.label.toLowerCase().includes(normalized)),
      }))
      .filter((category) => category.blocks.length > 0);
  }, [normalized]);

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: '#111',
        borderRight: '1px solid #222',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px 14px 8px', borderBottom: '1px solid #222' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Blocks
        </p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blocks..."
          style={{
            width: '100%',
            marginTop: '8px',
            background: '#0f0f0f',
            border: '1px solid #222',
            borderRadius: '6px',
            color: '#aaa',
            fontSize: '12px',
            padding: '6px 8px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ padding: '12px 10px', flex: 1 }}>
        {filteredCategories.map((category) => (
          <div key={category.name} style={{ marginBottom: '20px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#555',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 8px 2px',
              }}
            >
              {category.name}
            </p>
            {category.blocks.map((block) => (
              <DraggablePaletteItem key={block.blockType} block={block} />
            ))}
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p style={{ margin: '6px 2px', color: '#555', fontSize: '12px' }}>No blocks match “{search}”.</p>
        )}
      </div>

      <div style={{ padding: '12px 14px', borderTop: '1px solid #222' }}>
        <p style={{ fontSize: '11px', color: '#444', margin: 0, lineHeight: 1.4 }}>
          Drag blocks onto the canvas or click + to add
        </p>
      </div>
    </aside>
  );
}
