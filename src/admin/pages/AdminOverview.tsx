import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Boxes,
  ChevronDown,
  Download,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { fetchCatalogue, fetchProfiles, fetchReviews } from '../api'
import { formatNumber, initials, timeAgo, toCsv, downloadFile } from '../format'
import { useAsyncData } from '../useAsync'
import {
  Badge,
  Button,
  Card,
  EmptyRow,
  ErrorNote,
  LoadingRow,
  PageHeader,
  StatCard,
  cardClass,
} from '../ui'

const MONTH_COUNT = 6

function useMonthlyGrowth(dates: string[]) {
  return useMemo(() => {
    const now = new Date()
    const buckets = Array.from({ length: MONTH_COUNT }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (MONTH_COUNT - 1 - index), 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString('en-US', { month: 'short' }),
        count: 0,
      }
    })
    const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]))
    dates.forEach((value) => {
      const date = new Date(value)
      const bucket = byKey.get(`${date.getFullYear()}-${date.getMonth()}`)
      if (bucket) bucket.count += 1
    })
    const max = Math.max(1, ...buckets.map((bucket) => bucket.count))
    return { buckets, max }
  }, [dates])
}

const planTone = { basic: 'neutral', premium: 'violet' } as const

export function AdminOverview() {
  const [quickOpen, setQuickOpen] = useState(false)
  const { data, error, loading, reload } = useAsyncData(
    async () => {
      const [profiles, reviews, catalogue] = await Promise.all([
        fetchProfiles(),
        fetchReviews(),
        fetchCatalogue(),
      ])
      return { profiles, reviews, catalogue }
    },
    []
  )

  const profiles = data?.profiles ?? []
  const reviews = data?.reviews ?? []
  const kategori = data?.catalogue.kategori ?? []
  const subKategori = data?.catalogue.subKategori ?? []
  const kriteria = data?.catalogue.kriteria ?? []
  const pilihan = data?.catalogue.pilihan ?? []

  const growth = useMonthlyGrowth(
    profiles.map((profile) => profile.created_at).filter((value): value is string => Boolean(value))
  )
  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0
  const lastMonth = growth.buckets[growth.buckets.length - 1]?.count ?? 0
  const prevMonth = growth.buckets[growth.buckets.length - 2]?.count ?? 0
  const delta = prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : lastMonth > 0 ? 100 : 0
  const recent = profiles.slice(0, 5)
  const unresolved = reviews.filter((review) => !review.resolved).length

  const topTwoShare = useMemo(() => {
    const total = growth.buckets.reduce((sum, bucket) => sum + bucket.count, 0)
    if (total === 0) return 0
    const peak = [...growth.buckets].sort((a, b) => b.count - a.count).slice(0, 2)
    return Math.round((peak.reduce((sum, bucket) => sum + bucket.count, 0) / total) * 100)
  }, [growth.buckets])

  function exportMetrics() {
    downloadFile(
      'mychoice-admin-metrics.csv',
      toCsv(
        growth.buckets.map((bucket) => ({
          month: bucket.label,
          registered_users: bucket.count,
          total_users: profiles.length,
          total_reviews: reviews.length,
          average_rating: Number(avgRating.toFixed(2)),
        }))
      )
    )
  }

  return (
    <div>
      <PageHeader
        label={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[#6d34d9]" /> Platform intelligence · Real-time sync
          </>
        }
        title="Admin Dashboard Overview"
        description="Monitor platform metrics, user growth, and the health of your decision engine."
        actions={
          <>
            <Button onClick={exportMetrics} disabled={!data}>
              <Download className="h-3.5 w-3.5" /> Export metrics
            </Button>
            <div className="relative">
              <Button
                variant="primary"
                onClick={() => setQuickOpen((open) => !open)}
                aria-expanded={quickOpen}
              >
                <Plus className="h-3.5 w-3.5" /> Quick action
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
              {quickOpen ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setQuickOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-56 rounded-[13px] border border-[#f0eaf9] bg-white p-1.5 shadow-[0_18px_38px_-22px_rgba(28,15,46,0.45)]">
                    {[
                      { label: 'Add a criterion', href: '/admin/catalogue', icon: Boxes },
                      { label: 'Moderate feedback', href: '/admin/reports', icon: MessageSquare },
                      { label: 'Manage user access', href: '/admin/users', icon: Users },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setQuickOpen(false)}
                        className="flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[12px] text-[#4d445c] hover:bg-[#f8f4ff]"
                      >
                        <item.icon className="h-3.5 w-3.5 text-[#8d84a0]" /> {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </>
        }
      />

      {error ? (
        <div className="mb-5 space-y-2">
          <ErrorNote>{error}</ErrorNote>
          <Button size="sm" onClick={reload}>
            Try again
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={loading ? '—' : formatNumber(profiles.length)}
          icon={<Users className="h-4 w-4" />}
          hint={
            <>
              <Badge tone={delta >= 0 ? 'green' : 'rose'}>
                {delta >= 0 ? '↗' : '↘'} {Math.abs(delta).toFixed(1)}%
              </Badge>
              <span>vs last month</span>
            </>
          }
        />
        <StatCard
          label="Total reviews"
          value={loading ? '—' : formatNumber(reviews.length)}
          icon={<Star className="h-4 w-4" />}
          tone="green"
          hint={
            <>
              <Badge tone="green">{unresolved} open</Badge>
              <span>{unresolved === 0 ? 'all moderated' : 'awaiting moderation'}</span>
            </>
          }
        />
        <StatCard
          label="Active catalogues"
          value={loading ? '—' : `${kategori.length} categories`}
          icon={<Boxes className="h-4 w-4" />}
          hint={
            <>
              <Badge tone="violet">{kriteria.length} criteria</Badge>
              <span>
                {subKategori.length} sub categories · {pilihan.length} options
              </span>
            </>
          }
        />
        <StatCard
          label="Average rating"
          value={loading ? '—' : avgRating.toFixed(1)}
          icon={<TrendingUp className="h-4 w-4" />}
          hint={
            <>
              <Badge tone={avgRating >= 4.5 ? 'green' : 'amber'}>{avgRating.toFixed(1)} / 5.0</Badge>
              <span>from {reviews.length} reviews</span>
            </>
          }
        />
      </div>

      {/* Growth chart */}
      <Card className="mt-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14.5px] font-semibold text-[#171021]">New user activity &amp; growth</h2>
              <Badge tone="violet">H2 cycle</Badge>
            </div>
            <p className="mt-1 text-[11.5px] text-[#8d84a0]">
              Registrations per month, sourced from the users table.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#6f677e]">
              <span className="h-2 w-2 rounded-sm bg-[#6d34d9]" /> Registered users
            </span>
            <span className="rounded-[9px] border border-[#ece4f8] px-2.5 py-1 text-[10.5px] font-medium text-[#6f677e]">
              Monthly
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingRow label="Loading growth data…" />
        ) : (
          <div className="mt-6">
            <div className="flex gap-3">
              <div className="flex w-8 shrink-0 flex-col justify-between pb-6 text-right text-[9.5px] text-[#b3aac2]">
                {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                  <span key={ratio}>{Math.round(growth.max * ratio)}</span>
                ))}
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <span key={line} className="h-px w-full bg-[#f4eefb]" />
                  ))}
                </div>
                <div className="relative flex h-[210px] items-end justify-between gap-3 px-1 sm:gap-6">
                  {growth.buckets.map((bucket, index) => (
                    <div key={bucket.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className="flex w-full max-w-[54px] flex-1 items-end">
                        <div
                          className="w-full rounded-t-[8px] bg-gradient-to-t from-[#6d34d9] to-[#b18bf0] transition-all"
                          style={{
                            height: `${Math.max(3, (bucket.count / growth.max) * 100)}%`,
                            opacity: 0.55 + (index / MONTH_COUNT) * 0.45,
                          }}
                          title={`${bucket.label}: ${bucket.count} new users`}
                        />
                      </div>
                      <span className="text-[10.5px] text-[#8d84a0]">{bucket.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#f3edfb] bg-[#faf7ff] px-4 py-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-[9px] bg-white text-[#6d34d9]">
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11.5px] font-semibold text-[#2b2138]">Key velocity insight</p>
                  <p className="text-[11px] text-[#79708a]">
                    The two strongest months account for {topTwoShare}% of all registrations in this window.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b28d9] hover:underline"
              >
                Full user report <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Recent users */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[14.5px] font-semibold text-[#171021]">Recent users</h2>
            <Badge tone="violet">{Math.max(0, lastMonth)} new this month</Badge>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b28d9] hover:underline"
          >
            View all users <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {error ? (
          <EmptyRow>Connect Supabase to see registered accounts.</EmptyRow>
        ) : loading ? (
          <div className="px-5">
            <LoadingRow label="Loading users…" />
          </div>
        ) : recent.length === 0 ? (
          <EmptyRow>No accounts yet. They appear here as soon as users sign up.</EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-[#faf7ff] text-left text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#a99fbb]">
                  <th className="px-5 py-2.5">User details</th>
                  <th className="px-3 py-2.5">Role</th>
                  <th className="px-3 py-2.5">Current plan</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Registered</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((profile) => (
                  <tr key={profile.id} className="border-t border-[#f5f0fb]">
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
                    <td className="px-3 py-3 text-[11.5px] capitalize text-[#5f5769]">{profile.role}</td>
                    <td className="px-3 py-3">
                      <Badge tone={planTone[profile.plan]} className="capitalize">
                        {profile.plan} plan
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={profile.status === 'active' ? 'green' : 'rose'} dot className="capitalize">
                        {profile.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-[11.5px] text-[#79708a]">{timeAgo(profile.created_at)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to="/admin/users"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6b28d9] hover:underline"
                      >
                        Manage <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className={cardClass + ' mt-5 px-5 py-3 text-[10.5px] text-[#a39aae]'}>
        Numbers are computed live from the Supabase tables (users, categories, subcategories, criteria, catalog_options
        and reviews). “Average rating” replaces the old decision-query counter because query volume is not stored in the
        database.
      </p>
    </div>
  )
}
