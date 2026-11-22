/**
 * Adds `is-scrolling` to <html> while the page is being scrolled (and ~180 ms after).
 * CSS uses it to pause decorative loops, so the browser spends scroll frames on scrolling,
 * not on repainting animated SVGs.
 */
let installed = false
export function installScrollState() {
  if (installed || typeof window === 'undefined') return
  installed = true
  const root = document.documentElement
  let t = 0, on = false
  window.addEventListener('scroll', () => {
    if (!on) { root.classList.add('is-scrolling'); on = true }
    clearTimeout(t)
    t = window.setTimeout(() => { root.classList.remove('is-scrolling'); on = false }, 180)
  }, { passive: true })
}

/** Shared, rAF-throttled scroll listener: `fn` runs at most once per frame. */
export function onScrollFrame(fn: () => void) {
  let queued = false
  const handler = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; fn() })
  }
  window.addEventListener('scroll', handler, { passive: true })
  window.addEventListener('resize', handler, { passive: true })
  return () => { window.removeEventListener('scroll', handler); window.removeEventListener('resize', handler) }
}
