import { useEffect, useRef, useState } from 'react'
import manifest from '../assets/baby-manifest.json'
import { storage } from '../lib/storage'
import { HEART_PATH } from './Heart'

/**
 * A little mascot that crawls along the bottom of the page.
 *  - crawl: seamless loop, moved across the screen at the speed the hands really travel
 *  - smile: every so often it stops, turns to the viewer and smiles, then crawls on
 *  - tickle: tap it and it giggles (with sound, since the tap allows audio)
 * Clips come from Flow, cut and matted by make_set.py; manifest.json holds the cut points.
 */

type Clip = 'crawl' | 'smile' | 'tickle'
const FPS = manifest.fps
const SPEED = 0.333                       // body-heights per second (measured from the planted hands)
const CROSSFADE = 140                     // ms, hides the small pose jump when returning to the crawl
const base = import.meta.env.BASE_URL + 'baby/'

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
// Safari and every iOS browser can't show transparent WebM, they need HEVC with alpha
const webkit = /iPad|iPhone|iPod/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|Android/.test(ua))
const src = (c: Clip) => webkit ? `${base}baby-${c}-hevc.mov` : `${base}baby-${c}.webm`

export default function CrawlingBaby() {
  const [napping, setNapping] = useState<boolean | null>(null)
  const [broken, setBroken] = useState(false)          // video can't play here → still poster
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const box = useRef<HTMLDivElement>(null)
  const vids = { crawl: useRef<HTMLVideoElement>(null), smile: useRef<HTMLVideoElement>(null), tickle: useRef<HTMLVideoElement>(null) }
  const st = useRef({ clip: 'crawl' as Clip, x: -400, waitUntil: 0, nextLook: 0, wantLook: false, last: 0, raf: 0, hidden: false })
  const audio = useRef<HTMLAudioElement | null>(null)

  // arrive a moment after the page has settled, so the hero loads first
  useEffect(() => {
    let t = 0
    const go = () => { t = window.setTimeout(() => storage.get<boolean>('babyNap').then(v => setNapping(!!v)), 1200) }
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('load', go) }
  }, [])

  function show(c: Clip) {
    const s = st.current
    const prev = s.clip
    s.clip = c
    const el = vids[c].current!, old = vids[prev].current!
    if (c === 'crawl' && prev !== 'crawl') {
      // fade the crawl back in over the end of the other clip
      el.classList.add('on')
      window.setTimeout(() => { if (st.current.clip === 'crawl') old.classList.remove('on') }, CROSSFADE)
    } else {
      el.classList.add('on')
      if (old !== el) old.classList.remove('on')
    }
    box.current?.setAttribute('data-clip', c)
  }

  function play(c: Clip, at = 0) {
    const v = vids[c].current
    if (!v) return
    try { v.currentTime = at } catch { /* not ready yet */ }
    v.play().catch(() => {})
  }

  // ---- the main loop ----
  useEffect(() => {
    if (napping !== false || reduce || broken) return
    const s = st.current
    const now = performance.now()
    s.last = now; s.nextLook = now + 5000 + Math.random() * 4000
    if (box.current && s.x === -400) s.x = -box.current.offsetWidth - 10   // start just off the left edge
    const crawl = vids.crawl.current!, smile = vids.smile.current!, tickle = vids.tickle.current!

    const backToCrawl = (clip: 'smile' | 'tickle') => {
      if (st.current.clip !== clip) return
      play('crawl', (manifest.clips[clip].exitTo) / FPS)
      show('crawl')
      st.current.nextLook = performance.now() + 7000 + Math.random() * 6000
    }
    const onSmileEnd = () => backToCrawl('smile')
    const onTickleEnd = () => backToCrawl('tickle')
    smile.addEventListener('ended', onSmileEnd)
    tickle.addEventListener('ended', onTickleEnd)

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - s.last) / 1000); s.last = t
      const el = box.current
      if (el && !s.hidden) {
        const h = el.offsetHeight, w = el.offsetWidth, vw = window.innerWidth
        if (s.clip === 'crawl') {
          if (t < s.waitUntil) { /* off-screen pause */ }
          else {
            if (s.x > vw + 30) { s.x = -w - 30; s.waitUntil = t + 3000 + Math.random() * 4000; crawl.pause() }
            else { if (crawl.paused) crawl.play().catch(() => {}); s.x += SPEED * h * dt }
          }
          // time for a look? only when fully on screen, and cut exactly on the matching crawl frame
          const fully = s.x > vw * 0.08 && s.x + w < vw * 0.92
          if (fully && t > s.nextLook) s.wantLook = true
          if (s.wantLook && fully) {
            const target = manifest.clips.smile.enterAt / FPS
            if (Math.abs(crawl.currentTime - target) < 0.6 / FPS) {
              s.wantLook = false
              play('smile', 0); show('smile'); crawl.pause()
            }
          }
        }
        el.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0)`
      }
      s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)

    const onVis = () => {
      s.hidden = document.hidden
      const v = vids[s.clip].current
      if (document.hidden) v?.pause(); else { s.last = performance.now(); if (s.clip !== 'crawl' || performance.now() >= s.waitUntil) v?.play().catch(() => {}) }
    }
    document.addEventListener('visibilitychange', onVis)

    // tuck the baby away while she scrolls, so it never sits on top of what she's reading
    let tuckT = 0
    const lane = box.current?.parentElement
    const onScroll = () => {
      lane?.classList.add('tucked')
      clearTimeout(tuckT); tuckT = window.setTimeout(() => lane?.classList.remove('tucked'), 900)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(tuckT); window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(s.raf)
      smile.removeEventListener('ended', onSmileEnd)
      tickle.removeEventListener('ended', onTickleEnd)
      document.removeEventListener('visibilitychange', onVis)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [napping, reduce, broken])

  function tickle() {
    const s = st.current
    hearts()
    if (!audio.current) { audio.current = new Audio(base + 'baby-tickle.mp3'); audio.current.volume = 0.6 }
    try { audio.current.currentTime = 0; audio.current.play().catch(() => {}) } catch { /* no audio here */ }
    if (reduce || broken) return
    if (s.clip === 'tickle') return
    s.wantLook = false
    vids[s.clip].current?.pause()
    play('tickle', 0); show('tickle')
  }

  function hearts() {
    const el = box.current
    if (!el || reduce) return
    const colors = ['#E58F86', '#C9837C', '#F1A9A0', '#E7C67A', '#A7B89C']
    for (let i = 0; i < 5; i++) {
      const h = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      h.setAttribute('viewBox', '0 0 24 24'); h.setAttribute('class', 'heart-pop'); h.setAttribute('aria-hidden', 'true')
      h.innerHTML = `<path d="${HEART_PATH}" fill="${colors[i]}"/>`
      const size = 12 + Math.random() * 12
      Object.assign(h.style, { left: `${55 + Math.random() * 25}%`, top: '10%', width: `${size}px`, height: `${size}px`, animationDelay: `${i * 70}ms` })
      h.style.setProperty('--dx', `${Math.random() * 60 - 30}px`); h.style.setProperty('--rot', `${Math.random() * 50 - 25}deg`)
      el.appendChild(h); window.setTimeout(() => h.remove(), 1900)
    }
  }

  async function nap(v: boolean) { setNapping(v); await storage.set('babyNap', v) }

  if (napping === null) return null
  if (napping) {
    return <button type="button" className="baby-wake" onClick={() => nap(false)}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#C9837C" /></svg>
      Wake the baby
    </button>
  }

  const still = reduce || broken
  return (
    <div className="baby-lane">
      <div ref={box} className={`baby-crawler ${still ? 'still' : ''}`} data-clip="crawl"
        style={{ aspectRatio: `${manifest.width} / ${manifest.height}`, transform: still ? undefined : 'translate3d(-400px,0,0)' }}
        role="button" tabIndex={0} aria-label="Tickle the baby"
        onClick={tickle} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tickle() } }}>
        <span className="baby-shadow" />
        {still
          ? <img src={`${base}baby-crawl-poster.webp`} alt="" />
          : (['crawl', 'smile', 'tickle'] as Clip[]).map(c => (
            <video key={c} ref={vids[c]} className={c === 'crawl' ? 'on' : ''} src={src(c)}
              muted playsInline preload="auto" loop={c === 'crawl'} autoPlay={c === 'crawl'}
              poster={c === 'crawl' ? `${base}baby-crawl-poster.webp` : undefined}
              onError={() => setBroken(true)} disablePictureInPicture />
          ))}
      </div>
      <button type="button" className="baby-nap" onClick={() => nap(true)} aria-label="Let the baby nap (hide)" title="Nap time">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor" /></svg>
      </button>
    </div>
  )
}
