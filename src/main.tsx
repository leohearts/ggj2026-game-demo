import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Game UI imports
import App from './game_ui/App.tsx'
import './game_ui/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
