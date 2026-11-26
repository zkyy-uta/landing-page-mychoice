import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabase } from '@/lib/supabase'
import { fetchProfile } from './api'
import type { AdminProfile } from './types'

type AdminAuthValue = {
  loading: boolean
  profile: AdminProfile | null
  email: string | null
  isAdmin: boolean
  /** Email of a signed-in account that was rejected because its role is not admin. */
  deniedEmail: string | null
  clearDenied: () => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null)

  // The console is admin-only: any signed-in account whose profile role is not
  // "admin" is signed straight back out instead of receiving a session.
  const loadProfile = useCallback(
    async (userId: string, userEmail: string | null, name: string | null) => {
      const row = await fetchProfile(userId, userEmail, name)
      if (row && row.role !== 'admin') {
        await supabase?.auth.signOut()
        setProfile(null)
        setEmail(null)
        setDeniedEmail(row.email ?? userEmail)
        return
      }
      setProfile(row)
      setEmail(userEmail)
      setDeniedEmail(null)
    },
    [supabase]
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
      setDeniedEmail(null)
      const { data, error } = await supabase.auth.signInWithPassword({ email: nextEmail, password })
      if (error) return { error: error.message }

      // Verify the role before the caller navigates, so a regular user never
      // reaches the console even for a moment.
      const user = data.user
      if (user) {
        const row = await fetchProfile(
          user.id,
          user.email ?? nextEmail,
          (user.user_metadata?.full_name as string) ?? null
        )
        if (row.role !== 'admin') {
          await supabase.auth.signOut()
          setProfile(null)
          setEmail(null)
          return { error: 'This account is not an administrator. Ask an admin to grant the administrator role.' }
        }
      }
      return { error: null }
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    setProfile(null)
    setEmail(null)
  }, [supabase])

  const clearDenied = useCallback(() => setDeniedEmail(null), [])

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
      deniedEmail,
      clearDenied,
      signIn,
      signOut,
      refresh,
    }),
    [loading, profile, email, deniedEmail, clearDenied, signIn, signOut, refresh]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return value
}
