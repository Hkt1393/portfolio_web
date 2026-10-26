import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { ThemeProvider } from './app/providers/ThemeProvider'
import './app/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider><App /></ThemeProvider>
  </StrictMode>,
)
