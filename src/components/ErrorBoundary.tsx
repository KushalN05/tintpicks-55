import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          backgroundColor: '#ffebee',
          border: '2px solid #ef5350',
          borderRadius: '8px',
          color: '#c62828',
          fontFamily: 'monospace',
          overflowX: 'auto'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Fatal React Error
          </h1>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Message:</strong> {this.state.error?.message}
          </div>
          <details style={{ whiteSpace: 'pre-wrap', backgroundColor: '#ffcdd2', padding: '1rem', borderRadius: '4px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>View Stack Trace</summary>
            {this.state.error?.stack}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
