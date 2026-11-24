import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import myChoiceLogo from '@/assets/mychoice-logo.png'

const links = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'criteria', label: 'AI Criteria', href: '/dashboard/ai-criteria' },
  { key: 'comparison', label: 'Matrix SAW', href: '/dashboard/comparison' },
  { key: 'ranking', label: 'Ranking', href: '/dashboard/ranking' },
  { key: 'whatif', label: 'What-If', href: '/dashboard/what-if' },
]

export type StudioSection = 'dashboard' | 'criteria' | 'comparison' | 'ranking' | 'whatif'

export function StudioBar({ active }: { active: StudioSection }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f1ebfa] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[58px] w-full max-w-[1180px] items-center gap-5 px-6 md:px-8">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={myChoiceLogo} alt="MyChoice" className="h-[26px] w-auto" />
        </Link>

        <span className="hidden h-4 w-px bg-line lg:block" />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-[12px] transition-colors',
                active === item.key
                  ? 'bg-[#f4ecfd] font-semibold text-primary'
                  : 'text-muted hover:bg-[#faf7ff] hover:text-ink'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-[#e6f6ec] bg-[#f3fcf6] px-3 py-1.5 text-[10px] font-semibold text-[#15803d] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            SAW Engine Active
          </span>
          <Link
            to="/dashboard"
            className="rounded-lg bg-primary px-3.5 py-2 text-[11.5px] font-semibold text-white shadow-[0_12px_26px_-16px_rgba(124,58,237,0.9)] transition-colors hover:bg-primary-deep"
          >
            Try MyChoice
          </Link>
        </div>
      </div>
    </header>
  )
}
