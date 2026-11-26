import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  AdminProfile,
  EngineSettings,
  KatalogBundle,
  Kategori,
  KategoriInput,
  Kriteria,
  KriteriaInput,
  PilihanInput,
  PilihanKatalog,
  Review,
  SubKategori,
  SubKategoriInput,
  UserPlan,
  UserRole,
  UserStatus,
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
      ? `${context}: the database table is missing. Run supabase/07-harden-access.sql in the Supabase SQL editor.`
      : denied
        ? `${context}: ${message}. Run supabase/07-harden-access.sql to grant the admin write policies.`
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
  // public.users.plan only allows basic / premium.
  if (label.includes('pro') || label.includes('business') || label.includes('premium') || label.includes('paid')) {
    return 'premium'
  }
  return 'basic'
}

/* ------------------------------------------------------------------ users */

/** Row shape of public.users — the renamed `pengguna` table that now stores accounts. */
type UserRow = {
  id_pengguna: string
  email: string | null
  nama: string | null
  role: string | null
  plan: string | null
  status_akun: string | null
  jenis_langganan: string | null
  tanggal_dibuat: string | null
}

const USER_COLUMNS =
  'id_pengguna, email, nama, role, plan, status_akun, jenis_langganan, tanggal_dibuat'

function toRole(value: string | null): UserRole {
  return value === 'admin' ? 'admin' : 'user'
}

function toPlan(value: string | null, membership: string | null): UserPlan {
  if (value === 'basic' || value === 'premium') return value
  return planFromMembership(membership)
}

function toStatus(value: string | null): UserStatus {
  const label = (value ?? '').toLowerCase()
  if (label === 'suspended' || label === 'suspend' || label === 'nonaktif' || label === 'non-aktif') return 'suspended'
  return 'active'
}

/** public.users.status_akun only allows aktif / nonaktif. */
const STATUS_TO_DB: Record<UserStatus, string> = {
  active: 'aktif',
  suspended: 'nonaktif',
}

function mapUser(row: UserRow): AdminProfile {
  return {
    id: row.id_pengguna,
    email: row.email,
    full_name: row.nama,
    role: toRole(row.role),
    plan: toPlan(row.plan, row.jenis_langganan),
    status: toStatus(row.status_akun),
    created_at: row.tanggal_dibuat,
    membership: row.jenis_langganan,
  }
}

export async function fetchProfiles(): Promise<AdminProfile[]> {
  const { data, error } = await db()
    .from('users')
    .select(USER_COLUMNS)
    .order('tanggal_dibuat', { ascending: false })
    .limit(1000)
  if (error) fail('Could not load users', error.message)
  return ((data ?? []) as unknown as UserRow[]).map(mapUser)
}

export async function fetchProfile(userId: string, email: string | null, name: string | null): Promise<AdminProfile> {
  const { data, error } = await db()
    .from('users')
    .select(USER_COLUMNS)
    .eq('id_pengguna', userId)
    .maybeSingle()
  if (error) fail('Could not load your admin profile', error.message)
  if (data) {
    const row = mapUser(data as unknown as UserRow)
    return { ...row, email: row.email ?? email, full_name: row.full_name ?? name }
  }
  // The account row is created when the user is added; a missing row means "no access".
  return {
    id: userId,
    email,
    full_name: name,
    role: 'user',
    plan: 'basic',
    status: 'active',
    created_at: null,
  }
}

export async function updateProfile(
  id: string,
  patch: Partial<Pick<AdminProfile, 'role' | 'plan' | 'status' | 'full_name'>>
): Promise<void> {
  const payload: Record<string, unknown> = {}
  if (patch.full_name !== undefined) payload.nama = patch.full_name
  if (patch.role !== undefined) payload.role = patch.role
  if (patch.plan !== undefined) payload.plan = patch.plan
  if (patch.status !== undefined) payload.status_akun = STATUS_TO_DB[patch.status]
  if (Object.keys(payload).length === 0) return

  const { error } = await db().from('users').update(payload).eq('id_pengguna', id)
  if (error) fail('Could not update the user', error.message)
}

/* --------------------------------------------------------------- catalogue */

export async function fetchKategori(): Promise<Kategori[]> {
  const { data, error } = await db().from('categories').select('*').order('id_kategori', { ascending: true })
  if (error) fail('Could not load categories', error.message)
  return (data ?? []) as Kategori[]
}

