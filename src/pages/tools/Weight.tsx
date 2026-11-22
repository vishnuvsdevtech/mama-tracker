import { useEffect, useRef, useState } from 'react'
import ToolShell, { Confirm } from '../../components/ToolShell'
import { EMPTY, dayOf, todayISO, uid, useStored, type WeightData, type WeightEntry } from '../../lib/tools'
import { useProfile } from '../../lib/ProfileContext'
import { whereAreWe } from '../../lib/profile'
import { weekOn } from './Visits'

export default function Weight() {
  const { profile } = useProfile()
  const [data, setData, ready] = useStored<WeightData>('weight', EMPTY.weight)
  const [date, setDate] = useState(todayISO())
  const [kg, setKg] = useState('')
  const w = whereAreWe(profile?.stage ?? null)
  const due = w?.pregnant ? w.due : undefined
  const entries = [...data.entries].sort((a, b) => a.date.localeCompare(b.date))
  const first = entries[0], last = entries[entries.length - 1]
  const change = first && last && first !== last ? last.kg - first.kg : null
  const hide = data.hideNumbers
  const val = Number(kg)
  const valid = kg !== '' && val >= 25 && val <= 250 && !!date

  const add = () => {
    if (!valid) return
    const e: WeightEntry = { id: uid(), date, kg: Math.round(val * 10) / 10 }
    setData(d => ({ ...d, entries: [...d.entries.filter(x => x.date !== date), e] }))   // one entry per day
    setKg('')
  }

  if (!ready) return null
  return (
    <ToolShell eyebrow="Weight" title={<>Your numbers, <em>gently.</em></>}
      intro="A private place to note your weight when you want to. Only your own numbers — no charts of what anyone else weighs, no judgement.">

      <section className="tool-card">
        <form className="weight-add" onSubmit={e => { e.preventDefault(); add() }}>
          <label className="field"><span className="ob-q">Date</span><input type="date" value={date} max={todayISO()} onChange={e => setDate(e.target.value)} /></label>
          <label className="field"><span className="ob-q">Weight (kg)</span><input type="number" inputMode="decimal" step="0.1" min={25} max={250} value={kg} placeholder="e.g. 62.4" onChange={e => setKg(e.target.value)} /></label>
          <button type="submit" className="btn btn-primary" disabled={!valid}>Save</button>
        </form>
        <label className="toggle">
          <input type="checkbox" checked={hide} onChange={e => setData(d => ({ ...d, hideNumbers: e.target.checked }))} />
          <span className="switch" aria-hidden="true" /> Hide the numbers — just show the shape of the line
        </label>
      </section>

      {entries.length > 0 && (
        <section className="tool-card">
          <div className="card-head"><h2>Over time</h2>{!hide && change != null && <span className="pill">{change >= 0 ? '+' : '−'}{Math.abs(change).toFixed(1)} kg since {dayOf(first.date)}</span>}</div>
          <WeightChart entries={entries} hide={hide} due={due} />
          <p className="muted small">Every body changes in its own way and at its own pace. Your doctor will tell you if anything needs attention.</p>
        </section>
      )}

      {entries.length > 0 && (
        <section className="tool-card">
          <div className="card-head"><h2>Entries</h2><Confirm label="Delete every weight entry?" onYes={() => setData(d => ({ ...d, entries: [] }))}>Clear all</Confirm></div>
          <ul className="log">
            {[...entries].reverse().map(e => {
              const wk = weekOn(e.date, due)
              return (
                <li key={e.id} className="log-row">
                  <div className="log-main"><b>{hide ? '•••' : `${e.kg.toFixed(1)} kg`}</b><span>{dayOf(e.date)}{wk != null ? ` · week ${wk}` : ''}</span></div>
                  <button type="button" className="x" aria-label="Delete entry" onClick={() => setData(d => ({ ...d, entries: d.entries.filter(x => x.id !== e.id) }))}>×</button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </ToolShell>
  )
}

function WeightChart({ entries, hide, due }: { entries: WeightEntry[]; hide: boolean; due?: Date }) {
  // draw at the real pixel width so labels stay readable on phones
  const box = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(600)
  useEffect(() => {
    const el = box.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))))
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const H = Math.round(Math.min(240, Math.max(170, W * 0.42))), P = { l: hide ? 12 : 36, r: 14, t: 14, b: 26 }
  const t = (d: string) => new Date(d + 'T00:00:00').getTime()
  const t0 = t(entries[0].date), t1 = Math.max(t(entries[entries.length - 1].date), t0 + 7 * 86_400_000)
  const kgs = entries.map(e => e.kg)
  const lo = Math.floor(Math.min(...kgs) - 1), hi = Math.ceil(Math.max(...kgs) + 1)
  const x = (d: string) => P.l + (t(d) - t0) / (t1 - t0) * (W - P.l - P.r)
  const y = (k: number) => P.t + (1 - (k - lo) / (hi - lo)) * (H - P.t - P.b)
  const pts = entries.map(e => [x(e.date), y(e.kg)] as const)
  const path = pts.map(([px, py], i) => (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)).join(' ')
  const area = `${path} L ${pts[pts.length - 1][0].toFixed(1)} ${H - P.b} L ${pts[0][0].toFixed(1)} ${H - P.b} Z`
  const ticks = [lo, (lo + hi) / 2, hi]
  const label = (d: string) => { const wk = weekOn(d, due); return wk != null ? `wk ${wk}` : dayOf(d) }
  return (
    <div ref={box} className="wchart-box"><svg className="wchart" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={hide ? 'Your weight trend, numbers hidden' : `Your weight from ${entries[0].kg} to ${entries[entries.length - 1].kg} kg`}>
      <defs><linearGradient id="wfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F0507F" stopOpacity=".22" /><stop offset="1" stopColor="#F0507F" stopOpacity="0" /></linearGradient></defs>
      {ticks.map(k => <g key={k}><line x1={P.l} x2={W - P.r} y1={y(k)} y2={y(k)} stroke="#F8D7E1" />{!hide && <text x={P.l - 8} y={y(k) + 4} textAnchor="end" className="wtick">{k.toFixed(0)}</text>}</g>)}
      {pts.length > 1 && <path d={area} fill="url(#wfill)" />}
      {pts.length > 1 && <path d={path} fill="none" stroke="#F0507F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {pts.map(([px, py], i) => <circle key={i} cx={px} cy={py} r={i === pts.length - 1 ? 6 : 4.5} fill={i === pts.length - 1 ? '#F0507F' : '#fff'} stroke="#F0507F" strokeWidth="2.5" />)}
      <text x={pts[0][0]} y={H - 8} className="wtick" textAnchor="start">{label(entries[0].date)}</text>
      {entries.length > 1 && <text x={pts[pts.length - 1][0]} y={H - 8} className="wtick" textAnchor="end">{label(entries[entries.length - 1].date)}</text>}
    </svg></div>
  )
}
