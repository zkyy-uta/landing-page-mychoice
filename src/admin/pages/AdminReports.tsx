import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Download,
  Eye,
  Flag,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Star as StarIcon,
  ThumbsUp,
} from 'lucide-react'
import { fetchReviews, updateReview } from '../api'
import { downloadFile, formatDate, initials, timeAgo, toCsv } from '../format'
import { useAsyncData } from '../useAsync'
import type { Review } from '../types'
import {
  Badge,
  Button,
  Card,
  EmptyRow,
  ErrorNote,
  LoadingRow,
  Modal,
  PageHeader,
  Rating,
  Select,
  StatCard,
  TextInput,
  Toggle,
} from '../ui'

const PAGE_SIZE = 5

export function AdminReports() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [stars, setStars] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<Review | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, error, loading, reload } = useAsyncData(() => fetchReviews(), [])
  const reviews = data ?? []

  const categories = useMemo(
    () => Array.from(new Set(reviews.map((review) => review.category))).sort(),
    [reviews]
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return reviews.filter((review) => {
      const matchesTerm =
        !term ||
        review.author_name.toLowerCase().includes(term) ||
        review.author_email.toLowerCase().includes(term) ||
        (review.body ?? '').toLowerCase().includes(term)
      return (
        matchesTerm &&
        (category === 'all' || review.category === category) &&
        (stars === 'all' || review.rating === stars)
      )
    })
  }, [reviews, query, category, stars])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0
  const satisfaction = reviews.length
    ? Math.round((reviews.filter((review) => review.rating >= 4).length / reviews.length) * 1000) / 10
    : 0
  const openCount = reviews.filter((review) => !review.resolved).length

  async function patchReview(review: Review, patch: Partial<Pick<Review, 'resolved' | 'featured' | 'status'>>) {
    setBusyId(review.id)
    setActionError(null)
    try {
      await updateReview(review.id, patch)
      setDetail((current) =>
        current && current.id === review.id ? { ...current, ...patch } : current
      )
      reload()
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Could not update the review.')
    } finally {
      setBusyId(null)
    }
  }

  function exportCsv() {
    downloadFile(
      'mychoice-reviews.csv',
      toCsv(
        filtered.map((review) => ({
          author: review.author_name,
          email: review.author_email,
          rating: review.rating,
          category: review.category,
          review: review.body ?? '',
          status: review.status,
          resolved: review.resolved ? 'yes' : 'no',
          featured: review.featured ? 'yes' : 'no',
          submitted: review.created_at,
        }))
      )
    )
  }

  return (
    <div>
      <PageHeader
        label={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[#6d34d9]" /> Intelligence &amp; feedback hub · Audit stream
          </>
        }
        title="Reports &amp; User Reviews"
        description="Moderate feedback, user ratings, and suggestions submitted across MyChoice decision workflows."
        actions={
          <>
            <Button onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="primary" onClick={reload}>
              <Sparkles className="h-3.5 w-3.5" /> Refresh feed
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-5">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4">
          <ErrorNote>{actionError}</ErrorNote>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total reviews"
          value={loading ? '—' : reviews.length}
          accent
          icon={<MessageSquare className="h-4 w-4" />}
          hint={<>{openCount} awaiting moderation</>}
        />
        <StatCard
          label="Average rating"
          value={loading ? '—' : avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
          hint={
            <>
              <Rating value={Math.round(avgRating)} size={11} />
              <span>/ 5.0</span>
            </>
          }
        />
        <StatCard
          label="Satisfaction rate"
          value={loading ? '—' : `${satisfaction}%`}
          icon={<ThumbsUp className="h-4 w-4" />}
          tone="green"
          hint={<>Positive rating share (4★ and up)</>}
        />
        <StatCard
          label="Flagged for review"
          value={loading ? '—' : openCount}
          icon={<Flag className="h-4 w-4" />}
          hint={<>Zero unresolved moderation anomalies</>}
        />
      </div>

      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a99fbb]" />
            <TextInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search name, user email, or review text…"
              className="pl-9"
              aria-label="Search reviews"
            />
          </div>
          <Select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              setPage(1)
            }}
            className="lg:w-[240px]"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {(['all', 5, 4, 3, 2, 1] as const).map((value) => (
            <button
              key={value}
              onClick={() => {
                setStars(value)
                setPage(1)
              }}
              className={
                stars === value
                  ? 'inline-flex items-center gap-1.5 rounded-full bg-[#6d34d9] px-3 py-1.5 text-[10.5px] font-semibold text-white'
                  : 'inline-flex items-center gap-1.5 rounded-full border border-[#ece4f8] bg-white px-3 py-1.5 text-[10.5px] font-medium text-[#6f677e] hover:bg-[#faf7ff]'
              }
            >
              {value === 'all' ? (
                'All ratings'
              ) : (
                <>
                  <StarIcon className="h-3 w-3" /> {value} stars
                </>
              )}
            </button>
          ))}
          <span className="ml-auto text-[10.5px] text-[#a39aae]">{filtered.length} total</span>
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[13.5px] font-semibold text-[#171021]">
          Verified customer feedback <Badge tone="violet">{filtered.length} total</Badge>
        </h2>
        <span className="text-[10.5px] text-[#a39aae]">Sort: most recent</span>
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <Card className="px-5">
            <LoadingRow label="Loading reviews…" />
          </Card>
        ) : rows.length === 0 ? (
          <Card>
            <EmptyRow>
              {reviews.length === 0
                ? 'No reviews yet. Feedback submitted by users will appear here.'
                : 'No review matches these filters.'}
            </EmptyRow>
          </Card>
        ) : (
          rows.map((review) => (
            <Card key={review.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0e7fe] text-[12px] font-semibold text-[#6b28d9]">
                    {initials(review.author_name)}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12.5px] font-semibold text-[#2b2138]">{review.author_name}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#6d34d9]" />
                    </div>
                    <p className="text-[10.5px] text-[#9a90ac]">
                      {timeAgo(review.created_at)} · {review.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.featured ? <Badge tone="green">Featured</Badge> : null}
                  {review.status === 'hidden' ? <Badge tone="rose">Hidden</Badge> : null}
                  <Rating value={review.rating} />
                  <span className="text-[11px] font-semibold text-[#4d445c]">{review.rating}.0</span>
                </div>
              </div>

              <div className="mt-3 rounded-[10px] bg-[#faf7ff] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-[#5f5769]">
                {review.body ? `“${review.body}”` : <span className="italic text-[#a39aae]">No written review provided.</span>}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#b3aac2]">SAW model</span>
                  {review.criteria.length ? (
                    review.criteria.map((criterion) => (
                      <span
                        key={criterion.name}
                        className="rounded-full bg-[#f3ecfe] px-2 py-0.5 text-[10px] font-medium text-[#6b28d9]"
                      >
                        {criterion.name} ({criterion.weight}%)
                      </span>
                    ))
                  ) : (
                    <span className="text-[10.5px] text-[#a39aae]">Not recorded</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button size="sm" variant="ghost" onClick={() => setDetail(review)}>
                    <Eye className="h-3.5 w-3.5" /> Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === review.id}
                    onClick={() => void patchReview(review, { resolved: !review.resolved })}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {review.resolved ? 'Resolved' : 'Mark resolved'}
                  </Button>
                  <Button
                    size="sm"
                    variant={review.featured ? 'primary' : 'outline'}
                    disabled={busyId === review.id}
                    onClick={() => void patchReview(review, { featured: !review.featured })}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {review.featured ? 'Featured' : 'Feature'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10.5px] text-[#9a90ac]">
          Showing {rows.length} of {filtered.length} reviews
        </p>
        <div className="flex items-center gap-1.5">
          <Button size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            Previous
          </Button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={
                pageNumber === currentPage
                  ? 'h-8 w-8 rounded-[9px] bg-[#6d34d9] text-[11.5px] font-semibold text-white'
                  : 'h-8 w-8 rounded-[9px] border border-[#ece4f8] bg-white text-[11.5px] font-medium text-[#6f677e] hover:bg-[#faf7ff]'
              }
            >
              {pageNumber}
            </button>
          ))}
          <Button size="sm" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Review details & audit breakdown"
        subtitle={detail ? `${detail.category} · ${formatDate(detail.created_at)}` : undefined}
        icon={<MessageSquare className="h-4 w-4" />}
        footer={
          <>
            <Button onClick={() => setDetail(null)}>Close</Button>
            {detail ? (
              <Button
                variant="primary"
                disabled={busyId === detail.id}
                onClick={() => void patchReview(detail, { resolved: !detail.resolved })}
              >
                {detail.resolved ? 'Reopen review' : 'Save moderation changes'}
              </Button>
            ) : null}
          </>
        }
      >
        {detail ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#f2ecfa] bg-[#faf7ff] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-[#6b28d9]">
                  {initials(detail.author_name)}
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-[#2b2138]">{detail.author_name}</p>
                  <p className="text-[10.5px] text-[#9a90ac]">{detail.author_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Rating value={detail.rating} />
                <span className="text-[11px] font-semibold text-[#4d445c]">{detail.rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.15em] text-[#b3aac2]">Feedback</p>
              <p className="rounded-[11px] bg-[#faf7ff] px-3.5 py-3 text-[12px] leading-relaxed text-[#4d445c]">
                {detail.body ? `“${detail.body}”` : 'No written feedback was submitted with this rating.'}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.15em] text-[#b3aac2]">
                Criteria weighting distribution
              </p>
              {detail.criteria.length === 0 ? (
                <p className="text-[11.5px] text-[#a39aae]">No criteria snapshot recorded for this review.</p>
              ) : (
                <div className="overflow-hidden rounded-[11px] border border-[#f2ecfa]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#faf7ff] text-left text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#a99fbb]">
                        <th className="px-3.5 py-2">Criterion</th>
                        <th className="px-3.5 py-2">Weight</th>
                        <th className="px-3.5 py-2">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.criteria.map((criterion) => (
                        <tr key={criterion.name} className="border-t border-[#f5f0fb]">
                          <td className="px-3.5 py-2 text-[11.5px] text-[#4d445c]">{criterion.name}</td>
                          <td className="px-3.5 py-2 text-[11.5px] font-semibold text-[#2b2138]">{criterion.weight}%</td>
                          <td className="px-3.5 py-2">
                            <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-[#f1ecf9]">
                              <span
                                className="block h-full rounded-full bg-[#6d34d9]"
                                style={{ width: `${Math.min(100, criterion.weight)}%` }}
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] text-[#b3aac2]">
                Moderation &amp; internal controls
              </p>
              <div className="flex items-center justify-between gap-3 rounded-[11px] border border-[#f2ecfa] px-3.5 py-2.5">
                <div>
                  <p className="text-[11.5px] font-medium text-[#2b2138]">Public visibility</p>
                  <p className="text-[10px] text-[#9a90ac]">Published reviews appear on the public site.</p>
                </div>
                <Toggle
                  checked={detail.status === 'published'}
                  onChange={(next) => void patchReview(detail, { status: next ? 'published' : 'hidden' })}
                  label="Public visibility"
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[11px] border border-[#f2ecfa] px-3.5 py-2.5">
                <div>
                  <p className="text-[11.5px] font-medium text-[#2b2138]">Feature testimonial</p>
                  <p className="text-[10px] text-[#9a90ac]">Highlight this review in marketing surfaces.</p>
                </div>
                <Toggle
                  checked={detail.featured}
                  onChange={(next) => void patchReview(detail, { featured: next })}
                  label="Feature testimonial"
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[11px] border border-[#f2ecfa] px-3.5 py-2.5">
                <div>
                  <p className="text-[11.5px] font-medium text-[#2b2138]">Moderation resolved</p>
                  <p className="text-[10px] text-[#9a90ac]">Marks the thread as handled by an admin.</p>
                </div>
                <Toggle
                  checked={detail.resolved}
                  onChange={(next) => void patchReview(detail, { resolved: next })}
                  label="Moderation resolved"
                />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
