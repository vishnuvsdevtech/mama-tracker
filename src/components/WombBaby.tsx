import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { HEART_PATH } from './Heart'
import sacUrl from '../assets/womb/sac.webp'
import babyUrl from '../assets/womb/baby.webp'

/*
 * The womb is the illustrated baby-in-a-pink-sac, split into two layers so the baby can
 * float inside: the sac (with the baby area painted over) and the baby on top.
 * All geometry below is in the source pixels of those images (594 × 634).
 */
const W = 594, H = 634
const BABY = { x: 89, y: 81, w: 419, h: 437 }
// the sac outline, fitted as a rotated ellipse: centre, full axes, angle of the first axis
const SAC = { cx: 295.6, cy: 316.2, a: 544, b: 657, deg: 145.9 }
const pct = (v: number, of: number) => `${(v / of) * 100}%`

export const WOMB_PINKS = ['#FE6490', '#F9517F', '#FE96B0', '#FEB0C2', '#FFC6B3']

interface Props {
  scale?: number            // 0.3 – 1, grows with the week; the womb grows from 80% to full size
  interactive?: boolean
  decor?: boolean           // floating hearts, sparkles and the soft halo
  lines?: string[]          // what baby says when tapped
  hint?: React.ReactNode
  label?: string
  className?: string
  /** kiss & hug mode: tap the womb to kiss, press and hold to hug. Return what baby says. */
  love?: { onKiss: () => string | void; onHug: () => string | void }
  ref?: Ref<WombBabyHandle>
}

export interface WombBabyHandle { kiss: () => void; hug: () => void }
const HOLD_MS = 450

const DECOR: { x: number; y: number; s: number; c: string; d: number; kind: 'heart' | 'spark' | 'dot' }[] = [
  { x: 7, y: 9, s: 46, c: '#FE6490', d: 0, kind: 'heart' },
  { x: 14, y: 25, s: 22, c: '#FEB0C2', d: -1.4, kind: 'heart' },
  { x: 88, y: 8, s: 24, c: '#FE6490', d: -2.2, kind: 'heart' },
  { x: 90, y: 30, s: 36, c: '#FE96B0', d: -.7, kind: 'heart' },
  { x: 9, y: 82, s: 40, c: '#FE6490', d: -3, kind: 'heart' },
  { x: 25, y: 93, s: 20, c: '#FEB0C2', d: -1.9, kind: 'heart' },
  { x: 91, y: 70, s: 20, c: '#FEB0C2', d: -2.6, kind: 'heart' },
  { x: 85, y: 88, s: 26, c: '#fff', d: -1, kind: 'spark' },
  { x: 93, y: 95, s: 16, c: '#fff', d: -2.3, kind: 'spark' },
  { x: 4, y: 52, s: 8, c: '#FE96B0', d: -1.2, kind: 'dot' },
  { x: 95, y: 20, s: 7, c: '#FE96B0', d: -2.8, kind: 'dot' },
]

