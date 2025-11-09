// frontend/src/main.jsx
import { initTheme } from './theme.js';
initTheme();

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './app.jsx'
import Login from './pages/Login.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={createBrowserRouter([
      { path: '/login', element: <Login /> },
      { path: '/*', element: <App /> }
    ])} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
  </React.StrictMode>,
)
