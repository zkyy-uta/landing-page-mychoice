import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/#features' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/#about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-100 bg-white/90 backdrop-blur-md">
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <Link to="/" className="text-xl font-bold text-text-h tracking-tight">
              MyChoice
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'nav-link px-3 py-2 rounded-lg transition-colors',
                  location.pathname === link.href ||
                    (link.href !== '/' && location.pathname.startsWith(link.href))
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-text hover:bg-brand-50'
                )}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setIsDark((d) => !d)}
              className="p-2 rounded-lg text-text hover:bg-brand-50 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/pricing"
              className="text-sm font-medium text-white bg-brand-600 px-5 py-2 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
            >
              Get Started
            </Link>

            <button
              onClick={() => setIsOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-text hover:bg-brand-50 transition-colors"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col gap-1 pt-4 border-t border-brand-100">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium text-text hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/pricing"
              className="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
