import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Banknote,
  BatteryCharging,
  BookOpen,
  Briefcase,
  Camera,
  Check,
  Clock,
  Cpu,
  Droplets,
  Footprints,
  Gauge,
  Gem,
  GraduationCap,
  Laptop,
  Layers,
  Monitor,
  Plus,
  RotateCcw,
  Ruler,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Thermometer,
  Trophy,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
import myChoiceLogo from '@/assets/mychoice-logo.png'
import { cn } from '@/lib/utils'
import { datasetFor, type Candidate, type Criterion, type IconKey } from '@/data/decisionDatasets'

/* ── Category & subcategory ───────────────────────────────────── */

const categories = [
  {
    id: 'Technology',
    blurb: 'Gadgets, Laptops & Hardware',
    icon: Laptop,
    subcategories: ['Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Gaming PC', 'Processor', 'Graphics Card'],
  },
  {
    id: 'Education',
    blurb: 'Courses, Degrees & Bootcamps',
    icon: GraduationCap,
    subcategories: ['Online Course', 'Bootcamp', 'University', 'Certification', 'Training Program'],
  },
  {
    id: 'Fashion',
    blurb: 'Apparel, Footwear & Accessories',
    icon: Shirt,
    subcategories: ['Dress', 'Shoes', 'Accessories', 'Jewelry', 'Outerwear', 'Tops', 'Bottoms'],
  },
] as const

type CategoryId = (typeof categories)[number]['id']

const steps = [
  { id: 1, short: 'Domain & Field', name: 'Category' },
  { id: 2, short: 'Candidate / Options', name: 'Pick options' },
  { id: 3, short: 'Criteria Weights', name: 'Priority' },
  { id: 4, short: 'Decision Result', name: 'Decision cockpit' },
]

const iconMap: Record<IconKey, LucideIcon> = {
  money: Banknote,
  chip: Cpu,
  battery: BatteryCharging,
  camera: Camera,
  display: Monitor,
  star: Star,
  clock: Clock,
  shield: ShieldCheck,
  award: Award,
  gem: Gem,
  layers: Layers,
  zap: Zap,
  gauge: Gauge,
  thermometer: Thermometer,
  briefcase: Briefcase,
  bag: ShoppingBag,
  ruler: Ruler,
  footprints: Footprints,
  shirt: Shirt,
  book: BookOpen,
  droplets: Droplets,
}

const stepTitle: Record<number, string> = {
  1: 'Category & Subcategory',
  2: 'Select Candidates',
  3: 'Weights & SAW Priority',
  4: 'Review & Decision Cockpit',
}

const stepSubtitle: Record<number, string> = {
  1: 'Pick a domain and subcategory to load the criteria and standard options of the SAW model.',
  2: 'Select 2–4 options you want to compare. The option list follows the chosen subcategory.',
  3: 'Set how important each criterion is. The total weight must be exactly 100%.',
  4: 'Final ranking, weighted scores and the normalisation matrix of the selected candidates.',
}

const rupiah = (value: number) => `Rp ${value.toLocaleString('en-US')}`

const formatValue = (criterion: Criterion, value: number) => {
  if (criterion.id === 'price') return rupiah(value)
  const base = Number.isInteger(value) ? value.toLocaleString('en-US') : String(value)
  if (!criterion.unit) return base
  return criterion.unit.startsWith('/') ? `${base}${criterion.unit}` : `${base} ${criterion.unit}`
}

const defaultWeightsFor = (criteria: Criterion[]) => {
  const base = [30, 30, 20, 20]
  return criteria.reduce<Record<string, number>>((acc, criterion, index) => {
    acc[criterion.id] = base[index] ?? 25
    return acc
  }, {})
}

