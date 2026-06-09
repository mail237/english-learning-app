import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="screen" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>読み込みエラー</h2>
          <p style={{ margin: '1rem 0', color: '#666' }}>
            ページを再読み込みするか、下のURLをSafariで開いてください。
          </p>
          <p>
            <a href="https://mail237.github.io/english-learning-app/">
              https://mail237.github.io/english-learning-app/
            </a>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
