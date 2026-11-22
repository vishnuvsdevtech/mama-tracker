import { useState } from 'react'
import { motion } from 'motion/react'
import ToolShell, { Confirm, SafetyNote } from '../../components/ToolShell'
import { EMPTY, buzz, clock, timeOf, useStored, useTicker, type ContractionData, type DoctorRule } from '../../lib/tools'

const MIN = 60_000

export default function Contractions() {
  const [data, setData, ready] = useStored<ContractionData>('contractions', EMPTY.contractions)
  const items = data.items
  const running = items.length > 0 && items[items.length - 1].end == null ? items[items.length - 1] : null
  useTicker(true, running ? 250 : 5000)
  const now = Date.now()

  const toggle = () => {
    buzz(20)
    setData(d => {
      const last = d.items[d.items.length - 1]
      if (last && last.end == null) return { ...d, items: d.items.map((c, i) => i === d.items.length - 1 ? { ...c, end: Date.now() } : c) }
      return { ...d, items: [...d.items, { start: Date.now() }].slice(-200) }
    })
  }

  // pattern over the window her doctor asked about (or the last hour)
  const windowMin = data.rule?.forMin || 60
  const done = items.filter(c => c.end != null)
  const inWin = done.filter(c => c.start >= now - windowMin * MIN)
  const durs = inWin.map(c => c.end! - c.start)
  const gaps = inWin.slice(1).map((c, i) => c.start - inWin[i].start)
  const avg = (a: number[]) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0
  const avgDur = avg(durs), avgGap = avg(gaps)

  // Does her recent pattern match the rule her doctor gave her? Look back over the rule's
  // period plus one gap, so the run of contractions can actually span the whole period.
  let matches = false
  const r = data.rule
  if (r) {
    const run = done.filter(c => c.start >= now - (r.forMin + r.everyMin) * MIN)
    const runGaps = run.slice(1).map((c, i) => c.start - run[i].start)
    const recent = run.length > 0 && now - run[run.length - 1].start <= r.everyMin * MIN * 1.5
    matches = run.length >= 3 && recent
      && run[run.length - 1].start - run[0].start >= r.forMin * MIN * 0.9
      && runGaps.every(g => g <= r.everyMin * MIN * 1.1)
      && run.every(c => c.end! - c.start >= r.lastingSec * 1000 * 0.9)
  }

  if (!ready) return null
  const list = [...items].map((c, i) => ({ ...c, gap: i ? c.start - items[i - 1].start : null })).reverse()

  return (
    <ToolShell eyebrow="Contractions" title={<>Time them, <em>breathe.</em></>}
      intro="Tap when a contraction starts and again when it ends. The timing is kept for you, so you can focus on breathing.">

      <section className="tool-card center">
        <motion.button type="button" className={`big-round ${running ? 'live' : ''}`} onClick={toggle} whileTap={{ scale: .93 }}>
          {running ? <><b className="big-clock">{clock(now - running.start)}</b><span>Tap when it ends</span></> : <><b className="big-clock">Start</b><span>Tap when it begins</span></>}
        </motion.button>
        {running && <p className="muted breathe">Breathe in… and slowly out.</p>}
        <div className="kick-stats">
          <div><b>{inWin.length}</b><span>in the last {windowMin} min</span></div>
          <div><b>{avgDur ? `${Math.round(avgDur / 1000)} s` : '—'}</b><span>average length</span></div>
          <div><b>{avgGap ? `${(avgGap / MIN).toFixed(1)} min` : '—'}</b><span>apart, start to start</span></div>
        </div>
      </section>

      <RuleCard rule={data.rule} onChange={rule => setData(d => ({ ...d, rule }))} matches={matches} hasData={inWin.length > 0} />

      <SafetyNote>
        Waters breaking, bleeding, constant or severe pain, or the baby moving less? <b>Call your hospital now</b> — don't wait for a pattern.
      </SafetyNote>

      <section className="tool-card">
        <div className="card-head"><h2>This labour log</h2>{items.length > 0 && <Confirm label="Clear every timed contraction?" onYes={() => setData(d => ({ ...d, items: [] }))}>Start fresh</Confirm>}</div>
        {list.length === 0 ? <p className="muted">Contractions you time will appear here.</p> : (
          <table className="ctable">
            <thead><tr><th>Started</th><th>Lasted</th><th>Apart</th></tr></thead>
            <tbody>
              {list.slice(0, 40).map(c => (
                <tr key={c.start} className={c.end == null ? 'live' : ''}>
                  <td>{timeOf(c.start)}</td>
                  <td>{c.end == null ? 'now…' : clock(c.end - c.start)}</td>
                  <td>{c.gap == null ? '—' : clock(c.gap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </ToolShell>
  )
}

function RuleCard({ rule, onChange, matches, hasData }: { rule?: DoctorRule; onChange: (r?: DoctorRule) => void; matches: boolean; hasData: boolean }) {
  const [edit, setEdit] = useState(!rule)
  const [v, setV] = useState({ everyMin: rule?.everyMin ?? '', lastingSec: rule?.lastingSec ?? '', forMin: rule?.forMin ?? '' })
  const ok = Number(v.everyMin) > 0 && Number(v.lastingSec) > 0 && Number(v.forMin) > 0
  return (
    <section className={`tool-card rule ${matches ? 'match' : ''}`}>
      <div className="card-head"><h2>Your doctor's rule</h2>{rule && !edit && <button type="button" className="link" onClick={() => setEdit(true)}>Change</button>}</div>
      {edit ? (
        <>
          <p className="muted">Ask your doctor or midwife when they want you to come in, and note their numbers here. The app only compares your timings with what they told you.</p>
          <div className="rule-form">
            <label>Every <input type="number" inputMode="decimal" min={1} value={v.everyMin} onChange={e => setV({ ...v, everyMin: e.target.value })} /> min</label>
            <label>lasting <input type="number" inputMode="numeric" min={10} value={v.lastingSec} onChange={e => setV({ ...v, lastingSec: e.target.value })} /> sec</label>
            <label>for <input type="number" inputMode="numeric" min={10} value={v.forMin} onChange={e => setV({ ...v, forMin: e.target.value })} /> min</label>
          </div>
          <div className="row-actions">
            {rule && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { onChange(undefined); setV({ everyMin: '', lastingSec: '', forMin: '' }) }}>Remove</button>}
            <button type="button" className="btn btn-primary btn-sm" disabled={!ok} onClick={() => { onChange({ everyMin: +v.everyMin, lastingSec: +v.lastingSec, forMin: +v.forMin }); setEdit(false) }}>Save rule</button>
          </div>
        </>
      ) : rule ? (
        <>
          <p className="rule-line">Every <b>{rule.everyMin} min</b>, lasting <b>{rule.lastingSec} sec</b>, for <b>{rule.forMin} min</b></p>
          {matches
            ? <p className="rule-status yes">Your timings now match the rule your doctor gave you. <b>Follow their plan — call your hospital.</b></p>
            : <p className="rule-status">{hasData ? 'Not matching your doctor\'s rule yet. Keep timing, and rest between them.' : 'Start timing and this will compare your pattern with their rule.'}</p>}
        </>
      ) : null}
    </section>
  )
}
