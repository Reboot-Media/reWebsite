import App from './App.jsx'
import BeforeCall from './BeforeCall.jsx'
import VisibilityCheck from './VisibilityCheck.jsx'

const PAGES = {
  '/before-your-call': BeforeCall,
  '/visibility-check': VisibilityCheck,
}

export const normalizePath = (path) => path.replace(/\/+$/, '') || '/'

// Shared by the browser router and the build-time prerender.
export const pageFor = (path) => PAGES[normalizePath(path)] || App
