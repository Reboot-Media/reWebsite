import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BeforeCall from './BeforeCall.jsx'
import VisibilityCheck from './VisibilityCheck.jsx'
import './index.css'

const PAGES = {
  '/before-your-call': BeforeCall,
  '/visibility-check': VisibilityCheck,
}
const Page = PAGES[window.location.pathname.replace(/\/+$/, '')] || App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
