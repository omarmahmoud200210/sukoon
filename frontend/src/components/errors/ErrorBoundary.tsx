import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import logger from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RawErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-red-400 mb-4">
              error_outline
            </span>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-on-surface-variant mb-4 max-w-sm">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Wraps the class-based ErrorBoundary with Sentry.withErrorBoundary so that
 * every unhandled React error is automatically reported to Sentry.
 */
const ErrorBoundary = Sentry.withErrorBoundary(RawErrorBoundary, {
  showDialog: false, // set to true if you want the Sentry user-feedback dialog
});

export default ErrorBoundary;
