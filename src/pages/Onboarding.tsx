import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useProfile } from '../lib/ProfileContext'
import {
  BUBBLES, CALL_ME, EXTRAS, HAIRS, HAIR_COLORS, OUTFITS, SCARF_COLORS, SKINS,
  ageText, fmtDate, todayISO, whereAreWe, type Profile, type Stage,
} from '../lib/profile'
import { MONTHS, sizeFor } from '../lib/weeks'
import MamaAvatar from '../components/MamaAvatar'
import WombBaby, { BUBBLE_COLORS } from '../components/WombBaby'
import Stepper from '../components/Stepper'
import Swatches from '../components/Swatches'
import Brand from '../components/Brand'
import { Arrow, Heart } from '../components/Heart'
import { weekScale } from './Landing'

type Update = (patch: Partial<Profile>) => void
interface StepProps { d: Profile; up: Update }

/* ------------------------------------------------------------------ */
/* steps                                                               */
/* ------------------------------------------------------------------ */

function Hello({ d }: StepProps) {
  return (
    <div className="ob-center">
      <div className="duo">
        <MamaAvatar look={d.mamaLook} size={150} className="duo-mama" />
        <WombBaby className="duo-baby" decor={false} interactive scale={0.85} lines={['hi mama!', 'let\'s begin!', '*tiny kick*']} />
      </div>
      <p className="eyebrow">Welcome</p>
      <h1 className="ob-title">Hello, <em>mama.</em></h1>
      <p className="ob-sub">A few gentle questions so this space feels like yours. It takes about a minute, and everything you tell us stays on this phone — nothing is sent anywhere.</p>
    </div>
  )
}

function You({ d, up }: StepProps) {
  const custom = !CALL_ME.includes(d.callMe)
  const [other, setOther] = useState(custom ? d.callMe : '')
  return (
    <div>
      <p className="eyebrow">About you</p>
      <h1 className="ob-title">What's your <em>name?</em></h1>
      <label className="field">
        <span className="sr">Your name</span>
        <input autoFocus value={d.mamaName} maxLength={40} placeholder="Your name"
          onChange={e => up({ mamaName: e.target.value })} />
      </label>

      <h2 className="ob-q">And what will the little one call you?</h2>
      <div className="chips">
        {CALL_ME.map(c => (
          <button key={c} type="button" className={`chip ${d.callMe === c ? 'on' : ''}`} onClick={() => { up({ callMe: c }); setOther('') }}>{c}</button>
        ))}
        <input className={`chip chip-input ${custom && d.callMe ? 'on' : ''}`} placeholder="Something else…" value={other} maxLength={16}
          onChange={e => { setOther(e.target.value); up({ callMe: e.target.value || 'Amma' }) }} aria-label="Something else" />
      </div>

      <div className="speech-row">
        <WombBaby decor={false} scale={0.9} className="tiny-baby" theme={d.babyLook.bubble} extra={d.babyLook.extra} skin={d.babyLook.skin} />
        <motion.div key={d.callMe} className="speech" initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
          hi {d.callMe.toLowerCase()}!
        </motion.div>
      </div>
    </div>
  )
}

