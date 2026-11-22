import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useProfile } from '../lib/ProfileContext'
import { ageText, fmtDate, whereAreWe } from '../lib/profile'
import { babyFact, mamaFact, sizeFor, trimester } from '../lib/weeks'
import MamaAvatar from '../components/MamaAvatar'
import WombBaby, { type WombBabyHandle } from '../components/WombBaby'
import { addLove, loadAffection, type Affection } from '../lib/affection'
import CrawlingBaby from '../components/CrawlingBaby'
import Brand from '../components/Brand'
import { weekScale } from './Landing'

const TOOLS: Record<string, { title: string; text: string; tone: string }> = {
  learn: { title: 'This week, explained', text: 'A little science about you two, every week.', tone: 'c-rose' },
  scans: { title: 'Scans & reports', text: 'One folder, filed by week.', tone: 'c-sage' },
  questions: { title: 'Questions for the doctor', text: 'Jot them down, tick them off.', tone: 'c-lav' },
  bag: { title: 'Hospital bag', text: 'Wakes up at 35 weeks.', tone: 'c-peach' },
  journal: { title: 'Little journal', text: 'Notes for baby to read one day.', tone: 'c-butter' },
}

function greeting() {
  const h = new Date().getHours()
  return h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

export default function Home() {
  const { ready, profile } = useProfile()
  const [love, setLove] = useState<Affection | null>(null)
  const [bump, setBump] = useState<'' | 'kiss' | 'hug'>('')
  const bubble = useRef<WombBabyHandle>(null)
  const loveRef = useRef<Affection | null>(null)
  useEffect(() => { loadAffection().then(a => { loveRef.current = a; setLove(a) }) }, [])
  if (!ready) return null
  if (!profile) return <Navigate to="/start/hello" replace />

  const w = whereAreWe(profile.stage)
  const baby = profile.babyName.trim() || 'Little one'
  const order = [...profile.likes.filter(l => l in TOOLS), ...Object.keys(TOOLS).filter(k => !profile.likes.includes(k))]
  const call = profile.callMe.toLowerCase()
  function count(kind: 'kiss' | 'hug') {
    if (!loveRef.current) return 0
    const next = addLove(loveRef.current, kind)
    loveRef.current = next; setLove(next)
    setBump(''); requestAnimationFrame(() => setBump(kind))
    return kind === 'kiss' ? next.kisses : next.hugs
  }
  const onKiss = () => {
    const n = count('kiss')
    if (n === 1) return 'my first kiss!'
    if (n % 25 === 0) return `${n} kisses, ${call}!`
    return pick(['mwah!', 'hehe!', 'again!', `love you, ${call}`, 'that tickles!', 'mwah mwah!'])
  }
  const onHug = () => {
    const n = count('hug')
    if (n === 1) return 'my first hug!'
    if (n % 10 === 0) return `${n} hugs!`
    return pick(['so warm…', 'squeeze!', `I feel you, ${call}`, 'cosy!', 'more hugs'])
  }
  const pct = w?.pregnant ? Math.min(100, Math.max(0, ((280 - (w.daysToGo ?? 0)) / 280) * 100)) : 100

  return (
    <div className="app">
      <nav className="top scrolled">
        <div className="wrap row">
          <Brand to="/home" />
          <Link to="/profile" className="me" aria-label="Your profile">
            <span>{profile.mamaName}</span>
            <MamaAvatar look={profile.mamaLook} size={42} blink={false} />
          </Link>
        </div>
      </nav>

      <main className="wrap home">
        <motion.section className="home-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <div>
            <p className="eyebrow">{greeting()}, {profile.mamaName}</p>
            {w?.pregnant ? <>
              <h1 className="home-title">Week {w.week} with <em>{baby}.</em></h1>
              <p className="lede">{baby} is about the size of <b>{sizeFor(w.week)[0]}</b> — {sizeFor(w.week)[1]}.</p>
            </> : w ? <>
              <h1 className="home-title">{baby} is <em>{ageText(w.ageDays!)}.</em></h1>
              <p className="lede">Every day counts up from here. Feeds, sleeps and the paediatrician's questions are moving in next.</p>
            </> : <h1 className="home-title">Hello, <em>{profile.callMe}.</em></h1>}

            {w?.pregnant && (
              <div className="stat-row">
                <div className="ring-stat">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#F6DAD2" strokeWidth="12" />
                    <motion.circle cx="60" cy="60" r="50" fill="none" stroke="#C9837C" strokeWidth="12" strokeLinecap="round"
                      transform="rotate(-90 60 60)" strokeDasharray={314.16}
                      initial={{ strokeDashoffset: 314.16 }} animate={{ strokeDashoffset: 314.16 * (1 - pct / 100) }} transition={{ duration: 1.6, ease: 'easeOut', delay: .3 }} />
                  </svg>
                  <div><b>{Math.round(pct)}%</b><span>of the way</span></div>
                </div>
                <div className="stat"><b>{Math.max(0, w.daysToGo!)}</b><span>days to go</span></div>
                <div className="stat"><b>T{trimester(w.week)}</b><span>trimester</span></div>
                <div className="stat"><b>{fmtDate(w.due!)}</b><span>{w.estimate ? <>estimated due date · <Link to="/start/when?edit=1" className="link">add exact</Link></> : 'due date'}</span></div>
              </div>
            )}
          </div>
          <div className="love-col">
            <WombBaby ref={bubble} followEyes theme={profile.babyLook.bubble} extra={profile.babyLook.extra} skin={profile.babyLook.skin}
              scale={w?.pregnant ? weekScale(w.week) : 0.95}
              love={{ onKiss, onHug }}
              label={`${baby}. Tap to send a kiss, press and hold to hug.`} />
            <div className="love-row">
              <button type="button" className={`love-chip ${bump === 'kiss' ? 'bump' : ''}`} onClick={() => bubble.current?.kiss()} aria-label={`Send ${baby} a kiss. ${love?.kisses ?? 0} so far.`}>
                <span className="love-emoji" aria-hidden="true">💋</span>
                <span className="love-n"><b>{love?.kisses ?? 0}</b><small>{love?.kisses === 1 ? 'kiss' : 'kisses'}{love?.todayKisses ? ` · ${love.todayKisses} today` : ''}</small></span>
              </button>
              <button type="button" className={`love-chip ${bump === 'hug' ? 'bump' : ''}`} onClick={() => bubble.current?.hug()} aria-label={`Send ${baby} a hug. ${love?.hugs ?? 0} so far.`}>
                <span className="love-emoji" aria-hidden="true">🤗</span>
                <span className="love-n"><b>{love?.hugs ?? 0}</b><small>{love?.hugs === 1 ? 'hug' : 'hugs'}{love?.todayHugs ? ` · ${love.todayHugs} today` : ''}</small></span>
              </button>
            </div>
            <p className="love-hint">Tap the bubble to kiss {baby} · press and hold to hug</p>
          </div>
        </motion.section>

        {w?.pregnant && (
          <section className="facts home-facts">
            <div className="fact baby-f"><h4>{baby} this week</h4>{babyFact(w.week)}</div>
            <div className="fact mama-f"><h4>You this week</h4>{mamaFact(w.week)}</div>
          </section>
        )}

        <section className="tools">
          <h2 className="tools-h">Your space</h2>
          <div className="tool-grid">
            {order.map((k, n) => {
              const t = TOOLS[k]
              const locked = k === 'bag' && w?.pregnant && w.week < 35
              return (
                <motion.div key={k} className={`tool ${profile.likes.includes(k) ? 'fav' : ''}`}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + n * .06 }}>
                  <span className={`tool-dot ${t.tone}`} />
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <span className="soon">{locked ? `Opens at week 35` : 'Moving in soon'}</span>
                </motion.div>
              )
            })}
          </div>
        </section>
        <p className="disclaim center">General information only — not medical advice. Your doctor knows you two best.</p>
        <div className="baby-space" aria-hidden="true" />
      </main>
      <CrawlingBaby />
    </div>
  )
}
