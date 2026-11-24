import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  History,
  Info,
  Laptop,
  LayoutGrid,
  List,
  RefreshCw,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import { SignupCta } from '@/components/cta/SignupCta'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/metrics'

const criteria = [
  { label: 'Price', weight: '35%', bar: 100 },
  { label: 'Performance', weight: '30%', bar: 86 },
  { label: 'RAM (16GB+)', weight: '20%', bar: 58 },
  { label: 'Battery Life', weight: '15%', bar: 44 },
]

const ranking = [
  {
    rank: '#1',
    name: 'MacBook Air M3 16GB',
    sub: 'Top benchmark per dollar & 18h battery',
    score: '92.4',
    best: true,
  },
  {
    rank: '#2',
    name: 'ThinkPad T14s Gen 4',
    sub: 'Exceptional keyboard, 14h battery',
    score: '84.1',
  },
  {
    rank: '#3',
    name: 'Dell XPS 13 Plus',
    sub: 'Vibrant display, slightly higher cost',
    score: '79.8',
  },
]

const problems = [
  {
    icon: List,
    title: 'Too Many Choices',
    desc: 'Comparing multiple alternatives can make it difficult to identify the option that truly fits your needs, resulting in analysis paralysis.',
    tag: 'Option saturation',
    tagIcon: List,
  },
  {
    icon: Scale,
    title: 'Unclear Priorities',
    desc: "Not every factor matters equally, but determining which criteria deserve more importance isn't always easy without objective weighting.",
    tag: 'Subjective trade-offs',
    tagIcon: ArrowUpRight,
  },
  {
    icon: Clock,
    title: 'Time-Consuming Research',
    desc: 'Collecting information from different sources and comparing alternatives manually takes immense time, effort, and spreadsheet juggling.',
    tag: 'Fragmented data',
    tagIcon: LayoutGrid,
  },
]

const suggestedCriteria = [
  { label: '1. Price ($800 – $1,400)', weight: 35, bar: 100 },
  { label: '2. Processor Performance (Geekbench)', weight: 30, bar: 86 },
  { label: '3. RAM Capacity (16GB min)', weight: 20, bar: 58 },
  { label: '4. Storage & Battery Life (512GB / 12h+)', weight: 15, bar: 44 },
]

const assistantTiles = [
  {
    icon: Brain,
    title: 'AI-Assisted Criteria',
    desc: 'Get relevant criteria suggestions based on your decision category and personal needs.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Personalized Priorities',
    desc: 'Adjust the importance of each criterion according to your personal preferences.',
  },
  {
    icon: BarChart3,
    title: 'Structured Comparison',
    desc: 'Evaluate alternatives through a systematic and weighted decision-making process.',
  },
  {
    icon: ArrowUpRight,
    title: 'Explainable Results',
    desc: 'Understand your rankings through clear comparisons and AI-assisted explanations.',
  },
]

const features = [
  {
    icon: Sparkles,
    title: 'AI Criteria Suggestions',
    desc: 'Get AI-assisted criteria recommendations based on your decision category and personal needs.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Weighted Criteria',
    desc: 'Assign importance levels to each criterion based on your personal priorities, with a total weight of 100%.',
  },
  {
    icon: ArrowUpDown,
    title: 'Alternative Comparison',
    desc: 'Compare multiple alternatives side by side using structured criteria and evaluation results.',
  },
  {
    icon: BarChart3,
    title: 'Smart Decision Ranking',
    desc: 'Discover ranked alternatives calculated using the Simple Additive Weighting (SAW) method.',
  },
  {
    icon: RefreshCw,
    title: 'What-If Simulation',
    desc: 'Experiment with different criteria weights and explore how your decision ranking changes dynamically.',
  },
  {
    icon: History,
    title: 'Decision History',
    desc: 'Review previous decisions and revisit your saved decision results with full rationale intact.',
  },
]

type OptionRow = { k: string; v: string; highlight?: boolean }

type Option = {
  name: string
  sub: string
  score: string
  rows: OptionRow[]
  note: string
  best: boolean
  focus?: string
}

