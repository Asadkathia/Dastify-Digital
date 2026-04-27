'use client';

import { useEffect, useState } from 'react';

const DEFAULTS = {
  primary: '#0025E8',
  accent: '#6F3EE5',
  support: '#63DB24',
} as const;

const STORAGE_KEY = 'dastify-tweaks';

type TweakState = { primary: string; accent: string; support: string };

function applyTokens(state: TweakState) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary', state.primary);
  root.style.setProperty('--accent', state.accent);
  root.style.setProperty('--support', state.support);
  // Derive an ink shade for dark-on-primary surfaces.
  root.style.setProperty(
    '--primary-ink',
    `color-mix(in srgb, ${state.primary} 72%, black 28%)`,
  );
}

export default function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<TweakState>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TweakState>;
        const next: TweakState = {
          primary: parsed.primary ?? DEFAULTS.primary,
          accent: parsed.accent ?? DEFAULTS.accent,
          support: parsed.support ?? DEFAULTS.support,
        };
        setState(next);
        applyTokens(next);
      } else {
        applyTokens(DEFAULTS);
      }
    } catch {
      applyTokens(DEFAULTS);
    }
    setHydrated(true);
  }, []);

  const update = (patch: Partial<TweakState>) => {
    const next = { ...state, ...patch };
    setState(next);
    applyTokens(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setState(DEFAULTS);
    applyTokens(DEFAULTS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    } catch {
      /* ignore */
    }
  };

  if (!hydrated) return null;

  return (
    <>
      <style>{`
        .tweaks-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          border: none;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0,0,0,.25);
          transition: transform .15s ease;
        }
        .tweaks-fab:hover { transform: translateY(-2px); }
        .tweaks-panel {
          position: fixed;
          bottom: 84px;
          right: 24px;
          z-index: 1000;
          width: 320px;
          background: var(--dark-bg, #0B1220);
          color: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,.4);
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 13px;
        }
        .tweaks-panel__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .tweaks-panel__title { font-weight: 600; font-size: 14px; }
        .tweaks-panel__close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
        }
        .tweaks-row { margin-bottom: 12px; }
        .tweaks-row__label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          opacity: .9;
        }
        .tweaks-row__input {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tweaks-row__input input[type="color"] {
          width: 40px;
          height: 32px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }
        .tweaks-row__hex {
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 12px;
          opacity: .8;
          text-transform: uppercase;
        }
        .tweaks-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .tweaks-btn {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.06);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .tweaks-btn:hover { background: rgba(255,255,255,.12); }
        @media (max-width: 767px) {
          .tweaks-fab, .tweaks-panel { display: none; }
        }
      `}</style>

      {open && (
        <div className="tweaks-panel" role="dialog" aria-label="Color tweaks">
          <div className="tweaks-panel__header">
            <span className="tweaks-panel__title">Tweaks</span>
            <button
              type="button"
              className="tweaks-panel__close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="tweaks-row">
            <label className="tweaks-row__label" htmlFor="tweaks-primary">Primary color</label>
            <div className="tweaks-row__input">
              <input
                id="tweaks-primary"
                type="color"
                value={state.primary}
                onChange={(e) => update({ primary: e.target.value })}
              />
              <span className="tweaks-row__hex">{state.primary}</span>
            </div>
          </div>

          <div className="tweaks-row">
            <label className="tweaks-row__label" htmlFor="tweaks-accent">Accent color</label>
            <div className="tweaks-row__input">
              <input
                id="tweaks-accent"
                type="color"
                value={state.accent}
                onChange={(e) => update({ accent: e.target.value })}
              />
              <span className="tweaks-row__hex">{state.accent}</span>
            </div>
          </div>

          <div className="tweaks-row">
            <label className="tweaks-row__label" htmlFor="tweaks-support">Support color</label>
            <div className="tweaks-row__input">
              <input
                id="tweaks-support"
                type="color"
                value={state.support}
                onChange={(e) => update({ support: e.target.value })}
              />
              <span className="tweaks-row__hex">{state.support}</span>
            </div>
          </div>

          <div className="tweaks-actions">
            <button type="button" className="tweaks-btn" onClick={reset}>
              Reset to defaults
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="tweaks-fab"
        aria-label={open ? 'Close tweaks panel' : 'Open tweaks panel'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r="1.5" />
          <circle cx="17.5" cy="10.5" r="1.5" />
          <circle cx="8.5" cy="7.5" r="1.5" />
          <circle cx="6.5" cy="12.5" r="1.5" />
          <path d="M12 2a10 10 0 1 0 0 20c1 0 1.5-.5 1.5-1.25 0-.5-.25-.75-.5-1.25-.25-.5-.5-.75-.5-1.25 0-.75.5-1.25 1.25-1.25H15a5 5 0 0 0 5-5c0-5-3.5-9-8-10Z" />
        </svg>
      </button>
    </>
  );
}
