import { Component, type ErrorInfo, type ReactNode } from 'react';
import { errorHandler } from '../error/ErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string; // Optional component name for better error context
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component
 * Per spec Section 4.3.7: React ErrorBoundary component wraps main app and individual views
 * Catches React rendering errors and shows fallback UI
 * Per milestone 16: Enhanced with structured logging
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error with structured logging
    errorHandler.fatal(
      `React rendering error in ${this.props.componentName || 'component'}: ${error.message}`,
      {
        component: this.props.componentName || 'ErrorBoundary',
        action: 'componentDidCatch',
        state: {
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
        },
      }
    );

    this.setState({
      error,
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {import.meta.env.DEV && this.state.errorInfo && (
            <details>
              <summary>Error details (development only)</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
