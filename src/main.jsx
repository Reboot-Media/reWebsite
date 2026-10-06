import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BeforeCall from './BeforeCall.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/before-your-call' ? <BeforeCall /> : <App />}
  </React.StrictMode>,
)
