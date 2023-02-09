import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { routes } from './router'
import App from './App'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {routes.map(({ path, component: Component, redirect }) => (
            (redirect && (
              <Route key={path} path={path} element={<Navigate to={redirect} replace />} />
            )) ||
            (path && Component && (
              <Route key={path} path={path} element={<Component />} />
            ))
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