const options: Option[] = [
  {
    name: 'MacBook Air M3',
    sub: 'Apple Silicon 16GB',
    score: '92.4',
    rows: [
      { k: 'Price', v: '$1,199' },
      { k: 'Performance', v: '9.6 / 10' },
      { k: 'RAM Capacity', v: '16 GB Unified' },
      { k: 'Battery Life', v: '18 Hours' },
    ],
    note: 'Optimal trade-off for speed & battery',
    best: true,
  },
  {
    name: 'ThinkPad T14s',
    sub: 'Intel Core i7 16GB',
    score: '84.1',
    rows: [
      { k: 'Price', v: '$999 (Lowest)', highlight: true },
      { k: 'Performance', v: '8.8 / 10' },
      { k: 'RAM Capacity', v: '16 GB DDR5' },
      { k: 'Battery Life', v: '14 Hours' },
    ],
    note: 'Great price, slightly lower battery',
    best: false,
    focus: 'Value Focus',
  },
  {
    name: 'Dell XPS 13 Plus',
    sub: 'Intel Core i7 OLED',
    score: '79.8',
    rows: [
      { k: 'Price', v: '$1,349' },
      { k: 'Performance', v: '9.1 / 10' },
      { k: 'RAM Capacity', v: '16 GB LPDDR5' },
      { k: 'Battery Life', v: '11 Hours' },
    ],
    note: 'Highest display score, higher cost',
    best: false,
    focus: 'Design Focus',
  },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-canvas text-ink antialiased">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-14 md:px-8 md:pb-24 md:pt-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#efe4ff] opacity-70 blur-[110px]" />
        <div className="pointer-events-none absolute -left-32 top-24 h-[360px] w-[360px] rounded-full bg-[#f1e8ff] opacity-60 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-[1180px] items-start gap-14 lg:grid-cols-[1fr_1.02fr] lg:gap-10">
          {/* Left copy */}
          <div className="max-w-[440px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-primary">
              <Sparkles className="h-3 w-3" />
              AI-Powered Decision Support
            </span>

            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[50px] lg:text-[56px]">
              <span className="block">Make</span>
              <span className="block text-primary">Better Decisions,</span>
              <span className="block">With Confidence.</span>
            </h1>

            <p className="mt-6 max-w-[400px] text-[15px] leading-[1.75] text-muted">
              Stop overthinking your options. MyChoice helps you compare alternatives, prioritize
              what matters, and find the right choice based on your personal needs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  void trackEvent('hero_try_click', { label: 'Try MyChoice' })
                  navigate('/dashboard')
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-deep"
              >
                Try MyChoice
                <span aria-hidden="true">→</span>
              </button>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-primary-soft/40"
              >
                Explore Features
              </Link>
            </div>

            <p className="mt-7 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
              <CheckCircle2 className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#16a34a]" />
              Designed to make your decision-making process simpler and more structured.
            </p>
          </div>

          {/* Right: comparison preview */}
          <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="rounded-[22px] border border-line bg-white p-5 shadow-[0_24px_60px_-32px_rgba(76,29,149,0.35)]">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[9px] font-semibold text-primary">
                  Technology
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f9ee] px-2.5 py-1 text-[9px] font-semibold text-[#16a34a]">
                  <Check className="h-2.5 w-2.5" />
                  SAW Evaluated
                </span>
              </div>

              <h2 className="mt-3 text-[18px] font-bold leading-snug tracking-[-0.01em] text-ink">
                Choose Your Programming Laptop
              </h2>

              <p className="mt-4 text-[8.5px] font-bold uppercase tracking-[0.14em] text-muted/80">
                Criteria &amp; Importance Weights
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {criteria.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg border border-[#f1eafc] bg-[#fbf8fe] px-2 py-1.5"
                  >
                    <p className="truncate text-[8.5px] text-muted">{c.label}</p>
                    <p className="mt-1 text-[11px] font-bold text-ink">{c.weight}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[8.5px] font-bold uppercase tracking-[0.14em] text-muted/80">
                Ranking Analysis (SAW Score)
              </p>
              <div className="mt-2 space-y-2">
                {ranking.map((item) => (
                  <div
                    key={item.rank}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border px-2.5 py-2',
                      item.best ? 'border-primary-tint bg-[#faf6ff]' : 'border-line bg-white'
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[9px] font-bold text-primary">
                      {item.rank}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-primary">
                      <Laptop className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[11.5px] font-bold text-ink">{item.name}</p>
                        {item.best && (
                          <span className="shrink-0 rounded bg-primary-soft px-1.5 py-[1px] text-[7.5px] font-bold text-primary">
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[8.5px] text-muted">{item.sub}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 pl-1">
                      <div className="text-right leading-none">
                        <span className="text-[17px] font-bold text-ink">{item.score}</span>
                        <span className="ml-0.5 text-[8px] text-muted/70">/ 100</span>
                      </div>
                      {item.best && (
                        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#16a34a] text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#f4eefb] pt-3">
                <span className="flex items-center gap-1.5 text-[9px] text-muted">
                  <Sparkles className="h-3 w-3 text-primary" />
                  AI Trade-off explanation ready
                </span>
                <button className="flex items-center gap-1 text-[9px] font-bold text-primary hover:text-primary-deep">
                  Simulate Weights
                  <span aria-hidden="true">↳</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cognitive overload ───────────────────────────────── */}
      <section className="px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-[660px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Cognitive Overload
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-ink md:text-[32px]">
              Choosing Isn't Always Easy.
            </h2>
            <p className="mx-auto mt-3 max-w-[540px] text-[13.5px] leading-relaxed text-muted">
              With so many options available, making the right decision can become overwhelming.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(60,20,120,0.03)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-5 text-[18px] font-bold leading-snug tracking-[-0.015em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[12.5px] leading-[1.75] text-muted">{p.desc}</p>
                <div className="mt-8 flex items-center gap-1.5 text-[9.5px] font-semibold text-primary/80">
                  <span>{p.tag}</span>
                  <p.tagIcon className="h-2.5 w-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ─────────────────────────────────────────── */}
      <section className="px-6 pb-20 md:px-8 md:pb-24">
        <div className="mx-auto grid w-full max-w-[1180px] items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          {/* Setup mock */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_18px_45px_-30px_rgba(76,29,149,0.4)] md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-muted/80">
                  Step 01 / Setup
                </p>
                <h3 className="mt-1 text-[19px] font-bold tracking-[-0.02em] text-ink">
                  Create Your Decision
                </h3>
              </div>
              <span className="mt-2 shrink-0 rounded-full bg-[#faf7fe] px-2.5 py-1 text-[9px] font-medium text-muted">
                Technology Category
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-[#fbf9fd] px-3 py-2.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted/70" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted/70">
                  Decision Scope
                </p>
                <p className="mt-0.5 text-[11.5px] font-medium text-ink">
                  "Find the best laptop for programming"
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Suggested Criteria
              </span>
              <span className="rounded-full bg-primary-soft px-2 py-1 text-[8.5px] font-semibold text-primary">
                Auto-Calibrated
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {suggestedCriteria.map((c) => (
                <div key={c.label} className="rounded-lg border border-[#f1eafc] bg-white px-3 py-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10.5px] font-medium text-ink">{c.label}</span>
                    <span className="shrink-0 text-[9px] font-semibold text-muted">
                      Weight: <span className="text-primary">{c.weight}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[#f1eafc]">
                    <div
                      className="h-[3px] rounded-full bg-primary"
                      style={{ width: `${c.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#d9f0e2] bg-[#f2fbf5] px-3 py-2">
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#15803d]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Total Weight: 100% Validated
              </span>
              <span className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-[9px] font-semibold text-ink">
                SAW Ready
              </span>
            </div>
          </div>

          {/* Copy + tiles */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              The MyChoice Solution
            </p>
            <h2 className="mt-3 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink md:text-[36px]">
              Your Personal Decision Assistant.
            </h2>
            <p className="mt-4 max-w-[440px] text-[13px] leading-[1.75] text-muted">
              MyChoice combines AI-assisted suggestions with structured decision analysis, helping
              you evaluate alternatives based on what matters most to you.
            </p>

            <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {assistantTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="rounded-xl border border-[#f2ecfb] bg-[#faf7fe] p-4"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-[0_1px_2px_rgba(60,20,120,0.06)]">
                    <tile.icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="mt-3 text-[13px] font-bold text-ink">{tile.title}</h3>
                  <p className="mt-1.5 text-[10.5px] leading-[1.7] text-muted">{tile.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────────────── */}
      <section className="border-y border-[#f2ebfb] bg-gradient-to-b from-white to-[#f7f2fc] px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-[660px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Step-by-Step Guidance
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-ink md:text-[32px]">
              Simple Steps to Your Best Choice.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[13px] leading-relaxed text-muted">
              From defining your needs to understanding your results, MyChoice makes every step
              easier.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* 01 */}
            <div className="flex flex-col rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-soft text-[10.5px] font-bold text-primary">
                  01
                </span>
                <Compass className="h-4 w-4 text-muted/40" />
              </div>
              <h3 className="mt-4 text-[14px] font-bold text-ink">Create Your Decision</h3>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-muted">
                Choose a category and describe what you need to decide.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-1.5">
                <span className="rounded-md bg-primary px-2 py-1.5 text-center text-[9.5px] font-semibold text-white">
                  Laptop
                </span>
                <span className="rounded-md bg-[#faf7fe] px-2 py-1.5 text-center text-[9.5px] font-medium text-muted ring-1 ring-line">
                  Internship
                </span>
                <span className="rounded-md bg-[#faf7fe] px-2 py-1.5 text-center text-[9.5px] font-medium text-muted ring-1 ring-line">
                  Course
                </span>
                <span className="rounded-md bg-[#faf7fe] px-2 py-1.5 text-center text-[9.5px] font-medium text-muted ring-1 ring-line">
                  Phone
                </span>
              </div>
            </div>

            {/* 02 */}
            <div className="flex flex-col rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-soft text-[10.5px] font-bold text-primary">
                  02
                </span>
                <SlidersHorizontal className="h-4 w-4 text-muted/40" />
              </div>
              <h3 className="mt-4 text-[14px] font-bold text-ink">Set Your Criteria</h3>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-muted">
                Review AI-generated criteria suggestions and customize your priorities.
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-medium text-muted">Importance Weight</span>
                  <span className="text-[8.5px] font-bold text-primary">100% Total</span>
                </div>
                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[#f1eafc]">
                  <div className="h-[3px] w-full rounded-full bg-primary" />
                </div>
                <p className="mt-1.5 text-[8px] text-muted/70">
                  Price (35%) · Perf (30%) · Battery (35%)
                </p>
              </div>
            </div>

            {/* 03 */}
            <div className="flex flex-col rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-soft text-[10.5px] font-bold text-primary">
                  03
                </span>
                <LayoutGrid className="h-4 w-4 text-muted/40" />
              </div>
              <h3 className="mt-4 text-[14px] font-bold text-ink">Compare Alternatives</h3>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-muted">
                Add your options and evaluate them using your selected criteria.
              </p>
              <table className="mt-4 w-full text-left">
                <thead>
                  <tr className="text-[8px] uppercase tracking-wide text-muted/60">
                    <th className="pb-1 font-medium">Option</th>
                    <th className="pb-1 font-medium">Spec</th>
                    <th className="pb-1 text-right font-medium">Val</th>
                  </tr>
                </thead>
                <tbody className="text-[9.5px] text-ink">
                  <tr>
                    <td className="py-[3px] font-medium">MacBook</td>
                    <td className="py-[3px] text-muted">M3</td>
                    <td className="py-[3px] text-right font-semibold text-primary">$1.1k</td>
                  </tr>
                  <tr>
                    <td className="py-[3px] font-medium">ThinkPad</td>
                    <td className="py-[3px] text-muted">i7</td>
                    <td className="py-[3px] text-right font-semibold text-ink">$999</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 04 */}
            <div className="flex flex-col rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-soft text-[10.5px] font-bold text-primary">
                  04
                </span>
                <Trophy className="h-4 w-4 text-muted/40" />
              </div>
              <h3 className="mt-4 text-[14px] font-bold text-ink">Get Your Best Match</h3>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-muted">
                Explore ranked results, understand the analysis, and make your final choice.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#faf7fe] px-2.5 py-2 ring-1 ring-line">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                  1
                </span>
                <span className="text-[10px] font-semibold text-ink">MacBook Air</span>
                <span className="ml-auto text-[10px] font-bold text-primary">92.4</span>
                <Check className="h-3 w-3 shrink-0 text-[#16a34a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-[660px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Powerful Features
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-ink md:text-[32px]">
              Everything You Need to Decide Smarter.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[13px] leading-relaxed text-muted">
              Explore the tools that make your decision-making process more organized, personalized,
              and insightful.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-[14px] font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[11px] leading-[1.75] text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive interface ────────────────────────────── */}
      <section className="bg-canvas px-6 py-20 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-[660px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Interactive Interface
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.025em] text-ink md:text-[32px]">
              See MyChoice in Action.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[13px] leading-relaxed text-muted">
              An intuitive interface designed to make complex decisions easier to understand.
            </p>
          </div>

          <div className="mt-9 rounded-2xl border border-line bg-white p-4 shadow-[0_20px_60px_-40px_rgba(76,29,149,0.45)] md:p-5">
            <div className="flex flex-col gap-3 border-b border-[#f3edfb] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#f87171]" />
                  <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                  <span className="h-2 w-2 rounded-full bg-[#34d399]" />
                </div>
                <div>
                  <p className="text-[11.5px] font-bold text-ink">
                    Decision: Choose Your Programming Laptop
                  </p>
                  <p className="mt-0.5 text-[8.5px] text-muted/70">
                    SAW Calculation Complete • 3 Alternatives Analyzed
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button className="rounded-md border border-line bg-white px-2.5 py-1.5 text-[9px] font-medium text-muted transition-colors hover:bg-[#faf7fe]">
                  View Comparison
                </button>
                <button className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1.5 text-[9px] font-medium text-muted transition-colors hover:bg-[#faf7fe]">
                  <SlidersHorizontal className="h-2.5 w-2.5" />
                  What-If Simulation
                </button>
                <button className="rounded-md bg-primary px-3 py-1.5 text-[9px] font-semibold text-white transition-colors hover:bg-primary-deep">
                  View Analysis
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {options.map((opt, i) => (
                <div
                  key={opt.name}
                  className={cn(
                    'relative flex flex-col rounded-xl bg-white p-4 pt-5',
                    opt.best ? 'border-2 border-primary' : 'border border-line'
                  )}
                >
                  {opt.best ? (
                    <span className="absolute -top-[11px] left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-primary px-2.5 py-1 text-[7.5px] font-bold uppercase tracking-[0.08em] text-white">
                      <Trophy className="h-2.5 w-2.5" />
                      Rank #1 Best Match
                    </span>
                  ) : (
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary">Rank #{i + 1}</span>
                      <span className="text-[8px] text-muted/70">{opt.focus}</span>
                    </div>
                  )}

                  <div className={cn('text-center', !opt.best && 'mt-1')}>
                    <h3 className="text-[13.5px] font-bold text-ink">{opt.name}</h3>
                    <p className="mt-0.5 text-[9px] text-muted">{opt.sub}</p>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-primary">
                        {opt.score}
                      </span>
                      <span className="text-[8.5px] text-muted">SAW Score</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {opt.rows.map((row) => (
                      <div
                        key={row.k}
                        className="flex items-center justify-between border-t border-[#f5effc] py-[7px] text-[9.5px]"
                      >
                        <span className="text-muted">{row.k}</span>
                        <span
                          className={cn(
                            'font-semibold',
                            row.highlight ? 'text-[#15803d]' : 'text-ink'
                          )}
                        >
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={cn(
                      'mt-auto flex items-center gap-1.5 rounded-lg px-2 py-2 text-[8.5px] font-medium leading-snug',
                      opt.best ? 'bg-[#f1fbf4] text-[#15803d]' : 'bg-[#f8f4fd] text-muted'
                    )}
                  >
                    {opt.best ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                    ) : (
                      <Info className="h-3 w-3 shrink-0" />
                    )}
                    {opt.note}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 border-t border-[#f5effc] pt-3 text-center text-[8.5px] text-muted/60">
              Illustrative interface model demonstrating the Simple Additive Weighting (SAW)
              methodology with normalized criteria matrix.
            </p>
          </div>
        </div>
      </section>

      {/* ── Signup CTA ───────────────────────────────────────── */}
      <SignupCta />

      <Footer />
    </div>
  )
}