export async function fetchSubKategori(): Promise<SubKategori[]> {
  const { data, error } = await db()
    .from('subcategories')
    .select('*')
    .order('id_sub_kategori', { ascending: true })
  if (error) fail('Could not load sub categories', error.message)
  return (data ?? []) as SubKategori[]
}

export async function fetchKriteria(): Promise<Kriteria[]> {
  const { data, error } = await db().from('criteria').select('*').order('id_kriteria', { ascending: true })
  if (error) fail('Could not load criteria', error.message)
  return (data ?? []) as Kriteria[]
}

export async function fetchPilihanKatalog(): Promise<PilihanKatalog[]> {
  const { data, error } = await db()
    .from('catalog_options')
    .select('*')
    .order('nama_pilihan', { ascending: true })
    .limit(2000)
  if (error) fail('Could not load catalogue options', error.message)
  return (data ?? []) as PilihanKatalog[]
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
    const { error } = await db().from('categories').update(payload).eq('id_kategori', input.id_kategori)
    if (error) fail('Could not save the category', error.message)
    return
  }

  const rows = await fetchKategori()
  await insertRow('categories', payload, 'id_kategori', nextId(rows.map((row) => row.id_kategori)))
}

export async function saveSubKategori(input: SubKategoriInput): Promise<void> {
  const payload = {
    id_kategori: input.id_kategori,
    nama_sub_kategori: input.nama_sub_kategori.trim(),
  }

  if (input.id_sub_kategori) {
    const { error } = await db()
      .from('subcategories')
      .update(payload)
      .eq('id_sub_kategori', input.id_sub_kategori)
    if (error) fail('Could not save the sub category', error.message)
    return
  }

  const rows = await fetchSubKategori()
  await insertRow('subcategories', payload, 'id_sub_kategori', nextId(rows.map((row) => row.id_sub_kategori)))
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
    const { error } = await db().from('criteria').update(payload).eq('id_kriteria', input.id_kriteria)
    if (error) fail('Could not save the criterion', error.message)
    return
  }

  const rows = await fetchKriteria()
  await insertRow('criteria', payload, 'id_kriteria', nextId(rows.map((row) => row.id_kriteria)))
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
      .from('catalog_options')
      .update(payload)
      .eq('id_pilihan_katalog', input.id_pilihan_katalog)
    if (error) fail('Could not save the catalogue option', error.message)
    return
  }

  const { error } = await db()
    .from('catalog_options')
    .insert({ ...payload, id_pilihan_katalog: randomId() })
  if (error) fail('Could not add the catalogue option', error.message)
}

export async function deleteKategori(id: number): Promise<void> {
  const { error } = await db().from('categories').delete().eq('id_kategori', id)
  if (error) fail('Could not delete the category', error.message)
}

export async function deleteSubKategori(id: number): Promise<void> {
  const { error } = await db().from('subcategories').delete().eq('id_sub_kategori', id)
  if (error) fail('Could not delete the sub category', error.message)
}

export async function deleteKriteria(id: number): Promise<void> {
  const { error } = await db().from('criteria').delete().eq('id_kriteria', id)
  if (error) fail('Could not delete the criterion', error.message)
}

export async function deletePilihan(id: string): Promise<void> {
  const { error } = await db().from('catalog_options').delete().eq('id_pilihan_katalog', id)
  if (error) fail('Could not delete the catalogue option', error.message)
}

/* ----------------------------------------------------------------- reviews */

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await db()
    .from('decision_history_reviews')
    .select(
      'id, user_id, author_name, author_email, rating, category, model_text, body:review, criteria, status, resolved, featured, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    throw new Error(
      `Could not load reviews: ${error.message}. Run supabase/09-feedback-table.sql in the Supabase SQL editor.`
    )
  }

  return ((data ?? []) as Partial<Review>[]).map((row) => ({
    id: row.id as string,
    user_id: row.user_id ?? null,
    author_name: row.author_name?.trim() || 'Anonymous',
    author_email: row.author_email ?? '',
    rating: row.rating ?? 0,
    category: row.category?.trim() || 'General',
    model_text: row.model_text ?? null,
    body: row.body ?? null,
    criteria: Array.isArray(row.criteria) ? row.criteria : [],
    status: row.status === 'hidden' ? 'hidden' : 'published',
    resolved: Boolean(row.resolved),
    featured: Boolean(row.featured),
    created_at: row.created_at as string,
  }))
}

export async function updateReview(
  id: string,
  patch: Partial<Pick<Review, 'status' | 'resolved' | 'featured'>>
): Promise<void> {
  const { error } = await db().from('decision_history_reviews').update(patch).eq('id', id)
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
