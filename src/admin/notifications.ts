import { useEffect, useState } from 'react'
import { fetchCatalogue, fetchProfiles, fetchReviews } from './api'
import type { AdminProfile, KatalogBundle, Review } from './types'

export type NotificationKind = 'user' | 'review' | 'catalogue' | 'system'
export type NotificationTone = 'violet' | 'green' | 'amber' | 'rose' | 'neutral'

export type AdminNotification = {
  id: string
  kind: NotificationKind
  tone: NotificationTone
  title: string
  body: string
  href: string
  created_at: string
}

export const KIND_LABELS: Record<NotificationKind, string> = {
  user: 'Accounts',
  review: 'Feedback',
  catalogue: 'Catalogue',
  system: 'System',
}

const RECENT_MS = 14 * 24 * 60 * 60 * 1000

function displayName(profile: AdminProfile): string {
  return profile.full_name?.trim() || profile.email || 'Unnamed account'
}

function snippet(value: string | null, max = 120): string {
  const text = (value ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return 'No message provided.'
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function listNames(names: string[], max = 3): string {
  if (names.length === 0) return ''
  const shown = names.slice(0, max).join(', ')
  return names.length > max ? `${shown} and ${names.length - max} more` : shown
}

/** Turns real rows into an activity feed; no extra table required. */
export function buildNotifications({
  profiles,
  reviews,
  catalogue,
}: {
  profiles: AdminProfile[]
  reviews: Review[]
  catalogue: KatalogBundle
}): AdminNotification[] {
  const now = Date.now()
  const items: AdminNotification[] = []
  const nowIso = new Date(now).toISOString()
  const isRecent = (iso: string | null) =>
    Boolean(iso) && now - new Date(iso as string).getTime() <= RECENT_MS

  for (const profile of profiles) {
    if (profile.status === 'suspended') {
      items.push({
        id: `user-suspended:${profile.id}`,
        kind: 'user',
        tone: 'amber',
        title: 'Account suspended',
        body: `${displayName(profile)} currently has no access to the platform.`,
        href: '/admin/users',
        created_at: profile.created_at ?? nowIso,
      })
      continue
    }
    if (isRecent(profile.created_at)) {
      items.push({
        id: `user-new:${profile.id}`,
        kind: 'user',
        tone: 'violet',
        title: 'New account created',
        body: `${displayName(profile)} joined on the ${profile.plan} plan.`,
        href: profile.email ? `/admin/users?q=${encodeURIComponent(profile.email)}` : '/admin/users',
        created_at: profile.created_at as string,
      })
    }
  }

  for (const review of reviews) {
    const hidden = review.status === 'hidden'
    items.push({
      id: `review:${review.id}:${review.status}:${review.resolved ? 'r' : 'o'}`,
      kind: 'review',
      tone: hidden ? 'neutral' : review.resolved ? 'green' : 'amber',
      title: hidden
        ? 'Feedback hidden from the public page'
        : review.resolved
          ? 'Feedback handled'
          : `New ${review.rating}★ feedback`,
      body: `${review.author_name} · ${review.category} — ${snippet(review.body)}`,
      href: '/admin/reports',
      created_at: review.created_at,
    })
  }

  const { kategori, subKategori, kriteria, pilihan } = catalogue

  const emptyCategories = kategori.filter(
    (row) => !subKategori.some((sub) => sub.id_kategori === row.id_kategori)
  )
  if (emptyCategories.length > 0) {
    items.push({
      id: `catalogue:empty-categories:${emptyCategories.length}`,
      kind: 'catalogue',
      tone: 'amber',
      title: `${emptyCategories.length} categor${emptyCategories.length === 1 ? 'y has' : 'ies have'} no sub categories`,
      body: `${listNames(emptyCategories.map((row) => row.nama_kategori))} cannot be used in decisions until a sub category is added.`,
      href: '/admin/catalogue',
      created_at: nowIso,
    })
  }

  const subsWithoutCriteria = subKategori.filter(
    (row) => !kriteria.some((criterion) => criterion.id_sub_kategori === row.id_sub_kategori)
  )
  if (subsWithoutCriteria.length > 0) {
    items.push({
      id: `catalogue:no-criteria:${subsWithoutCriteria.length}`,
      kind: 'catalogue',
      tone: 'amber',
      title: `${subsWithoutCriteria.length} sub categor${subsWithoutCriteria.length === 1 ? 'y has' : 'ies have'} no criteria`,
      body: `${listNames(subsWithoutCriteria.map((row) => row.nama_sub_kategori))} will not produce a SAW ranking yet.`,
      href: '/admin/catalogue',
      created_at: nowIso,
    })
  }

  const optionsWithoutData = pilihan.filter(
    (row) => Object.keys(row.atribut ?? {}).length === 0
  )
  if (optionsWithoutData.length > 0) {
    items.push({
      id: `catalogue:empty-dataset:${optionsWithoutData.length}`,
      kind: 'catalogue',
      tone: 'neutral',
      title: `${optionsWithoutData.length} catalogue option${optionsWithoutData.length === 1 ? '' : 's'} without dataset values`,
      body: `${listNames(optionsWithoutData.map((row) => row.nama_pilihan))} cannot be scored until their attributes are filled in.`,
      href: '/admin/catalogue',
      created_at: nowIso,
    })
  }

  if (kategori.length === 0) {
    items.push({
      id: 'system:no-categories',
      kind: 'system',
      tone: 'rose',
      title: 'No categories configured',
      body: 'The decision engine cannot score anything until at least one category and sub category exist.',
      href: '/admin/catalogue',
      created_at: nowIso,
    })
  }

  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

/* ------------------------------------------------------------ live loader */

let feedCache: { at: number; items: AdminNotification[] } | null = null

export function invalidateNotifications() {
  feedCache = null
}

export async function loadNotifications(): Promise<AdminNotification[]> {
  if (feedCache && Date.now() - feedCache.at < 60_000) return feedCache.items
  const [profiles, reviews, catalogue] = await Promise.all([
    fetchProfiles(),
    fetchReviews(),
    fetchCatalogue(),
  ])
  const items = buildNotifications({ profiles, reviews, catalogue })
  feedCache = { at: Date.now(), items }
  return items
}

/* ------------------------------------------------------------ read state */

const READ_KEY = 'mychoice:admin:notifications:read'
const READ_EVENT = 'mychoice:notifications:read-change'

export function getReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

function persist(ids: string[]) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(new Set(ids)).slice(-500)))
  } catch {
    // Storage can be unavailable; read state is best effort.
  }
  window.dispatchEvent(new Event(READ_EVENT))
}

export function markNotificationsRead(ids: string[]) {
  persist([...getReadIds(), ...ids])
}

export function markAllNotificationsRead(ids: string[]) {
  persist(ids)
}

export function useReadNotifications() {
  const [readIds, setReadIds] = useState<string[]>(() => getReadIds())

  useEffect(() => {
    const sync = () => setReadIds(getReadIds())
    window.addEventListener(READ_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(READ_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return {
    readIds,
    unreadCount: (ids: string[]) => ids.filter((id) => !readIds.includes(id)).length,
    markRead: (id: string) => markNotificationsRead([id]),
    markAllRead: (ids: string[]) => markAllNotificationsRead(ids),
  }
}
