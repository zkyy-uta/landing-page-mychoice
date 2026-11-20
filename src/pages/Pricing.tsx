import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Crown, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import { cn } from '@/lib/utils'

const basicFeatures = [
  'Up to 5 decisions per month',
  'Maximum 3 alternatives per decision',
  'AI-assisted criteria suggestions',
  'Criteria weighting (up to 100%)',
  'Alternative comparison',
  'SAW-based ranking calculation',
  'Basic result explanation',
  '30-day decision history access',
]

const premiumFeatures = [
  'Unlimited decisions per month',
  'Maximum 10 alternatives per decision',
  'AI-assisted criteria suggestions (advanced models)',
  'Advanced decision analysis & trade-off metrics',
  'What-If Simulation & dynamic weight sweeps',
  'Extended decision history (lifetime cloud archives)',
  'Personal decision pattern insights & cognitive bias radar',
]

const comparisonData = [
  { feature: 'Monthly decision limit', basic: '5 decisions / month', premium: 'Unlimited' },
  { feature: 'Alternatives per decision', basic: 'Up to 3', premium: 'Up to 10' },
  { feature: 'AI criteria suggestions', basic: 'Yes', premium: 'Yes (Advanced)', premiumHighlight: true },
  { feature: 'Weighted criteria', basic: 'Yes', premium: 'Yes (Precision slider)', premiumHighlight: true },
  { feature: 'Alternative comparison', basic: 'Side-by-side', premium: 'Advanced matrix', premiumHighlight: true },
  { feature: 'SAW ranking calculation', basic: 'Standard', premium: 'Full analysis', premiumHighlight: true },
  { feature: 'What-If Simulation', basic: '–', premium: 'Included', premiumHighlight: true },
  { feature: 'Decision history', basic: '30 days', premium: 'Lifetime', premiumHighlight: true },
  { feature: 'Personal decision insights', basic: '–', premium: 'Included', premiumHighlight: true },
  { feature: 'Priority customer support', basic: 'Standard', premium: 'Priority 24/7', premiumHighlight: true },
]

const faqs = [
  {
    q: 'Can I use MyChoice for free?',
    a: 'Yes! MyChoice offers a generous Free Forever plan (Basic) with essential decision-making tools. You can upgrade to Premium anytime for advanced features.',
  },
  {
    q: 'Can I upgrade to Premium later?',
    a: 'Absolutely. You can upgrade from Basic to Premium at any time from your account settings. Your data carries over seamlessly.',
  },
  {
    q: 'What happens when I reach my monthly decision limit?',
    a: 'On the Basic plan, once you reach 5 decisions in a month, you can either wait for the next billing cycle or upgrade to Premium for unlimited decisions.',
  },
  {
    q: 'What additional features does Premium offer?',
    a: 'Premium includes unlimited decisions, up to 10 alternatives per decision, advanced AI models, What-If Simulation, lifetime decision history, personal insights, and priority 24/7 support.',
  },
]

