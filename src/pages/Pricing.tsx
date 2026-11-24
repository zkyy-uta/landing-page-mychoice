import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Crown,
  Headset,
  History,
  LayoutGrid,
  RefreshCw,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
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
  'AI-assisted criteria suggestions (Advanced models)',
  'Advanced decision analysis & trade-off matrices',
  'What-If simulation & dynamic weight sweeps',
  'Extended decision history (Lifetime cloud archives)',
  'Personal decision pattern insights & cognitive bias radar',
]

const comparisonData = [
  {
    icon: CalendarDays,
    feature: 'Monthly decision limit',
    basic: '5 decisions / month',
    premium: 'Unlimited',
  },
  {
    icon: LayoutGrid,
    feature: 'Alternatives per decision',
    basic: 'Up to 3',
    premium: 'Up to 10',
  },
  {
    icon: Sparkles,
    feature: 'AI criteria suggestions',
    basic: 'Yes',
    premium: 'Yes (Advanced)',
  },
  {
    icon: SlidersHorizontal,
    feature: 'Weighted criteria',
    basic: 'Yes',
    premium: 'Yes (Precision slider)',
  },
  {
    icon: ArrowLeftRight,
    feature: 'Alternative comparison',
    basic: 'Side-by-side',
    premium: 'Advanced matrix',
  },
  {
    icon: BarChart3,
    feature: 'SAW ranking calculation',
    basic: 'Standard',
    premium: 'Full analysis',
  },
  {
    icon: RefreshCw,
    feature: 'What-If simulation',
    basic: '–',
    premium: 'Included',
  },
  {
    icon: History,
    feature: 'Decision history',
    basic: '30 days',
    premium: 'Lifetime',
  },
  {
    icon: TrendingUp,
    feature: 'Personal decision insights',
    basic: '–',
    premium: 'Included',
  },
  {
    icon: Headset,
    feature: 'Priority customer support',
    basic: 'Standard',
    premium: 'Priority 24/7',
  },
]

const faqs = [
  {
    q: 'Can I use MyChoice for free?',
    a: 'Yes! MyChoice offers a Free Forever plan (Basic) with essential decision-making tools. You can upgrade to Premium anytime for advanced features.',
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
    a: 'Premium includes unlimited decisions, up to 10 alternatives per decision, advanced AI models, What-If simulation, lifetime decision history, personal insights, and priority 24/7 support.',
  },
]

