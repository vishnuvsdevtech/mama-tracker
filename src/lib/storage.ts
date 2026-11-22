/**
 * The only file that knows where data lives.
 * Everything is async so a real backend could replace localStorage here
 * without touching any component above it.
 */
const PREFIX = 'nmo.'

function safeGet(key: string): string | null {
  try { return localStorage.getItem(PREFIX + key) } catch { return null }
}
function safeSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(PREFIX + key)
    else localStorage.setItem(PREFIX + key, value)
  } catch { /* storage unavailable (private mode, sandbox) — keep working in memory */ }
}

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const raw = safeGet(key)
    if (!raw) return null
    try { return JSON.parse(raw) as T } catch { return null }
  },
  async set<T>(key: string, value: T): Promise<void> { safeSet(key, JSON.stringify(value)) },
  async remove(key: string): Promise<void> { safeSet(key, null) },
}
