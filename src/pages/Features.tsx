import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Zap,
  CreditCard,
  Cpu,
  MemoryStick,
  HardDrive,
  BatteryCharging,
  CheckCircle2,
  Info,
  Lock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  CalendarDays,
  Layers,
  Crown,
  MonitorPlay,
  SlidersHorizontal,
  Scale,
  ListChecks,
  Tag,
  Users,
  PenLine,
  MousePointerClick,
  Star,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'

/* ─── Hero decision matrix ───────────────────────────────────── */
const candidates = [
  {
    rank: 1,
    name: 'MacBook Air M3',
    badge: 'Best Match',
    rows: [
      { label: 'Price ($1,299)', value: '85/100', width: 85 },
      { label: 'Performance (M3 8-core)', value: '96/100', width: 96 },
      { label: 'Battery Life (18h)', value: '98/100', width: 98 },
    ],
    total: '92.4',
  },
  {
    rank: 2,
    name: 'ThinkPad T14s',
    badge: 'Rank #2',
    rows: [
      { label: 'Price ($1,180)', value: '90/100', width: 90 },
      { label: 'Performance (Ryzen 7)', value: '88/100', width: 88 },
      { label: 'Battery Life (14h)', value: '82/100', width: 82 },
    ],
    total: '84.1',
  },
  {
    rank: 3,
    name: 'Dell XPS 13 Plus',
    badge: 'Rank #3',
    rows: [
      { label: 'Price ($1,350)', value: '80/100', width: 80 },
      { label: 'Performance (i7 1360P)', value: '89/100', width: 89 },
      { label: 'Battery Life (11h)', value: '70/100', width: 70 },
    ],
    total: '79.8',
  },
]

/* ─── AI suggested criteria ──────────────────────────────────── */
const suggestions = [
  { icon: CreditCard, name: 'Price', type: 'Cost Factor' },
  { icon: Cpu, name: 'Processor Performance', type: 'Benefit' },
  { icon: MemoryStick, name: 'RAM Capacity', type: 'Benefit' },
  { icon: HardDrive, name: 'Storage', type: 'Benefit' },
  { icon: BatteryCharging, name: 'Battery Life', type: 'Benefit' },
]

const criteriaTraits = [
  {
    icon: Tag,
    title: 'Category-based',
    desc: 'Pre-tailored criteria domains from tech gear to career moves.',
  },
  {
    icon: Users,
    title: 'Personalized Criteria',
    desc: 'Adapts suggestions to your unique constraints and goals.',
  },
  {
    icon: PenLine,
    title: 'Editable Suggestions',
    desc: 'Rename, re-type, and tweak any parameter in one click.',
  },
  {
    icon: MousePointerClick,
    title: 'User-Controlled',
    desc: 'You have 100% agency to accept, modify, or dismiss suggestions.',
  },
]

/* ─── Weighting ──────────────────────────────────────────────── */
const weights = [
  { name: 'Price', type: 'Cost', weight: 30 },
  { name: 'Processor Performance', type: 'Benefit', weight: 25 },
  { name: 'RAM Capacity', type: 'Benefit', weight: 20 },
  { name: 'Storage', type: 'Benefit', weight: 15 },
  { name: 'Battery Life', type: 'Benefit', weight: 10 },
]

const weightChips = [
  { icon: SlidersHorizontal, label: 'Adjustable criterion weights' },
  { icon: Scale, label: 'Benefit & cost criteria' },
  { icon: CheckCircle2, label: 'Automatic total-weight validation' },
  { icon: Users, label: 'Personalized priorities' },
]

