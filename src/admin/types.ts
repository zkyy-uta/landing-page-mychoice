export type UserRole = 'admin' | 'user'
export type UserPlan = 'basic' | 'premium' | 'pro'
export type UserStatus = 'active' | 'suspended' | 'invited'

export type AdminProfile = {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  plan: UserPlan
  status: UserStatus
  created_at: string | null
  /** Raw subscription label from the legacy `pengguna` table (for example "free"). */
  membership?: string | null
  /** `pengguna` rows have no auth profile, so they are shown but cannot be edited. */
  source?: 'profile' | 'pengguna'
  editable?: boolean
}

export type AttributeType = 'benefit' | 'cost'

/* ------------------------------------------------------------- catalogue */

export type Kategori = {
  id_kategori: number
  nama_kategori: string
  deskripsi: string | null
}

export type SubKategori = {
  id_sub_kategori: number
  id_kategori: number
  nama_sub_kategori: string
}

export type Kriteria = {
  id_kriteria: number
  id_sub_kategori: number
  nama_kriteria: string
  jenis_kriteria: AttributeType
  satuan: string | null
  atribut_key: string
}

export type KatalogAtribut = Record<string, string>

export type PilihanKatalog = {
  id_pilihan_katalog: string
  id_sub_kategori: number
  nama_pilihan: string
  harga: number | null
  spesifikasi: string | null
  rating: number | null
  atribut: KatalogAtribut | null
  mata_uang: string | null
  sumber_url: string | null
  lisensi_data: string | null
}

export type KatalogBundle = {
  kategori: Kategori[]
  subKategori: SubKategori[]
  kriteria: Kriteria[]
  pilihan: PilihanKatalog[]
}

export type KategoriInput = { id_kategori?: number; nama_kategori: string; deskripsi: string }

export type SubKategoriInput = {
  id_sub_kategori?: number
  id_kategori: number
  nama_sub_kategori: string
}

export type KriteriaInput = {
  id_kriteria?: number
  id_sub_kategori: number
  nama_kriteria: string
  jenis_kriteria: AttributeType
  satuan: string
  atribut_key: string
}

export type PilihanInput = {
  id_pilihan_katalog?: string
  id_sub_kategori: number
  nama_pilihan: string
  harga: number | null
  rating: number | null
  mata_uang: string
  sumber_url: string
  lisensi_data: string
  spesifikasi: string
  atribut: KatalogAtribut
}

/** Members of the legacy `pengguna` table shown next to the auth profiles. */
export type Pengguna = {
  id_pengguna: string
  nama: string | null
  email: string | null
  jenis_langganan: string | null
}

/* ------------------------------------------------------- reviews & engine */

export type ReviewCriterion = { name: string; weight: number }

export type Review = {
  id: string
  user_id: string | null
  author_name: string
  author_email: string
  rating: number
  category: string
  model_text: string | null
  body: string | null
  criteria: ReviewCriterion[]
  status: 'published' | 'hidden'
  resolved: boolean
  featured: boolean
  created_at: string
}

export type EngineSettings = {
  auto_normalize: boolean
  allow_custom_criteria: boolean
  normalization_method: string
  decimal_precision: string
  realtime_sync: boolean
  maintenance_mode: boolean
  require_2fa: boolean
  session_timeout: string
  cache_cleared_at: string | null
}

export const DEFAULT_ENGINE_SETTINGS: EngineSettings = {
  auto_normalize: true,
  allow_custom_criteria: true,
  normalization_method: 'Linear Max-Min (Standard SAW)',
  decimal_precision: '4 Decimal Places (0.0000)',
  realtime_sync: true,
  maintenance_mode: false,
  require_2fa: false,
  session_timeout: '12 hours',
  cache_cleared_at: null,
}
