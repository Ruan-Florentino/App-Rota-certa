import React, { Component, ReactNode } from 'react';
import { Globe3DFallback } from './Globe3DFallback';

interface Props {
  children: ReactNode;
  countryCount: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class Globe3DErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('[Globe3D] Erro capturado, exibindo fallback:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-20">
          <Globe3DFallback countryCount={this.props.countryCount} />
        </div>
      );
    }
    return this.props.children;
  }
}
