const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' })

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatMonth(value: string): string {
  return monthFormatter.format(new Date(value))
}

export function timeAgo(value: string | null | undefined): string {
  if (!value) return '—'
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return formatDate(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_TINTS = [
  'bg-[#ece4fd] text-[#6b28d9]',
  'bg-[#e2f7ec] text-[#127a4b]',
  'bg-[#fde8ef] text-[#b02a5b]',
  'bg-[#e5eefd] text-[#2455b8]',
  'bg-[#fdf1dc] text-[#a26708]',
]

export function avatarTint(seed: string): string {
  let sum = 0
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i)
  return AVATAR_TINTS[sum % AVATAR_TINTS.length]
}

export function toCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
  return [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h] ?? '')).join(','))].join('\n')
}

export function downloadFile(name: string, content: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}
