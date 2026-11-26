import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabase } from '@/lib/supabase'
import { fetchProfile } from './api'
import type { AdminProfile } from './types'

type AdminAuthValue = {
  loading: boolean
  profile: AdminProfile | null
  email: string | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const loadProfile = useCallback(
    async (userId: string, userEmail: string | null, name: string | null) => {
      const row = await fetchProfile(userId, userEmail, name)
      setProfile(row)
      setEmail(userEmail)
    },
    []
  )

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return
      const user = data.session?.user
      if (user) {
        try {
          await loadProfile(user.id, user.email ?? null, (user.user_metadata?.full_name as string) ?? null)
        } catch {
          setProfile(null)
        }
      }
      if (!cancelled) setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
      if (!user) {
        setProfile(null)
        setEmail(null)
        return
      }
      void loadProfile(user.id, user.email ?? null, (user.user_metadata?.full_name as string) ?? null).catch(
        () => setProfile(null)
      )
    })

    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [supabase, loadProfile])

  const signIn = useCallback(
    async (nextEmail: string, password: string) => {
      if (!supabase) {
        return { error: 'Supabase is not configured. Add your project URL and anon key to .env, then restart the dev server.' }
      }
      const { error } = await supabase.auth.signInWithPassword({ email: nextEmail, password })
      return { error: error ? error.message : null }
    },
    [supabase]
  )

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured. Add your project URL and anon key to .env, then restart the dev server.' }
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
        queryParams: { prompt: 'select_account' },
      },
    })
    return { error: error ? error.message : null }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    setProfile(null)
    setEmail(null)
  }, [supabase])

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return
    await loadProfile(user.id, user.email ?? null, (user.user_metadata?.full_name as string) ?? null)
  }, [supabase, loadProfile])

  const value = useMemo<AdminAuthValue>(
    () => ({
      loading,
      profile,
      email,
      isAdmin: profile?.role === 'admin',
      signIn,
      signInWithGoogle,
      signOut,
      refresh,
    }),
    [loading, profile, email, signIn, signInWithGoogle, signOut, refresh]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return value
}
