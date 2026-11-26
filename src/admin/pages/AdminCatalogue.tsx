import { useMemo, useState } from 'react'
import {
  Boxes,
  Database,
  FolderTree,
  Layers,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  deleteKategori,
  deleteKriteria,
  deletePilihan,
  deleteSubKategori,
  fetchCatalogue,
  saveKategori,
  saveKriteria,
  savePilihan,
  saveSubKategori,
} from '../api'
import { formatCurrency } from '../format'
import { useAsyncData } from '../useAsync'
import type {
  AttributeType,
  KatalogAtribut,
  Kriteria,
  Kategori,
  PilihanKatalog,
  SubKategori,
} from '../types'
import {
  Badge,
  Button,
  Card,
  EmptyRow,
  ErrorNote,
  Field,
  IconButton,
  LoadingRow,
  Modal,
  PageHeader,
  TextInput,
  inputClass,
} from '../ui'

const OPTION_PAGE = 25

type KategoriDraft = { id_kategori?: number; nama_kategori: string; deskripsi: string }
type SubDraft = { id_sub_kategori?: number; nama_sub_kategori: string }
type KriteriaDraft = {
  id_kriteria?: number
  nama_kriteria: string
  jenis_kriteria: AttributeType
  satuan: string
  atribut_key: string
}
type AtributRow = { key: string; value: string }
type PilihanDraft = {
  id_pilihan_katalog?: string
  nama_pilihan: string
  harga: string
  rating: string
  mata_uang: string
  sumber_url: string
  lisensi_data: string
  atribut: AtributRow[]
}

function emptyKategori(): KategoriDraft {
  return { nama_kategori: '', deskripsi: '' }
}

function emptySub(): SubDraft {
  return { nama_sub_kategori: '' }
}

function emptyKriteria(): KriteriaDraft {
  return { nama_kriteria: '', jenis_kriteria: 'benefit', satuan: '', atribut_key: '' }
}

function emptyPilihan(): PilihanDraft {
  return {
    nama_pilihan: '',
    harga: '',
    rating: '',
    mata_uang: 'IDR',
    sumber_url: '',
    lisensi_data: '',
    atribut: [{ key: '', value: '' }],
  }
}

function toPilihanDraft(pilihan: PilihanKatalog): PilihanDraft {
  const atribut = Object.entries(pilihan.atribut ?? {}).map(([key, value]) => ({
    key,
    value: String(value),
  }))
  return {
    id_pilihan_katalog: pilihan.id_pilihan_katalog,
    nama_pilihan: pilihan.nama_pilihan,
    harga: pilihan.harga === null ? '' : String(pilihan.harga),
    rating: pilihan.rating === null ? '' : String(pilihan.rating),
    mata_uang: pilihan.mata_uang ?? 'IDR',
    sumber_url: pilihan.sumber_url ?? '',
    lisensi_data: pilihan.lisensi_data ?? '',
    atribut: atribut.length ? atribut : [{ key: '', value: '' }],
  }
}

function toAtributObject(rows: AtributRow[]): KatalogAtribut {
  const result: KatalogAtribut = {}
  rows.forEach((row) => {
    const key = row.key.trim().toLowerCase().replace(/\s+/g, '_')
    if (key && row.value.trim()) result[key] = row.value.trim()
  })
  return result
}

function buildSpesifikasi(atribut: KatalogAtribut, kriteria: Kriteria[]): string {
  const labels = new Map(kriteria.map((row) => [row.atribut_key.toLowerCase(), row.nama_kriteria]))
  return Object.entries(atribut)
    .map(([key, value]) => `${labels.get(key.toLowerCase()) ?? key.replace(/_/g, ' ')}: ${value}`)
    .join('; ')
}

