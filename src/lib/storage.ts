/**
 * The only file that knows where data lives.
 *
 * Browser: localStorage. iOS/Android (Capacitor): Preferences, which is
 * UserDefaults — durable across app restarts and, unlike WKWebView's
 * localStorage, not evictable under storage pressure. For a pregnancy record
 * that difference is the whole point: the phone must not silently forget a
 * scan report because the OS reclaimed space.
 *
 * The API stays async so either side, or a real backend later, is a drop-in.
 */
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const PREFIX = 'nmo.'
const native = Capacitor.isNativePlatform()

const key = (k: string) => PREFIX + k

function safeGet(k: string): string | null {
  try { return localStorage.getItem(key(k)) } catch { return null }
}
function safeSet(k: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key(k))
    else localStorage.setItem(key(k), value)
  } catch { /* private mode or sandbox: keep working in memory */ }
}

export const storage = {
  /** true when running inside the native shell rather than a browser tab */
  get isNative() { return native },

  async get<T>(k: string): Promise<T | null> {
    let raw: string | null = null
    if (native) {
      try { raw = (await Preferences.get({ key: key(k) })).value } catch { raw = null }
    } else {
      raw = safeGet(k)
    }
    if (!raw) return null
    try { return JSON.parse(raw) as T } catch { return null }
  },

  async set<T>(k: string, value: T): Promise<void> {
    const raw = JSON.stringify(value)
    if (native) {
      try { await Preferences.set({ key: key(k), value: raw }); return } catch { /* fall through */ }
    }
    safeSet(k, raw)
  },

  async remove(k: string): Promise<void> {
    if (native) {
      try { await Preferences.remove({ key: key(k) }); return } catch { /* fall through */ }
    }
    safeSet(k, null)
  },

  /** everything this app has stored, as one object — used by any future export */
  async all(): Promise<Record<string, string>> {
    const out: Record<string, string> = {}
    if (native) {
      const { keys } = await Preferences.keys()
      for (const k of keys.filter((x) => x.startsWith(PREFIX))) {
        const v = (await Preferences.get({ key: k })).value
        if (v != null) out[k.slice(PREFIX.length)] = v
      }
      return out
    }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || ''
        if (k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = localStorage.getItem(k) || ''
      }
    } catch { /* ignore */ }
    return out
  },
}
