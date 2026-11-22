import { useEffect, useRef, useState } from 'react'
import manifest from '../assets/baby-manifest.json'
import { storage } from '../lib/storage'
import { HEART_PATH } from './Heart'

/**
 * A little mascot that crawls along the bottom of the page.
 *  - crawl: seamless loop, moved across the screen at the speed the hands really travel
 *  - smile: every so often it stops, turns to the viewer and smiles, then crawls on
 *  - tickle: tap it and it giggles (silent — the sound was removed on request)
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
  const st = useRef<{ clip: Clip; nextLook: number; wantLook: boolean; lookAt: number; hidden: boolean; move?: (on: boolean) => void }>({ clip: 'crawl', nextLook: 0, wantLook: false, lookAt: 0, hidden: false })

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
  // Movement runs as a Web Animation (on the compositor), so the page does no per-frame
  // JavaScript, style or layout work just to slide the baby along.
  useEffect(() => {
    if (napping !== false || reduce || broken) return
    const s = st.current
    const el = box.current!
    const crawl = vids.crawl.current!, smile = vids.smile.current!, tickle = vids.tickle.current!
    const size = { w: el.offsetWidth, h: el.offsetHeight, vw: window.innerWidth }
    const speed = () => SPEED * size.h                       // px per second
    let anim: Animation | null = null, x0 = -size.w - 10, offTimer = 0, cutting = 0
    s.nextLook = performance.now() + 5000 + Math.random() * 4000

    const xNow = () => anim && anim.currentTime != null ? x0 + speed() * (Number(anim.currentTime) / 1000) : x0
    const startCrossing = (from: number) => {
      x0 = from
      const to = size.vw + 30
      anim?.cancel()
      anim = el.animate([{ transform: `translate3d(${from}px,0,0)` }, { transform: `translate3d(${to}px,0,0)` }],
        { duration: Math.max(1, (to - from) / speed() * 1000), easing: 'linear', fill: 'forwards' })
      anim.onfinish = () => {
        crawl.pause()
        offTimer = window.setTimeout(() => { startCrossing(-size.w - 30); if (!s.hidden) crawl.play().catch(() => {}) }, 3000 + Math.random() * 4000)
      }
      if (s.hidden || s.clip !== 'crawl') anim.pause()
    }
    s.move = (on: boolean) => { if (!anim || anim.playState === 'finished') return; if (on) anim.play(); else anim.pause() }

    /* Movement must wait for the legs. On a first load the video element has no
       frame yet, so the browser paints the poster — a single still — and if the
       crossing starts immediately you watch that still slide across the screen.
       That was the initial-load report: the moment you clicked it, the tickle clip
       forced a real frame and the crawl came back correctly. So: start the crawl
       only once the video is genuinely playing, which also means the baby appears
       already crawling rather than appearing and then starting. */
    let moving = false
    const begin = () => {
      if (moving) return
      moving = true
      crawl.removeEventListener('playing', begin)
      crawl.removeEventListener('timeupdate', begin)
      startCrossing(x0)
    }
    crawl.addEventListener('playing', begin)
    crawl.addEventListener('timeupdate', begin)
    if (!crawl.paused && crawl.currentTime > 0.05) begin()
    crawl.play().catch(() => {})

    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth, h = el.offsetHeight
      if (w === size.w && h === size.h) return
      const x = xNow(); size.w = w; size.h = h
      if (anim && anim.playState !== 'finished') startCrossing(x)
    })
    ro.observe(el)
    const onResize = () => { size.vw = window.innerWidth; if (anim && anim.playState !== 'finished') startCrossing(xNow()) }
    window.addEventListener('resize', onResize, { passive: true })

    // The reaction clips are only needed once she has been here a while and moved
    // something. Fetching 350 kB of video for a visitor who bounces in two seconds
    // is the kind of thing that costs a phone user real money, so warm them on the
    // first pointer move, or after a long idle — not on a timer that fires anyway.
    const warmNow = () => { for (const v of [smile, tickle]) if (v.paused && v.readyState < 2) { v.preload = 'auto'; v.load() } }
    const warm = window.setTimeout(warmNow, 12000)
    const warmOnMove = () => { clearTimeout(warm); warmNow() }
    window.addEventListener('pointermove', warmOnMove, { once: true, passive: true })

    const backToCrawl = (clip: 'smile' | 'tickle') => {
      if (st.current.clip !== clip) return
      play('crawl', (manifest.clips[clip].exitTo) / FPS)
      show('crawl')
      if (!s.hidden) s.move?.(true)
      st.current.nextLook = performance.now() + 7000 + Math.random() * 6000
    }
    const onSmileEnd = () => backToCrawl('smile')
    const onTickleEnd = () => backToCrawl('tickle')
    smile.addEventListener('ended', onSmileEnd)
    tickle.addEventListener('ended', onTickleEnd)

    // a few times a second: is it time to stop and smile? Only when fully on screen.
    const target = manifest.clips.smile.enterAt / FPS
    const cutToSmile = () => {
      s.wantLook = false; cutting = 0
      if (s.clip !== 'crawl' || s.hidden) return
      s.move?.(false); play('smile', 0); show('smile'); crawl.pause()
    }
    const waitForFrame = () => {
      // cut exactly on the crawl frame that matches the smile clip's first frame
      if (!s.wantLook || s.clip !== 'crawl') { cutting = 0; return }
      const near = Math.abs(crawl.currentTime - target) < 0.6 / FPS
      if (near) return cutToSmile()
      const v = crawl as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }
      cutting = v.requestVideoFrameCallback ? v.requestVideoFrameCallback(waitForFrame) : requestAnimationFrame(waitForFrame)
    }
    /* Two clocks drive this creature and the browser does not keep them together.
       Position is a Web Animation on the document timeline; the legs are a video.
       When the machine sleeps, a tab is restored from bfcache, or the browser
       suspends a muted video by itself, the video stops while the animation keeps
       running — the baby slides across the screen frozen in one pose, and nothing
       ever puts it right. So: whoever is stalled gets restarted, every tick. */
    let lastT = -1, lastMove = 0, nudges = 0
    const sync = () => {
      if (document.hidden || s.hidden) return
      const v = vids[s.clip].current
      if (!v) return
      if (s.clip === 'crawl') {
        // paused: resume it. Not paused but the clock is frozen: a decoder waking
        // up or a stalled fetch — `paused` is false in that state, so it has to be
        // detected by the clock itself, not by the property.
        if (v.paused) { v.play().catch(() => {}); nudges = 0 }
        else if (!moving && !v.paused && crawl.currentTime > 0) begin()
        else if (v.currentTime === lastT) {
          if (lastMove && performance.now() - lastMove > 700) {
            nudges++
            v.play().catch(() => {})
            if (nudges === 3) v.load()          // a wedged element needs a reload
            if (nudges > 4) { lastMove = performance.now(); nudges = 0 }
          }
        }
        if (v.currentTime !== lastT) { lastT = v.currentTime; lastMove = performance.now(); nudges = 0 }
      } else if (v.paused && !v.ended) {
        v.play().catch(() => {})
      }
    }

    const look = window.setInterval(() => {
      sync()
      if (!moving && crawl.readyState >= 2 && !crawl.paused) begin()
      // a frame callback that never arrives must not silence the smile for good
      if (s.wantLook && performance.now() - s.lookAt > 2000) { s.wantLook = false; cutting = 0 }
      if (s.clip !== 'crawl' || s.hidden || s.wantLook || !anim || anim.playState !== 'running') return
      const x = xNow()
      const fully = x > size.vw * 0.08 && x + size.w < size.vw * 0.92
      if (fully && performance.now() > s.nextLook) { s.wantLook = true; s.lookAt = performance.now(); waitForFrame() }
    }, 250)

    const pauseAll = (hidden: boolean) => {
      s.hidden = hidden
      const v = vids[s.clip].current
      if (hidden) { v?.pause(); s.move?.(false) }
      else if (s.clip === 'crawl') { if (anim?.playState !== 'finished') { s.move?.(true); crawl.play().catch(() => {}) } }
      else v?.play().catch(() => {})
    }
    const onVis = () => pauseAll(document.hidden)
    // visibilitychange does not fire on a machine wake or a bfcache restore, and
    // those are exactly the two cases that leave the two clocks apart
    const onWake = () => { pauseAll(document.hidden); sync() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', onWake)
    window.addEventListener('focus', onWake)
    document.addEventListener('resume' as never, onWake as EventListener)

    return () => {
      clearTimeout(warm); clearTimeout(offTimer); window.removeEventListener('pointermove', warmOnMove); clearInterval(look); cancelAnimationFrame(cutting)
      ro.disconnect(); window.removeEventListener('resize', onResize)
      anim?.cancel(); s.move = undefined
      smile.removeEventListener('ended', onSmileEnd)
      tickle.removeEventListener('ended', onTickleEnd)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pageshow', onWake)
      window.removeEventListener('focus', onWake)
      document.removeEventListener('resume' as never, onWake as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [napping, reduce, broken])

  function tickle() {
    const s = st.current
    hearts()
    if (reduce || broken) return
    if (s.clip === 'tickle') return
    s.wantLook = false
    s.move?.(false)
    vids[s.clip].current?.pause()
    play('tickle', 0); show('tickle')
  }

  function hearts() {
    const el = box.current
    if (!el || reduce) return
    const colors = ['#FE6490', '#F0507F', '#FE96B0', '#E7C67A', '#F59E83']
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
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#F0507F" /></svg>
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
              muted playsInline preload={c === 'crawl' ? 'auto' : 'metadata'} loop={c === 'crawl'} autoPlay={c === 'crawl'}
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
