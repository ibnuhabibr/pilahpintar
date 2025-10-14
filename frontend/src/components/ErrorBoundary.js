import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">
              Oops! Terjadi kesalahan
            </h1>
            <p className="text-neutral-600 mb-6">
              Aplikasi sedang dalam pengembangan. Silakan refresh halaman atau
              coba lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
            >
              Refresh Halaman
            </button>
            <div className="mt-4 text-sm text-neutral-500">
              PilahPintar v1.0 - AI Waste Classification
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
