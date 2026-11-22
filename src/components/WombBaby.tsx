import { useEffect, useId, useRef, useState } from 'react'
import type { BabyExtra, BubbleTheme } from '../lib/profile'
import { cleanId, shade } from './color'
import { HEART_PATH } from './Heart'

export const BUBBLE_COLORS: Record<BubbleTheme, { stops: [string, string, string]; ring: string; swatch: string }> = {
  rose:     { stops: ['#FFF1EA', '#FBD9CD', '#F2BBAE'], ring: '#F1C4B8', swatch: '#F4C6BA' },
  peach:    { stops: ['#FFF5EC', '#FCE0C6', '#F5C29A'], ring: '#F3CDA9', swatch: '#F7CFAE' },
  butter:   { stops: ['#FFFAEA', '#FBEDC1', '#F1D693'], ring: '#EED9A2', swatch: '#F5E1A6' },
  sage:     { stops: ['#F5F9F0', '#DFE9D6', '#C2D3B5'], ring: '#CCDAC1', swatch: '#CFDDC3' },
  sky:      { stops: ['#F2F8FC', '#D9EAF4', '#B8D5E7'], ring: '#C4DAE8', swatch: '#C5DDEC' },
  lavender: { stops: ['#F8F3FC', '#E7DCF3', '#CFBDE6'], ring: '#D8CAEA', swatch: '#DACDEC' },
}

interface Props {
  theme?: BubbleTheme
  extra?: BabyExtra
  skin?: string
  scale?: number            // 0.3 – 1, grows with the week
  interactive?: boolean
  followEyes?: boolean
  decor?: boolean           // ripples + sparkles
  lines?: string[]          // what baby says when tapped
  hint?: React.ReactNode
  label?: string
  className?: string
}

