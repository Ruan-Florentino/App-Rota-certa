import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Algo deu errado.</h1>
          <p className="text-subtext mb-8">
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
          >
            Recarregar App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
