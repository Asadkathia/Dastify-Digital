'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * HomepageEditorButton — shown in the Homepage global admin view.
 * Navigates to the full Homepage Visual Editor route.
 */
export default function HomepageEditorButton() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
      <button
        type="button"
        onClick={() => router.push('/admin/homepage-editor')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #6c3ef4 0%, #4f46e5 100%)',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          padding: '10px 18px',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      >
        <span style={{ fontSize: '16px' }}>🎨</span>
        Open Visual Editor
      </button>
      <span style={{ color: 'var(--theme-text-secondary, #888)', fontSize: '12px' }}>
        Edit all homepage sections, blocks &amp; buttons visually
      </span>
    </div>
  );
}
