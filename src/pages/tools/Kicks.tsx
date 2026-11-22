import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ToolShell, { Confirm, SafetyNote } from '../../components/ToolShell'
import { EMPTY, ago, buzz, clock, dayOf, timeOf, uid, useStored, useTicker, type KickData } from '../../lib/tools'
import { useProfile } from '../../lib/ProfileContext'

export default function Kicks() {
  const { profile } = useProfile()
  const baby = profile?.babyName?.trim() || 'baby'
  const [data, setData, ready] = useStored<KickData>('kicks', EMPTY.kicks)
  const [pops, setPops] = useState<number[]>([])
  const active = data.active
  useTicker(!!active)

  const start = () => setData(d => ({ ...d, active: { id: uid(), start: Date.now(), taps: [] } }))
  const tap = () => {
    buzz()
    const now = Date.now()
    setData(d => d.active ? { ...d, active: { ...d.active, taps: [...d.active.taps, now] } } : d)
    setPops(p => [...p.slice(-6), now])
  }
  const undo = () => setData(d => d.active ? { ...d, active: { ...d.active, taps: d.active.taps.slice(0, -1) } } : d)
  const finish = () => setData(d => {
    if (!d.active) return d
    const done = { ...d.active, end: Date.now() }
    return { sessions: done.taps.length ? [done, ...d.sessions].slice(0, 60) : d.sessions, active: undefined }
  })
  const lastTap = active?.taps[active.taps.length - 1]
  const maxCount = Math.max(1, ...data.sessions.slice(0, 10).map(s => s.taps.length))

  if (!ready) return null
  return (
    <ToolShell eyebrow="Movements" title={<>Feel {baby} <em>move.</em></>}
      intro={<>Kicks, rolls, swishes and flutters all count. Notice what's usual for {baby}, and what time of day {baby} is most active.</>}>

      <section className="tool-card kick-card">
        {!active ? (
          <div className="kick-start">
            <button type="button" className="big-round" onClick={start}>
              <FootIcon /><span>Start a session</span>
            </button>
            <p className="muted">Lie on your side, relax, and tap each time you feel a movement.</p>
          </div>
        ) : (
          <div className="kick-live">
            <div className="kick-stats">
              <div><b>{active.taps.length}</b><span>movements</span></div>
              <div><b>{clock(Date.now() - active.start)}</b><span>so far</span></div>
              <div><b>{lastTap ? ago(lastTap).replace(' ago', '') : '—'}</b><span>since the last</span></div>
            </div>
            <div className="tap-zone">
              <motion.button type="button" className="big-round tap" onClick={tap} whileTap={{ scale: .9 }} aria-label="I felt a movement">
                <FootIcon /><span>I felt one!</span>
              </motion.button>
              <AnimatePresence>
                {pops.map(p => (
                  <motion.span key={p} className="plus-one" initial={{ opacity: 0, y: 0, scale: .6 }} animate={{ opacity: [0, 1, 0], y: -70, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1 }} onAnimationComplete={() => setPops(ps => ps.filter(x => x !== p))}>+1</motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="row-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={undo} disabled={!active.taps.length}>Undo</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={finish}>Finish session</button>
            </div>
          </div>
        )}
      </section>

      <SafetyNote>
        If {baby}'s movements slow down, stop, or feel different from usual, <b>don't wait and don't keep counting</b> — call your doctor or hospital straight away, day or night.
      </SafetyNote>

      <section className="tool-card">
        <div className="card-head"><h2>Past sessions</h2>{data.sessions.length > 0 && <Confirm label="Delete all past sessions?" onYes={() => setData(d => ({ ...d, sessions: [] }))}>Clear all</Confirm>}</div>
        {data.sessions.length === 0 ? <p className="muted">Your sessions will appear here.</p> : (
          <ul className="log">
            {data.sessions.slice(0, 20).map(s => (
              <li key={s.id}>
                <div className="log-main"><b>{s.taps.length} movement{s.taps.length === 1 ? '' : 's'}</b><span>{dayOf(s.start)} · {timeOf(s.start)} · {clock((s.end ?? s.start) - s.start)}</span></div>
                <span className="bar" style={{ width: `${(s.taps.length / maxCount) * 100}%` }} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </ToolShell>
  )
}

function FootIcon() {
  return (
    <svg viewBox="0 0 48 48" width="68" height="68" aria-hidden="true">
      <ellipse cx="25" cy="30" rx="11" ry="15" transform="rotate(-14 25 30)" fill="#EDB091" />
      <circle cx="16.5" cy="11" r="4.4" fill="#EDB091" /><circle cx="23" cy="8.4" r="3.7" fill="#EDB091" /><circle cx="28.8" cy="9.2" r="3.2" fill="#EDB091" />
      <circle cx="33.4" cy="12" r="2.8" fill="#EDB091" /><circle cx="36.6" cy="16.2" r="2.4" fill="#EDB091" />
      <ellipse cx="22" cy="33" rx="5" ry="7" transform="rotate(-14 22 33)" fill="#F1B596" opacity=".45" />
    </svg>
  )
}
