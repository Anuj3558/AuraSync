import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './store/AppState.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)
