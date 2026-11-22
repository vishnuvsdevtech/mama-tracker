import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from './storage'

/* ---------------- data shapes ---------------- */
export interface KickSession { id: string; start: number; end?: number; taps: number[] }
export interface KickData { sessions: KickSession[]; active?: KickSession }

export interface Contraction { start: number; end?: number }
export interface DoctorRule { everyMin: number; lastingSec: number; forMin: number }
export interface ContractionData { items: Contraction[]; rule?: DoctorRule }

export type VisitType = 'checkup' | 'scan' | 'blood' | 'other'
export interface Visit { id: string; date: string; time?: string; type: VisitType; place: string; notes: string }
export interface Question { id: string; text: string; done: boolean }
export interface VisitData { visits: Visit[]; questions: Question[] }

export interface WeightEntry { id: string; date: string; kg: number }
export interface WeightData { entries: WeightEntry[]; hideNumbers: boolean }

export const TOOL_KEYS = ['kicks', 'contractions', 'visits', 'weight'] as const
export const EMPTY = {
  kicks: { sessions: [] } as KickData,
  contractions: { items: [] } as ContractionData,
  visits: { visits: [], questions: [] } as VisitData,
  weight: { entries: [], hideNumbers: false } as WeightData,
}

/* ---------------- a little persisted-state hook ---------------- */
/** State that loads from storage once and saves on every change. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [ready, setReady] = useState(false)
  const loaded = useRef(false)
  useEffect(() => {
    storage.get<T>(key).then(v => { if (v) setValue({ ...initial, ...v }); loaded.current = true; setReady(true) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      if (loaded.current) storage.set(key, v)
      return v
    })
  }, [key])
  return [value, update, ready] as const
}

/** re-render every `ms` while `on` (for running timers) */
export function useTicker(on: boolean, ms = 1000) {
  const [, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const t = window.setInterval(() => setN(n => n + 1), ms)
    return () => clearInterval(t)
  }, [on, ms])
}

/* ---------------- small helpers ---------------- */
export const uid = () => Math.random().toString(36).slice(2, 10)
export const pad = (n: number) => String(n).padStart(2, '0')
export function clock(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}
export function ago(t: number, now = Date.now()) {
  const m = Math.round((now - t) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'yesterday' : `${d} days ago`
}
export const timeOf = (t: number) => new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
export const dayOf = (t: number | string) => new Date(typeof t === 'string' ? t + 'T00:00:00' : t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
export const todayISO = () => {
  const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
export function buzz(ms = 12) { try { navigator.vibrate?.(ms) } catch { /* not supported */ } }
