import React from 'react';
import type { FallbackProps } from 'react-error-boundary';

/**
 * ErrorFallback ultra-robusto (Componente Funcional para react-error-boundary).
 * Mantém o design premium mas integra com a biblioteca padrão industrial.
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Verificação de ambiente ultra-segura
  const isDev = typeof import.meta !== 'undefined' && 
                import.meta.env && 
                import.meta.env.DEV;

  const isAuthError = (error as any)?.code === 'AUTH_EXPIRED' || 
                     (error as any)?.message?.includes('Sessão expirada');

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    // Limpa estado de erro e tenta logout/login
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: '#020617',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Geist", "Inter", sans-serif'
    }}>
      {/* Background Decorativo - Puro CSS para resiliência total */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw',
          background: isAuthError ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)'
        }} />
      </div>
      
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '32px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Ícone de Erro - SVG Puro */}
        <div style={{
          width: '80px',
          height: '80px',
          marginBottom: '32px',
          borderRadius: '50%',
          backgroundColor: isAuthError ? 'rgba(168, 85, 247, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isAuthError ? 'rgba(168, 85, 247, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isAuthError ? '#A855F7' : '#F87171'
        }}>
          {isAuthError ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 900, 
          letterSpacing: '-0.025em', 
          marginBottom: '12px', 
          textTransform: 'uppercase',
          margin: '0 0 12px 0'
        }}>
          {isAuthError ? 'Sessão Expirada' : 'Ops! Algo deu errado'}
        </h1>
        
        <p style={{ 
          fontSize: '14px', 
          fontWeight: 500, 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: '32px', 
          lineHeight: 1.6,
          margin: '0 0 32px 0'
        }}>
          {isAuthError 
            ? 'Sua sessão de segurança expirou. Por favor, faça login novamente para reativar seu acesso.'
            : 'Encontramos um problema inesperado na aplicação. Não se preocupe, seus dados estão seguros.'}
        </p>
        
        {/* Modo Dev - Informações Técnicas */}
        {isDev && error && !isAuthError && (
          <div style={{
            width: '100%',
            textAlign: 'left',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.1em',
              marginBottom: '12px'
            }}>
              Detalhes Técnicos:
            </div>
            <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
              <code style={{ 
                display: 'block', 
                fontSize: '12px', 
                color: '#F87171', 
                marginBottom: '12px', 
                whiteSpace: 'pre-wrap',
                fontFamily: '"JetBrains Mono", monospace'
              }}>
                {(error as any)?.message || String(error)}
              </code>
            </div>
          </div>
        )}
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isAuthError ? (
            <button 
              onClick={handleLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#A855F7',
                color: 'white',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '11px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
              }}
            >
              Fazer Login Novamente
            </button>
          ) : (
            <button 
              onClick={resetErrorBoundary}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'white',
                color: 'black',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '11px',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Tentar Recarregar
            </button>
          )}
          
          <button 
            onClick={handleGoHome}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '11px',
              padding: '16px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Voltar ao Início
          </button>
          
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '11px',
              padding: '16px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🗑️ Limpar dados e reiniciar
          </button>
        </div>
        
        <p style={{
          marginTop: '32px',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Sua jornada continua em breve
        </p>
      </div>
    </div>
  );
}


