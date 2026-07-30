import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined' && window.trustedTypes?.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => string,
    createScript: (string) => string,
    createScriptURL: (string) => string,
  })
}

const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600;700&display=optional'
document.head.appendChild(fontLink)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)