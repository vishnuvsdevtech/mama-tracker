export default function Stepper({ count, current }: { count: number; current: number }) {
  return (
    <ol className="stepper" aria-label={`Step ${current + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={i < current ? 'done' : i === current ? 'now' : ''}>
          {i < current && <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 6.4l2 1.9L9 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </li>
      ))}
    </ol>
  )
}
