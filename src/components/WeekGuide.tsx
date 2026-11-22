import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ADVICE, KINDS, SOURCE, adviceFor, type Advice, type Kind } from '../lib/evidence'
import AdviceIcon from './AdviceIcons'

const ORDER: Kind[] = ['check', 'supplement', 'vaccine', 'food', 'body', 'mind', 'watch']

function Sources({ ids }: { ids: string[] }) {
  return (
    <span className="adv-src">
      {ids.map(id => {
        const s = SOURCE[id]
        return (
          <a key={id} href={s.url} target="_blank" rel="noopener noreferrer" className={`src-chip ${s.kind}`}
            title={`${s.title} — ${s.org}, ${s.year}`}>
            {s.short}<span className="sr"> (opens {s.org} in a new tab)</span>
          </a>
        )
      })}
    </span>
  )
}

function Card({ a, isNew }: { a: Advice; isNew?: boolean }) {
  return (
    <li className={`adv ${a.kind}`}>
      <AdviceIcon name={a.icon} />
      <div className="adv-body">
        <div className="adv-top">
          <b>{a.title}</b>
          <span className="adv-tags">
            {isNew && <span className="pill-new">{a.due ? 'Due now' : 'New'}</span>}
            {a.india && <span className="pill-in" title="India's national programme">India</span>}
          </span>
        </div>
        <p>{a.text}</p>
        <div className="adv-foot">
          <Sources ids={a.src} />
          {a.link && <Link className="adv-link" to={a.link.to}>{a.link.label} →</Link>}
        </div>
      </div>
    </li>
  )
}

export default function WeekGuide({ week }: { week: number }) {
  const current = Math.max(4, Math.min(42, Math.round(week)))
  const [wk, setWk] = useState(current)
  const [open, setOpen] = useState(false)
  const moreId = useId()
  const { now, top, more } = adviceFor(wk)
  const groups = ORDER.map(k => ({ k, items: more.filter(a => a.kind === k) })).filter(g => g.items.length)
  const sourcesUsed = new Set(ADVICE.flatMap(a => a.src)).size
  const go = (n: number) => { setWk(Math.max(4, Math.min(42, n))); setOpen(false) }

  return (
    <section className="guide" id="week-guide" aria-labelledby="guide-h">
      <div className="guide-head">
        <div>
          <p className="eyebrow">Week by week · backed by evidence</p>
          <h2 id="guide-h" className="tools-h">Week {wk}: <em>what the science says</em></h2>
          <p className="guide-sub">Care, check-ups, food and what to watch for. Every tip comes from WHO, NICE&thinsp;/&thinsp;NHS, ACOG&thinsp;/&thinsp;CDC, India's Ministry of Health or peer-reviewed research, with the link right under it.</p>
        </div>
        <div className="guide-nav" role="group" aria-label="Choose a week">
          <button type="button" className="icon-btn" onClick={() => go(wk - 1)} disabled={wk <= 4} aria-label="Previous week">‹</button>
          <label className="wk-pick">
            <span className="sr">Week</span>
            <select value={wk} onChange={e => go(+e.target.value)}>
              {Array.from({ length: 39 }, (_, i) => i + 4).map(n => <option key={n} value={n}>Week {n}{n === current ? ' (now)' : ''}</option>)}
            </select>
          </label>
          <button type="button" className="icon-btn" onClick={() => go(wk + 1)} disabled={wk >= 42} aria-label="Next week">›</button>
          {wk !== current && <button type="button" className="link" onClick={() => go(current)}>Back to this week</button>}
        </div>
      </div>

      <ul className="adv-list top">{top.map(a => <Card key={a.id} a={a} isNew={now.includes(a)} />)}</ul>

      <p className="guide-safety">
        <AdviceIcon name="phone" size={22} bare />
        <span><b>Don't wait:</b> bleeding, fluid leaking, strong pain, a severe headache with blurred vision, or your baby moving less — call your hospital now.</span>
      </p>

      {more.length > 0 && (
        <div className={`guide-more ${open ? 'open' : ''}`}>
          <button type="button" className="more-btn" aria-expanded={open} aria-controls={moreId} onClick={() => setOpen(o => !o)}>
            {open ? 'Show less' : `Show ${more.length} more for week ${wk}`}
            <span className="more-chev" aria-hidden="true">›</span>
          </button>
          <div id={moreId} hidden={!open}>
            {groups.map(g => (
              <div key={g.k} className={`guide-group ${g.k}`}>
                <h3><AdviceIcon name={KINDS[g.k].icon} size={22} bare /> {KINDS[g.k].label}</h3>
                <ul className="adv-list">{g.items.map(a => <Card key={a.id} a={a} isNew={now.includes(a)} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="guide-foot">
        Built only on published guidelines and research — {sourcesUsed} sources, each linked. Where countries differ, we say so.
        Your own doctor's advice for you always comes first. <Link to="/sources" className="link">See every source and how we choose them</Link>
      </p>
    </section>
  )
}
