import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? ''
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? ''

export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

/** Returns the shared Supabase client, or null when env vars are missing. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!client) client = createClient(url, anonKey)
  return client
}
