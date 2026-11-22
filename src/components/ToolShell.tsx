import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Brand from './Brand'
import { Arrow } from './Heart'

export default function ToolShell({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="app">
      <nav className="top scrolled">
        <div className="wrap row">
          <Link to="/home" className="icon-btn" aria-label="Back to home"><Arrow back /></Link>
          <Brand to="/home" />
          <span style={{ width: 44 }} />
        </div>
      </nav>
      <motion.main className="wrap tool-page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="home-title tool-title">{title}</h1>
        {intro && <p className="lede tool-intro">{intro}</p>}
        {children}
      </motion.main>
    </div>
  )
}

export function SafetyNote({ children }: { children: ReactNode }) {
  return (
    <div className="safety" role="note">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FCE7E1" /><path d="M12 7v6" stroke="#A85F5A" strokeWidth="2.4" strokeLinecap="round" /><circle cx="12" cy="16.6" r="1.4" fill="#A85F5A" /></svg>
      <p>{children}</p>
    </div>
  )
}

export function Confirm({ label, onYes, children = 'Clear', yes = 'Yes, clear' }: { label: string; onYes: () => void; children?: ReactNode; yes?: string }) {
  return (
    <details className="confirm">
      <summary className="link">{children}</summary>
      <div className="confirm-pop">
        <span>{label}</span>
        <button type="button" className="btn btn-danger btn-sm" onClick={e => { onYes(); (e.currentTarget.closest('details') as HTMLDetailsElement).open = false }}>{yes}</button>
      </div>
    </details>
  )
}