export function Dashboard() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<CategoryId | ''>('')
  const [subcategory, setSubcategory] = useState('')
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [picked, setPicked] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const activeCategory = categories.find((item) => item.id === category)
  const dataset = datasetFor(subcategory)
  const chosen = Boolean(category && subcategory)
  const total = dataset.criteria.reduce((sum, item) => sum + (weights[item.id] ?? 0), 0)

  const visible = dataset.candidates.filter((item) => {
    const matchQuery =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.brand.toLowerCase().includes(query.toLowerCase())
    const matchFilter = filter === 'All' || item.tags.includes(filter)
    return matchQuery && matchFilter
  })

  const ranking = useMemo(() => {
    const list = dataset.candidates.filter((item) => picked.includes(item.name))
    if (list.length === 0) return []
    const divisor = total || 1

    const range: Record<string, { min: number; max: number }> = {}
    dataset.criteria.forEach((key) => {
      const values = list.map((item) => item.values[key.id] ?? 0)
      range[key.id] = { min: Math.min(...values), max: Math.max(...values) }
    })

    return list
      .map((item: Candidate) => {
        const norm: Record<string, number> = {}
        dataset.criteria.forEach((key) => {
          const value = item.values[key.id] ?? 0
          const { min, max } = range[key.id]
          if (key.type === 'cost') {
            norm[key.id] = value > 0 ? min / value : 1
          } else {
            norm[key.id] = max > 0 ? value / max : 0
          }
        })
        const score =
          dataset.criteria.reduce((sum, key) => sum + norm[key.id] * (weights[key.id] ?? 0), 0) / divisor
        return { ...item, norm, score }
      })
      .sort((a, b) => b.score - a.score)
  }, [dataset, picked, weights, total])

  const chooseCategory = (id: CategoryId) => {
    setCategory(id)
    setSubcategory('')
    setWeights({})
    setPicked([])
    setQuery('')
    setFilter('All')
  }

  const chooseSubcategory = (name: string) => {
    const next = datasetFor(name)
    setSubcategory(name)
    setWeights(defaultWeightsFor(next.criteria))
    setPicked(next.candidates.slice(0, 3).map((item) => item.name))
    setQuery('')
    setFilter('All')
  }

  const togglePicked = (name: string) => {
    setPicked((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const resetAll = () => {
    setCategory('')
    setSubcategory('')
    setWeights({})
    setPicked([])
    setQuery('')
    setFilter('All')
    setStep(1)
  }

  /* ── Gating: every step must be complete before moving on ── */
  const readiness = [true, chosen, picked.length >= 2, picked.length >= 2 && total === 100]
  const canGo = (target: number) => readiness.slice(1, target).every(Boolean)
  const blockedHint = !chosen
    ? 'Choose a category and subcategory first.'
    : picked.length < 2
      ? 'Select at least 2 options to continue.'
      : total !== 100
        ? `Total weight is ${total}% — it must be exactly 100%.`
        : ''

  const progress = step * 25
  const costWeight = dataset.criteria
    .filter((item) => item.type === 'cost')
    .reduce((sum, item) => sum + (weights[item.id] ?? 0), 0)
  const benefitWeight = dataset.criteria
    .filter((item) => item.type === 'benefit')
    .reduce((sum, item) => sum + (weights[item.id] ?? 0), 0)
  const costCount = dataset.criteria.filter((item) => item.type === 'cost').length
  const benefitCount = dataset.criteria.length - costCount

  const presets = [
    ...dataset.criteria.map((key) => {
      const rest = dataset.criteria.filter((item) => item.id !== key.id)
      const each = Math.floor(50 / (rest.length || 1))
      const preset = dataset.criteria.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.id === key.id ? 50 : each
        return acc
      }, {})
      const remainder = 100 - Object.values(preset).reduce((sum, value) => sum + value, 0)
      if (rest.length > 0) preset[rest[0].id] += remainder
      return { id: `focus-${key.id}`, label: `Focus on ${key.name.replace(/\s*\(.*\)$/, '')}`, weights: preset }
    }),
    {
      id: 'even',
      label: 'Even Out Weights',
      weights: dataset.criteria.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = 25
        return acc
      }, {}),
    },
  ]

  const navItems = [
    { label: 'Overview', step: 1 },
    { label: 'Criteria', step: 3 },
    { label: 'Comparison', step: 2 },
    { label: 'Ranking', step: 4 },
  ]

  const nextLabel: Record<number, string> = {
    1: 'Continue to Step 2 (Select Candidates)',
    2: 'Continue to Step 3 (Set Weights)',
    3: 'Continue to Step 4 (See Results)',
    4: 'Save & Start a New Decision',
  }

  const winner = ranking[0]
  const topCriterion = dataset.criteria
    .slice()
    .sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0))[0]

  return (
    <div className="min-h-screen bg-[#faf7ff] antialiased">
      {/* ── App bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#f1ebfa] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[58px] w-full max-w-[1180px] items-center gap-5 px-6 md:px-8">
          <Link to="/" className="flex shrink-0 items-center">
            <img src={myChoiceLogo} alt="MyChoice" className="h-[26px] w-auto" />
          </Link>

          <span className="hidden h-4 w-px bg-line md:block" />

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={!canGo(item.step)}
                onClick={() => setStep(item.step)}
                className={cn(
                  'text-[12.5px] transition-colors',
                  step === item.step ? 'font-medium text-ink' : 'text-muted hover:text-ink',
                  !canGo(item.step) && 'cursor-not-allowed text-muted/40 hover:text-muted/40'
                )}
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/dashboard/what-if"
              className="text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              What-If
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#e6f6ec] bg-[#f3fcf6] px-3 py-1.5 text-[10px] font-semibold text-[#15803d] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              Sandbox Active
            </span>
            <button
              type="button"
              onClick={() => {
                resetAll()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[11.5px] font-semibold text-white shadow-[0_12px_26px_-16px_rgba(124,58,237,0.9)] transition-colors hover:bg-primary-deep"
            >
              <RotateCcw className="h-3 w-3" />
              Start Over
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-14 pt-5 md:px-8">
        {/* ── Breadcrumb ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-[10.5px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span className="text-muted/40">›</span>
            <span className="transition-colors hover:text-primary">Try MyChoice</span>
            <span className="text-muted/40">›</span>
            <span className="font-medium text-primary">Decision Wizard (Interactive SAW)</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-medium text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            Interactive Sandbox
            <span className="text-muted/50">·</span>
            <span className="text-muted">Zero Sign-Up Required</span>
          </span>
        </div>

        {/* ── Wizard card ──────────────────────────────────────── */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-60px_rgba(76,29,149,0.5)]">
          <div className="px-5 pt-5 md:px-7 md:pt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.18em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Decision Building Flow
                </p>
                <h1 className="mt-2 text-[24px] font-extrabold leading-[1.18] tracking-[-0.03em] text-ink md:text-[30px]">
                  {step}. {stepTitle[step]}
                </h1>
                <p className="mt-1.5 max-w-[520px] text-[11px] leading-[1.75] text-muted">
                  {stepSubtitle[step]}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5efff] px-3 py-1.5 text-[10.5px] font-semibold text-primary">
                <SlidersHorizontal className="h-3 w-3" />
                Step {step} of 4 · {progress}% complete
              </span>
            </div>

            {/* Step rail */}
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
              {steps.map((item) => {
                const isDone = item.id < step
                const isActive = item.id === step
                const locked = !canGo(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => canGo(item.id) && setStep(item.id)}
                    disabled={locked && !isActive}
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-left transition-colors',
                      isActive
                        ? 'border-transparent bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white'
                        : 'border-line bg-white hover:bg-[#fdfbff]',
                      locked && !isActive && 'cursor-not-allowed opacity-55 hover:bg-white'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold',
                          isActive
                            ? 'bg-white/25 text-white'
                            : isDone
                              ? 'bg-[#eafaf0] text-[#15803d]'
                              : 'bg-[#f4eefb] text-muted'
                        )}
                      >
                        {isDone ? <Check className="h-2.5 w-2.5" /> : item.id}
                      </span>
                      <span className={cn('text-[11px] font-semibold', isActive ? 'text-white' : 'text-ink')}>
                        {item.short}
                      </span>
                    </div>
                    <p className={cn('mt-0.5 pl-[26px] text-[9px]', isActive ? 'text-white/75' : 'text-muted')}>
                      {item.name}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 border-t border-[#f4eefb]" />

          {/* Step body */}
          <div className="px-5 py-5 md:px-7 md:py-6">
            {step === 1 && (
              <>
                {/* Copilot banner */}
                <div className="rounded-2xl bg-gradient-to-r from-[#f6efff] via-[#f8f3ff] to-[#fbf8ff] p-4 md:p-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#eadcff]">
                      <img src={chobbyMascot} alt="Chobby" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.1em] text-white">
                          AI Copilot
                        </span>
                        <span className="flex items-center gap-1 text-[10.5px] text-muted">
                          <Sparkles className="h-2.5 w-2.5 text-primary" />
                          Hi! Chobby is ready to help
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-[15px] font-bold text-ink">
                        Choose the Decision Category You Want to Analyse
                      </h2>
                      <p className="mt-1 max-w-[560px] text-[10.5px] leading-[1.75] text-muted">
                        Set the comparison domain. The criteria and option list adapt to the
                        subcategory you choose.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <h3 className="text-[12px] font-bold text-ink">1. Choose a Main Category</h3>
                    <span
                      className={cn(
                        'text-[9.5px]',
                        category ? 'font-medium text-[#15803d]' : 'text-muted'
                      )}
                    >
                      {category ? `Category: ${category}` : 'Required · 1 domain'}
                    </span>
                  </div>

                  <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                    {categories.map((item) => {
                      const Icon = item.icon
                      const isActive = item.id === category
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => chooseCategory(item.id)}
                          className={cn(
                            'relative rounded-xl border px-4 py-4 text-center transition-colors',
                            isActive ? 'border-[#a78bfa] bg-[#f7f2ff]' : 'border-line bg-white hover:bg-[#fdfbff]'
                          )}
                        >
                          <span
                            className={cn(
                              'mx-auto flex h-8 w-8 items-center justify-center rounded-lg',
                              isActive ? 'bg-[#efe4fe] text-primary' : 'bg-[#f6f2fb] text-muted'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <p className="mt-2.5 text-[12px] font-bold text-ink">{item.id}</p>
                          <p className="mt-0.5 text-[9px] text-muted">{item.blurb}</p>
                          {isActive && (
                            <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <h3 className="text-[12px] font-bold text-ink">2. Choose a Specific Subcategory</h3>
                    <span className="flex items-center gap-1 text-[9px] font-semibold text-[#15803d]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                      Standardised Dataset
                    </span>
                  </div>

                  {activeCategory ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {activeCategory.subcategories.map((item) => {
                        const isActive = item === subcategory
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => chooseSubcategory(item)}
                            className={cn(
                              'rounded-full px-3.5 py-1.5 text-[10.5px] font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-white shadow-[0_10px_22px_-14px_rgba(124,58,237,0.9)]'
                                : 'bg-[#f8f4ff] text-muted hover:bg-[#f1e9ff] hover:text-primary'
                            )}
                          >
                            {item}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="mt-2.5 rounded-xl border border-dashed border-line bg-[#fdfbff] px-4 py-5 text-center text-[10.5px] text-muted">
                      Select a main category first to show the subcategories.
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                {/* Panel header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-ink">Select {dataset.unit} Options</h3>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {dataset.unit} options for {category} › {subcategory} — pick 2–4 options.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5efff] px-3 py-1.5 text-[9.5px] font-semibold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {picked.length} options selected
                  </span>
                </div>

                {/* Search + filter */}
                <div className="mt-3.5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/70" />
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={`Search a ${dataset.unit.toLowerCase()} name or model...`}
                      className="w-full rounded-lg border border-line bg-[#faf8ff] py-2.5 pl-9 pr-3 text-[11px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-[#c4a9f7] focus:bg-white"
                    />
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {['All', ...dataset.filters].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFilter(item)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-[9.5px] font-medium transition-colors',
                          filter === item
                            ? 'bg-primary text-white'
                            : 'bg-[#f6f1fd] text-muted hover:bg-[#efe6fd] hover:text-primary'
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate cards */}
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {visible.map((item) => {
                    const isActive = picked.includes(item.name)
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => togglePicked(item.name)}
                        className={cn(
                          'rounded-xl border p-3.5 text-left transition-colors',
                          isActive ? 'border-[#b190f2] bg-[#fbf8ff]' : 'border-line bg-white hover:bg-[#fdfbff]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                              {item.brand}
                            </p>
                            <p className="mt-0.5 truncate text-[12.5px] font-bold text-ink">{item.name}</p>
                          </div>
                          <span
                            className={cn(
                              'flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border transition-colors',
                              isActive
                                ? 'border-primary bg-primary text-white'
                                : 'border-[#e2d8f1] bg-white text-[#b6a8c9]'
                            )}
                          >
                            {isActive ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#faf7ff] px-2.5 py-2">
                          {item.specs.map((spec) => (
                            <div key={spec.label} className="min-w-0">
                              <p className="text-[8px] uppercase tracking-wide text-muted">{spec.label}</p>
                              <p className="mt-0.5 truncate text-[9.5px] font-semibold text-ink">{spec.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-ink">{rupiah(item.price)}</span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[8.5px] font-medium',
                              isActive ? 'text-[#15803d]' : 'text-muted/80'
                            )}
                          >
                            {isActive ? (
                              <>
                                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#eafaf0]">
                                  <Check className="h-2 w-2" />
                                </span>
                                Verified data
                              </>
                            ) : (
                              'Click to add'
                            )}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {visible.length === 0 && (
                  <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-[11px] text-muted">
                    No matching options. Try another keyword or filter.
                  </p>
                )}

                {/* Selected pills */}
                <div className="mt-4 rounded-xl border border-line bg-[#fdfbff] px-3.5 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10.5px] font-bold text-ink">Selected Options ({picked.length})</p>
                    <span className="rounded-full bg-[#f2ecfd] px-2.5 py-1 text-[8.5px] font-semibold text-primary">
                      2–3 options recommended for SAW
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {picked.length === 0 && <span className="text-[10px] text-muted">No options selected yet.</span>}
                    {picked.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#f3ecfe] px-2.5 py-1 text-[9.5px] font-medium text-ink"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {name}
                        <button
                          type="button"
                          aria-label={`Remove ${name}`}
                          onClick={() => togglePicked(name)}
                          className="text-muted transition-colors hover:text-[#b91c1c]"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {picked.length < 2 && (
                    <p className="mt-2 text-[9px] text-[#b91c1c]">Select at least 2 options to continue.</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                {/* Total weight banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7f7ee] bg-[#f6fdf9] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#15803d] ring-1 ring-[#dff3e6]">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[11.5px] font-bold text-ink">Total Weight: {total}%</p>
                      <p className="text-[9px] text-muted">
                        {total === 100
                          ? 'Ideal for the SAW method — ready to continue to the results.'
                          : 'The total weight must be exactly 100% before continuing.'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[9px] font-bold',
                      total === 100 ? 'bg-[#e6f7ed] text-[#15803d]' : 'bg-[#fdf2f2] text-[#b91c1c]'
                    )}
                  >
                    {total === 100 ? 'Valid' : `Off by ${Math.abs(100 - total)}%`}
                  </span>
                </div>

                {/* Presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setWeights(preset.weights)}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-[9.5px] font-medium text-muted transition-colors hover:border-[#c4a9f7] hover:bg-[#faf7ff] hover:text-primary"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
                  {/* Side */}
                  <div className="space-y-3">
                    <div className="rounded-xl border border-line bg-[#fdfbff] p-3">
                      <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.12em] text-primary">
                        <Sparkles className="h-2.5 w-2.5" /> AI Decision Copilot
                      </p>
                      <p className="mt-2 text-[10px] leading-[1.7] text-muted">
                        Set the focus of your decision. The weights below are recalculated
                        automatically with Simple Additive Weighting normalisation.
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-3">
                      <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">
                        Selected Candidates
                      </p>
                      <ul className="mt-2 space-y-1">
                        {picked.map((name) => (
                          <li key={name} className="flex items-center gap-1.5 text-[10px] text-ink">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {name}
                          </li>
                        ))}
                        {picked.length === 0 && <li className="text-[10px] text-muted">No candidates yet.</li>}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-3">
                      <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">
                        SAW Criteria Guide
                      </p>
                      <p className="mt-2 flex items-start gap-1.5 text-[9.5px] leading-[1.6] text-muted">
                        <span className="rounded bg-[#fdecec] px-1 py-0.5 text-[7.5px] font-bold text-[#b91c1c]">
                          COST
                        </span>
                        A lower value scores better.
                      </p>
                      <p className="mt-1.5 flex items-start gap-1.5 text-[9.5px] leading-[1.6] text-muted">
                        <span className="rounded bg-[#e9f8ef] px-1 py-0.5 text-[7.5px] font-bold text-[#15803d]">
                          BENEFIT
                        </span>
                        A higher value scores better.
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-white p-3">
                      <div className="flex items-center justify-between text-[8.5px] font-bold uppercase tracking-[0.1em] text-muted">
                        <span>Type Distribution</span>
                        <span className="text-ink">{dataset.criteria.length} Active Criteria</span>
                      </div>
                      <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-[#f4eefb]">
                        <span className="bg-[#f0a6a6]" style={{ width: `${costWeight}%` }} />
                        <span className="bg-[#7c3aed]" style={{ width: `${benefitWeight}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[8.5px] text-muted">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f0a6a6]" />
                          {costCount} Cost ({costWeight}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                          {benefitCount} Benefit ({benefitWeight}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Criteria sliders */}
                  <div className="space-y-2.5">
                    {dataset.criteria.map((item) => {
                      const Icon = iconMap[item.icon]
                      const isCost = item.type === 'cost'
                      return (
                        <div key={item.id} className="rounded-xl border border-line bg-white px-3.5 py-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                                isCost ? 'bg-[#fdecec] text-[#b91c1c]' : 'bg-[#f2ecfd] text-primary'
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <p className="text-[11px] font-bold text-ink">{item.name}</p>
                                <span
                                  className={cn(
                                    'rounded px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide',
                                    isCost ? 'bg-[#fdecec] text-[#b91c1c]' : 'bg-[#e9f8ef] text-[#15803d]'
                                  )}
                                >
                                  {item.type}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[9px] leading-[1.6] text-muted">{item.desc}</p>
                            </div>
                            <span className="shrink-0 text-[12px] font-bold text-primary">
                              {weights[item.id] ?? 0}%
                            </span>
                          </div>

                          <input
                            type="range"
                            min={0}
                            max={60}
                            step={5}
                            value={weights[item.id] ?? 0}
                            aria-label={`${item.name} weight`}
                            onChange={(event) =>
                              setWeights((prev) => ({ ...prev, [item.id]: Number(event.target.value) }))
                            }
                            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-[#efe7f8] accent-primary"
                          />
                        </div>
                      )
                    })}

                    <div className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-[#fdfbff] py-2.5 text-[9.5px] font-medium text-muted">
                      <Plus className="h-3 w-3" />
                      Criteria are capped at 4 to keep the analysis concise
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                {ranking.length < 2 ? (
                  <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
                    <p className="text-[11px] font-semibold text-ink">At least 2 candidates required</p>
                    <p className="mt-1 text-[10px] text-muted">
                      Go back to Step 2 and select at least two options to see the ranking.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                        Calculation complete · SAW Engine v2 active
                      </p>
                      <span className="rounded-full bg-[#e9f8ef] px-2.5 py-1 text-[9px] font-bold text-[#15803d]">
                        100% Complete
                      </span>
                    </div>

                    {/* Winner */}
                    <div className="mt-3 rounded-2xl border border-[#d9c6fb] bg-gradient-to-br from-[#faf6ff] via-white to-[#fdfaff] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f1e7ff] px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wide text-primary">
                            <Trophy className="h-2.5 w-2.5" /> Top Recommendation #1
                          </span>
                          <span className="rounded-full bg-[#e9f8ef] px-2 py-1 text-[8px] font-bold text-[#15803d]">
                            Score {Math.round(winner.score * 100)}%
                          </span>
                        </div>
                        <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[8px] font-semibold text-muted">
                          {subcategory} · {category}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-muted">
                            Highest Ranking Score
                          </p>
                          <h3 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[26px]">
                            {winner.name}
                          </h3>
                          <p className="mt-1 text-[10px] text-muted">
                            {winner.specs.map((spec) => spec.value).join(' · ')}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[8.5px] font-semibold uppercase tracking-wide text-muted">SAW Score</p>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-[30px] font-extrabold leading-none tracking-[-0.03em] text-primary">
                              {winner.score.toFixed(3)}
                            </p>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#c4a9f7] text-[8px] font-bold text-primary">
                              {Math.round(winner.score * 100)}
                            </span>
                          </div>
                          <p className="mt-1 text-[8.5px] text-muted">
                            Scale 0–1 · index {Math.round(winner.score * 100)}/100
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {dataset.criteria.map((key) => (
                          <div key={key.id} className="rounded-lg border border-line bg-white px-2.5 py-2">
                            <p className="text-[8px] uppercase tracking-wide text-muted">
                              {key.name.replace(/\s*\(.*\)$/, '')}
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold text-ink">
                              {formatValue(key, winner.values[key.id] ?? 0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ranking list */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11.5px] font-bold text-ink">Ranking & SAW Score Comparison</h4>
                        <span className="text-[9px] text-muted">{ranking.length} candidates</span>
                      </div>

                      <ol className="mt-2.5 space-y-2">
                        {ranking.map((item, index) => (
                          <li key={item.name} className="rounded-xl border border-line bg-white px-3.5 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={cn(
                                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9.5px] font-bold',
                                  index === 0 ? 'bg-primary text-white' : 'bg-[#f1ebfa] text-muted'
                                )}
                              >
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-ink">
                                  {item.name}
                                  {index === 0 && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f1e7ff] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-primary">
                                      <Target className="h-2 w-2" /> Recommended
                                    </span>
                                  )}
                                </p>
                                <p className="mt-0.5 text-[8.5px] text-muted">
                                  {index === 0
                                    ? 'Selected from the normalisation across all criteria.'
                                    : `Gap ${(winner.score - item.score).toFixed(3)} (−${Math.abs(
                                        (item.score / winner.score - 1) * 100
                                      ).toFixed(1)}%) vs Rank 1`}
                                </p>
                              </div>
                              <span className="text-[13px] font-bold text-primary">
                                {item.score.toFixed(3)}
                                <span className="text-[8.5px] font-medium text-muted"> /1.000</span>
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f1ebfa]">
                              <div
                                className={cn('h-1.5 rounded-full', index === 0 ? 'bg-primary' : 'bg-[#b18cf0]')}
                                style={{ width: `${item.score * 100}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Normalized matrix */}
                    <div className="mt-4 overflow-hidden rounded-xl border border-line">
                      <div className="flex items-center justify-between border-b border-line bg-[#fdfbff] px-3.5 py-2.5">
                        <h4 className="text-[11px] font-bold text-ink">SAW Normalisation Matrix</h4>
                        <span className="text-[8.5px] text-muted">Vᵢ = Σ (wⱼ · rᵢⱼ)</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] border-collapse text-left">
                          <thead>
                            <tr className="bg-white">
                              <th className="px-3.5 py-2 text-[8.5px] font-bold uppercase tracking-wide text-muted">
                                Criteria
                              </th>
                              <th className="px-2 py-2 text-center text-[8.5px] font-bold uppercase tracking-wide text-muted">
                                Weight
                              </th>
                              {ranking.map((item) => (
                                <th
                                  key={item.name}
                                  className="px-2 py-2 text-center text-[8.5px] font-bold uppercase tracking-wide text-muted"
                                >
                                  {item.brand}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.criteria.map((key) => (
                              <tr key={key.id} className="border-t border-[#f4eefb]">
                                <td className="px-3.5 py-2">
                                  <p className="text-[10px] font-semibold text-ink">{key.name}</p>
                                  <p
                                    className={cn(
                                      'text-[7.5px] font-bold uppercase tracking-wide',
                                      key.type === 'cost' ? 'text-[#b91c1c]' : 'text-[#15803d]'
                                    )}
                                  >
                                    {key.type === 'cost' ? 'Cost (minimum)' : 'Benefit (maximum)'}
                                  </p>
                                </td>
                                <td className="px-2 py-2 text-center text-[9.5px] text-muted">
                                  {weights[key.id] ?? 0}%
                                </td>
                                {ranking.map((item) => (
                                  <td key={item.name} className="px-2 py-2 text-center">
                                    <p className="text-[10px] font-semibold text-ink">
                                      {(item.norm[key.id] ?? 0).toFixed(3)}
                                    </p>
                                    <p className="text-[7.5px] text-muted">
                                      contribution{' '}
                                      {(((item.norm[key.id] ?? 0) * (weights[key.id] ?? 0)) / (total || 1)).toFixed(3)}
                                    </p>
                                  </td>
                                ))}
                              </tr>
                            ))}
                            <tr className="border-t border-line bg-[#faf6ff]">
                              <td className="px-3.5 py-2.5 text-[10px] font-bold text-ink">Total SAW Score (Vᵢ)</td>
                              <td className="px-2 py-2.5 text-center text-[9.5px] text-muted">{total}%</td>
                              {ranking.map((item, index) => (
                                <td key={item.name} className="px-2 py-2.5 text-center">
                                  <p className="text-[11px] font-bold text-primary">{item.score.toFixed(3)}</p>
                                  <p className="text-[7.5px] text-muted">Rank #{index + 1}</p>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#f8f4ff] px-3.5 py-2.5 text-[9.5px] leading-[1.7] text-muted">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      Chobby: {winner.name} leads because the largest weight sits on{' '}
                      {topCriterion.name.replace(/\s*\(.*\)$/, '').toLowerCase()} and its normalised
                      values are consistent across every criterion.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f4eefb] bg-[#fdfbff] px-5 py-3.5 md:px-7">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center gap-1.5 text-[10.5px] font-medium text-muted transition-colors hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Default
              </button>
              {blockedHint && step < 4 && (
                <span className="rounded-full bg-[#fdf2f2] px-2.5 py-1 text-[9px] font-medium text-[#b91c1c]">
                  {blockedHint}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[10.5px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Step {step - 1}
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canGo(step + 1)}
                  onClick={() => canGo(step + 1) && setStep((prev) => prev + 1)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-4 py-2 text-[10.5px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(91,33,182,0.9)] transition-opacity hover:opacity-95',
                    !canGo(step + 1) && 'cursor-not-allowed opacity-50 hover:opacity-50'
                  )}
                >
                  {nextLabel[step]}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-4 py-2 text-[10.5px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(91,33,182,0.9)] transition-opacity hover:opacity-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {nextLabel[4]}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[9.5px] leading-[1.7] text-muted/80">
          Sandbox demo · the SAW calculation runs entirely in your browser, with no account and no
          data sent to a server.
        </p>
      </main>

      {/* ── Decision workspace links ─────────────────────────── */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pb-14 md:px-8">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-muted">
                Decision workspace
              </p>
              <h2 className="mt-1.5 text-[16px] font-extrabold tracking-[-0.02em] text-ink">
                Continue with the full SAW toolkit
              </h2>
            </div>
            <span className="text-[9px] text-muted">All three stages run on the same criteria set</span>
          </div>

          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
            {[
              {
                to: '/dashboard/ai-criteria',
                icon: Sparkles,
                title: 'AI Criteria Suggestions',
                body: 'Generate and fine-tune the criteria weighting with Chobby.',
              },
              {
                to: '/dashboard/comparison',
                icon: SlidersHorizontal,
                title: 'Decision Comparison',
                body: 'Review the specification and normalisation matrix side by side.',
              },
              {
                to: '/dashboard/ranking',
                icon: Trophy,
                title: 'Decision Ranking',
                body: 'See the champion podium and per-criterion contribution.',
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-xl border border-line bg-[#fdfbff] p-3.5 transition-colors hover:border-[#c4a9f7] hover:bg-[#faf7ff]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f2ecfd] text-primary">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-ink">
                  {item.title}
                  <ArrowRight className="h-2.5 w-2.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
                <p className="mt-1 text-[9px] leading-[1.7] text-muted">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
