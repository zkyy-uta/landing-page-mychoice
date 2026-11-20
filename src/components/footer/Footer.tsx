import { Link } from 'react-router-dom'
import { Sparkles, Mail, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerLinks = {
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/#about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ],
  product: [
    { name: 'AI Criteria Suggestions', href: '#' },
    { name: 'Decision Comparison', href: '#' },
    { name: 'Decision Ranking', href: '#' },
    { name: 'What-If Simulation', href: '#' },
  ],
  social: [
    { name: 'Instagram', href: '#', icon: LinkIcon },
    { name: 'Contact', href: '#', icon: Mail },
    { name: 'FAQ', href: '/faq', icon: LinkIcon },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-text-h">MyChoice</span>
              </div>
              <p className="text-text/70 text-sm leading-relaxed max-w-xs">
                Your personal decision-support assistant, helping you make informed choices through AI-powered insights and structured comparisons.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-h uppercase tracking-wider mb-6">Navigation</h4>
              <ul className="space-y-3">
                {footerLinks.navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'text-sm text-text hover:text-brand-600 transition-colors',
                        item.href === '#' ? 'cursor-default' : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-h uppercase tracking-wider mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'text-sm text-text hover:text-brand-600 transition-colors',
                        item.href === '#' ? 'cursor-default' : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-h uppercase tracking-wider mb-6">Social &amp; Contact</h4>
              <ul className="space-y-3">
                {footerLinks.social.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-brand-500" />
                    <Link
                      to={item.href}
                      className={cn(
                        'text-sm text-text hover:text-brand-600 transition-colors',
                        item.href === '#' ? 'cursor-default' : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-text/50">
              © 2025 MyChoice. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-xs text-text/50 hover:text-text transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-text/50 hover:text-text transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