function Look({ d, up }: StepProps) {
  const L = d.mamaLook
  const set = (p: Partial<typeof L>) => up({ mamaLook: { ...L, ...p } })
  const surprise = () => {
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    set({ hair: pick(HAIRS).id, skin: pick(SKINS), hairColor: pick(HAIR_COLORS), scarf: pick(SCARF_COLORS), outfit: pick(OUTFITS) })
  }
  return (
    <div className="look">
      <div className="look-preview">
        <motion.div key={JSON.stringify(L)} initial={{ scale: .92, rotate: -3 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }}>
          <MamaAvatar look={L} size={190} />
        </motion.div>
        <button type="button" className="btn btn-soft btn-sm" onClick={surprise}>Surprise me</button>
      </div>
      <div>
        <p className="eyebrow">Your avatar</p>
        <h1 className="ob-title">Now, a little <em>you.</em></h1>
        <h2 className="ob-q">Hair</h2>
        <div className="tiles six" role="radiogroup" aria-label="Hair style">
          {HAIRS.map(h => (
            <button key={h.id} type="button" role="radio" aria-checked={L.hair === h.id} className={`tile ${L.hair === h.id ? 'on' : ''}`} onClick={() => set({ hair: h.id })}>
              <MamaAvatar look={{ ...L, hair: h.id }} size={58} blink={false} />
              <span>{h.label}</span>
            </button>
          ))}
        </div>
        <h2 className="ob-q">Skin</h2>
        <Swatches label="Skin tone" colors={SKINS} value={L.skin} onChange={skin => set({ skin })} />
        <h2 className="ob-q">{L.hair === 'scarf' ? 'Scarf colour' : 'Hair colour'}</h2>
        {L.hair === 'scarf'
          ? <Swatches label="Scarf colour" colors={SCARF_COLORS} value={L.scarf} onChange={scarf => set({ scarf })} />
          : <Swatches label="Hair colour" colors={HAIR_COLORS} value={L.hairColor} onChange={hairColor => set({ hairColor })} />}
        <h2 className="ob-q">Outfit</h2>
        <Swatches label="Outfit colour" colors={OUTFITS} value={L.outfit} onChange={outfit => set({ outfit })} />
      </div>
    </div>
  )
}

