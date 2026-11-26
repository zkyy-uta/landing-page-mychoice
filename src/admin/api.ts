import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  AdminProfile,
  EngineSettings,
  KatalogBundle,
  Kategori,
  KategoriInput,
  Kriteria,
  KriteriaInput,
  Pengguna,
  PilihanInput,
  PilihanKatalog,
  Review,
  SubKategori,
  SubKategoriInput,
  UserPlan,
} from './types'
import { DEFAULT_ENGINE_SETTINGS } from './types'

function db() {
  const client = getSupabase()
  if (!client) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.'
    )
  }
  return client
}

function fail(context: string, message: string): never {
  const missingTable = /does not exist|schema cache/i.test(message)
  const denied = /permission denied|row-level security|violates row-level/i.test(message)
  throw new Error(
    missingTable
      ? `${context}: the database table is missing. Run supabase/schema.sql in the Supabase SQL editor.`
      : denied
        ? `${context}: ${message}. Run supabase/05-admin-catalogue.sql to grant the admin write policies.`
        : `${context}: ${message}`
  )
}

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function nextId(rows: number[]): number {
  return rows.reduce((max, value) => Math.max(max, value), 0) + 1
}

/** Inserts a row, adding an explicit id only when the id column has no default. */
async function insertRow(table: string, payload: Record<string, unknown>, idColumn: string, id: number) {
  const client = db()
  const first = await client.from(table).insert(payload)
  if (!first.error) return
  if (/null value in column/i.test(first.error.message)) {
    const second = await client.from(table).insert({ ...payload, [idColumn]: id })
    if (!second.error) return
    fail('Could not add the record', second.error.message)
  }
  fail('Could not add the record', first.error.message)
}

function planFromMembership(value: string | null): UserPlan {
  const label = (value ?? '').toLowerCase()
  if (label.includes('pro') || label.includes('business')) return 'pro'
  if (label.includes('premium') || label.includes('paid')) return 'premium'
  return 'basic'
}

/* ---------------------------------------------------------------- profiles */

