'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#052e16', border: '#16a34a', icon: '✓' },
  error:   { bg: '#2d0a0a', border: '#dc2626', icon: '✕' },
  info:    { bg: '#0c1a24', border: '#0369a1', icon: 'ℹ' },
};

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const colors = COLORS[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '240px',
              maxWidth: '320px',
              pointerEvents: 'auto',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <span style={{ color: colors.border, fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
              {colors.icon}
            </span>
            <span style={{ color: '#ddd', fontSize: '13px', flex: 1, lineHeight: 1.4 }}>
              {toast.message}
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
                fontSize: '12px',
                flexShrink: 0,
                padding: '0 2px',
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, show, dismiss };
}