function When({ d, up }: StepProps) {
  const today = todayISO()
  const kind = d.stage?.kind ?? null
  const choose = (k: Stage['kind']) => {
    if (k === kind) return
    if (k === 'month') up({ stage: { kind: 'month', month: 5, setOn: today } })
    if (k === 'due') up({ stage: { kind: 'due', due: '' } })
    if (k === 'born') up({ stage: { kind: 'born', born: '' } })
  }
  const w = stageValid(d.stage) ? whereAreWe(d.stage) : null
  const minDue = addDays(today, -21), maxDue = addDays(today, 300), minBorn = addDays(today, -3 * 365)

  return (
    <div>
      <p className="eyebrow">Your journey</p>
      <h1 className="ob-title">Where are you <em>right now?</em></h1>
      <div className="choices" role="radiogroup" aria-label="Where you are">
        {([
          ['month', 'I know my month', 'Pick the month you\'re in', <MoonIcon key="m" />],
          ['due', 'I know my due date', 'The most exact option', <CalIcon key="c" />],
          ['born', 'Baby is here!', 'Start from the birth date', <Heart key="h" size={30} color="#E58F86" />],
        ] as const).map(([k, t, s, icon]) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} className={`choice ${kind === k ? 'on' : ''}`} onClick={() => choose(k)}>
            <span className="choice-ico">{icon}</span>
            <b>{t}</b><span>{s}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {d.stage?.kind === 'month' && (
          <motion.div key="m" {...fade}>
            <h2 className="ob-q">Which month are you in?</h2>
            <div className="months">
              {MONTHS.map(m => {
                const on = d.stage?.kind === 'month' && d.stage.month === m.m
                return (
                  <button key={m.m} type="button" className={`month ${on ? 'on' : ''}`} aria-pressed={on}
                    onClick={() => up({ stage: { kind: 'month', month: m.m, setOn: today } })}>
                    <span className="m-dot" style={{ width: 8 + m.m * 3.2, height: 8 + m.m * 3.2 }} />
                    <b>Month {m.m}</b><span>weeks {m.from}–{m.to}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
        {d.stage?.kind === 'due' && (
          <motion.label key="d" className="field" {...fade}>
            <span className="ob-q">Your due date</span>
            <input type="date" value={d.stage.due} min={minDue} max={maxDue} onChange={e => up({ stage: { kind: 'due', due: e.target.value } })} />
          </motion.label>
        )}
        {d.stage?.kind === 'born' && (
          <motion.label key="b" className="field" {...fade}>
            <span className="ob-q">Baby's birth date</span>
            <input type="date" value={d.stage.born} min={minBorn} max={today} onChange={e => up({ stage: { kind: 'born', born: e.target.value } })} />
          </motion.label>
        )}
      </AnimatePresence>

      {d.stage && !stageValid(d.stage) && (d.stage.kind === 'due' ? d.stage.due : d.stage.kind === 'born' ? d.stage.born : '') && (
        <p className="ob-warn">{d.stage.kind === 'due' ? 'That date looks a little far off — check the year?' : 'That date looks a little off — check the year?'}</p>
      )}

      {w && (
        <motion.div className="result" key={JSON.stringify(d.stage)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Heart size={18} color="#C9837C" />
          {w.pregnant
            ? <span>That's about <b>week {w.week}</b> — baby is around the size of <em>{sizeFor(w.week)[0]}</em>.{w.estimate && ' We\'ll keep this as an estimate until you add a due date.'}</span>
            : <span>Your little one is <b>{ageText(w.ageDays!)}</b>. Congratulations, {d.callMe.toLowerCase()}!</span>}
        </motion.div>
      )}
    </div>
  )
}

function Baby({ d, up }: StepProps) {
  const B = d.babyLook
  const set = (p: Partial<typeof B>) => up({ babyLook: { ...B, ...p } })
  const born = d.stage?.kind === 'born'
  const w = stageValid(d.stage) ? whereAreWe(d.stage) : null
  return (
    <div className="look">
      <div className="look-preview">
        <WombBaby interactive followEyes decor theme={B.bubble} extra={B.extra} skin={B.skin}
          scale={born ? 0.95 : Math.max(0.6, weekScale(w?.week ?? 20))}
          lines={[`hi ${d.callMe.toLowerCase()}!`, '*tiny kick*', 'love you already']}
          hint={<><Heart size={13} color="#C9837C" />Tap {d.babyName ? d.babyName : 'me'}</>}
          className="baby-preview" />
      </div>
      <div>
        <p className="eyebrow">Your little one</p>
        <h1 className="ob-title">{born ? <>What's your little one's <em>name?</em></> : <>What shall we call <em>the little one?</em></>}</h1>
        <label className="field">
          <span className="sr">Baby's name or nickname</span>
          <input value={d.babyName} maxLength={30} placeholder="A name or nickname — Kunju, Vava, Bean…" onChange={e => up({ babyName: e.target.value })} />
        </label>
        <p className="ob-help">{born ? 'You can change it any time.' : 'Still deciding? A nickname is perfect — you can change it any time.'}</p>

        <h2 className="ob-q">{born ? 'Their little world' : 'Their cosy bubble'}</h2>
        <Swatches label="Bubble colour" colors={BUBBLES} value={B.bubble} onChange={c => set({ bubble: c as typeof B.bubble })} display={c => BUBBLE_COLORS[c as typeof B.bubble].swatch} />
        <h2 className="ob-q">A little something</h2>
        <div className="tiles six" role="radiogroup" aria-label="Accessory">
          {EXTRAS.map(x => (
            <button key={x.id} type="button" role="radio" aria-checked={B.extra === x.id} className={`tile ${B.extra === x.id ? 'on' : ''}`} onClick={() => set({ extra: x.id })}>
              <WombBaby decor={false} scale={1} theme={B.bubble} extra={x.id} skin={B.skin} className="thumb-baby" />
              <span>{x.label}</span>
            </button>
          ))}
        </div>
        <h2 className="ob-q">Skin</h2>
        <Swatches label="Baby skin tone" colors={SKINS} value={B.skin} onChange={skin => set({ skin })} />
      </div>
    </div>
  )
}

const LIKES: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'learn', label: 'Learn what\'s happening each week', icon: <span className="li-ico c-rose">✦</span> },
  { id: 'scans', label: 'Keep my scans & reports together', icon: <span className="li-ico c-sage">▣</span> },
  { id: 'questions', label: 'Remember questions for the doctor', icon: <span className="li-ico c-lav">?</span> },
  { id: 'bag', label: 'Get the hospital bag ready', icon: <span className="li-ico c-peach">◍</span> },
  { id: 'journal', label: 'Keep a little journal for baby', icon: <span className="li-ico c-butter">✎</span> },
  { id: 'unsure', label: 'I\'m not sure yet', icon: <span className="li-ico c-blank">…</span> },
]

function Likes({ d, up }: StepProps) {
  const toggle = (id: string) => {
    let next = d.likes.includes(id) ? d.likes.filter(x => x !== id) : [...d.likes, id]
    if (id === 'unsure' && next.includes('unsure')) next = ['unsure']
    else next = next.filter(x => x !== 'unsure' || id === 'unsure')
    up({ likes: next })
  }
  return (
    <div>
      <p className="eyebrow">Your space</p>
      <h1 className="ob-title">What would help you <em>most right now?</em></h1>
      <p className="ob-sub">Pick as many as you like. We'll put these first on your home.</p>
      <div className="likes">
        {LIKES.map(l => {
          const on = d.likes.includes(l.id)
          return (
            <button key={l.id} type="button" className={`like ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(l.id)}>
              {l.icon}<span>{l.label}</span>
              <span className="tick" aria-hidden="true">{on && <svg viewBox="0 0 12 12"><path d="M3 6.4l2 1.9L9 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
            </button>
          )
        })}
      </div>
      <h2 className="ob-q">Language</h2>
      <div className="chips">
        <button type="button" className={`chip ${d.language === 'en' ? 'on' : ''}`} onClick={() => up({ language: 'en' })}>English</button>
        <button type="button" className="chip" disabled title="Coming soon">മലയാളം <small>soon</small></button>
      </div>
    </div>
  )
}

function Ready({ d }: StepProps) {
  const w = stageValid(d.stage) ? whereAreWe(d.stage) : null
  const baby = d.babyName.trim() || 'little one'
  return (
    <div className="ob-center">
      <div className="duo big">
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: .05 }}>
          <MamaAvatar look={d.mamaLook} size={170} className="duo-mama" />
        </motion.div>
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: .15 }}>
          <WombBaby className="duo-baby" decor={false} interactive theme={d.babyLook.bubble} extra={d.babyLook.extra} skin={d.babyLook.skin}
            scale={w?.pregnant ? Math.max(0.6, weekScale(w.week)) : 0.95} lines={[`hi ${d.callMe.toLowerCase()}!`, 'we did it!']} />
        </motion.div>
        <FloatingHearts />
      </div>
      <p className="eyebrow">All set</p>
      <h1 className="ob-title">Hello, {cap(baby)}. <em>Hello, {d.callMe}.</em></h1>
      {w && (
        <div className="summary">
          {w.pregnant ? <>
            <div><b>Week {w.week}</b><span>{w.daysToGo! > 0 ? `${w.daysToGo} days to go` : 'any day now'}</span></div>
            <div><b>{cap(sizeFor(w.week)[0].replace(/^an? /, ''))}</b><span>baby's size this week</span></div>
            <div><b>{fmtDate(w.due!)}</b><span>{w.estimate ? 'estimated due date' : 'due date'}</span></div>
          </> : <>
            <div><b>{cap(ageText(w.ageDays!))}</b><span>and counting up</span></div>
            <div><b>{d.likes.length || '—'}</b><span>things on your home</span></div>
          </>}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

const STEPS: { id: string; C: (p: StepProps) => ReactNode; ok: (d: Profile) => boolean; next?: string }[] = [
  { id: 'hello', C: Hello, ok: () => true, next: 'Let\'s begin' },
  { id: 'you', C: You, ok: d => d.mamaName.trim().length > 0 },
  { id: 'look', C: Look, ok: () => true, next: 'That\'s me' },
  { id: 'when', C: When, ok: d => stageValid(d.stage) },
  { id: 'baby', C: Baby, ok: () => true },
  { id: 'likes', C: Likes, ok: () => true },
  { id: 'ready', C: Ready, ok: () => true, next: 'Open my home' },
]

export default function Onboarding() {
  const { step = 'hello' } = useParams()
  const [params] = useSearchParams()
  const editing = params.get('edit') === '1'
  const nav = useNavigate()
  const { ready, draft, updateDraft, finish, profile } = useProfile()
  const i = STEPS.findIndex(s => s.id === step)
  const prevI = useRef(i)
  const dir = i >= prevI.current ? 1 : -1
  useEffect(() => { prevI.current = i; window.scrollTo(0, 0) }, [i])

  if (!ready) return null
  if (i < 0) return <Navigate to="/start/hello" replace />
  const S = STEPS[i]
  const ok = S.ok(draft)

  async function next() {
    if (!ok) return
    if (editing) { await finish(); nav('/profile'); return }
    if (S.id === 'ready') { await finish(); nav('/home'); return }
    nav(`/start/${STEPS[i + 1].id}`)
  }
  function back() {
    if (editing) { nav('/profile'); return }
    if (i === 0) nav(profile ? '/home' : '/')
    else nav(`/start/${STEPS[i - 1].id}`)
  }
  const label = editing ? 'Save changes' : S.next ?? 'Next'

  return (
    <div className="ob">
      <header className="ob-top">
        <button type="button" className="icon-btn" onClick={back} aria-label={editing ? 'Cancel' : 'Back'}><Arrow back /></button>
        {editing ? <span className="ob-editing">Editing your profile</span> : <Stepper count={STEPS.length} current={i} />}
        <Brand to={profile ? '/home' : '/'} />
      </header>

      <main className="ob-main">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section key={S.id} className={`ob-card step-${S.id}`} custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
            <S.C d={draft} up={updateDraft} />
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="ob-bar">
        <div className="ob-bar-in">
          {!editing && i > 0 && <button type="button" className="btn btn-ghost" onClick={back}>Back</button>}
          <button type="button" className="btn btn-primary btn-next" disabled={!ok} onClick={next}>{label} <Arrow /></button>
        </div>
        {!ok && S.id === 'you' && <p className="ob-need">Just your name, and we're off.</p>}
        {!ok && S.id === 'when' && <p className="ob-need">Choose one of the three — you can change it later.</p>}
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */

const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: .22 } }
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
function addDays(iso: string, n: number) {
  const t = new Date(iso + 'T00:00:00'); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10)
}
export function stageValid(s: Stage | null): boolean {
  if (!s) return false
  const today = todayISO()
  if (s.kind === 'month') return s.month >= 1 && s.month <= 9
  if (s.kind === 'due') return !!s.due && s.due >= addDays(today, -21) && s.due <= addDays(today, 300)
  return !!s.born && s.born <= today && s.born >= addDays(today, -3 * 365)
}

function FloatingHearts() {
  return (
    <div className="float-hearts" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map(k => (
        <span key={k} style={{ left: `${12 + k * 15}%`, animationDelay: `${k * .55}s` }}><Heart size={12 + (k % 3) * 6} color={['#E58F86', '#E7C67A', '#C9837C'][k % 3]} /></span>
      ))}
    </div>
  )
}
function MoonIcon() {
  return <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="11" fill="#F6DAD2" /><path d="M15 4a11 11 0 0 1 0 22a7 11 0 0 0 0-22z" fill="#C9837C" /></svg>
}
function CalIcon() {
  return <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect x="4" y="6" width="22" height="20" rx="5" fill="#E5EDDF" /><rect x="4" y="6" width="22" height="7" rx="3" fill="#A7B89C" /><circle cx="15" cy="19" r="3.4" fill="#71866A" /></svg>
}