export async function fetchProfiles(): Promise<AdminProfile[]> {
  const client = db()
  const [profileResult, penggunaResult] = await Promise.all([
    client
      .from('profiles')
      .select('id, email, full_name, role, plan, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
    client.from('pengguna').select('*').limit(1000),
  ])

  if (profileResult.error) fail('Could not load users', profileResult.error.message)

  const rows: AdminProfile[] = ((profileResult.data ?? []) as Omit<AdminProfile, 'source' | 'editable'>[]).map(
    (row) => ({ ...row, source: 'profile', editable: true })
  )

  // The legacy `pengguna` directory is optional: when RLS hides it we still show the auth profiles.
  if (!penggunaResult.error && Array.isArray(penggunaResult.data)) {
    const byEmail = new Map(
      rows.filter((row) => row.email).map((row) => [row.email!.toLowerCase(), row] as const)
    )
    const byId = new Map(rows.map((row) => [row.id, row] as const))

    for (const raw of penggunaResult.data as Pengguna[]) {
      if (!raw || typeof raw !== 'object' || !raw.id_pengguna) continue
      const email = raw.email?.trim().toLowerCase() || null
      const existing = (email ? byEmail.get(email) : undefined) ?? byId.get(raw.id_pengguna)
      if (existing) {
        existing.membership = raw.jenis_langganan ?? null
        if (!existing.full_name) existing.full_name = raw.nama
        continue
      }
      rows.push({
        id: raw.id_pengguna,
        email: raw.email,
        full_name: raw.nama,
        role: 'user',
        plan: planFromMembership(raw.jenis_langganan),
        status: 'active',
        created_at: null,
        membership: raw.jenis_langganan ?? null,
        source: 'pengguna',
        editable: false,
      })
    }
  }

  return rows
}

export async function fetchProfile(userId: string, email: string | null, name: string | null): Promise<AdminProfile> {
  const { data, error } = await db()
    .from('profiles')
    .select('id, email, full_name, role, plan, status, created_at')
    .eq('id', userId)
    .maybeSingle()
  if (error) fail('Could not load your admin profile', error.message)
  if (data) {
    const row = data as AdminProfile
    return { ...row, email: row.email ?? email, full_name: row.full_name ?? name }
  }
  // Profile row is created by a trigger on sign-up; a missing row means "no access".
  return {
    id: userId,
    email,
    full_name: name,
    role: 'user',
    plan: 'basic',
    status: 'active',
    created_at: new Date().toISOString(),
  }
}

export async function updateProfile(
  id: string,
  patch: Partial<Pick<AdminProfile, 'role' | 'plan' | 'status' | 'full_name'>>
): Promise<void> {
  const { error } = await db().from('profiles').update(patch).eq('id', id)
  if (error) fail('Could not update the user', error.message)
}

/* --------------------------------------------------------------- catalogue */

export async function fetchKategori(): Promise<Kategori[]> {
  const { data, error } = await db().from('kategori').select('*').order('id_kategori', { ascending: true })
  if (error) fail('Could not load categories', error.message)
  return (data ?? []) as Kategori[]
}

export async function fetchSubKategori(): Promise<SubKategori[]> {
  const { data, error } = await db()
    .from('sub_kategori')
    .select('*')
    .order('id_sub_kategori', { ascending: true })
  if (error) fail('Could not load sub categories', error.message)
  return (data ?? []) as SubKategori[]
}

export async function fetchKriteria(): Promise<Kriteria[]> {
  const { data, error } = await db().from('kriteria').select('*').order('id_kriteria', { ascending: true })
  if (error) fail('Could not load criteria', error.message)
  return (data ?? []) as Kriteria[]
}

export async function fetchPilihanKatalog(): Promise<PilihanKatalog[]> {
  const { data, error } = await db()
    .from('pilihan_katalog')
    .select('*')
    .order('nama_pilihan', { ascending: true })
    .limit(2000)
  if (error) fail('Could not load catalogue options', error.message)
  return (data ?? []) as PilihanKatalog[]
}

export async function fetchPengguna(): Promise<Pengguna[]> {
  const { data, error } = await db().from('pengguna').select('*').limit(2000)
  if (error) fail('Could not load the user directory', error.message)
  return (data ?? []) as Pengguna[]
}

export async function fetchCatalogue(): Promise<KatalogBundle> {
  const [kategori, subKategori, kriteria, pilihan] = await Promise.all([
    fetchKategori(),
    fetchSubKategori(),
    fetchKriteria(),
    fetchPilihanKatalog(),
  ])
  return { kategori, subKategori, kriteria, pilihan }
}

export async function saveKategori(input: KategoriInput): Promise<void> {
  const payload = {
    nama_kategori: input.nama_kategori.trim(),
    deskripsi: input.deskripsi.trim() || null,
  }

  if (input.id_kategori) {
    const { error } = await db().from('kategori').update(payload).eq('id_kategori', input.id_kategori)
    if (error) fail('Could not save the category', error.message)
    return
  }

  const rows = await fetchKategori()
  await insertRow('kategori', payload, 'id_kategori', nextId(rows.map((row) => row.id_kategori)))
}

export async function saveSubKategori(input: SubKategoriInput): Promise<void> {
  const payload = {
    id_kategori: input.id_kategori,
    nama_sub_kategori: input.nama_sub_kategori.trim(),
  }

  if (input.id_sub_kategori) {
    const { error } = await db()
      .from('sub_kategori')
      .update(payload)
      .eq('id_sub_kategori', input.id_sub_kategori)
    if (error) fail('Could not save the sub category', error.message)
    return
  }

  const rows = await fetchSubKategori()
  await insertRow('sub_kategori', payload, 'id_sub_kategori', nextId(rows.map((row) => row.id_sub_kategori)))
}

export async function saveKriteria(input: KriteriaInput): Promise<void> {
  const payload = {
    id_sub_kategori: input.id_sub_kategori,
    nama_kriteria: input.nama_kriteria.trim(),
    jenis_kriteria: input.jenis_kriteria,
    satuan: input.satuan.trim() || null,
    atribut_key: input.atribut_key.trim().toLowerCase().replace(/\s+/g, '_'),
  }

  if (input.id_kriteria) {
    const { error } = await db().from('kriteria').update(payload).eq('id_kriteria', input.id_kriteria)
    if (error) fail('Could not save the criterion', error.message)
    return
  }

  const rows = await fetchKriteria()
  await insertRow('kriteria', payload, 'id_kriteria', nextId(rows.map((row) => row.id_kriteria)))
}

export async function savePilihan(input: PilihanInput): Promise<void> {
  const atribut: Record<string, string> = {}
  Object.entries(input.atribut).forEach(([key, value]) => {
    const clean_key = key.trim().toLowerCase().replace(/\s+/g, '_')
    const clean_value = String(value ?? '').trim()
    if (clean_key && clean_value) atribut[clean_key] = clean_value
  })

  const payload = {
    id_sub_kategori: input.id_sub_kategori,
    nama_pilihan: input.nama_pilihan.trim(),
    harga: input.harga,
    rating: input.rating,
    mata_uang: input.mata_uang.trim() || null,
    sumber_url: input.sumber_url.trim() || null,
    lisensi_data: input.lisensi_data.trim() || null,
    atribut,
    spesifikasi: input.spesifikasi.trim() || null,
  }

  if (input.id_pilihan_katalog) {
    const { error } = await db()
      .from('pilihan_katalog')
      .update(payload)
      .eq('id_pilihan_katalog', input.id_pilihan_katalog)
    if (error) fail('Could not save the catalogue option', error.message)
    return
  }

  const { error } = await db()
    .from('pilihan_katalog')
    .insert({ ...payload, id_pilihan_katalog: randomId() })
  if (error) fail('Could not add the catalogue option', error.message)
}

export async function deleteKategori(id: number): Promise<void> {
  const { error } = await db().from('kategori').delete().eq('id_kategori', id)
  if (error) fail('Could not delete the category', error.message)
}

export async function deleteSubKategori(id: number): Promise<void> {
  const { error } = await db().from('sub_kategori').delete().eq('id_sub_kategori', id)
  if (error) fail('Could not delete the sub category', error.message)
}

export async function deleteKriteria(id: number): Promise<void> {
  const { error } = await db().from('kriteria').delete().eq('id_kriteria', id)
  if (error) fail('Could not delete the criterion', error.message)
}

export async function deletePilihan(id: string): Promise<void> {
  const { error } = await db().from('pilihan_katalog').delete().eq('id_pilihan_katalog', id)
  if (error) fail('Could not delete the catalogue option', error.message)
}

/* ----------------------------------------------------------------- reviews */

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await db()
    .from('reviews')
    .select('id, user_id, author_name, author_email, rating, category, model_text, body, criteria, status, resolved, featured, created_at')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) fail('Could not load reviews', error.message)
  return (data ?? []) as Review[]
}

export async function updateReview(
  id: string,
  patch: Partial<Pick<Review, 'status' | 'resolved' | 'featured'>>
): Promise<void> {
  const { error } = await db().from('reviews').update(patch).eq('id', id)
  if (error) fail('Could not update the review', error.message)
}

/* ---------------------------------------------------------------- settings */

export async function fetchSettings(): Promise<EngineSettings> {
  const { data, error } = await db().from('admin_settings').select('engine').eq('id', 1).maybeSingle()
  if (error) fail('Could not load system settings', error.message)
  return { ...DEFAULT_ENGINE_SETTINGS, ...((data?.engine as Partial<EngineSettings> | null) ?? {}) }
}

export async function saveSettings(settings: EngineSettings): Promise<void> {
  const { error } = await db()
    .from('admin_settings')
    .upsert({ id: 1, engine: settings, updated_at: new Date().toISOString() })
  if (error) fail('Could not save system settings', error.message)
}

export const supabaseConfigured = isSupabaseConfigured
