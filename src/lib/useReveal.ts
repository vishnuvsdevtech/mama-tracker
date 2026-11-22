import { useEffect } from 'react'
/**
 * Marks every `.reveal` with `data-in` once it scrolls into view.
 * An attribute, not a class: React rewrites `className` when a component re-renders
 * (e.g. the baby giggling), which would wipe a class added here and hide the element again.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.setAttribute('data-in', ''); io.unobserve(en.target) }
    }), { threshold: 0.15 })
    document.querySelectorAll('.reveal:not([data-in])').forEach(el => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
