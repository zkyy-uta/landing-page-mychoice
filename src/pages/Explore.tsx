import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Info,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'

const criteria = [
  { id: 'price', name: 'Price', type: 'Cost', weight: 30 },
  { id: 'performance', name: 'Performance (CPU)', type: 'Benefit', weight: 25 },
  { id: 'ram', name: 'RAM & Multitasking', type: 'Benefit', weight: 20 },
  { id: 'display', name: 'Display Quality', type: 'Benefit', weight: 15 },
  { id: 'battery', name: 'Battery Life', type: 'Benefit', weight: 10 },
] as const

type CriterionId = (typeof criteria)[number]['id']

const options: {
  name: string
  price: string
  specs: string[]
  scores: Record<CriterionId, number>
}[] = [
  {
    name: 'MacBook Air M3',
    price: '$1,299',
    specs: ['Apple M3, 8-core CPU', '16 GB unified memory', '13.6" Liquid Retina', '18 hours battery'],
    scores: { price: 93, performance: 96, ram: 84, display: 92, battery: 98 },
  },
  {
    name: 'ThinkPad T14s Gen 4',
    price: '$1,180',
    specs: ['AMD Ryzen 7 PRO 7840U', '32 GB LPDDR5x', '14" WUXGA IPS', '14 hours battery'],
    scores: { price: 89, performance: 84, ram: 88, display: 72, battery: 82 },
  },
  {
    name: 'Dell XPS 13 Plus',
    price: '$1,350',
    specs: ['Intel Core i7-1360P', '16 GB LPDDR5', '13.4" OLED touch', '11 hours battery'],
    scores: { price: 84, performance: 84, ram: 60, display: 96, battery: 70 },
  },
]

const presets = [
  { name: 'Balanced', weights: { price: 30, performance: 25, ram: 20, display: 15, battery: 10 } },
  { name: 'Price first', weights: { price: 50, performance: 20, ram: 15, display: 5, battery: 10 } },
  { name: 'Performance first', weights: { price: 15, performance: 45, ram: 20, display: 10, battery: 10 } },
]

const defaultWeights: Record<CriterionId, number> = {
  price: 30,
  performance: 25,
  ram: 20,
  display: 15,
  battery: 10,
}

