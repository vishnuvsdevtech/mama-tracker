import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { storage } from './storage'
import { emptyProfile, type Profile } from './profile'

interface Ctx {
  ready: boolean
  profile: Profile | null          // saved, finished profile
  draft: Profile                   // what the onboarding is editing
  updateDraft: (patch: Partial<Profile>) => void
  finish: () => Promise<void>      // draft -> profile
  startEditing: () => void         // profile -> draft
  reset: () => Promise<void>
}

const ProfileCtx = createContext<Ctx | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [draft, setDraft] = useState<Profile>(emptyProfile())

  useEffect(() => {
    (async () => {
      const [p, d] = await Promise.all([storage.get<Profile>('profile'), storage.get<Profile>('draft')])
      if (p) setProfile(p)
      setDraft({ ...emptyProfile(), ...(d ?? p ?? {}) })
      setReady(true)
    })()
  }, [])

  const updateDraft = useCallback((patch: Partial<Profile>) => {
    setDraft(prev => {
      const next = { ...prev, ...patch }
      storage.set('draft', next)
      return next
    })
  }, [])

  const finish = useCallback(async () => {
    const saved = { ...draft, createdAt: draft.createdAt ?? new Date().toISOString() }
    await storage.set('profile', saved)
    await storage.remove('draft')
    setProfile(saved)
  }, [draft])

  const startEditing = useCallback(() => { if (profile) setDraft(profile) }, [profile])

  const reset = useCallback(async () => {
    await storage.remove('profile'); await storage.remove('draft')
    setProfile(null); setDraft(emptyProfile())
  }, [])

  return (
    <ProfileCtx.Provider value={{ ready, profile, draft, updateDraft, finish, startEditing, reset }}>
      {children}
    </ProfileCtx.Provider>
  )
}

export function useProfile() {
  const c = useContext(ProfileCtx)
  if (!c) throw new Error('useProfile outside ProfileProvider')
  return c
}
