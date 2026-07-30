import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Muat stylesheet Google Fonts secara non-blocking (menggantikan trik
// media="print" onload="this.media='all'" yang butuh inline script handler
// -- itu ditolak oleh Content-Security-Policy script-src 'self').
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap'
document.head.appendChild(fontLink)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)