import { Link } from 'react-router-dom'
export default function Brand({ to = '/' }: { to?: string }) {
  return (
    <Link className="brand" to={to} aria-label="Nine months, organised — home">
      <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#FFD9E3" /><circle cx="16" cy="17" r="8.5" fill="#F7CDB5" /><circle cx="13" cy="16.5" r="1.3" fill="#3E2230" /><circle cx="19" cy="16.5" r="1.3" fill="#3E2230" /><path d="M14 20q2 1.6 4 0" stroke="#C8295E" strokeWidth="1.3" fill="none" strokeLinecap="round" /><path d="M16 8.6c-1.6-.4-2 1.8-.4 1.9" stroke="#C8295E" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
      <span>Nine months, organised</span>
    </Link>
  )
}