export default function WombBaby({
  scale = 0.8, interactive = false, decor = true, lines = ['hi mama!'], hint, label, className = '', love, ref,
}: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState<'' | 'giggle'>('')
  const [kick, setKick] = useState(0)
  const [say, setSay] = useState<string | null>(null)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; dx: number; rot: number; s: number; c: string; d: number }[]>([])
  const li = useRef(0)
  const [stamps, setStamps] = useState<{ id: number; x: number; y: number; r: number; e: string }[]>([])
  const [inside, setInside] = useState(false)
  const [hugging, setHugging] = useState(false)
  const lipRef = useRef<HTMLSpanElement>(null)
  const press = useRef<{ t: number; timer: number; hug: boolean; x: number; y: number } | null>(null)
  const timers = useRef<number[]>([])
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const grow = 0.8 + 0.2 * Math.max(0, Math.min(1, (scale - 0.34) / 0.66))

  // pause the loops whenever the womb is off screen
  useEffect(() => {
    const el = stage.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.removeAttribute('data-off'); else el.setAttribute('data-off', '')
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function hello(ev?: React.MouseEvent) {
    if (!interactive || love) return
    react(lines[li.current++ % lines.length], ev && ev.clientX > 0 ? ev.clientX : undefined, ev && ev.clientY > 0 ? ev.clientY : undefined, 5)
  }

  function react(line: string, cx?: number, cy?: number, n = 5) {
    setMood('giggle'); setKick(k => k + 1)
    setSay(line)
    timers.current.push(window.setTimeout(() => setMood(''), 900))
    timers.current.push(window.setTimeout(() => setSay(null), 1800))
    if (reduce || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = cx != null ? cx - r.left : r.width / 2
    const y = cy != null ? cy - r.top : r.height * 0.45
    const now = Date.now()
    const made = Array.from({ length: n }, (_, i) => ({
      id: now + i, x: x + (Math.random() * 30 - 15), y, dx: Math.random() * 90 - 45, rot: Math.random() * 50 - 25,
      s: 14 + Math.random() * 16, c: WOMB_PINKS[i % WOMB_PINKS.length], d: i * 70,
    }))
    setHearts(h => [...h, ...made])
    timers.current.push(window.setTimeout(() => setHearts(h => h.filter(x => !made.includes(x))), 2000))
  }

  /* ---------- kiss & hug ---------- */
  function local(e: { clientX: number; clientY: number }) {
    const r = stage.current!.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    // is the pointer inside the sac? map into image pixels and test the rotated ellipse
    const a = art.current?.getBoundingClientRect()
    if (!a) return { x, y, inside: false }
    const k = W / a.width
    const dx = (e.clientX - a.left) * k - SAC.cx, dy = (e.clientY - a.top) * k - SAC.cy
    const t = SAC.deg * Math.PI / 180
    const u = dx * Math.cos(t) + dy * Math.sin(t), v = -dx * Math.sin(t) + dy * Math.cos(t)
    return { x, y, inside: (u / (SAC.a / 2)) ** 2 + (v / (SAC.b / 2)) ** 2 < 1 }
  }
  function moveLip(x: number, y: number) {
    const el = lipRef.current
    if (el) { el.style.left = `${x}px`; el.style.top = `${y}px` }
  }
  function stamp(x: number, y: number, e: string) {
    const id = Date.now() + Math.random()
    setStamps(s => [...s, { id, x, y, r: Math.random() * 40 - 20, e }])
    timers.current.push(window.setTimeout(() => setStamps(s => s.filter(t => t.id !== id)), 1300))
  }
  function doKiss(cx?: number, cy?: number) {
    const r = stage.current?.getBoundingClientRect()
    if (r) stamp(cx != null ? cx - r.left : r.width / 2 + (Math.random() * 60 - 30), cy != null ? cy - r.top : r.height * 0.4, '💋')
    react(love?.onKiss() || 'mwah!', cx, cy, 3)
  }
  function doHug() {
    setHugging(false)
    react(love?.onHug() || 'so warm!', undefined, undefined, 8)
  }
  useImperativeHandle(ref, () => ({
    kiss: () => doKiss(),
    hug: () => { setHugging(true); timers.current.push(window.setTimeout(doHug, 700)) },
  }))
  const loveHandlers = love ? {
    onPointerMove: (e: React.PointerEvent) => {
      const p = local(e); moveLip(p.x, p.y)
      if (e.pointerType === 'mouse' && p.inside !== inside) setInside(p.inside)
      if (press.current && !p.inside && !press.current.hug) { clearTimeout(press.current.timer); press.current = null }
    },
    onPointerLeave: () => {
      setInside(false)
      if (press.current) { clearTimeout(press.current.timer); if (press.current.hug) doHug(); press.current = null }
    },
    onPointerDown: (e: React.PointerEvent) => {
      const p = local(e)
      if (!p.inside) return
      moveLip(p.x, p.y)
      const cur = { t: performance.now(), hug: false, x: e.clientX, y: e.clientY, timer: 0 }
      cur.timer = window.setTimeout(() => { cur.hug = true; setHugging(true) }, HOLD_MS)
      press.current = cur
      lipRef.current?.classList.add('pucker')
    },
    onPointerUp: () => {
      lipRef.current?.classList.remove('pucker')
      const cur = press.current; press.current = null
      if (!cur) return
      clearTimeout(cur.timer)
      if (cur.hug) doHug(); else doKiss(cur.x, cur.y)
    },
    onPointerCancel: () => {
      const cur = press.current; press.current = null
      if (cur) { clearTimeout(cur.timer); if (cur.hug) doHug() }
      setHugging(false)
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  } : {}

  return (
    <div
      {...loveHandlers}
      ref={stage}
      className={`stage ${mood} ${love ? 'love' : ''} ${hugging ? 'hugging' : ''} ${className}`}
      data-kick={kick % 2}
      onClick={hello}
      onKeyDown={e => {
        if (love && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); doKiss() }
        else if (love && (e.key === 'h' || e.key === 'H')) { e.preventDefault(); setHugging(true); timers.current.push(window.setTimeout(doHug, 700)) }
        else if (interactive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); hello() }
      }}
      role={interactive || love ? 'button' : 'img'}
      tabIndex={interactive || love ? 0 : undefined}
      aria-label={label ?? (love ? 'Your baby. Press Enter to send a kiss, H to send a hug.' : 'A little baby, curled up and smiling inside a pink womb')}
      style={{ cursor: love ? (inside ? 'none' : 'default') : interactive ? 'pointer' : 'default', touchAction: love ? 'manipulation' : undefined }}
    >
      {decor && <div className="wb-decor" aria-hidden="true">
        {DECOR.map((d, i) => d.kind === 'heart'
          ? <svg key={i} viewBox="0 0 24 24" className="wb-heart" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }}><path d={HEART_PATH} fill={d.c} /></svg>
          : d.kind === 'spark'
            ? <svg key={i} viewBox="0 0 20 20" className="wb-spark" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }}><path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" fill={d.c} /></svg>
            : <span key={i} className="wb-dot" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, background: d.c, animationDelay: `${d.d}s` }} />)}
      </div>}

      <div className="wb-art" ref={art} style={{ ['--grow' as string]: grow.toFixed(3) }} aria-hidden="true">
        {decor && <span className="wb-halo" style={{ left: pct(SAC.cx, W), top: pct(SAC.cy, H), width: pct(SAC.a, W), height: pct(SAC.b, H), ['--deg' as string]: `${SAC.deg}deg` }} />}
        <div className="wb-sac">
          <img src={sacUrl} alt="" width={W} height={H} draggable={false} decoding="async" />
          {/* liquid: slow drifting light and tiny rising bubbles, clipped to the sac */}
          <div className="wb-fluid" style={{ left: pct(SAC.cx, W), top: pct(SAC.cy, H), width: pct(SAC.a * 0.9, W), height: pct(SAC.b * 0.9, H), ['--deg' as string]: `${SAC.deg}deg` }}>
            <div className="wb-fluid-in">
              <span className="wb-glint" />
              {[[22, 72, 5, 7, 0], [70, 80, 4, 9, -3], [58, 86, 3, 6, -1.5], [36, 88, 3.5, 8, -5], [80, 64, 2.5, 7.5, -2], [16, 60, 2.5, 6.5, -4]].map(([x, y, r, d, dl], i) => (
                <span key={i} className="wb-bub" style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, animationDuration: `${d}s`, animationDelay: `${dl}s` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="wb-baby" style={{ left: pct(BABY.x, W), top: pct(BABY.y, H), width: pct(BABY.w, W), height: pct(BABY.h, H) }}>
          <div className="wb-kick">
            <img src={babyUrl} alt="" width={BABY.w} height={BABY.h} draggable={false} decoding="async" />
          </div>
        </div>
      </div>

      <div className={`say ${say ? 'show' : ''}`} aria-live="polite">{say ?? ' '}</div>
      {hearts.map(h => (
        <svg key={h.id} viewBox="0 0 24 24" className="heart-pop" aria-hidden="true"
          style={{ left: h.x - 13, top: h.y - 13, width: h.s, height: h.s, animationDelay: `${h.d}ms`, ['--dx' as string]: `${h.dx}px`, ['--rot' as string]: `${h.rot}deg` }}>
          <path d={HEART_PATH} fill={h.c} />
        </svg>
      ))}
      {love && <span ref={lipRef} className={`love-cursor ${inside ? 'show' : ''}`} aria-hidden="true"><span>{hugging ? '🤗' : '💋'}</span></span>}
      {stamps.map(t => (
        <span key={t.id} className="kiss-stamp" aria-hidden="true" style={{ left: t.x, top: t.y, ['--r' as string]: `${t.r}deg` }}>{t.e}</span>
      ))}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}
