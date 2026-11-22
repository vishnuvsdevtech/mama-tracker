import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Brand from '../components/Brand'
import { Arrow } from '../components/Heart'
import { SOURCES, type SourceKind } from '../lib/evidence'

const GROUPS: { kind: SourceKind; title: string; text: string }[] = [
  { kind: 'guideline', title: 'International clinical guidelines', text: 'Written by expert panels who review all the available evidence: WHO, NICE and the NHS (UK), ACOG and CDC (USA), FDA/EPA.' },
  { kind: 'india', title: 'India\'s national guidelines and law', text: 'What India\'s Ministry of Health & Family Welfare and FOGSI advise for pregnant women here — supplements, tests, vaccines and free check-ups.' },
  { kind: 'research', title: 'Peer-reviewed research', text: 'The trials and systematic reviews behind the biggest pieces of advice, from Cochrane, NEJM, The Lancet and BMJ.' },
]

export default function Sources() {
  const nav = useNavigate()
  return (
    <div className="app">
      <nav className="top scrolled">
        <div className="wrap row">
          <button type="button" className="icon-btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label="Back"><Arrow back /></button>
          <Brand />
          <span style={{ width: 44 }} />
        </div>
      </nav>
      <motion.main className="wrap sources-page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">Our sources</p>
        <h1 className="ob-title">Only science, <em>always with a link.</em></h1>
        <p className="ob-sub">Nine months, organised is built only on published clinical guidelines and peer-reviewed research. Here is every source we use, so you can read the original yourself.</p>

        <div className="how-card">
          <h2>How we choose what goes in</h2>
          <ul>
            <li><b>Guidelines first.</b> National and international clinical guidelines (WHO, NICE, ACOG, India's MoHFW) — they weigh all the evidence, not just one study.</li>
            <li><b>Research behind them.</b> For the biggest advice we also link the trial or systematic review it rests on.</li>
            <li><b>No blogs, brands or forums.</b> Nothing is sponsored, and nothing comes from product sellers.</li>
            <li><b>Differences stay visible.</b> When countries advise different timings, we show both instead of picking one quietly.</li>
            <li><b>Never a diagnosis.</b> We do arithmetic on your own dates and notes, and we never guess baby's sex (it's illegal in India).</li>
          </ul>
          <p className="how-note">General information only — not medical advice. If your doctor tells you something different for your pregnancy, follow your doctor.</p>
        </div>

        {GROUPS.map(g => (
          <section key={g.kind} className="src-group">
            <h2>{g.title}</h2>
            <p className="ob-help">{g.text}</p>
            <ol className="src-list">
              {SOURCES.filter(s => s.kind === g.kind).map(s => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
                  <span>{s.org} · {s.year}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <p className="disclaim center"><Link to="/" className="link">Back to the start</Link></p>
      </motion.main>
    </div>
  )
}
