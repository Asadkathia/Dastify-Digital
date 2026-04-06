'use client';

import { useState } from 'react';

export type TabsBlockProps = {
  type: 'tabs';
  tabs: Array<{ label: string; content: string }>;
};

export function TabsBlock({ tabs }: TabsBlockProps) {
  const [active, setActive] = useState(0);
  if (!tabs?.length) return null;

  return (
    <div style={{ padding: '16px 24px' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', overflowX: 'auto', gap: '4px', marginBottom: '24px' }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: active === i ? '2px solid #0ea5e9' : '2px solid transparent',
              marginBottom: '-2px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: active === i ? 700 : 400,
              color: active === i ? '#0ea5e9' : '#555',
              fontSize: '15px',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Active panel */}
      <div style={{ fontSize: '15px', lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap' }}>
        {tabs[active]?.content}
      </div>
    </div>
  );
}
