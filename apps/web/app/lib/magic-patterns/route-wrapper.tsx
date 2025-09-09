import React from 'react';
import { useLoaderData } from '@react-router/react';
import type { Route } from '@react-router/dev/routes';

/**
 * Magic Patterns Route Wrapper
 * Provides consistent error handling and data loading for Magic Patterns components
 */

interface MagicPatternsRouteWrapperProps<T> {
  component: React.ComponentType<T>;
  transformData?: (loaderData: any) => T;
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error }>;
}

export function createMagicPatternsRoute<T>({
  component: Component,
  transformData,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
}: MagicPatternsRouteWrapperProps<T>) {
  return function MagicPatternsRoute() {
    // Hooks must be called at the top level, not inside try-catch
    const loaderData = useLoaderData();
    
    console.log('[MagicPatternsRoute] Raw loader data:', loaderData);
    
    try {
      // Transform data if transformer provided
      const props = transformData ? transformData(loaderData) : loaderData;
      console.log('[MagicPatternsRoute] Transformed props:', props);
      
      // Render the Magic Patterns component with props
      return <Component {...props} />;
    } catch (error) {
      console.error('Error in Magic Patterns route:', error);
      
      if (ErrorComponent) {
        return <ErrorComponent error={error as Error} />;
      }
      
      // Default error UI matching Magic Patterns style
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-gray-600">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
  };
}

/**
 * Default loading component matching Magic Patterns style
 */
export function MagicPatternsLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Default error boundary for Magic Patterns routes
 */
export class MagicPatternsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Magic Patterns Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-gray-900">Oops!</h1>
            <p className="mt-4 text-lg text-gray-600">
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}