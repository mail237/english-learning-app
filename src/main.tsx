import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

const rootEl = document.getElementById('root')

if (!rootEl) {
  document.body.innerHTML =
    '<p style="padding:2rem;text-align:center">アプリを読み込めませんでした。</p>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    console.error(err)
    rootEl.innerHTML =
      '<div style="padding:2rem;text-align:center"><h2>お使いのiPadでは表示できない可能性があります</h2><p>iOSを最新にしてから、Safariで次を開いてください。</p><p><a href="https://mail237.github.io/english-learning-app/">英語学習アプリを開く</a></p></div>'
  }
}
