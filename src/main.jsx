import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { SiteAuthProvider } from './context/SiteAuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteAuthProvider>
        <App />
      </SiteAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
