import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Error Boundary para capturar erros fatais e evitar tela branca
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Critical Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'monospace', 
          backgroundColor: '#fff0f0', 
          height: '100vh', 
          color: '#c0392b' 
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ O diário não pôde ser aberto.</h1>
          <p>Encontramos um erro técnico. Tente recarregar a página.</p>
          <br/>
          <details>
            <summary>Detalhes do Erro (para suporte)</summary>
            <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);