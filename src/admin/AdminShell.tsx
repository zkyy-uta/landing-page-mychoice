import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Boxes,
  ChevronsUpDown,
  ExternalLink,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Menu,
  Search,
  Settings2,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminAuth } from './AdminAuth'
import { loadNotifications, useReadNotifications } from './notifications'
import { useAsyncData } from './useAsync'
import { Button } from './ui'

const navItems = [
  { key: 'overview', label: 'Overview', href: '/admin', icon: LayoutGrid, end: true },
  { key: 'users', label: 'User Management', href: '/admin/users', icon: Users },
  { key: 'catalogue', label: 'Catalogue & Criteria', href: '/admin/catalogue', icon: Boxes },
  { key: 'reports', label: 'Reports & Feedback', href: '/admin/reports', icon: MessageSquare },
  { key: 'notifications', label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { key: 'settings', label: 'System Settings', href: '/admin/settings', icon: Settings2 },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { data: notifications } = useAsyncData(loadNotifications)
  const { readIds } = useReadNotifications()
  const unreadCount = (notifications ?? []).filter((item) => !readIds.includes(item.id)).length

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="" className="h-8 w-8 rounded-[10px]" />
          <span className="leading-tight">
            <span className="block text-[14.5px] font-semibold tracking-[-0.01em] text-[#171021]">MyChoice</span>
            <span className="block text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#a99fbb]">Admin Core</span>
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.href}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-[10px] px-3 py-[9px] text-[12.5px] font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#6127c7] text-white shadow-[0_10px_22px_-14px_rgba(97,39,199,0.95)]'
                  : 'text-[#5f5769] hover:bg-[#f8f4ff] hover:text-[#4a1fa8]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-[15px] w-[15px]" strokeWidth={1.9} />
                <span className="truncate">{item.label}</span>
                {item.key === 'notifications' && unreadCount > 0 ? (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-1.5 py-0.5 text-[9.5px] font-bold',
                      isActive ? 'bg-white/25 text-white' : 'bg-[#f1e9fe] text-[#6b28d9]'
                    )}
                  >
                    {unreadCount}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-auto pb-4">
          <div className="rounded-[12px] border border-[#f2ecfa] bg-[#faf7ff] px-3 py-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8d84a0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> Active
              </span>
              <span className="text-[9px] font-semibold text-[#a99fbb]">v2.4</span>
            </div>
            <p className="mt-1.5 text-[11.5px] font-semibold text-[#2b2138]">SAW Engine Online</p>
            <p className="text-[10.5px] text-[#8d84a0]">99.98% Model Health</p>
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#b3aac2]">Quick actions</span>
            <div className="flex items-center gap-1">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                aria-label="Open public site"
                className="flex h-6 w-6 items-center justify-center rounded-md text-[#9a90ac] hover:bg-[#f4efff] hover:text-[#6d34d9]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Link
                to="/faq"
                aria-label="Support"
                className="flex h-6 w-6 items-center justify-center rounded-md text-[#9a90ac] hover:bg-[#f4efff] hover:text-[#6d34d9]"
              >
                <LifeBuoy className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { profile, signOut } = useAdminAuth()
  const { data: notifications } = useAsyncData(loadNotifications)
  const { readIds } = useReadNotifications()
  const unreadCount = (notifications ?? []).filter((item) => !readIds.includes(item.id)).length
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-[#f2ecfa] bg-white/90 backdrop-blur-md">
      <div className="flex h-[60px] items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6279] hover:bg-[#f6f1ff] lg:hidden"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="hidden items-center gap-2 text-[12px] sm:flex">
          <Link to="/admin" className="font-medium text-[#3d3448] hover:text-[#6d34d9]">
            Admin Portal
          </Link>
          <span className="text-[#c9c0d6]">/</span>
          <span className="rounded-full bg-[#f3ecfe] px-2.5 py-1 text-[10.5px] font-semibold text-[#6b28d9]">
            Production Console
          </span>
        </div>

        <form
          className="ml-2 hidden w-full max-w-[320px] items-center gap-2 rounded-[10px] border border-transparent bg-[#f7f3fd] px-3 md:flex"
          onSubmit={(event) => {
            event.preventDefault()
            navigate(`/admin/users${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
          }}
        >
          <Search className="h-3.5 w-3.5 text-[#a99fbb]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users, criteria, models…"
            className="h-9 w-full bg-transparent text-[11.5px] text-[#2b2138] placeholder:text-[#a99fbb] focus:outline-none"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
          <Link
            to="/admin/notifications"
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6279] hover:bg-[#f6f1ff]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e0455c] px-1 text-[8.5px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </Link>

          <div className="mx-1 hidden h-6 w-px bg-[#eee7f7] sm:block" />

          <div className="relative">
            <button
              onClick={(event) => {
                event.stopPropagation()
                setMenuOpen((open) => !open)
              }}
              className="flex items-center gap-2 rounded-[10px] px-1.5 py-1 hover:bg-[#f8f4ff]"
            >
              <span className="hidden text-right leading-tight sm:block">
                <span className="block text-[11.5px] font-semibold text-[#2b2138]">
                  {profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Admin'}
                </span>
                <span className="block text-[9.5px] text-[#9a90ac]">Superuser</span>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6d34d9] text-[11.5px] font-semibold text-white">
                {(profile?.full_name ?? 'A').charAt(0).toUpperCase()}
              </span>
              <ChevronsUpDown className="hidden h-3 w-3 text-[#a99fbb] sm:block" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-11 w-56 rounded-[14px] border border-[#f0eaf9] bg-white p-1.5 shadow-[0_18px_38px_-22px_rgba(28,15,46,0.45)]">
                <div className="px-2.5 py-2">
                  <p className="truncate text-[12px] font-semibold text-[#2b2138]">{profile?.email}</p>
                  <p className="text-[10.5px] text-[#9a90ac]">Administrator</p>
                </div>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[12px] text-[#4d445c] hover:bg-[#f8f4ff]"
                >
                  <Settings2 className="h-3.5 w-3.5" /> System settings
                </Link>
                <button
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-[9px] px-2.5 py-2 text-left text-[12px] text-[#b02a3c] hover:bg-[#fdf3f4]"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

function AccessDenied() {
  const { email, signOut, profile } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf8fe] px-4">
      <div className="w-full max-w-md rounded-[20px] border border-[#f0eaf9] bg-white p-7 text-center shadow-[0_20px_50px_-30px_rgba(28,15,46,0.4)]">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#fdecef] text-[#bd2c45]">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-[17px] font-semibold text-[#171021]">Administrator access required</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#79708a]">
          You are signed in as <span className="font-medium text-[#4d445c]">{email ?? profile?.email}</span>, but this
          account is not an administrator. An existing admin can grant the role in User Management.
        </p>
        <Button
          variant="primary"
          className="mt-5 w-full"
          onClick={() => {
            void signOut()
            navigate('/admin/login')
          }}
        >
          Sign in with another account
        </Button>
      </div>
    </div>
  )
}

export function RequireAdmin() {
  const { loading, profile, isAdmin } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf8fe]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#ded3f2] border-t-[#6d34d9]" />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) return <AccessDenied />

  return <AdminShell />
}

function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#fbf8fe]">
      <aside className="fixed inset-y-0 left-0 hidden w-[238px] border-r border-[#f2ecfa] lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-[#251a38]/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[260px] border-r border-[#f2ecfa] shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-[#6b6279] hover:bg-[#f6f1ff]"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[238px]">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1220px] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
