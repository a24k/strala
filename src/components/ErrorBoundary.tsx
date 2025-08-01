import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('🚨 Strala Error Boundary caught an error:');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    
    // Store error info in state
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Clear error state and try to recover
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleClearData = () => {
    // Clear localStorage and reload
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('strala')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Cleared all Strala data for recovery');
      
      // Reload the page to start fresh
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-strala-navy flex items-center justify-center p-4">
          <div className="bg-strala-dark-blue border border-strala-border rounded-lg p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-strala-text-primary mb-2">
                Something went wrong
              </h1>
              <p className="text-strala-text-secondary">
                Strala encountered an unexpected error and needs to recover.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-strala-navy rounded-lg p-4">
                <h3 className="text-lg font-semibold text-strala-text-primary mb-2">
                  Error Details:
                </h3>
                <div className="text-sm text-strala-text-secondary font-mono">
                  {this.state.error?.message || 'Unknown error'}
                </div>
              </div>

              {this.state.errorInfo && (
                <details className="bg-strala-navy rounded-lg p-4">
                  <summary className="text-lg font-semibold text-strala-text-primary cursor-pointer">
                    Stack Trace (Development)
                  </summary>
                  <pre className="text-xs text-strala-text-secondary mt-2 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-strala-accent text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleClearData}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reset All Data
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-strala-border text-strala-text-primary rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-strala-text-secondary">
              <p>
                If this problem persists, please{' '}
                <a 
                  href="https://github.com/anthropics/claude-code/issues" 
                  className="text-strala-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  report it on GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}