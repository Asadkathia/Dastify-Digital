'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; label?: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[VisualEditor]', error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f0f0f',
            padding: '32px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#f87171', fontWeight: 600, fontSize: '14px', margin: '0 0 8px' }}>
            {this.props.label ?? 'Something went wrong'}
          </p>
          <p style={{ color: '#555', fontSize: '12px', margin: '0 0 20px', maxWidth: '300px', lineHeight: 1.5 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '8px 16px',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