/* ─── Comparison matrix ──────────────────────────────────────── */
type MatrixCell = { text: string; note?: string }
const matrixRows: { label: string; type: string; weight: string; values: MatrixCell[] }[] = [
  {
    label: 'Price',
    type: 'Cost',
    weight: '30%',
    values: [
      { text: '$1,299' },
      { text: '$1,180', note: '(Best Cost)' },
      { text: '$1,150' },
    ],
  },
  {
    label: 'Performance',
    type: 'Benefit',
    weight: '25%',
    values: [
      { text: 'Apple M3 (8-core CPU)' },
      { text: 'AMD Ryzen 7 PRO 7840U' },
      { text: 'Intel Core i7-1360P' },
    ],
  },
  {
    label: 'RAM Capacity',
    type: 'Benefit',
    weight: '20%',
    values: [{ text: '16 GB Unified Memory' }, { text: '32 GB LPDDR5x' }, { text: '16 GB LPDDR5' }],
  },
  {
    label: 'Battery Life',
    type: 'Benefit',
    weight: '15%',
    values: [{ text: '18 Hours', note: '(Leader)' }, { text: '14 Hours' }, { text: '11 Hours' }],
  },
]

/* ─── SAW ranking ────────────────────────────────────────────── */
const ranking = [
  {
    rank: 1,
    name: 'MacBook Air M3',
    score: '92.4',
    satisfaction: '92.4%',
    desc: 'Exceptional battery efficiency and high single core compute align perfectly with your daily mobility priorities.',
    best: true,
  },
  {
    rank: 2,
    name: 'ThinkPad T14s Gen 4',
    score: '84.1',
    satisfaction: '84.1%',
    desc: 'Outstanding price and memory headroom, making it a reliable runner-up option for heavy compilation.',
  },
  {
    rank: 3,
    name: 'Dell XPS 13 Plus',
    score: '79.8',
    satisfaction: '79.8%',
    desc: 'Stunning design and form factor, but slightly trailing in battery endurance and unit purchase price.',
  },
]

const scenarios = {
  original: {
    title: 'Prioritizing Price (35%) & Performance (25%).',
    rows: [
      { rank: 1, name: 'MacBook Air M3', points: '92.4 pts', trend: 'none' as const },
      { rank: 2, name: 'ThinkPad T14s', points: '84.1 pts', trend: 'none' as const },
      { rank: 3, name: 'Dell XPS 13 Plus', points: '79.8 pts', trend: 'none' as const },
    ],
  },
  simulated: {
    title: 'Adjusted focus: RAM Capacity (45%) & Price (20%).',
    rows: [
      { rank: 1, name: 'ThinkPad T14s', points: '94.2 pts', trend: 'up' as const },
      { rank: 2, name: 'MacBook Air M3', points: '88.6 pts', trend: 'down' as const },
      { rank: 3, name: 'Dell XPS 13 Plus', points: '78.2 pts', trend: 'none' as const },
    ],
  },
}

/* ─── Decision history ───────────────────────────────────────── */
const history = [
  {
    tag: 'Technology',
    status: 'Completed',
    title: 'Choose a Programming Laptop',
    desc: 'Evaluated 3 alternatives across price, memory, and battery endurance for full-stack workflow.',
    date: 'Oct 24, 2025',
    alternatives: 3,
    done: true,
  },
  {
    tag: 'Career',
    status: 'In Progress',
    title: 'Select an Internship Opportunity',
    desc: 'Comparing offer terms, mentorship quality, learning runway, and stipend across 4 tech firms.',
    date: 'Nov 02, 2025',
    alternatives: 4,
    done: false,
  },
  {
    tag: 'Education',
    status: 'Completed',
    title: 'Choose an Online Course',
    desc: 'Weighing curriculum depth, certification value, and total study hours for cloud computing mastery.',
    date: 'Dec 18, 2025',
    alternatives: 3,
    done: true,
  },
]

const trendIcon = {
  up: ArrowUp,
  down: ArrowDown,
  none: Minus,
}

