import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  LayoutGrid,
  Minus,
  SlidersHorizontal,
  Sparkles,
  Target,
  Info,
  Keyboard,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'

/* ─── Methodology cards ──────────────────────────────────────── */
const steps = [
  {
    number: '01',
    label: 'Step 01 · Intent',
    icon: Compass,
    title: 'Define What You Need to Decide',
    desc: 'Name your dilemma and assign a category to anchor relevant criteria and benchmarks immediately.',
    preview: (
      <>
        <span className="inline-flex rounded-md bg-[#f1e7ff] px-2 py-0.5 text-[8.5px] font-semibold text-primary">
          Technology
        </span>
        <p className="mt-1.5 text-[10.5px] font-medium text-ink">
          “Choose a programming laptop”
        </p>
      </>
    ),
  },
  {
    number: '02',
    label: 'Step 02 · AI Criteria',
    icon: Sparkles,
    title: 'Let AI Help You Identify What Matters',
    desc: 'Chobby scans your category and generates essential criteria. You retain full control to add, edit, or prune.',
    preview: (
      <div className="space-y-1.5">
        {[
          { name: 'Price & Value', keep: true },
          { name: 'RAM & Multitasking', keep: true },
          { name: 'Display Quality', keep: false },
        ].map((row) => (
          <div key={row.name} className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-ink">{row.name}</span>
            {row.keep ? (
              <CheckCircle2 className="h-3 w-3 text-[#16a34a]" />
            ) : (
              <Minus className="h-3 w-3 text-muted/40" />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    label: 'Step 03 · Weights',
    icon: SlidersHorizontal,
    title: 'Give Each Criterion Its Importance',
    desc: 'Adjust responsive weight sliders with real-time recalculation, safeguarded by 100% total weight validation.',
    preview: (
      <>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-ink">Price Priority</span>
          <span className="font-semibold text-ink">30%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#efe7f8]">
          <div className="h-1.5 w-[30%] rounded-full bg-[#6d28d9]" />
        </div>
        <p className="mt-2 flex items-center gap-1 text-[8.5px] text-muted">
          <CheckCircle2 className="h-2.5 w-2.5 text-[#16a34a]" />
          Total Allocation: 100%
        </p>
      </>
    ),
  },
  {
    number: '04',
    label: 'Step 04 · Candidates',
    icon: LayoutGrid,
    title: 'Bring Your Options Together',
    desc: 'Input candidate alternatives with accurate attribute values (supports up to 3 options on Free, 10 on Premium).',
    preview: (
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {[
          { name: 'MacBook', price: '$1,099' },
          { name: 'Dell XPS', price: '$1,299' },
          { name: 'ThinkPad', price: '$1,450' },
        ].map((item) => (
          <div key={item.name} className="rounded-lg bg-[#f1e7ff] px-1 py-1.5">
            <p className="text-[8.5px] font-semibold text-ink">{item.name}</p>
            <p className="text-[8px] text-muted">{item.price}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '05',
    label: 'Step 05 · Calculation',
    icon: Calculator,
    title: 'See How Your Options Compare',
    desc: 'Our Simple Additive Weighting (SAW) algorithm normalizes scores for rigorous mathematical comparison.',
    preview: (
      <>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-ink">Rank #1: MacBook M3</span>
          <span className="text-[10px] font-semibold text-primary">91.4 pts</span>
        </div>
        <p className="mt-1.5 text-[8.5px] leading-[1.6] text-muted">
          Normalized cost-benefit matrix validates highest return on speed &amp; longevity.
        </p>
      </>
    ),
  },
  {
    number: '06',
    label: 'Step 06 · Synthesis',
    icon: Target,
    title: 'Understand Your Results Before Deciding',
    desc: 'Audit trade-offs, run sensitivity simulations, and review the plain-language executive rationale.',
    preview: (
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: 'View Comparison', icon: Eye },
          { label: 'What-If Simulation', icon: SlidersHorizontal },
          { label: 'View Analysis', icon: BarChart3 },
        ].map((chip) => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1 rounded-md bg-[#f1e7ff] px-1.5 py-1 text-[8px] font-medium text-primary"
          >
            <chip.icon className="h-2.5 w-2.5" />
            {chip.label}
          </span>
        ))}
      </div>
    ),
  },
]

/* ─── Walkthrough stages ─────────────────────────────────────── */
type Stage = {
  tab: string
  stage: string
  title: string
  body: ReactNode
  metaLabel: string
  metaValue: string
  quoteLabel: string
  quote: string
}

const stages: Stage[] = [
  {
    tab: '1. Category',
    stage: 'Stage 01 · Selection',
    title: 'Domain Context Selected',
    body: (
      <>
        The user picks <span className="font-semibold text-ink">Technology &amp; Hardware</span> and
        enters the intent:{' '}
        <span className="italic">
          “Selecting primary machine for full-stack engineering and local containers.”
        </span>
      </>
    ),
    metaLabel: 'Category',
    metaValue: 'Consumer Tech & Hardware',
    quoteLabel: 'Prompt Statement',
    quote: '“Choose a programming laptop for backend work with 32GB target RAM.”',
  },
  {
    tab: '2. AI Criteria',
    stage: 'Stage 02 · Criteria',
    title: 'Suggested Criteria Confirmed',
    body: (
      <>
        Chobby proposes six dimensions for the category. The user keeps{' '}
        <span className="font-semibold text-ink">Price &amp; Value</span>,{' '}
        <span className="font-semibold text-ink">Performance</span>, and{' '}
        <span className="font-semibold text-ink">RAM</span>, then prunes Display Quality.
      </>
    ),
    metaLabel: 'Criteria Set',
    metaValue: '4 retained · 1 pruned',
    quoteLabel: 'User Note',
    quote: '“Battery endurance must stay above 12 hours.”',
  },
  {
    tab: '3. Weights',
    stage: 'Stage 03 · Weighting',
    title: 'Priorities Normalized',
    body: (
      <>
        Sliders are dragged to 30 / 25 / 25 / 20. The allocation bar re-validates to a strict{' '}
        <span className="font-semibold text-ink">100% total</span> before calculation can run.
      </>
    ),
    metaLabel: 'Allocation',
    metaValue: 'Price 30% · Perf 25% · RAM 25% · Battery 20%',
    quoteLabel: 'Validation',
    quote: '“Total weight validated — no criterion left unallocated.”',
  },
  {
    tab: '4. Options',
    stage: 'Stage 04 · Candidates',
    title: 'Candidates Entered',
    body: (
      <>
        Three machines are entered with verified price, CPU, and memory values so every alternative
        is judged on the same normalized scale.
      </>
    ),
    metaLabel: 'Candidates',
    metaValue: 'MacBook Air M3 · ThinkPad T14s · Dell XPS 13 Plus',
    quoteLabel: 'Data Check',
    quote: '“All attribute values verified against official spec sheets.”',
  },
  {
    tab: '5. SAW Math',
    stage: 'Stage 05 · Calculation',
    title: 'Weighted Scores Computed',
    body: (
      <>
        Cost criteria are inverted, benefit criteria are normalized, and each weighted value is
        summed into a single preference score for every candidate.
      </>
    ),
    metaLabel: 'Normalization',
    metaValue: 'Cost inverted · Benefit scaled 0–1',
    quoteLabel: 'Top Score',
    quote: '“MacBook Air M3 → 0.30(0.88) + 0.25(0.96) + 0.25(0.80) + 0.20(0.98) = 92.4”',
  },
  {
    tab: '6. Ranked',
    stage: 'Stage 06 · Synthesis',
    title: 'Final Ranking Ready',
    body: (
      <>
        The highest weighted score is surfaced with a plain-language rationale, so the final call is
        informed rather than guessed.
      </>
    ),
    metaLabel: 'Rank #1',
    metaValue: 'MacBook Air M3 · 92.4 pts',
    quoteLabel: 'Rationale',
    quote: '“Best balance of compute headroom and battery endurance for your budget.”',
  },
]

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]

  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[#f9f5ff] pb-16 pt-8 md:pb-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted/40" />
            <span className="font-medium text-primary">How It Works</span>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e7ff] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3 w-3" />
                How It Works
              </span>
              <h1 className="mt-5 max-w-[520px] text-[34px] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink md:text-[46px]">
                From Confusion to Confidence in Every Decision.
              </h1>
              <p className="mt-4 max-w-[460px] text-[12.5px] leading-[1.8] text-muted md:text-[13px]">
                Making decisions doesn't have to be complicated. Follow a simple process to compare
                alternatives and understand which option best matches your priorities.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[11.5px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(124,58,237,0.85)] transition-colors hover:bg-primary-deep"
                >
                  Start Your First Decision
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="#walkthrough"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#efe6fb] px-4 py-2.5 text-[11.5px] font-semibold text-primary transition-colors hover:bg-[#e6d8f9]"
                >
                  <Keyboard className="h-3.5 w-3.5" />
                  See Interactive Example
                </a>
              </div>
            </div>

            {/* Mascot visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative flex h-[280px] w-[280px] items-center justify-center md:h-[320px] md:w-[320px]">
                <div className="absolute inset-0 rounded-full bg-[#f1e7ff]" />
                <div className="absolute inset-[18px] rounded-full bg-[#e9dcff]" />
                <img
                  src={chobbyMascot}
                  alt="Chobby mascot"
                  className="relative h-[236px] w-[236px] rounded-full object-cover md:h-[270px] md:w-[270px]"
                />
              </div>

              <div className="absolute -right-1 top-2 rounded-xl border border-line bg-white px-3 py-2 shadow-[0_18px_40px_-28px_rgba(76,29,149,0.55)] md:right-2">
                <p className="flex items-center gap-1 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                  <CheckCircle2 className="h-2.5 w-2.5 text-[#16a34a]" />
                  Top Match
                </p>
                <p className="mt-0.5 text-[15px] font-extrabold leading-none text-primary">94.6%</p>
                <p className="mt-0.5 text-[8px] text-muted">MacBook Pro 14</p>
              </div>

              <div className="absolute -left-1 bottom-2 rounded-xl border border-line bg-white px-3 py-2 shadow-[0_18px_40px_-28px_rgba(76,29,149,0.55)] md:left-2">
                <p className="flex items-center gap-1.5 text-[8.5px] font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                  Live Weighting
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-ink">SAW Model Sync</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Methodology ────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-primary">
              The Methodology
            </p>
            <h2 className="mt-2.5 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Simple Steps to Unbiased Clarity
            </h2>
            <p className="mx-auto mt-2.5 max-w-[540px] text-[12px] leading-[1.8] text-muted">
              Six structured checkpoints engineered to turn subjective hesitation into objective
              evaluation.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_20px_50px_-45px_rgba(76,29,149,0.55)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[15px] font-bold leading-none text-ink">{step.number}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f6f0fe] text-primary">
                    <step.icon className="h-3.5 w-3.5" />
                  </span>
                </div>

                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                  {step.label}
                </p>
                <h3 className="mt-1.5 text-[13.5px] font-bold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1.5 flex-1 text-[11px] leading-[1.75] text-muted">{step.desc}</p>

                <div className="mt-4 rounded-xl border border-line/70 bg-[#faf7ff] p-3">
                  {step.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Realistic walkthrough ──────────────────────────────── */}
      <section id="walkthrough" className="scroll-mt-24 bg-[#fbf8ff] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="rounded-3xl border border-line bg-[#f9f5ff] p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 px-1">
              <div>
                <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  Realistic Walkthrough
                </p>
                <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em] text-ink md:text-[24px]">
                  Choosing the Best Laptop for Programming
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[8.5px] font-medium text-muted">
                <Info className="h-2.5 w-2.5 text-primary" />
                Illustrative Example
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-5 flex flex-wrap gap-1 rounded-full border border-line bg-[#f3ecfe] p-1">
              {stages.map((item, index) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => setActiveStage(index)}
                  className={cn(
                    'flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors',
                    activeStage === index
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  {item.tab}
                </button>
              ))}
            </div>

            {/* Stage panel */}
            <div className="mt-4 grid gap-5 rounded-2xl bg-[#f3ecfe] p-5 md:grid-cols-[1fr_0.95fr] md:p-6">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                  {stage.stage}
                </p>
                <h3 className="mt-2 text-[17px] font-bold tracking-[-0.01em] text-ink md:text-[19px]">
                  {stage.title}
                </h3>
                <p className="mt-2.5 max-w-[420px] text-[11px] leading-[1.85] text-muted">
                  {stage.body}
                </p>
              </div>

              <div className="rounded-xl border border-line bg-white p-4">
                <p className="text-[8.5px] font-semibold text-muted">{stage.metaLabel}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                  <LayoutGrid className="h-3 w-3 text-primary" />
                  {stage.metaValue}
                </p>

                <p className="mt-4 text-[8.5px] font-semibold text-muted">{stage.quoteLabel}</p>
                <div className="mt-1 rounded-lg bg-[#faf7ff] px-2.5 py-2">
                  <p className="text-[10px] leading-[1.7] text-ink">{stage.quote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-6 py-10 md:px-10 md:py-12">
            <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Free · No Credit Card Required
                </span>
                <h2 className="mt-3 max-w-[420px] text-[26px] font-extrabold leading-[1.18] tracking-[-0.03em] text-white md:text-[34px]">
                  Your Next Decision Starts Here.
                </h2>
                <p className="mt-2.5 max-w-[420px] text-[11.5px] leading-[1.8] text-white/80">
                  Stop cycling through second thoughts. Map out your priorities in under 3 minutes
                  and discover clarity with Chobby by your side.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[11px] font-bold text-primary transition-colors hover:bg-white/90"
                >
                  Try MyChoice Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex justify-start md:justify-end">
                <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-white ring-4 ring-white/20 md:h-[124px] md:w-[124px]">
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
