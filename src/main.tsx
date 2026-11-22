import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { ProfileProvider } from './lib/ProfileContext'
import App from './App'
import { installScrollState } from './lib/scrollState'
import './styles/landing.css'
import './styles/app.css'

// The Claude preview is a single sandboxed file, so it keeps routes in memory.
// The real site uses proper URLs under /mama-tracker/.
const isPreview = import.meta.env.MODE === 'preview'
const Router = ({ children }: { children: React.ReactNode }) =>
  isPreview
    ? <MemoryRouter>{children}</MemoryRouter>
    : <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>{children}</BrowserRouter>

installScrollState()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ProfileProvider>
        <Router><App /></Router>
      </ProfileProvider>
    </MotionConfig>
  </StrictMode>,
)
