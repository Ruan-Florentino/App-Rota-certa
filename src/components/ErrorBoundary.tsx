import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

/**
 * ErrorBoundary (Wrapper para react-error-boundary).
 * Implementa a lógica industrial de captura de erros com reset manual.
 */
export function ErrorBoundary({ children, onReset }: Props) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
      onError={(error, info) => {
        // Log detalhado no console para desenvolvedores
        if (typeof window !== 'undefined' && window.console) {
          console.group('🚨 [ErrorBoundary Application Crash]');
          console.error('Error:', error);
          console.error('Component Stack:', info.componentStack);
          console.groupEnd();
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
