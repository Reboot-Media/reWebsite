import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { NAVIGATE_EVENT } from './navigate.js'
import { pageFor } from './pages.js'
import './index.css'

const currentPage = () => pageFor(window.location.pathname)

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

// The build prerenders each page into #root for crawlers; createRoot replaces
// that markup with the live app.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
