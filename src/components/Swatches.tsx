export default function Swatches({ colors, value, onChange, label, display }: {
  colors: string[]; value: string; onChange: (c: string) => void; label: string; display?: (c: string) => string
}) {
  return (
    <div className="swatches" role="radiogroup" aria-label={label}>
      {colors.map(c => (
        <button key={c} type="button" role="radio" aria-checked={value === c} aria-label={`${label} ${colors.indexOf(c) + 1}`}
          className={`sw ${value === c ? 'on' : ''}`} style={{ background: display ? display(c) : c }} onClick={() => onChange(c)} />
      ))}
    </div>
  )
}
