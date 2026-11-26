import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, Pencil, RefreshCw, Search, ShieldCheck, SlidersHorizontal, UserCheck, Users } from 'lucide-react'
import { fetchProfiles, updateProfile } from '../api'
import { downloadFile, formatDate, initials, toCsv } from '../format'
import { useAsyncData } from '../useAsync'
import type { AdminProfile, UserPlan, UserRole, UserStatus } from '../types'
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
  Select,
  StatCard,
  TextInput,
} from '../ui'

const PAGE_SIZE = 10
const planTone = { basic: 'neutral', premium: 'violet' } as const

type Draft = { full_name: string; role: UserRole; plan: UserPlan; status: UserStatus }

export function AdminUsers() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [role, setRole] = useState<'all' | UserRole>('all')
  const [plan, setPlan] = useState<'all' | UserPlan>('all')
  const [status, setStatus] = useState<'all' | UserStatus>('all')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<AdminProfile | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const { data, error, loading, reload } = useAsyncData(() => fetchProfiles(), [])
  const profiles = data ?? []

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return profiles.filter((profile) => {
      const matchesTerm =
        !term ||
        (profile.full_name ?? '').toLowerCase().includes(term) ||
        (profile.email ?? '').toLowerCase().includes(term) ||
        profile.id.toLowerCase().includes(term)
      return (
        matchesTerm &&
        (role === 'all' || profile.role === role) &&
        (plan === 'all' || profile.plan === plan) &&
        (status === 'all' || profile.status === status)
      )
    })
  }, [profiles, query, role, plan, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const counts = {
    total: profiles.length,
    basic: profiles.filter((profile) => profile.plan === 'basic').length,
    premium: profiles.filter((profile) => profile.plan === 'premium').length,
    active: profiles.filter((profile) => profile.status === 'active').length,
    suspended: profiles.filter((profile) => profile.status === 'suspended').length,
  }
  const health = counts.total ? Math.round((counts.active / counts.total) * 100) : 100
  const premiumShare = counts.total ? Math.round((counts.premium / counts.total) * 1000) / 10 : 0

  function openEditor(profile: AdminProfile) {
    setEditing(profile)
    setDraft({
      full_name: profile.full_name ?? '',
      role: profile.role,
      plan: profile.plan,
      status: profile.status,
    })
    setSaveError(null)
  }

  async function saveEditor() {
    if (!editing || !draft) return
    setSaving(true)
    setSaveError(null)
    try {
      await updateProfile(editing.id, {
        full_name: draft.full_name.trim() || null,
        role: draft.role,
        plan: draft.plan,
        status: draft.status,
      })
      setEditing(null)
      reload()
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save the user.')
    } finally {
      setSaving(false)
    }
  }

  function exportCsv() {
    downloadFile(
      'mychoice-users.csv',
      toCsv(
        filtered.map((profile) => ({
          id: profile.id,
          name: profile.full_name ?? '',
          email: profile.email ?? '',
          role: profile.role,
          plan: profile.plan,
          status: profile.status,
          joined: profile.created_at ?? '',
        }))
      )
    )
  }

  function resetFilters() {
    setRole('all')
    setPlan('all')
    setStatus('all')
    setQuery('')
    setPage(1)
  }

  return (
    <div>
      <PageHeader
        label={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[#6d34d9]" /> Security &amp; permissions
          </>
        }
        title="User Management"
        description="Every account in the Supabase users table, with access roles and subscription tiers in one list."
        actions={
          <>
            <Button onClick={exportCsv} disabled={!data || filtered.length === 0}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="primary" onClick={reload}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-5">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total registered"
          value={loading ? '—' : counts.total}
          icon={<Users className="h-4 w-4" />}
          hint={<><span className="font-semibold text-[#137a4c]">{health}%</span> active accounts</>}
        />
        <StatCard
          label="Basic tier"
          value={loading ? '—' : counts.basic}
          icon={<UserCheck className="h-4 w-4" />}
          hint={<>{counts.total ? Math.round((counts.basic / counts.total) * 100) : 0}% of the base</>}
        />
        <StatCard
          label="Premium tier"
          value={loading ? '—' : counts.premium}
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="green"
          hint={<><span className="font-semibold text-[#6b28d9]">${premiumShare}%</span> on a paid plan</>}
        />
        <StatCard
          label="Security health"
          value={loading ? '—' : `${health}%`}
          icon={<ShieldCheck className="h-4 w-4" />}
          hint={<>{counts.suspended} suspended · {counts.total} total</>}
        />
      </div>

      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a99fbb]" />
            <TextInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, email, or user ID…"
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#8d84a0]">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </span>
            <Select
              value={role}
              onChange={(event) => {
                setRole(event.target.value as typeof role)
                setPage(1)
              }}
              aria-label="Filter by role"
              className="h-9 w-[104px] text-[11.5px]"
            >
              <option value="all">Role: All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Select>
            <Select
              value={plan}
              onChange={(event) => {
                setPlan(event.target.value as typeof plan)
                setPage(1)
              }}
              aria-label="Filter by plan"
              className="h-9 w-[104px] text-[11.5px]"
            >
              <option value="all">Plan: All</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </Select>
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as typeof status)
                setPage(1)
              }}
              aria-label="Filter by status"
              className="h-9 w-[118px] text-[11.5px]"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </Select>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-[#6b28d9] hover:underline"
            >
              Reset filters
            </button>
          </div>
        </div>
        <p className="mt-2.5 text-[10.5px] text-[#a39aae]">
          {filtered.length} account{filtered.length === 1 ? '' : 's'} found
        </p>
      </Card>

      <Card className="mt-4 overflow-hidden">
        {loading ? (
          <div className="px-5">
            <LoadingRow label="Loading users…" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyRow>
            {profiles.length === 0
              ? 'No accounts yet in public.users. Accounts appear here once they exist in Supabase Auth and the users table.'
              : 'No account matches these filters.'}
          </EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-[#faf7ff] text-left text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#a99fbb]">
                  <th className="px-5 py-2.5">User</th>
                  <th className="px-3 py-2.5">Role</th>
                  <th className="px-3 py-2.5">Plan</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Joined date</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((profile) => (
                  <tr key={profile.id} className="border-t border-[#f5f0fb] hover:bg-[#fdfbff]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0e7fe] text-[11px] font-semibold text-[#6b28d9]">
                          {initials(profile.full_name ?? profile.email ?? '?')}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-semibold text-[#2b2138]">
                            {profile.full_name ?? profile.email?.split('@')[0] ?? 'Unnamed user'}
                          </p>
                          <p className="truncate text-[10.5px] text-[#9a90ac]">{profile.email ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={profile.role === 'admin' ? 'violet' : 'neutral'} className="capitalize">
                        {profile.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-start gap-0.5">
                        <Badge tone={planTone[profile.plan]} className="uppercase tracking-wide">
                          {profile.plan}
                        </Badge>
                        {profile.membership &&
                        profile.membership.toLowerCase() !== profile.plan ? (
                          <span className="text-[9.5px] text-[#a39aae]">{profile.membership}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={profile.status === 'active' ? 'green' : 'rose'} dot className="capitalize">
                        {profile.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-[11.5px] text-[#79708a]">{formatDate(profile.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label={`Edit ${profile.email ?? 'user'}`}
                          onClick={() => openEditor(profile)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f5f0fb] px-5 py-3">
          <p className="text-[10.5px] text-[#9a90ac]">
            Displaying {rows.length} of {filtered.length} accounts
          </p>
          <div className="flex items-center gap-1.5">
            <Button size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              Previous
            </Button>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-[9px] bg-[#6d34d9] px-2 text-[11.5px] font-semibold text-white">
              {currentPage}
            </span>
            <Button size="sm" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={Boolean(editing && draft)}
        onClose={() => setEditing(null)}
        title="Edit account access"
        subtitle={editing?.email ?? undefined}
        icon={<Pencil className="h-4 w-4" />}
        width="max-w-lg"
        footer={
          <>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => void saveEditor()} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="space-y-3.5">
            <Field label="Display name">
              <TextInput
                value={draft.full_name}
                onChange={(event) => setDraft({ ...draft, full_name: event.target.value })}
                placeholder="Full name"
              />
            </Field>
            <div className="grid gap-3.5 sm:grid-cols-3">
              <Field label="Role">
                <Select
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value as UserRole })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>
              <Field label="Plan">
                <Select
                  value={draft.plan}
                  onChange={(event) => setDraft({ ...draft, plan: event.target.value as UserPlan })}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as UserStatus })}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </Field>
            </div>
            <div className="rounded-[11px] border border-[#f2ecfa] bg-[#faf7ff] px-3.5 py-2.5 text-[10.5px] leading-relaxed text-[#79708a]">
              Role changes take effect on the user’s next page load. Admin accounts can open this console and write to the
              catalogue.
            </div>
            {saveError ? <ErrorNote>{saveError}</ErrorNote> : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
