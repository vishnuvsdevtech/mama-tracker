import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ADVICE, KINDS, SOURCE, adviceFor, type Advice, type Kind } from '../lib/evidence'

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

function Item({ a }: { a: Advice }) {
  return (
    <li className={`adv ${a.kind}`}>
      <div className="adv-top">
        <b>{a.title}</b>
        {a.india && <span className="pill-in" title="India's national programme">India</span>}
      </div>
      <p>{a.text}</p>
      <div className="adv-foot">
        <Sources ids={a.src} />
        {a.link && <Link className="adv-link" to={a.link.to}>{a.link.label} →</Link>}
      </div>
    </li>
  )
}

export default function WeekGuide({ week }: { week: number }) {
  const current = Math.max(4, Math.min(42, Math.round(week)))
  const [wk, setWk] = useState(current)
  const { now, rest } = adviceFor(wk)
  const groups = ORDER.map(k => ({ k, items: rest.filter(a => a.kind === k) })).filter(g => g.items.length)
  const sourcesUsed = new Set(ADVICE.flatMap(a => a.src)).size

  return (
    <section className="guide" id="week-guide" aria-labelledby="guide-h">
      <div className="guide-head">
        <div>
          <p className="eyebrow">Week by week · backed by evidence</p>
          <h2 id="guide-h" className="tools-h">Week {wk}: <em>what the science says</em></h2>
          <p className="guide-sub">Care, check-ups, food and what to watch for — every tip comes from WHO, NICE&thinsp;/&thinsp;NHS, ACOG&thinsp;/&thinsp;CDC, India's Ministry of Health or peer-reviewed research, with the link right under it.</p>
        </div>
        <div className="guide-nav" role="group" aria-label="Choose a week">
          <button type="button" className="icon-btn" onClick={() => setWk(w => Math.max(4, w - 1))} disabled={wk <= 4} aria-label="Previous week">‹</button>
          <label className="wk-pick">
            <span className="sr">Week</span>
            <select value={wk} onChange={e => setWk(+e.target.value)}>
              {Array.from({ length: 39 }, (_, i) => i + 4).map(n => <option key={n} value={n}>Week {n}{n === current ? ' (now)' : ''}</option>)}
            </select>
          </label>
          <button type="button" className="icon-btn" onClick={() => setWk(w => Math.min(42, w + 1))} disabled={wk >= 42} aria-label="Next week">›</button>
          {wk !== current && <button type="button" className="link" onClick={() => setWk(current)}>Back to this week</button>}
        </div>
      </div>

      {now.length > 0 && (
        <div className="guide-now">
          <h3>{wk === current ? 'Due or new this week' : `Due or new in week ${wk}`}</h3>
          <ul className="adv-list now">{now.map(a => <Item key={a.id} a={a} />)}</ul>
        </div>
      )}

      <div className="guide-groups">
        {groups.map(g => (
          <details key={g.k} className={`guide-group ${g.k}`} open={g.k === 'watch'}>
            <summary><span aria-hidden="true">{KINDS[g.k].icon}</span> {KINDS[g.k].label}<small>{g.items.length}</small></summary>
            <ul className="adv-list">{g.items.map(a => <Item key={a.id} a={a} />)}</ul>
          </details>
        ))}
      </div>

      <p className="guide-foot">
        Built only on published guidelines and research — {sourcesUsed} sources, each linked. Where countries differ, we say so.
        Your own doctor's advice for you always comes first. <Link to="/sources" className="link">See every source and how we choose them</Link>
      </p>
    </section>
  )
}
