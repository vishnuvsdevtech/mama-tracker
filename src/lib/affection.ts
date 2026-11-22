import { storage } from './storage'
import { todayISO } from './profile'

export interface Affection { kisses: number; hugs: number; day: string; todayKisses: number; todayHugs: number }
const KEY = 'affection'
const fresh = (): Affection => ({ kisses: 0, hugs: 0, day: todayISO(), todayKisses: 0, todayHugs: 0 })

export async function loadAffection(): Promise<Affection> {
  const a = { ...fresh(), ...(await storage.get<Affection>(KEY)) }
  return a.day === todayISO() ? a : { ...a, day: todayISO(), todayKisses: 0, todayHugs: 0 }
}

export function addLove(a: Affection, kind: 'kiss' | 'hug'): Affection {
  const base = a.day === todayISO() ? a : { ...a, day: todayISO(), todayKisses: 0, todayHugs: 0 }
  const next = kind === 'kiss'
    ? { ...base, kisses: base.kisses + 1, todayKisses: base.todayKisses + 1 }
    : { ...base, hugs: base.hugs + 1, todayHugs: base.todayHugs + 1 }
  storage.set(KEY, next)
  return next
}
