export const HEART_PATH = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z'
export function Heart({ size = 16, color = 'currentColor', className, style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden="true">
      <path fill={color} d={HEART_PATH} />
    </svg>
  )
}
export function Check({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#FFE5DC" />
      <path d="M7 12.5l3.2 3L17 8.8" fill="none" stroke="#C8506A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function Arrow({ size = 18, back = false }: { size?: number; back?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
/** A hug: a big heart wrapping its arms around a little one. */
export function HugIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <path d={HEART_PATH} transform="translate(2 1) scale(1.85)" fill="#FE6490" stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
      <path d={HEART_PATH} transform="translate(13.5 12.5) scale(.88)" fill="#FFE3EA" />
      <g fill="none" stroke="#B8215A" strokeWidth="3.6" strokeLinecap="round">
        <path d="M8.6 19.5 C 7.6 28, 14 33, 20.5 31" /><path d="M39.4 19.5 C 40.4 28, 34 33, 27.5 31" />
      </g>
      <circle cx="20.6" cy="30.9" r="2.7" fill="#B8215A" /><circle cx="27.4" cy="30.9" r="2.7" fill="#B8215A" />
    </svg>
  )
}