export function Pricing() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Simple & Flexible Plans
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-text-h leading-tight mb-6">
              Choose the Plan That Fits Your<br />
              <span className="text-brand-600">Needs.</span>
            </h1>
            <p className="text-lg text-text/80 max-w-2xl mx-auto">
              Start with the essential decision-making tools and upgrade whenever you need more flexibility. Lucid, objective clarity at every step.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-sm text-text/60">Monthly Billing</span>
            <div className="relative inline-flex items-center rounded-full bg-brand-100 px-0.5">
              <button className="flex items-center px-3 py-1.5 text-xs font-medium text-brand-600 bg-white rounded-full shadow-sm transition-colors">
                Annual Billing
              </button>
              <button className="flex items-center px-3 py-1.5 text-xs font-medium text-text/50 rounded-full transition-colors">
                Save 20%
              </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Basic Plan */}
            <div className="card flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Starter Tier</span>
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-h mb-2">Basic</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-text-h">Free</span>
                <span className="text-sm text-text/60">$0 / forever</span>
              </div>
              <p className="text-sm text-text/60 mb-8">
                Essential tools to help you make better decisions with structured rationality.
              </p>
              <div className="space-y-3 mb-8">
                {basicFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text/80 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="#" className="w-full py-3 bg-brand-50 text-brand-600 border border-brand-100 rounded-xl font-medium text-center hover:bg-brand-100 transition-colors block">
                Get Started for Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="card flex flex-col relative border-brand-300 shadow-xl shadow-brand-200/50">
              <div className="absolute top-0 right-0 -mt-3 -mr-3">
                <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-bl-xl rounded-tr-xl">
                  Recommended
                </span>
                <Crown className="w-4 h-4 text-yellow-400 fill-current mt-1 ml-1" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Pro Level</span>
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-h mb-2">Premium</h2>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-text-h">Subscription</span>
              </div>
              <p className="text-sm text-brand-600 font-medium mb-2">
                Flexible monthly &amp; annual plans · Coming Soon
              </p>
              <p className="text-sm text-text/60 mb-8">
                More flexibility and deeper insights for your multi-criteria decision-making journey.
              </p>
              <div className="space-y-3 mb-8 flex-grow">
                {premiumFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text/80 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium text-center hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 block">
                Explore Premium
              </button>
            </div>
          </div>

          {/* Comparison Table Section */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Side by Side
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              Detailed Plan Comparison
            </h2>
            <p className="text-text/60 text-sm max-w-xl mx-auto">
              A comprehensive breakdown of analytical capabilities, limits, and intelligence modules.
            </p>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-50">
                  <th className="pb-4 text-left text-xs font-bold text-text/60 uppercase tracking-wider">Features &amp; Capabilities</th>
                  <th className="pb-4 text-center text-xs font-bold text-text/60 uppercase tracking-wider">Basic</th>
                  <th className="pb-4 text-center text-xs font-bold text-text/60 uppercase tracking-wider">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-text-h">{row.feature}</td>
                    <td className="py-4 text-center text-sm text-text/80">
                      {row.basic === 'Yes' ? (
                        <span className="flex items-center justify-center gap-1 text-brand-600">
                          <Check className="w-3 h-3" /> Yes
                        </span>
                      ) : row.basic === '–' ? (
                        <span className="text-text/40">–</span>
                      ) : (
                        <span>{row.basic}</span>
                      )}
                    </td>
                    <td className={cn('py-4 text-center text-sm', row.premiumHighlight ? 'text-brand-600 font-medium' : 'text-text/80')}>
                      {row.premium === 'Yes (Advanced)' || row.premium === 'Yes (Precision slider)' ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> {row.premium}
                        </span>
                      ) : row.premium === '–' ? (
                        <span className="text-text/40">–</span>
                      ) : (
                        <span>{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Answers & Clarity
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-text/60 text-sm max-w-xl mx-auto mb-12">
              Everything you need to know about our plans, quotas, and premium features.
            </p>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <section className="mt-20 relative overflow-hidden">
            <div className="relative bg-brand-600 rounded-[3rem] p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-brand-500/20" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium mb-4">
                    Your assistant Choby is ready
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                    Start Making Better Decisions<br />
                    <span className="text-brand-300">Today.</span>
                  </h2>
                  <p className="text-brand-100 text-lg leading-relaxed mb-8 max-w-lg">
                    Eliminate cognitive overload and trade-off anxiety. Create your first decision matrix with AI assistance in less than two minutes.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link to="#" className="btn-primary">
                      Get Started for Free <span aria-hidden="true">→</span>
                    </Link>
                    <span className="text-xs text-brand-100/80 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400" />
                      No credit card required
                    </span>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="w-48 h-48 rounded-full bg-brand-500/30 flex items-center justify-center border border-white/10 shadow-2xl shadow-brand-500/20">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-brand-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-brand-50"
      >
        <span className="text-sm font-medium text-text-h">{question}</span>
        <span className={cn('w-4 h-4 transition-transform', open ? 'rotate-180' : '')}>
          <span className="w-4 h-4 border-b border-r border-text/60" />
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 border-t border-brand-50/50">
          <p className="text-sm text-text/70 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}


