import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <p className="text-text-secondary">Please refresh the page. If this keeps happening, get in touch.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