export function Explore() {
  const [weights, setWeights] = useState<Record<CriterionId, number>>(defaultWeights)
  const [selected, setSelected] = useState('MacBook Air M3')

  const total = criteria.reduce((sum, criterion) => sum + weights[criterion.id], 0)

  const ranked = useMemo(() => {
    const divisor = total || 1
    return options
      .map((option) => {
        const weighted = criteria.reduce(
          (sum, criterion) => sum + option.scores[criterion.id] * weights[criterion.id],
          0
        )
        return { ...option, score: weighted / divisor }
      })
      .sort((a, b) => b.score - a.score)
  }, [weights, total])

  const selectedOption = ranked.find((option) => option.name === selected) ?? ranked[0]

  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#f6f0fe] via-[#faf6ff] to-white pb-12 pt-6">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted/40" />
            <span className="font-medium text-primary">Explore</span>
          </nav>

          <div className="mt-9 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3 w-3" />
                Interactive Sandbox
              </span>
              <h1 className="mt-4 max-w-[500px] text-[30px] font-extrabold leading-[1.14] tracking-[-0.035em] text-ink md:text-[40px]">
                Explore MyChoice — Features in Action.
              </h1>
              <p className="mt-4 max-w-[460px] text-[12px] leading-[1.85] text-muted">
                Adjust the weights of a real decision matrix and watch the ranking recalculate
                instantly. Everything here runs on the Simple Additive Weighting method, with no
                account required.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <a
                  href="#builder"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[11.5px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(124,58,237,0.9)] transition-colors hover:bg-primary-deep"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Try Decision Matrix
                </a>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-[11.5px] font-semibold text-primary transition-colors hover:bg-[#fbf8ff]"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_28px_70px_-50px_rgba(76,29,149,0.55)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    Live Ranking
                  </p>
                  <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#15803d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                    {total}% allocated
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {ranked.map((option, index) => (
                    <div key={option.name} className="rounded-xl bg-[#faf7ff] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold',
                            index === 0 ? 'bg-primary text-white' : 'bg-[#efe7f8] text-muted'
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="text-[10.5px] font-medium text-ink">{option.name}</span>
                        <span className="ml-auto text-[10.5px] font-bold text-primary">
                          {option.score.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#efe7f8]">
                        <div
                          className="h-1.5 rounded-full bg-[#6d28d9]"
                          style={{ width: `${option.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Builder ────────────────────────────────────────────── */}
      <section id="builder" className="scroll-mt-24 py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Interactive Decision Matrix
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Build Your Own Comparison
            </h2>
            <p className="mx-auto mt-2.5 max-w-[500px] text-[10.5px] leading-[1.8] text-muted">
              Move a slider and the weighted scores, ranking, and recommendation update in real time.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[300px_1fr]">
            {/* Weights */}
            <div className="lg:sticky lg:top-[86px] lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12.5px] font-bold text-ink">Criteria Weights</h3>
                  <button
                    type="button"
                    onClick={() => setWeights(defaultWeights)}
                    className="flex items-center gap-1 text-[9px] font-medium text-muted transition-colors hover:text-primary"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    Reset
                  </button>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {presets.map((preset) => {
                    const isActive = criteria.every(
                      (criterion) =>
                        weights[criterion.id] ===
                        preset.weights[criterion.id as CriterionId]
                    )
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setWeights({ ...preset.weights })}
                        className={cn(
                          'rounded-md px-2 py-1 text-[9px] font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-[#f6f0fe] text-primary hover:bg-[#efe4fe]'
                        )}
                      >
                        {preset.name}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 space-y-3">
                  {criteria.map((criterion) => (
                    <div key={criterion.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-ink">{criterion.name}</span>
                        <span className="text-[9.5px] font-semibold text-primary">
                          {weights[criterion.id]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={5}
                        value={weights[criterion.id]}
                        aria-label={`${criterion.name} weight`}
                        onChange={(event) =>
                          setWeights((prev) => ({
                            ...prev,
                            [criterion.id]: Number(event.target.value),
                          }))
                        }
                        className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-full bg-[#efe7f8] accent-primary"
                      />
                    </div>
                  ))}
                </div>

                <div
                  className={cn(
                    'mt-4 flex items-center justify-between rounded-lg px-2.5 py-2',
                    total === 100 ? 'bg-[#eafaf0]' : 'bg-[#fdf2f2]'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center gap-1 text-[9px] font-medium',
                      total === 100 ? 'text-[#15803d]' : 'text-[#b91c1c]'
                    )}
                  >
                    <Check className="h-2.5 w-2.5" />
                    {total === 100 ? 'Weights balanced' : 'Normalized automatically'}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      total === 100 ? 'text-[#15803d]' : 'text-[#b91c1c]'
                    )}
                  >
                    {total}%
                  </span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-[12.5px] font-bold text-ink">
                      Choose Your Programming Laptop
                    </h3>
                    <p className="mt-0.5 text-[9.5px] text-muted">
                      {options.length} candidates · 5 criteria · SAW scoring
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#15803d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                    SAW Engine Active
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {ranked.map((option, index) => {
                    const isSelected = option.name === selectedOption.name
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelected(option.name)}
                        className={cn(
                          'w-full rounded-xl border px-3.5 py-3 text-left transition-colors',
                          isSelected
                            ? 'border-[#c4a9f7] bg-[#faf7ff]'
                            : 'border-line bg-white hover:bg-[#fdfbff]'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold',
                              index === 0 ? 'bg-primary text-white' : 'bg-[#f1ebfa] text-muted'
                            )}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                              {option.name}
                              {index === 0 && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f1e7ff] px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide text-primary">
                                  <Crown className="h-2 w-2" />
                                  Best match
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 text-[9px] text-muted">
                              {option.price} · {option.specs[0]}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[14px] font-bold leading-none text-primary">
                              {option.score.toFixed(1)}
                            </p>
                            <p className="mt-0.5 text-[7.5px] uppercase tracking-wide text-muted">
                              / 100
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#efe7f8]">
                          <div
                            className="h-1.5 rounded-full bg-[#6d28d9]"
                            style={{ width: `${option.score}%` }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-[1.7] text-muted/80">
                  <Info className="mt-[1px] h-2.5 w-2.5 shrink-0" />
                  Scores are weighted averages of each candidate's criterion scores, normalized
                  against your current allocation.
                </p>
              </div>

              {/* Selected detail */}
              <div className="rounded-2xl border border-line bg-[#fbf8ff] p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                      Selected Candidate
                    </p>
                    <h3 className="mt-1 text-[14px] font-bold text-ink">{selectedOption.name}</h3>
                  </div>
                  <span className="rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-primary">
                    {selectedOption.score.toFixed(1)} pts
                  </span>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                      Specifications
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      <li className="flex items-start gap-1.5 text-[10px] text-ink">
                        <Check className="mt-[2px] h-2.5 w-2.5 shrink-0 text-[#16a34a]" />
                        {selectedOption.price}
                      </li>
                      {selectedOption.specs.map((spec) => (
                        <li key={spec} className="flex items-start gap-1.5 text-[10px] text-ink">
                          <Check className="mt-[2px] h-2.5 w-2.5 shrink-0 text-[#16a34a]" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                      Criterion Breakdown
                    </p>
                    <div className="mt-1.5 space-y-1.5">
                      {criteria.map((criterion) => (
                        <div key={criterion.id}>
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-muted">{criterion.name}</span>
                            <span className="font-semibold text-ink">
                              {selectedOption.scores[criterion.id]}/100
                              <span className="ml-1 font-normal text-muted/70">
                                ×{weights[criterion.id]}%
                              </span>
                            </span>
                          </div>
                          <div className="mt-0.5 h-1 w-full rounded-full bg-[#efe7f8]">
                            <div
                              className="h-1 rounded-full bg-[#a78bfa]"
                              style={{ width: `${selectedOption.scores[criterion.id]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="pb-14 pt-2">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-6 py-9 md:px-9 md:py-11">
            <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <Layers className="h-2.5 w-2.5" />
                  Bring Your Own Decision
                </span>
                <h2 className="mt-3 max-w-[440px] text-[26px] font-extrabold leading-[1.16] tracking-[-0.03em] text-white md:text-[32px]">
                  Ready to Make Better Decisions?
                </h2>
                <p className="mt-2.5 max-w-[430px] text-[11px] leading-[1.8] text-white/80">
                  This matrix is a demo. Start your own decision with your criteria, your weights,
                  and your alternatives — free, no credit card required.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[10.5px] font-bold text-primary transition-colors hover:bg-white/90"
                  >
                    Get Started for Free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-white/25"
                  >
                    Ask the team
                  </Link>
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
