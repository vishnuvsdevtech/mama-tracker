const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
/** amount > 0 mixes toward white, < 0 toward black */
export function shade(hex: string, amount: number) {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
  const t = amount > 0 ? 255 : 0, a = Math.abs(amount)
  return '#' + [r, g, b].map(c => clamp(c + (t - c) * a).toString(16).padStart(2, '0')).join('')
}
export const cleanId = (id: string) => 'u' + id.replace(/[^a-zA-Z0-9]/g, '')
