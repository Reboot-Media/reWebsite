import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BeforeCall from './BeforeCall.jsx'
import VisibilityCheck from './VisibilityCheck.jsx'
import { NAVIGATE_EVENT } from './navigate.js'
import './index.css'

const PAGES = {
  '/before-your-call': BeforeCall,
  '/visibility-check': VisibilityCheck,
}

function currentPage() {
  return PAGES[window.location.pathname.replace(/\/+$/, '')] || App
}

// Re-renders when navigate() changes the URL in place, so a page switch
// (like booking -> /before-your-call) doesn't need a server round trip.
function Router() {
  const [Page, setPage] = useState(() => currentPage())
  useEffect(() => {
    const update = () => setPage(() => currentPage())
    window.addEventListener('popstate', update)
    window.addEventListener(NAVIGATE_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(NAVIGATE_EVENT, update)
    }
  }, [])
  return <Page />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