export function AdminCatalogue() {
  const [kategoriId, setKategoriId] = useState<number | null>(null)
  const [subId, setSubId] = useState<number | null>(null)
  const [tab, setTab] = useState<'criteria' | 'dataset'>('criteria')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(OPTION_PAGE)
  const [kategoriDraft, setKategoriDraft] = useState<KategoriDraft | null>(null)
  const [subDraft, setSubDraft] = useState<SubDraft | null>(null)
  const [kriteriaDraft, setKriteriaDraft] = useState<KriteriaDraft | null>(null)
  const [pilihanDraft, setPilihanDraft] = useState<PilihanDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  const { data, error, loading, reload } = useAsyncData(() => fetchCatalogue(), [])

  const kategori = data?.kategori ?? []
  const subKategori = data?.subKategori ?? []
  const kriteria = data?.kriteria ?? []
  const pilihan = data?.pilihan ?? []

  const activeKategori = useMemo(
    () => kategori.find((row) => row.id_kategori === kategoriId) ?? kategori[0] ?? null,
    [kategori, kategoriId]
  )

  const categorySubs = useMemo(
    () =>
      activeKategori
        ? subKategori.filter((row) => row.id_kategori === activeKategori.id_kategori)
        : [],
    [subKategori, activeKategori]
  )

  const activeSub = useMemo(
    () => categorySubs.find((row) => row.id_sub_kategori === subId) ?? categorySubs[0] ?? null,
    [categorySubs, subId]
  )

  const subKriteria = useMemo(
    () =>
      activeSub
        ? kriteria
            .filter((row) => row.id_sub_kategori === activeSub.id_sub_kategori)
            .sort((a, b) => a.id_kriteria - b.id_kriteria)
        : [],
    [kriteria, activeSub]
  )

  const subPilihan = useMemo(
    () =>
      activeSub
        ? pilihan
            .filter((row) => row.id_sub_kategori === activeSub.id_sub_kategori)
            .sort((a, b) => a.nama_pilihan.localeCompare(b.nama_pilihan))
        : [],
    [pilihan, activeSub]
  )

  const filteredPilihan = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return subPilihan
    return subPilihan.filter((row) => {
      if (row.nama_pilihan.toLowerCase().includes(term)) return true
      return Object.entries(row.atribut ?? {}).some(
        ([key, value]) =>
          key.toLowerCase().includes(term) || String(value).toLowerCase().includes(term)
      )
    })
  }, [subPilihan, query])

  const shownPilihan = filteredPilihan.slice(0, visible)
  const attributeSuggestions = useMemo(
    () =>
      Array.from(
        new Set([
          ...subKriteria.map((row) => row.atribut_key),
          'harga',
          'price',
          'material',
          'type',
          'best_for',
        ])
      ),
    [subKriteria]
  )

  const totals = useMemo(
    () => ({
      kategori: kategori.length,
      subKategori: subKategori.length,
      kriteria: kriteria.length,
      pilihan: pilihan.length,
    }),
    [kategori, subKategori, kriteria, pilihan]
  )

  function resetFilters() {
    setQuery('')
    setVisible(OPTION_PAGE)
    setPageError(null)
  }

  function selectKategori(id: number) {
    setKategoriId(id)
    setSubId(null)
    setTab('criteria')
    resetFilters()
  }

  function selectSub(id: number) {
    setSubId(id)
    resetFilters()
  }

  async function submitKategori() {
    if (!kategoriDraft) return
    setSaving(true)
    setModalError(null)
    try {
      await saveKategori({
        id_kategori: kategoriDraft.id_kategori,
        nama_kategori: kategoriDraft.nama_kategori,
        deskripsi: kategoriDraft.deskripsi,
      })
      setKategoriDraft(null)
      reload()
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : 'Could not save the category.')
    } finally {
      setSaving(false)
    }
  }

  async function submitSub() {
    if (!subDraft || !activeKategori) return
    setSaving(true)
    setModalError(null)
    try {
      await saveSubKategori({
        id_sub_kategori: subDraft.id_sub_kategori,
        id_kategori: activeKategori.id_kategori,
        nama_sub_kategori: subDraft.nama_sub_kategori,
      })
      setSubDraft(null)
      reload()
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : 'Could not save the sub category.')
    } finally {
      setSaving(false)
    }
  }

  async function submitKriteria() {
    if (!kriteriaDraft || !activeSub) return
    setSaving(true)
    setModalError(null)
    try {
      await saveKriteria({
        id_kriteria: kriteriaDraft.id_kriteria,
        id_sub_kategori: activeSub.id_sub_kategori,
        nama_kriteria: kriteriaDraft.nama_kriteria,
        jenis_kriteria: kriteriaDraft.jenis_kriteria,
        satuan: kriteriaDraft.satuan,
        atribut_key: kriteriaDraft.atribut_key,
      })
      setKriteriaDraft(null)
      reload()
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : 'Could not save the criterion.')
    } finally {
      setSaving(false)
    }
  }

  async function submitPilihan() {
    if (!pilihanDraft || !activeSub) return
    setSaving(true)
    setModalError(null)
    try {
      const atribut = toAtributObject(pilihanDraft.atribut)
      await savePilihan({
        id_pilihan_katalog: pilihanDraft.id_pilihan_katalog,
        id_sub_kategori: activeSub.id_sub_kategori,
        nama_pilihan: pilihanDraft.nama_pilihan,
        harga: pilihanDraft.harga.trim() === '' ? null : Number(pilihanDraft.harga),
        rating: pilihanDraft.rating.trim() === '' ? null : Number(pilihanDraft.rating),
        mata_uang: pilihanDraft.mata_uang,
        sumber_url: pilihanDraft.sumber_url,
        lisensi_data: pilihanDraft.lisensi_data,
        spesifikasi: buildSpesifikasi(atribut, subKriteria),
        atribut,
      })
      setPilihanDraft(null)
      reload()
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : 'Could not save the option.')
    } finally {
      setSaving(false)
    }
  }

  async function removeKategori(row: Kategori) {
    if (!window.confirm(`Delete the “${row.nama_kategori}” category?`)) return
    setPageError(null)
    try {
      await deleteKategori(row.id_kategori)
      setKategoriId(null)
      setSubId(null)
      reload()
    } catch (cause) {
      setPageError(cause instanceof Error ? cause.message : 'Could not delete the category.')
    }
  }

  async function removeSub(row: SubKategori) {
    if (!window.confirm(`Delete the “${row.nama_sub_kategori}” sub category?`)) return
    setPageError(null)
    try {
      await deleteSubKategori(row.id_sub_kategori)
      setSubId(null)
      reload()
    } catch (cause) {
      setPageError(cause instanceof Error ? cause.message : 'Could not delete the sub category.')
    }
  }

  async function removeKriteria(row: Kriteria) {
    if (!window.confirm(`Delete “${row.nama_kriteria}” from this sub category?`)) return
    setPageError(null)
    try {
      await deleteKriteria(row.id_kriteria)
      reload()
    } catch (cause) {
      setPageError(cause instanceof Error ? cause.message : 'Could not delete the criterion.')
    }
  }

  async function removePilihan(row: PilihanKatalog) {
    if (!window.confirm(`Delete “${row.nama_pilihan}” from the catalogue dataset?`)) return
    setPageError(null)
    try {
      await deletePilihan(row.id_pilihan_katalog)
      reload()
    } catch (cause) {
      setPageError(cause instanceof Error ? cause.message : 'Could not delete the option.')
    }
  }

  const tabs = [
    { key: 'criteria' as const, label: 'Criteria', count: subKriteria.length },
    { key: 'dataset' as const, label: 'Catalogue dataset', count: subPilihan.length },
  ]

  const draftAtribut = pilihanDraft ? toAtributObject(pilihanDraft.atribut) : {}
  const draftSpesifikasi = buildSpesifikasi(draftAtribut, subKriteria)

  return (
    <div>
      <PageHeader
        label={
          <>
            <Boxes className="h-3 w-3" /> Catalogue &amp; criteria · Live Supabase data
          </>
        }
        title="Catalogue Studio"
        description="Every category, sub category, criterion and catalogue option comes straight from Supabase. Add categories and sub categories here, then feed each option with a dataset of attribute values."
        actions={
          <>
            <Button
              onClick={() => {
                setModalError(null)
                setKategoriDraft(emptyKategori())
              }}
            >
              <FolderTree className="h-3.5 w-3.5" /> Add category
            </Button>
            <Button
              variant="primary"
              disabled={!activeKategori}
              onClick={() => {
                setModalError(null)
                setSubDraft(emptySub())
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add sub category
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-5">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}
      {pageError ? (
        <div className="mb-5">
          <ErrorNote>{pageError}</ErrorNote>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-[#8d84a0]">
        <Badge tone="violet">{totals.kategori} categories</Badge>
        <Badge tone="violet">{totals.subKategori} sub categories</Badge>
        <Badge tone="violet">{totals.kriteria} criteria</Badge>
        <Badge tone="violet">{totals.pilihan} catalogue options</Badge>
      </div>

      {loading ? (
        <Card className="mt-4 px-5">
          <LoadingRow label="Loading catalogue from Supabase…" />
        </Card>
      ) : kategori.length === 0 ? (
        <Card className="mt-4">
          <EmptyRow>
            No categories yet. Add the first category, then create its sub categories.
          </EmptyRow>
        </Card>
      ) : (
        <>
          {/* Category tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {kategori.map((row) => {
              const active = row.id_kategori === activeKategori?.id_kategori
              const subCount = subKategori.filter((sub) => sub.id_kategori === row.id_kategori).length
              return (
                <button
                  key={row.id_kategori}
                  onClick={() => selectKategori(row.id_kategori)}
                  className={
                    active
                      ? 'inline-flex items-center gap-2 rounded-[10px] bg-[#6d34d9] px-3.5 py-2 text-[11.5px] font-semibold text-white'
                      : 'inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[11.5px] font-medium text-[#6f677e] hover:bg-white'
                  }
                >
                  <FolderTree className="h-3.5 w-3.5" /> {row.nama_kategori}
                  <span
                    className={
                      active
                        ? 'rounded-full bg-white/20 px-1.5 text-[9.5px] font-bold'
                        : 'rounded-full bg-[#f2ecfa] px-1.5 text-[9.5px] font-bold text-[#8d84a0]'
                    }
                  >
                    {subCount}
                  </span>
                </button>
              )
            })}
          </div>

          {activeKategori ? (
            <Card className="mt-3 flex flex-wrap items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[14.5px] font-semibold text-[#171021]">
                    {activeKategori.nama_kategori}
                  </h2>
                  <Badge tone="neutral">id {activeKategori.id_kategori}</Badge>
                </div>
                <p className="mt-0.5 text-[11.5px] text-[#8d84a0]">
                  {activeKategori.deskripsi ?? 'No description yet.'}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {categorySubs.length === 0 ? (
                    <span className="text-[11px] text-[#a39aae]">
                      No sub categories in this category yet.
                    </span>
                  ) : (
                    categorySubs.map((row) => {
                      const active = row.id_sub_kategori === activeSub?.id_sub_kategori
                      const optionCount = pilihan.filter(
                        (item) => item.id_sub_kategori === row.id_sub_kategori
                      ).length
                      return (
                        <button
                          key={row.id_sub_kategori}
                          onClick={() => selectSub(row.id_sub_kategori)}
                          className={
                            active
                              ? 'inline-flex items-center gap-1.5 rounded-full bg-[#f1e9fe] px-3 py-1.5 text-[11px] font-semibold text-[#6b28d9] ring-1 ring-[#d9c4fb]'
                              : 'inline-flex items-center gap-1.5 rounded-full border border-[#ece4f8] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6f677e] hover:bg-[#faf7ff]'
                          }
                        >
                          {row.nama_sub_kategori}
                          <span className="text-[9.5px] text-[#a99fbb]">{optionCount}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton
                  label="Edit category"
                  onClick={() => {
                    setModalError(null)
                    setKategoriDraft({
                      id_kategori: activeKategori.id_kategori,
                      nama_kategori: activeKategori.nama_kategori,
                      deskripsi: activeKategori.deskripsi ?? '',
                    })
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  label="Delete category"
                  onClick={() => void removeKategori(activeKategori)}
                  className="hover:bg-[#fdeef0] hover:text-[#c02a3c]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </Card>
          ) : null}

          {activeSub ? (
            <Card className="mt-4 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f5f0fb] px-5 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13.5px] font-semibold text-[#171021]">
                      {activeSub.nama_sub_kategori}
                    </h3>
                    <Badge tone="neutral">{activeKategori?.nama_kategori}</Badge>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-[#9a90ac]">
                    {subKriteria.length} criteria · {subPilihan.length} dataset options
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    label="Edit sub category"
                    onClick={() => {
                      setModalError(null)
                      setSubDraft({
                        id_sub_kategori: activeSub.id_sub_kategori,
                        nama_sub_kategori: activeSub.nama_sub_kategori,
                      })
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton
                    label="Delete sub category"
                    onClick={() => void removeSub(activeSub)}
                    className="hover:bg-[#fdeef0] hover:text-[#c02a3c]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f5f0fb] px-5">
                <div className="flex flex-wrap gap-5">
                  {tabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={
                        tab === item.key
                          ? 'flex items-center gap-1.5 border-b-2 border-[#6d34d9] py-3 text-[12px] font-semibold text-[#4a1fa8]'
                          : 'flex items-center gap-1.5 border-b-2 border-transparent py-3 text-[12px] font-medium text-[#8d84a0] hover:text-[#4d445c]'
                      }
                    >
                      {item.label}
                      <span className="rounded-full bg-[#f3ecfe] px-1.5 py-0.5 text-[9.5px] font-semibold text-[#6b28d9]">
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
                {tab === 'criteria' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setModalError(null)
                      setKriteriaDraft(emptyKriteria())
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add criterion
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setModalError(null)
                      setPilihanDraft(emptyPilihan())
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add option
                  </Button>
                )}
              </div>

              {tab === 'criteria' ? (
                subKriteria.length === 0 ? (
                  <EmptyRow>
                    No criteria for this sub category yet. Add Harga, RAM, or any attribute the SAW
                    engine should compare.
                  </EmptyRow>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse">
                      <thead>
                        <tr className="bg-[#faf7ff] text-left text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#a99fbb]">
                          <th className="px-5 py-2.5">Criterion</th>
                          <th className="px-3 py-2.5">Attribute key</th>
                          <th className="px-3 py-2.5">Type</th>
                          <th className="px-3 py-2.5">Unit</th>
                          <th className="px-5 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subKriteria.map((row) => (
                          <tr key={row.id_kriteria} className="border-t border-[#f5f0fb]">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f4edfe] text-[#6b28d9]">
                                  <ListChecks className="h-3.5 w-3.5" />
                                </span>
                                <p className="text-[12.5px] font-semibold text-[#2b2138]">
                                  {row.nama_kriteria}
                                </p>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <code className="rounded-[6px] bg-[#faf7ff] px-1.5 py-0.5 text-[11px] text-[#6b28d9]">
                                {row.atribut_key}
                              </code>
                            </td>
                            <td className="px-3 py-3">
                              <Badge tone={row.jenis_kriteria === 'benefit' ? 'green' : 'rose'}>
                                {row.jenis_kriteria === 'benefit' ? '↑ Benefit' : '↓ Cost'}
                              </Badge>
                            </td>
                            <td className="px-3 py-3 text-[11.5px] text-[#79708a]">
                              {row.satuan || '—'}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <IconButton
                                  label={`Edit ${row.nama_kriteria}`}
                                  onClick={() => {
                                    setModalError(null)
                                    setKriteriaDraft({
                                      id_kriteria: row.id_kriteria,
                                      nama_kriteria: row.nama_kriteria,
                                      jenis_kriteria: row.jenis_kriteria,
                                      satuan: row.satuan ?? '',
                                      atribut_key: row.atribut_key,
                                    })
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </IconButton>
                                <IconButton
                                  label={`Delete ${row.nama_kriteria}`}
                                  onClick={() => void removeKriteria(row)}
                                  className="hover:bg-[#fdeef0] hover:text-[#c02a3c]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </IconButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <>
                  <div className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a99fbb]" />
                      <TextInput
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value)
                          setVisible(OPTION_PAGE)
                        }}
                        placeholder="Search option name or dataset value…"
                        className="pl-9"
                        aria-label="Search catalogue options"
                      />
                    </div>
                    <span className="text-[10.5px] text-[#a39aae]">
                      {filteredPilihan.length} of {subPilihan.length} options
                    </span>
                  </div>

                  {shownPilihan.length === 0 ? (
                    <EmptyRow>
                      {subPilihan.length === 0
                        ? 'No catalogue options yet. Add one and fill its attribute dataset.'
                        : 'No option matches this search.'}
                    </EmptyRow>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] border-collapse">
                          <thead>
                            <tr className="bg-[#faf7ff] text-left text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#a99fbb]">
                              <th className="px-5 py-2.5">Option</th>
                              <th className="px-3 py-2.5">Price</th>
                              <th className="px-3 py-2.5">Dataset</th>
                              <th className="px-3 py-2.5">Specification preview</th>
                              <th className="px-5 py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shownPilihan.map((row) => {
                              const atributCount = Object.keys(row.atribut ?? {}).length
                              return (
                                <tr key={row.id_pilihan_katalog} className="border-t border-[#f5f0fb] hover:bg-[#fdfbff]">
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f4edfe] text-[#6b28d9]">
                                        <Database className="h-3.5 w-3.5" />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="text-[12.5px] font-semibold text-[#2b2138]">
                                          {row.nama_pilihan}
                                        </p>
                                        <p className="text-[10px] text-[#a39aae]">
                                          {row.mata_uang ?? 'IDR'}
                                          {row.rating !== null ? ` · ${row.rating}★` : ''}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-[11.5px] text-[#79708a]">
                                    {formatCurrency(row.harga)}
                                  </td>
                                  <td className="px-3 py-3">
                                    <Badge tone={atributCount > 0 ? 'violet' : 'amber'}>
                                      {atributCount} attributes
                                    </Badge>
                                  </td>
                                  <td className="px-3 py-3">
                                    <p className="max-w-[320px] truncate text-[11px] text-[#9a90ac]">
                                      {row.spesifikasi ?? '—'}
                                    </p>
                                  </td>
                                  <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <IconButton
                                        label={`Edit ${row.nama_pilihan}`}
                                        onClick={() => {
                                          setModalError(null)
                                          setPilihanDraft(toPilihanDraft(row))
                                        }}
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </IconButton>
                                      <IconButton
                                        label={`Delete ${row.nama_pilihan}`}
                                        onClick={() => void removePilihan(row)}
                                        className="hover:bg-[#fdeef0] hover:text-[#c02a3c]"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </IconButton>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f5f0fb] px-5 py-3">
                        <p className="text-[10.5px] text-[#9a90ac]">
                          Showing {shownPilihan.length} of {filteredPilihan.length} options
                        </p>
                        {visible < filteredPilihan.length ? (
                          <Button size="sm" onClick={() => setVisible(visible + OPTION_PAGE)}>
                            <Layers className="h-3.5 w-3.5" /> Load more
                          </Button>
                        ) : null}
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
          ) : (
            <Card className="mt-4">
              <EmptyRow>
                Select or create a sub category to manage its criteria and catalogue dataset.
              </EmptyRow>
            </Card>
          )}
        </>
      )}

      {/* Category editor */}
      <Modal
        open={Boolean(kategoriDraft)}
        onClose={() => setKategoriDraft(null)}
        title={kategoriDraft?.id_kategori ? 'Edit category' : 'Add category'}
        subtitle="Stored in public.categories"
        icon={<FolderTree className="h-4 w-4" />}
        width="max-w-lg"
        footer={
          <>
            <Button onClick={() => setKategoriDraft(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => void submitKategori()}
              disabled={saving || !kategoriDraft?.nama_kategori.trim()}
            >
              {saving ? 'Saving…' : 'Save category'}
            </Button>
          </>
        }
      >
        {kategoriDraft ? (
          <div className="space-y-3.5">
            <Field label="Category name" hint="For example Technology, Education, or Fashion.">
              <TextInput
                value={kategoriDraft.nama_kategori}
                onChange={(event) =>
                  setKategoriDraft({ ...kategoriDraft, nama_kategori: event.target.value })
                }
                placeholder="e.g. Home & Living"
                autoFocus
              />
            </Field>
            <Field label="Description">
              <textarea
                value={kategoriDraft.deskripsi}
                onChange={(event) =>
                  setKategoriDraft({ ...kategoriDraft, deskripsi: event.target.value })
                }
                rows={3}
                className="w-full rounded-[10px] border border-[#ece4f8] bg-white px-3 py-2 text-[12.5px] text-[#2b2138] placeholder:text-[#b0a7bf] focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/15"
                placeholder="What kind of decisions does this category cover?"
              />
            </Field>
            {modalError ? <ErrorNote>{modalError}</ErrorNote> : null}
          </div>
        ) : null}
      </Modal>

      {/* Sub category editor */}
      <Modal
        open={Boolean(subDraft)}
        onClose={() => setSubDraft(null)}
        title={subDraft?.id_sub_kategori ? 'Edit sub category' : 'Add sub category'}
        subtitle={activeKategori ? `Parent category · ${activeKategori.nama_kategori}` : undefined}
        icon={<Plus className="h-4 w-4" />}
        width="max-w-lg"
        footer={
          <>
            <Button onClick={() => setSubDraft(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => void submitSub()}
              disabled={saving || !subDraft?.nama_sub_kategori.trim()}
            >
              {saving ? 'Saving…' : 'Save sub category'}
            </Button>
          </>
        }
      >
        {subDraft ? (
          <div className="space-y-3.5">
            <Field label="Sub category name" hint="Each sub category holds its own criteria and options.">
              <TextInput
                value={subDraft.nama_sub_kategori}
                onChange={(event) =>
                  setSubDraft({ ...subDraft, nama_sub_kategori: event.target.value })
                }
                placeholder="e.g. Headphones"
                autoFocus
              />
            </Field>
            {modalError ? <ErrorNote>{modalError}</ErrorNote> : null}
          </div>
        ) : null}
      </Modal>

      {/* Criterion editor */}
      <Modal
        open={Boolean(kriteriaDraft)}
        onClose={() => setKriteriaDraft(null)}
        title={kriteriaDraft?.id_kriteria ? 'Edit criterion' : 'Add criterion'}
        subtitle={activeSub ? `${activeSub.nama_sub_kategori} · public.criteria` : undefined}
        icon={<ListChecks className="h-4 w-4" />}
        width="max-w-xl"
        footer={
          <>
            <Button onClick={() => setKriteriaDraft(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => void submitKriteria()}
              disabled={
                saving ||
                !kriteriaDraft?.nama_kriteria.trim() ||
                !kriteriaDraft?.atribut_key.trim()
              }
            >
              {saving ? 'Saving…' : 'Save criterion'}
            </Button>
          </>
        }
      >
        {kriteriaDraft ? (
          <div className="space-y-4">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Criterion name">
                <TextInput
                  value={kriteriaDraft.nama_kriteria}
                  onChange={(event) =>
                    setKriteriaDraft({ ...kriteriaDraft, nama_kriteria: event.target.value })
                  }
                  placeholder="e.g. Harga"
                  autoFocus
                />
              </Field>
              <Field label="Attribute key" hint="Key used inside each option dataset.">
                <TextInput
                  value={kriteriaDraft.atribut_key}
                  onChange={(event) =>
                    setKriteriaDraft({ ...kriteriaDraft, atribut_key: event.target.value })
                  }
                  placeholder="e.g. harga"
                />
              </Field>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-[#5c5368]">SAW attribute type</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(
                  [
                    { value: 'benefit', title: 'Benefit', note: 'Higher values are more desirable' },
                    { value: 'cost', title: 'Cost', note: 'Lower values are more desirable' },
                  ] as const
                ).map((option) => {
                  const active = kriteriaDraft.jenis_kriteria === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setKriteriaDraft({ ...kriteriaDraft, jenis_kriteria: option.value })
                      }
                      className={
                        active
                          ? 'rounded-[11px] border border-[#d9c4fb] bg-[#f8f2ff] px-3.5 py-3 text-left'
                          : 'rounded-[11px] border border-[#eee7f7] bg-white px-3.5 py-3 text-left hover:bg-[#fdfbff]'
                      }
                    >
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2b2138]">
                        {option.value === 'benefit' ? '↑' : '↓'} {option.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-[#8d84a0]">{option.note}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Field label="Unit" hint="Optional. For example GB, jam, Hz or mAh.">
              <TextInput
                value={kriteriaDraft.satuan}
                onChange={(event) =>
                  setKriteriaDraft({ ...kriteriaDraft, satuan: event.target.value })
                }
                placeholder="GB"
              />
            </Field>

            {modalError ? <ErrorNote>{modalError}</ErrorNote> : null}
          </div>
        ) : null}
      </Modal>

      {/* Catalogue option (dataset) editor */}
      <Modal
        open={Boolean(pilihanDraft)}
        onClose={() => setPilihanDraft(null)}
        title={pilihanDraft?.id_pilihan_katalog ? 'Edit catalogue option' : 'Add catalogue option'}
        subtitle={activeSub ? `${activeSub.nama_sub_kategori} · public.catalog_options` : undefined}
        icon={<Database className="h-4 w-4" />}
        width="max-w-3xl"
        footer={
          <>
            <Button onClick={() => setPilihanDraft(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => void submitPilihan()}
              disabled={saving || !pilihanDraft?.nama_pilihan.trim()}
            >
              {saving ? 'Saving…' : 'Save option'}
            </Button>
          </>
        }
      >
        {pilihanDraft ? (
          <div className="space-y-4">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Option name">
                <TextInput
                  value={pilihanDraft.nama_pilihan}
                  onChange={(event) =>
                    setPilihanDraft({ ...pilihanDraft, nama_pilihan: event.target.value })
                  }
                  placeholder="e.g. Apple MacBook Pro 14"
                  autoFocus
                />
              </Field>
              <Field label="Price (numeric)">
                <TextInput
                  type="number"
                  value={pilihanDraft.harga}
                  onChange={(event) =>
                    setPilihanDraft({ ...pilihanDraft, harga: event.target.value })
                  }
                  placeholder="31984000"
                />
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-3">
              <Field label="Currency">
                <TextInput
                  value={pilihanDraft.mata_uang}
                  onChange={(event) =>
                    setPilihanDraft({ ...pilihanDraft, mata_uang: event.target.value })
                  }
                  placeholder="IDR"
                />
              </Field>
              <Field label="Rating" hint="Optional, 1–5.">
                <TextInput
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={pilihanDraft.rating}
                  onChange={(event) =>
                    setPilihanDraft({ ...pilihanDraft, rating: event.target.value })
                  }
                  placeholder="4.8"
                />
              </Field>
              <Field label="Data licence">
                <TextInput
                  value={pilihanDraft.lisensi_data}
                  onChange={(event) =>
                    setPilihanDraft({ ...pilihanDraft, lisensi_data: event.target.value })
                  }
                  placeholder="CC BY 4.0"
                />
              </Field>
            </div>

            <Field label="Source URL">
              <TextInput
                value={pilihanDraft.sumber_url}
                onChange={(event) =>
                  setPilihanDraft({ ...pilihanDraft, sumber_url: event.target.value })
                }
                placeholder="https://…"
              />
            </Field>

            <div className="rounded-[12px] border border-[#f0eaf9] bg-[#fdfbff] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-semibold text-[#2b2138]">Attribute dataset</p>
                  <p className="text-[10.5px] text-[#9a90ac]">
                    Stored in <code>atribut</code> (JSONB). Use the criterion keys above so the SAW
                    engine can read the values.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    onClick={() =>
                      setPilihanDraft({
                        ...pilihanDraft,
                        atribut: [...pilihanDraft.atribut, { key: '', value: '' }],
                      })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" /> Add field
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const rows = subKriteria.map((row) => ({ key: row.atribut_key, value: '' }))
                      if (rows.length === 0) return
                      setPilihanDraft({
                        ...pilihanDraft,
                        atribut: [...pilihanDraft.atribut.filter((row) => row.key || row.value), ...rows],
                      })
                    }}
                    disabled={subKriteria.length === 0}
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Use criteria keys
                  </Button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {pilihanDraft.atribut.map((row, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={row.key}
                      onChange={(event) => {
                        const atribut = pilihanDraft.atribut.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, key: event.target.value } : item
                        )
                        setPilihanDraft({ ...pilihanDraft, atribut })
                      }}
                      list="catalogue-atribut-keys"
                      placeholder="key"
                      aria-label={`Attribute key ${index + 1}`}
                      className={`${inputClass} h-9 w-[38%] font-mono text-[11.5px]`}
                    />
                    <input
                      value={row.value}
                      onChange={(event) => {
                        const atribut = pilihanDraft.atribut.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: event.target.value } : item
                        )
                        setPilihanDraft({ ...pilihanDraft, atribut })
                      }}
                      placeholder="value"
                      aria-label={`Attribute value ${index + 1}`}
                      className={`${inputClass} h-9 flex-1 text-[11.5px]`}
                    />
                    <IconButton
                      label="Remove attribute"
                      onClick={() =>
                        setPilihanDraft({
                          ...pilihanDraft,
                          atribut:
                            pilihanDraft.atribut.length === 1
                              ? [{ key: '', value: '' }]
                              : pilihanDraft.atribut.filter((_, itemIndex) => itemIndex !== index),
                        })
                      }
                      className="hover:bg-[#fdeef0] hover:text-[#c02a3c]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                ))}
              </div>
              <datalist id="catalogue-atribut-keys">
                {attributeSuggestions.map((key) => (
                  <option key={key} value={key} />
                ))}
              </datalist>

              <div className="mt-3 rounded-[10px] bg-white px-3 py-2.5 ring-1 ring-[#f0eaf9]">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#b3aac2]">
                  Specification preview
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#5f5769]">
                  {draftSpesifikasi || 'Fill a few attributes to generate the specification text.'}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[#a39aae]">
                <span>{Object.keys(draftAtribut).length} stored fields</span>
                {subKriteria.map((row) => (
                  <Badge
                    key={row.id_kriteria}
                    tone={draftAtribut[row.atribut_key] ? 'green' : 'neutral'}
                  >
                    {row.nama_kriteria}
                  </Badge>
                ))}
              </div>
            </div>

            {modalError ? <ErrorNote>{modalError}</ErrorNote> : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