function PlanValue({ value, premium = false }: { value: string; premium?: boolean }) {
  if (value === '–') {
    return <span className="text-[11px] text-muted/50">–</span>
  }

  if (value.startsWith('Yes')) {
    return (
      <span className={cn('flex items-center justify-center gap-1 text-[11px]', premium && 'font-medium text-primary')}>
        <Check className={cn('h-3 w-3', premium ? 'text-primary' : 'text-[#16a34a]')} />
        {value}
      </span>
    )
  }

  if (value === 'Included') {
    return (
      <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-primary">
        <CircleCheck className="h-3 w-3" />
        Included
      </span>
    )
  }

  return (
    <span className={cn('text-[11px]', premium ? 'font-medium text-primary' : 'text-ink')}>{value}</span>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fbf8ff]"
      >
        <span className="text-[11.5px] font-medium text-ink">{question}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted transition-transform',
            open && 'rotate-180 text-primary'
          )}
        />
      </button>
      {open && (
        <div className="border-t border-line px-5 py-3.5">
          <p className="text-[11px] leading-[1.8] text-muted">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#f6f0fe] via-[#faf6ff] to-white pb-14 pt-6 md:pb-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted/40" />
            <span className="font-medium text-primary">Pricing</span>
          </nav>

          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
              <CircleCheck className="h-3 w-3" />
              Simple and Flexible Plans
            </span>
            <h1 className="mx-auto mt-5 max-w-[620px] text-[32px] font-extrabold leading-[1.13] tracking-[-0.035em] text-ink md:text-[42px]">
              Choose the Plan That Fits Your Needs.
            </h1>
            <p className="mx-auto mt-4 max-w-[520px] text-[12px] leading-[1.8] text-muted md:text-[12.5px]">
              Start with the essential decision-making tools and upgrade whenever you need more
              flexibility. Lucid, objective clarity at every step.
            </p>

            {/* Billing toggle */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-[0_10px_30px_-24px_rgba(76,29,149,0.55)]">
                <button
                  type="button"
                  onClick={() => setBilling('monthly')}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[10.5px] font-medium transition-colors',
                    billing === 'monthly'
                      ? 'bg-[#f1e7ff] text-ink'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('annual')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10.5px] font-medium transition-colors',
                    billing === 'annual'
                      ? 'bg-[#f1e7ff] text-ink'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  Annual Billing
                  <span className="rounded-full bg-[#dcfce7] px-1.5 py-0.5 text-[8px] font-bold text-[#15803d]">
                    SAVE 25%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plan cards */}
          <div className="mx-auto mt-10 grid max-w-[940px] items-start gap-5 md:grid-cols-2">
            {/* Basic */}
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_-50px_rgba(76,29,149,0.5)]">
              <div className="flex items-start justify-between">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                  Starter Tier
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f6f0fe] text-primary">
                  <Rocket className="h-3.5 w-3.5" />
                </span>
              </div>

              <h2 className="mt-2.5 text-[19px] font-bold text-ink">Basic</h2>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[30px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                  Free
                </span>
                <span className="text-[10px] text-muted">$0 / forever</span>
              </div>
              <p className="mt-3 text-[10.5px] leading-[1.75] text-muted">
                Essential tools to help you make better decisions with structured rationality.
              </p>

              <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                Included in Basic:
              </p>
              <ul className="mt-2.5 flex-1 space-y-2.5">
                {basicFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[10.5px] text-ink">
                    <CircleCheck className="mt-[1px] h-3 w-3 shrink-0 text-[#16a34a]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/explore"
                className="mt-6 block rounded-xl bg-[#f1e7ff] py-2.5 text-center text-[11px] font-semibold text-primary transition-colors hover:bg-[#e6d8f9]"
              >
                Get Started for Free
              </Link>
            </div>

            {/* Premium */}
            <div className="relative flex h-full flex-col rounded-2xl border-2 border-[#c4a9f7] bg-white p-6 shadow-[0_30px_70px_-50px_rgba(76,29,149,0.75)]">
              <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">
                <Sparkles className="h-2.5 w-2.5" />
                Recommended
              </span>

              <div className="flex items-start justify-between">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                  Pro Level
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f6f0fe] text-primary">
                  <Crown className="h-3.5 w-3.5" />
                </span>
              </div>

              <h2 className="mt-2.5 text-[19px] font-bold text-ink">
                Premium <span className="text-primary">•</span>
              </h2>
              <p className="mt-0.5 text-[27px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                Subscription
              </p>
              <p className="mt-2 text-[9px] font-medium text-primary">
                Flexible monthly &amp; annual plans · Coming Soon
              </p>
              <p className="mt-2 text-[10.5px] leading-[1.75] text-muted">
                More flexibility and deeper insights for your multi-criteria decision-making
                journey.
              </p>

              <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                Everything in Basic, plus:
              </p>
              <ul className="mt-2.5 flex-1 space-y-2.5">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[10.5px] text-ink">
                    <CircleCheck className="mt-[1px] h-3 w-3 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/faq"
                className="mt-6 block rounded-xl bg-primary py-2.5 text-center text-[11px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(124,58,237,0.9)] transition-colors hover:bg-primary-deep"
              >
                Explore Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────────────────── */}
      <section className="py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Side by Side
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Detailed Plan Comparison
            </h2>
            <p className="mx-auto mt-2.5 max-w-[520px] text-[10.5px] leading-[1.8] text-muted">
              A comprehensive breakdown of analytical capabilities, limits, and intelligence
              modules.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-[#faf7ff]">
                  <th className="px-5 py-3.5 text-[10px] font-bold text-ink">
                    Features &amp; Capabilities
                  </th>
                  <th className="px-5 py-3.5 text-center">
                    <span className="block text-[10px] font-bold text-ink">Basic</span>
                    <span className="mt-0.5 block text-[8.5px] font-normal text-muted">
                      Free Forever
                    </span>
                  </th>
                  <th className="bg-[#f3ecfe] px-5 py-3.5 text-center">
                    <span className="block text-[10px] font-bold text-primary">Premium</span>
                    <span className="mt-0.5 block text-[8.5px] font-normal text-muted">
                      Subscription
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 text-[10.5px] text-muted">
                        <row.icon className="h-3 w-3 shrink-0 text-muted/60" />
                        {row.feature}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <PlanValue value={row.basic} />
                    </td>
                    <td className="bg-[#fbf8ff] px-5 py-3 text-center">
                      <PlanValue value={row.premium} premium />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="bg-[#faf7ff] py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Answers &amp; Clarity
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2.5 max-w-[480px] text-[10.5px] leading-[1.8] text-muted">
              Everything you need to know about our plans, quotas, and premium features.
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-[640px] space-y-2.5">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-6 py-9 md:px-9 md:py-11">
            <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <Sparkles className="h-2.5 w-2.5" />
                  Your Assistant Choby is Ready
                </span>
                <h2 className="mt-3 max-w-[460px] text-[26px] font-extrabold leading-[1.16] tracking-[-0.03em] text-white md:text-[33px]">
                  Start Making Better Decisions Today.
                </h2>
                <p className="mt-2.5 max-w-[440px] text-[11px] leading-[1.8] text-white/80">
                  Eliminate cognitive overload and trade-off anxiety. Create your first decision
                  matrix with AI assistance in less than two minutes.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[10.5px] font-bold text-primary transition-colors hover:bg-white/90"
                  >
                    Get Started for Free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="flex items-center gap-1.5 text-[9px] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    No credit card required
                  </span>
                </div>
              </div>

              <div className="flex justify-start md:justify-end">
                <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 md:h-[124px] md:w-[124px]">
                  <img
                    src={chobbyMascot}
                    alt="Chobby mascot"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
