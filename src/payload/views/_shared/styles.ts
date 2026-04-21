import type { CSSProperties } from 'react';

/**
 * Pre-built CSSProperties objects that pull from the design tokens in
 * `./theme.css`. Use these instead of hand-rolling inline styles with hex
 * codes in each view file.
 *
 * Example:
 *   <div style={adminStyles.panel}>
 *     <h2 style={adminStyles.panelTitle}>Settings</h2>
 *     <label style={adminStyles.label}>Name</label>
 *     <input style={adminStyles.input} />
 *   </div>
 *
 * Composition works via spread:
 *   <button style={{ ...adminStyles.buttonPrimary, marginTop: 8 }}>Save</button>
 */
export const adminStyles = {
  // ─── Layout ──────────────────────────────────────────────────────────────
  container: {
    padding: 'var(--admin-space-6)',
    fontFamily: 'var(--admin-font-family)',
    minHeight: '100vh',
    color: 'var(--admin-text-primary)',
    background: 'var(--admin-bg-secondary)',
  } satisfies CSSProperties,

  // ─── Typography ──────────────────────────────────────────────────────────
  heading1: {
    margin: 0,
    fontSize: 'var(--admin-text-2xl)',
    fontWeight: 700,
    color: 'var(--admin-text-primary)',
  } satisfies CSSProperties,

  heading2: {
    margin: '0 0 var(--admin-space-3)',
    fontSize: 'var(--admin-text-sm)',
    color: 'var(--admin-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
  } satisfies CSSProperties,

  label: {
    display: 'block',
    fontSize: 'var(--admin-text-base)',
    color: 'var(--admin-text-tertiary)',
    marginBottom: 'var(--admin-space-1)',
    fontWeight: 500,
  } satisfies CSSProperties,

  helpText: {
    fontSize: 'var(--admin-text-sm)',
    color: 'var(--admin-text-tertiary)',
    margin: '4px 0 0',
  } satisfies CSSProperties,

  // ─── Form inputs ─────────────────────────────────────────────────────────
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid var(--admin-border)',
    background: 'var(--admin-bg-input)',
    color: 'var(--admin-text-primary)',
    borderRadius: 'var(--admin-radius-md)',
    padding: '8px 10px',
    fontSize: 'var(--admin-text-md)',
    fontFamily: 'var(--admin-font-family)',
  } satisfies CSSProperties,

  inputMono: {
    fontFamily: 'var(--admin-font-mono)',
    fontSize: 'var(--admin-text-sm)',
  } satisfies CSSProperties,

  // ─── Panels & cards ──────────────────────────────────────────────────────
  panel: {
    border: '1px solid var(--admin-border)',
    borderRadius: 'var(--admin-radius-xl)',
    background: 'var(--admin-bg-tertiary)',
    padding: 'var(--admin-space-4)',
  } satisfies CSSProperties,

  card: {
    border: '1px solid var(--admin-border)',
    borderRadius: 'var(--admin-radius-lg)',
    background: 'var(--admin-bg-tertiary)',
    padding: 'var(--admin-space-5)',
  } satisfies CSSProperties,

  // ─── Buttons ─────────────────────────────────────────────────────────────
  buttonBase: {
    border: '1px solid transparent',
    borderRadius: 'var(--admin-radius-md)',
    cursor: 'pointer',
    fontSize: 'var(--admin-text-base)',
    fontWeight: 600,
    padding: '8px 12px',
    fontFamily: 'var(--admin-font-family)',
    transition: 'background 120ms ease, border-color 120ms ease',
  } satisfies CSSProperties,

  buttonPrimary: {
    background: 'var(--admin-accent)',
    color: '#06131a',
    borderColor: 'var(--admin-accent)',
  } satisfies CSSProperties,

  buttonSecondary: {
    background: 'transparent',
    color: 'var(--admin-text-secondary)',
    borderColor: 'var(--admin-border)',
  } satisfies CSSProperties,

  buttonDanger: {
    background: 'var(--admin-danger-bg)',
    color: 'var(--admin-danger-text)',
    borderColor: 'var(--admin-danger)',
  } satisfies CSSProperties,

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } satisfies CSSProperties,

  // ─── Status messages ─────────────────────────────────────────────────────
  statusSuccess: {
    border: '1px solid var(--admin-success)',
    background: 'var(--admin-success-bg)',
    color: 'var(--admin-success-text)',
    borderRadius: 'var(--admin-radius-md)',
    padding: '10px 12px',
    fontSize: 'var(--admin-text-md)',
  } satisfies CSSProperties,

  statusError: {
    border: '1px solid var(--admin-danger)',
    background: 'var(--admin-danger-bg)',
    color: 'var(--admin-danger-text)',
    borderRadius: 'var(--admin-radius-md)',
    padding: '10px 12px',
    fontSize: 'var(--admin-text-md)',
  } satisfies CSSProperties,

  statusWarning: {
    border: '1px solid var(--admin-warning)',
    background: 'var(--admin-warning-bg)',
    color: 'var(--admin-warning-text)',
    borderRadius: 'var(--admin-radius-md)',
    padding: '10px 12px',
    fontSize: 'var(--admin-text-md)',
  } satisfies CSSProperties,
};