export default function WombBaby({
  theme = 'rose', extra = 'curl', skin = '#F1C3A2', scale = 0.8, interactive = false,
  followEyes = false, decor = true, lines = ['hi mama!'], hint, label, className = '',
}: Props) {
  const uid = cleanId(useId())
  const stage = useRef<HTMLDivElement>(null)
  const pupils = useRef<SVGGElement>(null)
  const [mood, setMood] = useState<'' | 'giggle'>('')
  const [kick, setKick] = useState(0)
  const [say, setSay] = useState<string | null>(null)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; dx: number; rot: number; s: number; c: string; d: number }[]>([])
  const li = useRef(0)
  const timers = useRef<number[]>([])
  const b = BUBBLE_COLORS[theme]
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // skin family
  const s0 = shade(skin, 0.28), s1 = skin, knee = shade(skin, 0.06), foot = shade(skin, -0.02), arm = shade(skin, -0.03), hand = shade(skin, 0.12), ear = shade(skin, -0.02)

  useEffect(() => {
    if (!followEyes || reduce) return
    const onMove = (e: PointerEvent) => {
      const el = stage.current, p = pupils.current
      if (!el || !p) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.42)
      const d = Math.hypot(dx, dy) || 1, m = Math.min(4.5, d / 60)
      p.style.transform = `translate(${(dx / d * m).toFixed(2)}px,${(dy / d * m).toFixed(2)}px)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [followEyes, reduce])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function hello(ev?: React.MouseEvent) {
    if (!interactive) return
    setMood('giggle'); setKick(k => k + 1)
    setSay(lines[li.current++ % lines.length])
    timers.current.push(window.setTimeout(() => setMood(''), 900))
    timers.current.push(window.setTimeout(() => setSay(null), 1800))
    if (reduce || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = ev && ev.clientX > 0 ? ev.clientX - r.left : r.width / 2
    const y = ev && ev.clientY > 0 ? ev.clientY - r.top : r.height * 0.45
    const colors = ['#E58F86', '#C9837C', '#F1A9A0', '#E7C67A', '#A7B89C']
    const now = Date.now()
    const made = Array.from({ length: 5 }, (_, i) => ({
      id: now + i, x: x + (Math.random() * 30 - 15), y, dx: Math.random() * 90 - 45, rot: Math.random() * 50 - 25,
      s: 14 + Math.random() * 16, c: colors[i % colors.length], d: i * 70,
    }))
    setHearts(h => [...h, ...made])
    timers.current.push(window.setTimeout(() => setHearts(h => h.filter(x => !made.includes(x))), 2000))
  }

  return (
    <div
      ref={stage}
      className={`stage ${mood} ${className}`}
      data-kick={kick % 2}
      onClick={hello}
      onKeyDown={e => { if (interactive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); hello() } }}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={label ?? 'A little baby floating in a bubble'}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      <svg className="womb" viewBox="0 0 400 430" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}w`} cx="45%" cy="40%" r="65%">
            <stop offset="0" stopColor={b.stops[0]} /><stop offset=".55" stopColor={b.stops[1]} /><stop offset="1" stopColor={b.stops[2]} />
          </radialGradient>
          <radialGradient id={`${uid}s`} cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor={s0} /><stop offset="1" stopColor={s1} />
          </radialGradient>
          <radialGradient id={`${uid}g`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}c`}><circle cx="200" cy="215" r="176" /></clipPath>
        </defs>

        {decor && <>
          <circle className="ring" cx="200" cy="215" r="182" fill="none" stroke={b.ring} strokeWidth="3" />
          <circle className="ring r2" cx="200" cy="215" r="182" fill="none" stroke={b.ring} strokeWidth="3" />
          <g fill="#E8B4A6">
            <path className="sparkle" d="M30 70l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
            <path className="sparkle" style={{ animationDelay: '-1s' }} d="M366 96l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#E7C67A" />
            <path className="sparkle" style={{ animationDelay: '-2s' }} d="M372 340l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
            <path className="sparkle" style={{ animationDelay: '-.5s' }} d="M22 330l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#A7B89C" />
          </g>
        </>}

        <g className="womb-body">
          <circle cx="200" cy="215" r="176" fill={`url(#${uid}w)`} />
          <circle cx="200" cy="215" r="170" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
          <g clipPath={`url(#${uid}c)`}>
            {[[110, 360, 5, 7, 0], [300, 370, 4, 9, -3], [250, 380, 3, 6, -1.5], [150, 385, 3.5, 8, -5], [330, 330, 2.5, 7.5, -2], [80, 300, 2.5, 6.5, -4]].map(([cx, cy, r, d, dl], i) => (
              <circle key={i} className="bubble-p" cx={cx} cy={cy} r={r} fill="#fff" style={{ animationDuration: `${d}s`, animationDelay: `${dl}s` }} />
            ))}
          </g>
          <path d="M80 140 A140 140 0 0 1 170 62" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity=".55" />
          <circle cx="70" cy="168" r="6" fill="#fff" opacity=".55" />
        </g>

        <g className="baby" style={{ transform: `scale(${scale.toFixed(3)})` }}>
          <g className="float">
            <ellipse cx="200" cy="215" rx="120" ry="120" fill={`url(#${uid}g)`} />
            <g className="foot-l" >
              <ellipse cx="146" cy="318" rx="24" ry="15" fill={foot} />
              <circle cx="128" cy="312" r="5" fill={foot} />
            </g>
            <ellipse cx="200" cy="282" rx="74" ry="56" fill={`url(#${uid}s)`} />
            <path className="chest-heart" d={HEART_PATH} transform="translate(190 254) scale(.83)" fill="#E58F86" />
            <circle cx="160" cy="292" r="31" fill={knee} />
            <circle cx="240" cy="292" r="31" fill={knee} />
            <g className="foot-r" >
              <ellipse cx="256" cy="322" rx="25" ry="15" fill={foot} />
              <circle cx="276" cy="316" r="5" fill={foot} /><circle cx="279" cy="324" r="4" fill={foot} />
            </g>
            <path d="M138 262 Q150 300 186 290" fill="none" stroke={arm} strokeWidth="20" strokeLinecap="round" />
            <circle cx="188" cy="288" r="12" fill={hand} />
            <g className="wave-arm">
              <path d="M262 262 Q284 236 270 212" fill="none" stroke={arm} strokeWidth="20" strokeLinecap="round" />
              <circle cx="268" cy="206" r="13" fill={hand} />
              <circle cx="262" cy="196" r="4.5" fill={hand} />
            </g>
            {extra === 'bunny' && <g>
              <ellipse cx="160" cy="82" rx="17" ry="42" transform="rotate(-14 160 82)" fill="#FFF7F2" stroke="#F1D3C6" strokeWidth="3" />
              <ellipse cx="160" cy="86" rx="8" ry="28" transform="rotate(-14 160 86)" fill="#F7C3BA" />
              <ellipse cx="240" cy="82" rx="17" ry="42" transform="rotate(14 240 82)" fill="#FFF7F2" stroke="#F1D3C6" strokeWidth="3" />
              <ellipse cx="240" cy="86" rx="8" ry="28" transform="rotate(14 240 86)" fill="#F7C3BA" />
            </g>}
            <circle cx="124" cy="182" r="15" fill={ear} />
            <circle cx="276" cy="182" r="15" fill={ear} />
            <circle cx="200" cy="175" r="82" fill={`url(#${uid}s)`} />
            {extra === 'curl' && <path d="M196 95 C 186 80, 210 72, 214 86 C 217 97, 202 100, 200 92" fill="none" stroke="#C98B7A" strokeWidth="5" strokeLinecap="round" />}
            {extra === 'sprout' && <g>
              <path d="M200 95 C 200 84, 201 76, 203 68" fill="none" stroke="#71866A" strokeWidth="5" strokeLinecap="round" />
              <path d="M203 70 C 190 52, 168 58, 170 70 C 180 76, 196 74, 203 70Z" fill="#A7B89C" />
              <path d="M203 70 C 214 50, 238 54, 236 66 C 226 74, 210 74, 203 70Z" fill="#BFD0B2" />
            </g>}
            {extra === 'beanie' && <g>
              <path d="M120 158 C 118 104, 160 90, 200 90 C 240 90, 282 104, 280 158 C 240 140, 160 140, 120 158Z" fill="#E9A99D" />
              <path d="M118 160 C 160 138, 240 138, 282 160 L 280 172 C 240 152, 160 152, 120 172Z" fill="#D98F84" />
              <circle cx="200" cy="86" r="16" fill="#FFF3EE" />
            </g>}
            {extra === 'bunny' && <path d="M126 140 C 150 100, 250 100, 274 140" fill="none" stroke="#F1D3C6" strokeWidth="7" strokeLinecap="round" />}
            {extra === 'star' && <path d="M256 104 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2z" fill="#F2CF6B" stroke="#E3B648" strokeWidth="2" strokeLinejoin="round" />}
            <ellipse className="cheek" cx="150" cy="205" rx="17" ry="11" fill="#F29A8E" opacity=".5" />
            <ellipse className="cheek" cx="250" cy="205" rx="17" ry="11" fill="#F29A8E" opacity=".5" />
            <g className="open-eyes">
              <g className="pupils" ref={pupils}>
                <g className="eye"><ellipse cx="170" cy="180" rx="9.5" ry="12" fill="#3A2B2A" /><circle cx="173.5" cy="175" r="3.6" fill="#fff" /><circle cx="167" cy="186" r="1.6" fill="#fff" /></g>
                <g className="eye"><ellipse cx="230" cy="180" rx="9.5" ry="12" fill="#3A2B2A" /><circle cx="233.5" cy="175" r="3.6" fill="#fff" /><circle cx="227" cy="186" r="1.6" fill="#fff" /></g>
              </g>
            </g>
            <g className="happy" fill="none" stroke="#3A2B2A" strokeWidth="4.5" strokeLinecap="round">
              <path d="M160 184 Q170 170 180 184" /><path d="M220 184 Q230 170 240 184" />
            </g>
            <ellipse cx="200" cy="200" rx="4" ry="3" fill={shade(skin, -0.12)} />
            <path d="M190 213 Q200 223 210 213" fill="none" stroke="#A85F5A" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <div className={`say ${say ? 'show' : ''}`} aria-live="polite">{say ?? ' '}</div>
      {hearts.map(h => (
        <svg key={h.id} viewBox="0 0 24 24" className="heart-pop" aria-hidden="true"
          style={{ left: h.x - 13, top: h.y - 13, width: h.s, height: h.s, animationDelay: `${h.d}ms`, ['--dx' as string]: `${h.dx}px`, ['--rot' as string]: `${h.rot}deg` }}>
          <path d={HEART_PATH} fill={h.c} />
        </svg>
      ))}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}
