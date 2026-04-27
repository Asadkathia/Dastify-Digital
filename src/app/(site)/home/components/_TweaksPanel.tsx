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
