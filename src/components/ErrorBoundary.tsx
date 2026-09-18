"use client";

import { Component, ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">Algo deu errado nesta seção.</p>
            <button
              className="min-h-12 min-w-12 rounded-md bg-red-600 px-4 text-white"
              onClick={() => this.setState({ hasError: false })}
            >
              Tentar novamente
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
