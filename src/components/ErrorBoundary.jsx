import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-[5%] text-center">
          <div className="max-w-[440px]">
            <h1 className="font-[var(--font-display)] text-[4rem] font-black text-[--accent] mb-2">Oops</h1>
            <p className="text-white font-semibold text-lg mb-2">Something went wrong</p>
            <p className="text-[--text-muted] text-sm mb-8">
              An unexpected error occurred. Please refresh the page or go back home.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn-secondary text-sm" onClick={() => window.location.reload()}>
                Refresh Page
              </button>
              <Link to="/" className="btn-primary text-sm" onClick={() => this.setState({ hasError: false })}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
