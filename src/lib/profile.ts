import { MONTHS } from './weeks'

export type HairStyle = 'bun' | 'long' | 'bob' | 'braid' | 'curly' | 'scarf'
export type BabyExtra = 'curl' | 'sprout' | 'beanie' | 'bunny' | 'star' | 'none'
export type BubbleTheme = 'rose' | 'sage' | 'butter' | 'lavender' | 'peach' | 'sky'

export interface MamaLook { hair: HairStyle; skin: string; hairColor: string; scarf: string; outfit: string }
export interface BabyLook { bubble: BubbleTheme; extra: BabyExtra; skin: string }

export type Stage =
  | { kind: 'month'; month: number; setOn: string }   // estimate, moves forward from the day she picked it
  | { kind: 'due'; due: string }
  | { kind: 'born'; born: string }

export interface Profile {
  mamaName: string
  callMe: string
  mamaLook: MamaLook
  babyName: string
  babyLook: BabyLook
  stage: Stage | null
  likes: string[]
  language: 'en' | 'ml'
  createdAt?: string
}

export const SKINS = ['#FADCC6', '#F1C3A2', '#E2A880', '#C98C64', '#A66D4A', '#7A4C33']
export const HAIR_COLORS = ['#2A1C19', '#4A2E23', '#7B4A2D', '#B47C50', '#8C5A7A', '#9C9590']
export const SCARF_COLORS = ['#C9837C', '#A7B89C', '#E7C67A', '#B7A3D4', '#8DB3C9', '#3F4B5E']
export const OUTFITS = ['#C9837C', '#A7B89C', '#E7C67A', '#B7A3D4', '#8DB3C9', '#F0A98E']
export const HAIRS: { id: HairStyle; label: string }[] = [
  { id: 'bun', label: 'Bun' }, { id: 'long', label: 'Long' }, { id: 'bob', label: 'Bob' },
  { id: 'braid', label: 'Braid' }, { id: 'curly', label: 'Curls' }, { id: 'scarf', label: 'Scarf' },
]
export const EXTRAS: { id: BabyExtra; label: string }[] = [
  { id: 'curl', label: 'Little curl' }, { id: 'sprout', label: 'Sprout' }, { id: 'beanie', label: 'Beanie' },
  { id: 'bunny', label: 'Bunny ears' }, { id: 'star', label: 'Star clip' }, { id: 'none', label: 'Just me' },
]
export const BUBBLES: BubbleTheme[] = ['rose', 'peach', 'butter', 'sage', 'sky', 'lavender']
export const CALL_ME = ['Amma', 'Mama', 'Mummy', 'Ammi', 'Ammu']

export const emptyProfile = (): Profile => ({
  mamaName: '',
  callMe: 'Amma',
  mamaLook: { hair: 'bun', skin: SKINS[2], hairColor: HAIR_COLORS[0], scarf: SCARF_COLORS[0], outfit: OUTFITS[0] },
  babyName: '',
  babyLook: { bubble: 'rose', extra: 'curl', skin: SKINS[1] },
  stage: null,
  likes: [],
  language: 'en',
})

/* ---------- dates: plain arithmetic on dates she typed ---------- */
const DAY = 86_400_000
export const todayISO = () => new Date().toISOString().slice(0, 10)
const parse = (iso: string) => new Date(iso + 'T00:00:00')
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY)

export interface Where {
  pregnant: boolean
  week: number          // weeks pregnant (1–42), when pregnant
  day: number           // extra days
  due?: Date
  daysToGo?: number
  estimate: boolean     // true when worked out from a month, not a date
  ageDays?: number      // when born
}

export function whereAreWe(stage: Stage | null, now = new Date()): Where | null {
  if (!stage) return null
  const today = parse(now.toISOString().slice(0, 10))
  if (stage.kind === 'born') {
    return { pregnant: false, week: 40, day: 0, estimate: false, ageDays: Math.max(0, daysBetween(parse(stage.born), today)) }
  }
  let due: Date
  if (stage.kind === 'due') due = parse(stage.due)
  else {
    const mid = MONTHS[stage.month - 1].mid
    due = new Date(parse(stage.setOn).getTime() + (40 - mid) * 7 * DAY)
  }
  const daysToGo = daysBetween(today, due)
  const daysIn = 280 - daysToGo
  const week = Math.max(1, Math.min(42, Math.floor(daysIn / 7)))
  return { pregnant: true, week, day: Math.max(0, daysIn % 7), due, daysToGo, estimate: stage.kind === 'month' }
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export function ageText(days: number) {
  if (days < 1) return 'born today'
  if (days < 14) return `${days} day${days === 1 ? '' : 's'} old`
  if (days < 98) return `${Math.floor(days / 7)} weeks old`
  const months = Math.floor(days / 30.44)
  return months < 24 ? `${months} months old` : `${Math.floor(months / 12)} years old`
}
