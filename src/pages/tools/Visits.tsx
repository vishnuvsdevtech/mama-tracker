import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ToolShell, { Confirm } from '../../components/ToolShell'
import { EMPTY, todayISO, uid, useStored, type Visit, type VisitData, type VisitType } from '../../lib/tools'
import { useProfile } from '../../lib/ProfileContext'
import { fmtDate, whereAreWe } from '../../lib/profile'

export const VISIT_TYPES: { id: VisitType; label: string; tone: string }[] = [
  { id: 'checkup', label: 'Check-up', tone: 'c-rose' },
  { id: 'scan', label: 'Scan', tone: 'c-sage' },
  { id: 'blood', label: 'Blood test', tone: 'c-lav' },
  { id: 'other', label: 'Other', tone: 'c-butter' },
]
const blank = (): Visit => ({ id: uid(), date: todayISO(), time: '', type: 'checkup', place: '', notes: '' })

/** pregnancy week on a given date, from her due date (null after birth / without dates) */
export function weekOn(dateISO: string, due?: Date) {
  if (!due) return null
  const days = 280 - Math.round((due.getTime() - new Date(dateISO + 'T00:00:00').getTime()) / 86_400_000)
  return days >= 0 && days <= 300 ? Math.floor(days / 7) : null
}

export default function Visits() {
  const { profile } = useProfile()
  const [data, setData, ready] = useStored<VisitData>('visits', EMPTY.visits)
  const [form, setForm] = useState<Visit | null>(null)
  const [q, setQ] = useState('')
  const due = dueDate(profile?.stage)
  const today = todayISO()
  const upcoming = data.visits.filter(v => v.date >= today).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  const past = data.visits.filter(v => v.date < today).sort((a, b) => b.date.localeCompare(a.date))
  const next = upcoming[0]

  const save = () => {
    if (!form) return
    setData(d => ({ ...d, visits: [...d.visits.filter(v => v.id !== form.id), { ...form, place: form.place.trim(), notes: form.notes.trim() }] }))
    setForm(null)
  }
  const addQ = () => {
    const text = q.trim(); if (!text) return
    setData(d => ({ ...d, questions: [...d.questions, { id: uid(), text, done: false }] })); setQ('')
  }

  if (!ready) return null
  return (
    <ToolShell eyebrow="Visits & notes" title={<>Every visit, <em>remembered.</em></>}
      intro="Keep your appointments, what the doctor said, and the questions you want to ask next time — all in one place.">

      <section className="tool-card next-visit">
        {next ? <>
          <p className="eyebrow">Next visit</p>
          <h2>{fmtDate(new Date(next.date + 'T00:00:00'))}{next.time ? ` · ${next.time}` : ''}</h2>
          <p className="muted">{VISIT_TYPES.find(t => t.id === next.type)?.label}{next.place ? ` · ${next.place}` : ''}{weekOn(next.date, due) != null ? ` · week ${weekOn(next.date, due)}` : ''}</p>
        </> : <p className="muted">No upcoming visit yet. Add one so it shows on your home.</p>}
        {!form && <button type="button" className="btn btn-primary btn-sm" onClick={() => setForm(blank())}>+ Add a visit</button>}
      </section>

      <AnimatePresence>
        {form && (
          <motion.section className="tool-card form-card" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h2>{data.visits.some(v => v.id === form.id) ? 'Edit visit' : 'New visit'}</h2>
            <div className="chips">
              {VISIT_TYPES.map(t => <button key={t.id} type="button" className={`chip ${form.type === t.id ? 'on' : ''}`} onClick={() => setForm({ ...form, type: t.id })}>{t.label}</button>)}
            </div>
            <div className="form-grid">
              <label className="field"><span className="ob-q">Date</span><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
              <label className="field"><span className="ob-q">Time <small>(optional)</small></span><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label>
            </div>
            <label className="field"><span className="ob-q">Where / with whom</span><input value={form.place} maxLength={80} placeholder="e.g. Dr. Meera, City Hospital" onChange={e => setForm({ ...form, place: e.target.value })} /></label>
            <label className="field"><span className="ob-q">Notes</span><textarea rows={4} value={form.notes} maxLength={2000} placeholder="What the doctor said, anything to remember…" onChange={e => setForm({ ...form, notes: e.target.value })} /></label>
            <div className="row-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className="btn btn-primary btn-sm" disabled={!form.date} onClick={save}>Save visit</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="tool-card">
        <div className="card-head"><h2>Questions for next time</h2></div>
        <form className="q-add" onSubmit={e => { e.preventDefault(); addQ() }}>
          <input value={q} maxLength={200} placeholder="Jot a question down…" onChange={e => setQ(e.target.value)} aria-label="New question" />
          <button type="submit" className="btn btn-soft btn-sm" disabled={!q.trim()}>Add</button>
        </form>
        {data.questions.length === 0 ? <p className="muted">Questions pop up at 2 a.m. — write them here, tick them off in the consultation room.</p> : (
          <ul className="qlist">
            {data.questions.map(x => (
              <li key={x.id} className={x.done ? 'done' : ''}>
                <button type="button" className="tickbox" aria-pressed={x.done} aria-label={x.done ? 'Mark as not asked' : 'Mark as asked'}
                  onClick={() => setData(d => ({ ...d, questions: d.questions.map(y => y.id === x.id ? { ...y, done: !y.done } : y) }))}>
                  {x.done && <svg viewBox="0 0 12 12"><path d="M3 6.4l2 1.9L9 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
                <span>{x.text}</span>
                <button type="button" className="x" aria-label="Delete question" onClick={() => setData(d => ({ ...d, questions: d.questions.filter(y => y.id !== x.id) }))}>×</button>
              </li>
            ))}
          </ul>
        )}
        {data.questions.some(x => x.done) && <button type="button" className="link" onClick={() => setData(d => ({ ...d, questions: d.questions.filter(x => !x.done) }))}>Remove asked questions</button>}
      </section>

      {[['Coming up', upcoming], ['Past visits', past]].map(([label, list]) => (list as Visit[]).length > 0 && (
        <section className="tool-card" key={label as string}>
          <div className="card-head"><h2>{label as string}</h2></div>
          <ul className="visits">
            {(list as Visit[]).map(v => {
              const t = VISIT_TYPES.find(x => x.id === v.type)!
              const wk = weekOn(v.date, due)
              return (
                <li key={v.id}>
                  <span className={`vdot ${t.tone}`} />
                  <div className="vbody">
                    <div className="vhead"><b>{fmtDate(new Date(v.date + 'T00:00:00'))}{v.time ? ` · ${v.time}` : ''}</b><span className="pill">{t.label}{wk != null ? ` · wk ${wk}` : ''}</span></div>
                    {v.place && <p className="vplace">{v.place}</p>}
                    {v.notes && <p className="vnotes">{v.notes}</p>}
                    <div className="row-actions left">
                      <button type="button" className="link" onClick={() => { setForm(v); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
                      <Confirm yes="Yes, delete" label="Delete this visit?" onYes={() => setData(d => ({ ...d, visits: d.visits.filter(x => x.id !== v.id) }))}>Delete</Confirm>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </ToolShell>
  )
}

function dueDate(stage: import('../../lib/profile').Stage | null | undefined) {
  const w = whereAreWe(stage ?? null)
  return w?.pregnant ? w.due : undefined
}
