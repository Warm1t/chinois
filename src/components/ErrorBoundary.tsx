import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-[4px_4px_0px_#1c1917] dark:shadow-[4px_4px_0px_#000] space-y-4 max-w-2xl mx-auto my-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold font-serif">
              {this.props.fallbackTitle || 'Une erreur inattendue est survenue'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {this.state.error?.message || "La leçon n'a pas pu se charger correctement."}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            {this.props.onReset && (
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReset?.();
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retour aux modules</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

