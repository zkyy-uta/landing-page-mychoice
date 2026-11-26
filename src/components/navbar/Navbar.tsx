import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import myChoiceLogo from '@/assets/mychoice-logo.png'
import { trackEvent } from '@/lib/metrics'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Explore', href: '/explore' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/' && location.pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f1ebfa] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] w-full max-w-[1180px] items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img src={myChoiceLogo} alt="MyChoice" className="h-[28px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-[13px] transition-colors',
                isActive(link.href)
                  ? 'font-medium text-ink'
                  : 'text-muted hover:text-ink'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/admin/login"
            className="text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            Log In
          </Link>
          <Link
            to="/explore"
            onClick={() => void trackEvent('navbar_get_started_click', { location: 'desktop' })}
            className="rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-primary/25 transition-colors hover:bg-primary-deep"
          >
            Get Started
          </Link>
          <Link
            to="/admin/login"
            aria-label="Account"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#2b1b3d] text-white transition-colors hover:bg-[#3b2653]"
          >
            <User className="h-[13px] w-[13px]" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-soft/60 lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-[#f1ebfa] bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-1 px-6 py-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-primary-soft text-primary'
                    : 'text-muted hover:bg-[#faf7fe] hover:text-ink'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-[#f4eefb] pt-2">
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-line py-2 text-center text-[13px] font-medium text-ink"
              >
                Log In
              </Link>
              <Link
                to="/explore"
                onClick={() => {
                  setIsOpen(false)
                  void trackEvent('navbar_get_started_click', { location: 'mobile' })
                }}
                className="flex-1 rounded-xl bg-primary py-2 text-center text-[13px] font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