export function Features() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[#f9f5ff] pb-14 pt-8">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted/40" />
            <span className="font-medium text-primary">Features</span>
          </nav>

          <div className="mt-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e7ff] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3 w-3" />
              Powerful Features
            </span>
            <h1 className="mx-auto mt-5 max-w-[760px] text-[30px] font-extrabold leading-[1.16] tracking-[-0.03em] text-ink md:text-[42px]">
              Everything You Need to Make Smarter{' '}
              <span className="text-primary">Decisions.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[600px] text-[13px] leading-[1.75] text-muted md:text-[14px]">
              Discover the tools that help you organize your thoughts, compare alternatives, and
              make decisions based on your personal priorities.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(124,58,237,0.8)] transition-colors hover:bg-primary-deep"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#criteria"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#efe6fb] px-5 py-2.5 text-[12.5px] font-semibold text-primary transition-colors hover:bg-[#e6d8f9]"
              >
                Explore Features
                <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Live decision matrix */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_36px_90px_-50px_rgba(76,29,149,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                  <ListChecks className="h-3 w-3 text-primary" />
                  Decision Matrix · Choose Your Programming Laptop
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#16a34a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                  SAW Engine Active
                </span>
                <span className="rounded-md border border-line px-1.5 py-0.5 text-[9.5px] font-medium text-muted">
                  v2.4.0
                </span>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <div className="rounded-2xl border border-line bg-[#fdfbff] p-4 md:p-5">
                <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="inline-flex rounded-md bg-[#f3ecfe] px-2 py-0.5 text-[9px] font-semibold text-primary">
                      Technology
                    </span>
                    <h2 className="mt-1.5 text-[17px] font-bold tracking-[-0.01em] text-ink md:text-[19px]">
                      Choose Your Programming Laptop
                    </h2>
                    <p className="mt-0.5 text-[10.5px] text-muted">
                      3 evaluated candidates across 5 normalized criteria
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-muted/70">
                        Top Selected Match
                      </p>
                      <p className="text-[13px] font-bold text-primary">MacBook Air M3 (92.4%)</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[12px] font-bold text-white">
                      #1
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {candidates.map((item) => (
                    <div key={item.name} className="rounded-xl border border-line bg-white p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12.5px] font-bold text-ink">{item.name}</span>
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[8.5px] font-semibold',
                            item.rank === 1
                              ? 'bg-primary text-white'
                              : 'text-muted/70'
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2.5">
                        {item.rows.map((row) => (
                          <div key={row.label}>
                            <div className="flex items-center justify-between gap-2 text-[10px]">
                              <span className="truncate text-muted">{row.label}</span>
                              <span className="shrink-0 font-semibold text-ink">{row.value}</span>
                            </div>
                            <div className="mt-1 h-[3px] w-full rounded-full bg-[#efe7f8]">
                              <div
                                className="h-[3px] rounded-full"
                                style={{
                                  width: `${row.width}%`,
                                  backgroundColor: item.rank === 1 ? '#5b21b6' : '#c8bcd9',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                        <span className="text-[10px] text-muted">Total Score</span>
                        <span className="text-[15px] font-bold text-primary">{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intelligent assistance ─────────────────────────────── */}
      <section id="criteria" className="scroll-mt-24 py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.02fr_1fr]">
          {/* Mockup */}
          <div className="rounded-3xl border border-line bg-[#fbf8ff] p-5 shadow-[0_26px_70px_-45px_rgba(76,29,149,0.5)] md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Create Your Decision
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#f3ecfe] px-2.5 py-1 text-[9px] font-semibold text-primary">
                <Sparkles className="h-2.5 w-2.5" />
                AI Assistant
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted/70">
                Decision Scope
              </p>
              <p className="mt-1 text-[13px] font-semibold text-ink">
                Find the best laptop for programming
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#f3ecfe] px-2 py-0.5 text-[9px] font-medium text-primary">
                <Zap className="h-2.5 w-2.5" />
                Category: Technology
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Suggested Criteria
              </span>
              <span className="text-[9.5px] text-muted">5 recommended</span>
            </div>

            <div className="mt-3 space-y-2">
              {suggestions.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2.5 rounded-xl border border-line/70 bg-[#f6f0fe] px-3 py-2.5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-primary">
                    <item.icon className="h-3 w-3" />
                  </span>
                  <span className="text-[11.5px] font-semibold text-ink">{item.name}</span>
                  <span className="text-[9.5px] text-muted">{item.type}</span>
                  <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-[#16a34a]" />
                </div>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-primary">
              Intelligent Assistance
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Start with the Right Criteria.
            </h2>
            <p className="mt-3 max-w-[460px] text-[12.5px] leading-[1.8] text-muted">
              Not sure what factors to consider? MyChoice uses AI to suggest relevant evaluation
              criteria based on your decision category and personal needs.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {criteriaTraits.map((trait) => (
                <div key={trait.title}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3ecfe] text-primary">
                    <trait.icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="mt-2 text-[12px] font-bold text-ink">{trait.title}</h3>
                  <p className="mt-1 text-[11px] leading-[1.7] text-muted">{trait.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex gap-2.5 rounded-2xl bg-[#f6f0fe] px-4 py-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-[11px] leading-[1.75] text-muted">
                <span className="font-semibold text-ink">Transparent Philosophy:</span> AI only
                suggests criteria; users remain in full control of their personal weighting and
                final decision boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Precision tuning ───────────────────────────────────── */}
      <section className="bg-[#fbf8ff] py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-6 md:px-8 lg:grid-cols-2">
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-primary">
              Precision Tuning
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Prioritize What Matters Most.
            </h2>
            <p className="mt-3 max-w-[430px] text-[12.5px] leading-[1.8] text-muted">
              Every decision is personal. MyChoice lets you assign different importance levels to
              each criterion based on your preferences.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {weightChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-muted"
                >
                  <chip.icon className="h-3 w-3 text-primary" />
                  {chip.label}
                </span>
              ))}
            </div>

            <p className="mt-6 max-w-[430px] text-[10.5px] leading-[1.8] text-muted/80">
              Sliders enforce strict mathematical consistency so your normalized calculations
              represent clear trade-offs instead of arbitrary guesswork.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_26px_70px_-45px_rgba(76,29,149,0.45)] md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-[13.5px] font-bold text-ink">Criteria Weighting</h3>
                <p className="mt-0.5 text-[9.5px] text-muted">
                  Drag to adjust relative importance
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#eafaf0] px-2 py-1 text-[9px] font-semibold text-[#15803d]">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Total Weight: 100% Validated
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {weights.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-semibold text-ink">{item.name}</span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[8.5px] font-medium',
                          item.type === 'Cost'
                            ? 'bg-[#f3ecfe] text-primary'
                            : 'bg-[#efeadf] text-[#8a7a5c]'
                        )}
                      >
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-ink">{item.weight}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#f1ebfa]">
                    <div
                      className="h-1.5 rounded-full bg-[#6d28d9]"
                      style={{ width: `${item.weight * 2.4}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-[#faf7ff] px-4 py-2.5">
              <span className="text-[10.5px] text-muted">Summation Verification</span>
              <span className="text-[14px] font-bold text-[#15803d]">100% Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comprehensive matrix ───────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-muted">
              Comprehensive Matrix
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Compare Your Options Side by Side.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[12.5px] leading-[1.8] text-muted">
              Organize multiple alternatives into one structured comparison so you can evaluate each
              option more easily.
            </p>
            <p className="mt-2 text-[10px] italic text-muted/60">* Illustrative interface example</p>
          </div>

          <div className="mt-9 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fbf8ff]">
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted">
                    Evaluation Criteria
                  </th>
                  {['MacBook Air M3', 'ThinkPad T14s Gen 4', 'Dell XPS 13 Plus'].map((name) => (
                    <th key={name} className="px-4 py-3 text-[10.5px] font-semibold text-ink">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row) => (
                  <tr key={row.label} className="border-b border-line align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11.5px] font-semibold text-ink">{row.label}</span>
                        <span className="text-[9.5px] text-muted">({row.type})</span>
                      </div>
                      <p className="mt-0.5 text-[9.5px] text-muted/80">Weight: {row.weight}</p>
                    </td>
                    {row.values.map((value, index) => (
                      <td key={index} className="px-4 py-4 text-[11.5px] font-medium text-ink">
                        {value.text}
                        {value.note && (
                          <span className="ml-1 text-[10px] font-normal text-muted">
                            {value.note}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <td className="px-4 py-4 text-[11.5px] font-semibold text-ink">Computed Ranking</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[9.5px] font-semibold text-white">
                      <Star className="h-2.5 w-2.5 fill-white" />#1 Best Choice
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-[#f3ecfe] px-2.5 py-1 text-[9.5px] font-medium text-primary">
                      #2 Balanced Alternative
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-[#f3ecfe] px-2.5 py-1 text-[9.5px] font-medium text-primary">
                      #3 Third Option
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Algorithmic rigor ──────────────────────────────────── */}
      <section className="bg-[#fbf8ff] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-muted">
              Algorithmic Rigor
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Discover Your Best-Matching Alternative.
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[12.5px] leading-[1.8] text-muted">
              MyChoice uses the Simple Additive Weighting (SAW) method to calculate weighted scores
              and rank alternatives according to your selected criteria.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {ranking.map((item) => (
              <div
                key={item.name}
                className="relative rounded-2xl border border-line bg-white p-5 shadow-[0_20px_55px_-45px_rgba(76,29,149,0.6)]"
              >
                {item.best && (
                  <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[9px] font-semibold text-white shadow-sm">
                    <Crown className="h-2.5 w-2.5" />
                    Best Match
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold',
                      item.rank === 1
                        ? 'bg-primary text-white'
                        : 'bg-[#f3ecfe] text-primary'
                    )}
                  >
                    {item.rank}
                  </span>
                  <div className="text-right">
                    <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-muted/70">
                      SAW Score
                    </p>
                    <p className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-primary">
                      {item.score}
                    </p>
                  </div>
                </div>

                <h3 className="mt-4 text-[13.5px] font-bold text-ink">{item.name}</h3>
                <p className="mt-2 text-[11px] leading-[1.75] text-muted">{item.desc}</p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-muted">Criteria Satisfaction</span>
                    <span className="font-semibold text-ink">{item.satisfaction}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#f1ebfa]">
                    <div
                      className="h-1.5 rounded-full bg-[#6d28d9]"
                      style={{ width: item.satisfaction }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#f4ecfe] px-5 py-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e3d3fb] text-[12px] font-bold text-primary">
              2
            </span>
            <div>
              <h3 className="text-[12px] font-bold text-ink">
                How Simple Additive Weighting (SAW) Works
              </h3>
              <p className="mt-1 text-[11px] leading-[1.75] text-muted">
                SAW evaluates alternatives by normalizing criterion values, applying their respective
                weights, and calculating a final preference score. Results depend on your weights and
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dynamic exploration ────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-muted">
              Dynamic Exploration
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              What If Your Priorities Change?
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[12.5px] leading-[1.8] text-muted">
              Explore how different priorities can affect your decision results without losing your
              original configuration.
            </p>
          </div>

          <div className="mt-9 rounded-3xl border border-line bg-white p-5 shadow-[0_30px_80px_-55px_rgba(76,29,149,0.5)] md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex rounded-md bg-[#f3ecfe] px-2 py-0.5 text-[9px] font-semibold text-primary">
                  Sandbox Simulation Mode
                </span>
                <h3 className="mt-1.5 text-[14px] font-bold text-ink">
                  Sensitivity &amp; Scenario Comparison
                </h3>
              </div>
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary-deep"
              >
                <MonitorPlay className="h-3.5 w-3.5" />
                Try Simulation
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Original */}
              <div className="rounded-2xl border border-line bg-[#fbf8ff] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Original Result
                  </span>
                  <span className="rounded-md bg-[#efe7f8] px-2 py-0.5 text-[8.5px] font-medium text-muted">
                    Baseline Weights
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-muted">{scenarios.original.title}</p>

                <div className="mt-3 space-y-1.5">
                  {scenarios.original.rows.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2"
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold',
                          row.rank === 1
                            ? 'bg-primary text-white'
                            : 'bg-[#efe7f8] text-muted'
                        )}
                      >
                        {row.rank}
                      </span>
                      <span className="text-[11px] font-semibold text-ink">{row.name}</span>
                      <span className="ml-auto text-[10.5px] font-semibold text-ink">
                        {row.points}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[9px] text-muted/80">
                  <Lock className="h-2.5 w-2.5" />
                  Original setup securely preserved in memory.
                </p>
              </div>

              {/* Simulated */}
              <div className="rounded-2xl border border-line bg-[#fbf8ff] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Simulated Result
                  </span>
                  <span className="rounded-md bg-primary px-2 py-0.5 text-[8.5px] font-semibold text-white">
                    Simulated State
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-muted">{scenarios.simulated.title}</p>

                <div className="mt-3 space-y-1.5">
                  {scenarios.simulated.rows.map((row) => {
                    const Trend = trendIcon[row.trend]
                    return (
                      <div
                        key={row.name}
                        className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2"
                      >
                        <span
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold',
                            row.rank === 1
                              ? 'bg-[#16a34a] text-white'
                              : 'bg-[#efe7f8] text-muted'
                          )}
                        >
                          {row.rank}
                        </span>
                        <span className="text-[11px] font-semibold text-ink">{row.name}</span>
                        <Trend
                          className={cn(
                            'h-3 w-3',
                            row.trend === 'up'
                              ? 'text-[#16a34a]'
                              : row.trend === 'down'
                                ? 'text-[#dc2626]'
                                : 'text-muted/50'
                          )}
                        />
                        <span className="ml-auto text-[10.5px] font-semibold text-ink">
                          {row.points}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[9px] text-muted/80">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Rankings recalculate instantly without altering saved states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Decision history + CTA ─────────────────────────────── */}
      <section className="bg-[#fbf8ff] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-muted">
              Long-Term Continuity
            </p>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink md:text-[32px]">
              Keep Track of Your Decisions.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[12.5px] leading-[1.8] text-muted">
              Review your previous decisions and revisit the analysis whenever you need it.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {history.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-[0_18px_50px_-45px_rgba(76,29,149,0.55)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-[#f3ecfe] px-2 py-0.5 text-[9px] font-semibold text-primary">
                    {item.tag}
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 text-[9px] font-medium',
                      item.done ? 'text-[#15803d]' : 'text-primary'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        item.done ? 'bg-[#22c55e]' : 'bg-primary'
                      )}
                    />
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-3 text-[12.5px] font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 flex-1 text-[10.5px] leading-[1.75] text-muted">{item.desc}</p>

                <div className="mt-4 flex items-center justify-between text-[9px] text-muted">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-2.5 w-2.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-2.5 w-2.5" />
                    {item.alternatives} Alternatives
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-line bg-[#faf7ff] py-1.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary-soft"
                >
                  View Details
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative mt-12 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-6 py-10 md:px-12 md:py-12">
            <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <Zap className="h-2.5 w-2.5" />
                  Free Tier Available
                </span>
                <h2 className="mt-3 text-[24px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white md:text-[30px]">
                  Ready to Make Better Decisions?
                </h2>
                <p className="mt-2 max-w-[430px] text-[12px] leading-[1.8] text-white/80">
                  Eliminate second-guessing and cognitive fatigue. Harness structured
                  multi-criteria algorithms paired with transparent AI guidance today.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[11.5px] font-bold text-primary transition-colors hover:bg-white/90"
                  >
                    Get Started for Free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[9.5px] text-white/70">
                    No credit card required · Free instant setup
                  </span>
                </div>
              </div>

              <div className="flex justify-start md:justify-end">
                <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 md:h-[118px] md:w-[118px]">
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
