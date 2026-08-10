import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif',
          padding: '2rem', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>TOBEQUE</h1>
          <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>Something went wrong loading the page.</p>
          <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '2rem', maxWidth: '500px', wordBreak: 'break-word' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              background: '#fff', color: '#000', border: 'none',
              padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold',
              letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem'
            }}
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
