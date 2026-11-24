import { Link } from 'react-router-dom'
import { AtSign, HelpCircle, Mail } from 'lucide-react'
import myChoiceLogo from '@/assets/mychoice-logo.png'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
]

const product = [
  { name: 'Try MyChoice (Setup)', href: '/dashboard' },
  { name: 'AI Criteria Suggestions', href: '/dashboard/ai-criteria' },
  { name: 'Decision Comparison', href: '/dashboard/comparison' },
  { name: 'Decision Ranking', href: '/dashboard/ranking' },
  { name: 'What-If Simulation', href: '/dashboard/what-if' },
]

const social = [
  { name: 'Instagram', href: '#', icon: AtSign },
  { name: 'Contact', href: '/faq', icon: Mail },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
]

export function Footer() {
  return (
    <footer className="border-t border-[#f1ebfa] bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-12 md:px-8 md:py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img src={myChoiceLogo} alt="MyChoice" className="h-[28px] w-auto" />
            </Link>
            <p className="mt-3 max-w-[240px] text-[11px] leading-[1.8] text-muted">
              Your personal decision-support assistant, helping you make informed choices through
              AI-powered insights and structured comparisons.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-ink">Navigation</h4>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-[11px] text-muted transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-ink">Product</h4>
            <ul className="mt-4 space-y-2.5">
              {product.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-[11px] text-muted transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-ink">Social &amp; Contact</h4>
            <ul className="mt-4 space-y-2.5">
              {social.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-primary"
                  >
                    <item.icon className="h-3 w-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#f4eefb] pt-6 md:flex-row md:items-center">
          <p className="text-[10px] text-muted/70">© 2026 MyChoice. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/faq"
              className="text-[10px] text-muted/70 transition-colors hover:text-ink"
            >
              Privacy Policy
            </Link>
            <Link
              to="/faq"
              className="text-[10px] text-muted/70 transition-colors hover:text-ink"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
