import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Boxes,
  CheckCheck,
  ChevronRight,
  Inbox,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '../format'
import {
  KIND_LABELS,
  loadNotifications,
  useReadNotifications,
  type AdminNotification,
  type NotificationKind,
} from '../notifications'
import { useAsyncData } from '../useAsync'
import { Badge, Button, Card, EmptyRow, ErrorNote, LoadingRow, PageHeader, StatCard } from '../ui'

type FilterKey = 'all' | 'unread' | NotificationKind

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'user', label: 'Accounts' },
  { key: 'review', label: 'Feedback' },
  { key: 'catalogue', label: 'Catalogue' },
  { key: 'system', label: 'System' },
]

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  user: Users,
  review: MessageSquare,
  catalogue: Boxes,
  system: ShieldAlert,
}

const TONE_BOX: Record<AdminNotification['tone'], string> = {
  violet: 'bg-[#f1e9fe] text-[#6b28d9]',
  green: 'bg-[#e4f8ee] text-[#137a4c]',
  amber: 'bg-[#fdf3e2] text-[#9a6508]',
  rose: 'bg-[#fdecef] text-[#bd2c45]',
  neutral: 'bg-[#f4f1f8] text-[#6f677e]',
}

export function AdminNotifications() {
  const { data, error, loading, reload } = useAsyncData(loadNotifications)
  const { readIds, markRead, markAllRead } = useReadNotifications()
  const [filter, setFilter] = useState<FilterKey>('all')

  const items = useMemo(() => data ?? [], [data])
  const unread = useMemo(() => items.filter((item) => !readIds.includes(item.id)), [items, readIds])

  const visible = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'unread') return unread
    return items.filter((item) => item.kind === filter)
  }, [items, unread, filter])

  const counts = useMemo(
    () => ({
      user: items.filter((item) => item.kind === 'user').length,
      review: items.filter((item) => item.kind === 'review').length,
      attention: items.filter((item) => item.tone === 'amber' || item.tone === 'rose').length,
    }),
    [items]
  )

  return (
    <div>
      <PageHeader
        label={
          <>
            <Bell className="h-3 w-3" /> Activity centre
          </>
        }
        title="Notifications"
        description="Everything that moved in accounts, feedback and the category catalogue. The feed is derived from your Supabase rows, so a new sign-up, review or an incomplete category shows up here automatically."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={unread.length === 0}
              onClick={() => markAllRead(items.map((item) => item.id))}
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Unread"
          value={unread.length}
          hint={`${items.length} total notifications`}
          icon={<Bell className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="Account activity"
          value={counts.user}
          hint="Sign-ups and suspensions"
          icon={<Users className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Feedback"
          value={counts.review}
          hint="Reviews and moderation"
          icon={<MessageSquare className="h-4 w-4" />}
          tone="green"
        />
        <StatCard
          label="Needs attention"
          value={counts.attention}
          hint="Warnings and alerts"
          icon={<ShieldAlert className="h-4 w-4" />}
          tone="amber"
        />
      </div>

      {error ? (
        <div className="mb-4">
          <ErrorNote>{error}</ErrorNote>
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#f3eefb] px-4 py-3">
          {FILTERS.map((option) => {
            const active = filter === option.key
            const count =
              option.key === 'all'
                ? items.length
                : option.key === 'unread'
                  ? unread.length
                  : items.filter((item) => item.kind === option.key).length
            return (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors',
                  active
                    ? 'bg-[#f1e9fe] text-[#6b28d9]'
                    : 'text-[#857b96] hover:bg-[#f8f4ff] hover:text-[#4a1fa8]'
                )}
              >
                {option.label}
                <span className={cn('text-[10px]', active ? 'text-[#8b5cf6]' : 'text-[#b3aac2]')}>{count}</span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <LoadingRow label="Loading activity…" />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2">
            <EmptyRow>
              <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f5f0fe] text-[#8b5cf6]">
                <Inbox className="h-4 w-4" />
              </span>
              {filter === 'unread' ? 'Nothing unread — you are all caught up.' : 'No activity to show for this filter yet.'}
            </EmptyRow>
          </div>
        ) : (
          <ul className="divide-y divide-[#f5f0fc]">
            {visible.map((item) => {
              const Icon = KIND_ICON[item.kind]
              const isUnread = !readIds.includes(item.id)
              return (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    onClick={() => markRead(item.id)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[#fbf8ff]',
                      isUnread ? 'bg-white' : 'bg-[#fdfbff]'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]',
                        TONE_BOX[item.tone]
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.9} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn('text-[12.5px]', isUnread ? 'font-semibold text-[#171021]' : 'font-medium text-[#4d445c]')}>
                          {item.title}
                        </p>
                        <Badge tone="neutral">{KIND_LABELS[item.kind]}</Badge>
                        {isUnread ? <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" /> : null}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-relaxed text-[#79708a]">{item.body}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 pl-2">
                      <span className="text-[10.5px] text-[#a39aae]">{timeAgo(item.created_at)}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#c9c0d6]" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <p className="mt-3 px-1 text-[10.5px] text-[#a39aae]">
        Read state is stored in this browser only. Notifications are generated from live records and cleared when the
        underlying row changes.
      </p>
    </div>
  )
}
