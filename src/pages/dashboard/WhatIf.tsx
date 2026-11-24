import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Info,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import { Footer } from '@/components/footer/Footer'
import { StudioBar } from '@/components/dashboard/StudioBar'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'
import { runSaw, smartphoneCriteria, studioCandidates, type SawCriterion } from '@/data/sawStudio'

const baselineWeights = smartphoneCriteria.reduce<Record<string, number>>((acc, criterion) => {
  acc[criterion.id] = criterion.weight
  return acc
}, {})

const presets = [
  { id: 'baseline', label: 'Balanced baseline' },
  { id: 'price', label: 'Price first', focus: 'price' },
  { id: 'battery', label: 'Battery first', focus: 'battery' },
  { id: 'camera', label: 'Camera first', focus: 'camera' },
  { id: 'perf', label: 'Performance first', focus: 'perf' },
]

function presetWeights(focus?: string) {
  if (!focus) return { ...baselineWeights }
  return smartphoneCriteria.reduce<Record<string, number>>((acc, criterion) => {
    acc[criterion.id] = criterion.id === focus ? 45 : Math.max(5, Math.round(55 / (smartphoneCriteria.length - 1)))
    return acc
  }, {})
}

const shortName = (criterion: SawCriterion) => criterion.name.replace(/\s*\(.*\)$/, '')

export function WhatIf() {
  const [weights, setWeights] = useState<Record<string, number>>({ ...baselineWeights })
  const [preset, setPreset] = useState('baseline')

  const total = smartphoneCriteria.reduce((sum, criterion) => sum + (weights[criterion.id] ?? 0), 0)

  const baseline = useMemo(() => runSaw(smartphoneCriteria, studioCandidates), [])
  const results = useMemo(
    () => runSaw(smartphoneCriteria, studioCandidates, weights),
    [weights]
  )

  const winner = results[0]
  const baselineWinner = baseline[0]
  const leadChanged = winner.name !== baselineWinner.name
  const margin = (results[0].score - results[1].score) * 100

  const rankOf = (name: string, list: typeof results) =>
    list.findIndex((item) => item.name === name) + 1

  const heaviest = smartphoneCriteria
    .slice()
    .sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0))[0]

  const changed = smartphoneCriteria.some(
    (criterion) => (weights[criterion.id] ?? 0) !== baselineWeights[criterion.id]
  )

  const update = (id: string, value: number) => {
    setWeights((prev) => ({ ...prev, [id]: value }))
    setPreset('custom')
  }

  const applyPreset = (id: string, focus?: string) => {
    setWeights(presetWeights(focus))
    setPreset(id)
  }

  return (
    <div className="min-h-screen bg-[#faf7ff] antialiased">
      <StudioBar active="whatif" />

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-8 md:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#f2ecfd]">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-primary" />
              </span>
              Sensitivity Analysis
            </p>
            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">
              What-If Simulation
            </h1>
            <p className="mt-2.5 max-w-[500px] text-[11px] leading-[1.85] text-muted">
              Move any criterion weight and the SAW ranking recalculates instantly. Compare every
              score against the balanced baseline to see how stable your top choice really is.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setWeights({ ...baselineWeights })
                setPreset('baseline')
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[10px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to baseline
            </button>
            <Link
              to="/dashboard/ranking"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              Open Decision Ranking
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Live status strip */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#15803d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              Live recompute
            </span>
            <span className="text-[9.5px] text-muted">
              Total weight <span className="font-semibold text-ink">{total}%</span> · normalised
              automatically
            </span>
            <span className="text-[9.5px] text-muted">
              Heaviest criterion{' '}
              <span className="font-semibold text-primary">{shortName(heaviest)}</span>
            </span>
          </div>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[8.5px] font-bold',
              changed ? 'bg-[#f2ecfd] text-primary' : 'bg-[#f4eefb] text-muted'
            )}
          >
            {changed ? 'Scenario modified' : 'Baseline scenario'}
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          {/* Controls */}
          <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-ink">Adjust criteria weights</h2>
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPreset(item.id, item.focus)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[9px] font-medium transition-colors',
                    preset === item.id
                      ? 'border-[#c4a9f7] bg-[#f2ecfd] text-primary'
                      : 'border-line bg-white text-muted hover:border-[#c4a9f7] hover:text-primary'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {smartphoneCriteria.map((criterion) => {
                const value = weights[criterion.id] ?? 0
                const share = total > 0 ? (value / total) * 100 : 0
                const Icon = criterion.icon
                return (
                  <div key={criterion.id} className="rounded-xl border border-line px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                          criterion.type === 'cost'
                            ? 'bg-[#fdecec] text-[#b91c1c]'
                            : 'bg-[#f2ecfd] text-primary'
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <p className="min-w-0 flex-1 truncate text-[10.5px] font-semibold text-ink">
                        {shortName(criterion)}
                      </p>
                      <span className="rounded bg-[#f4eefb] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-muted">
                        {criterion.type}
                      </span>
                      <span className="w-9 text-right text-[11px] font-bold text-primary">{value}%</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={5}
                        value={value}
                        aria-label={`${shortName(criterion)} weight`}
                        onChange={(event) => update(criterion.id, Number(event.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#efe7f8] accent-primary"
                      />
                      <span className="w-10 shrink-0 text-right text-[8px] text-muted">
                        {share.toFixed(0)}% share
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#f8f4ff] px-3 py-2 text-[8.5px] leading-[1.7] text-muted">
              <Info className="mt-0.5 h-2.5 w-2.5 shrink-0 text-primary" />
              SAW scores are normalised by the weight total, so the sliders do not have to add up to
              100% to produce a valid ranking.
            </p>
          </div>

          {/* Live results */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-primary">
                    <Trophy className="h-2.5 w-2.5" />
                    Live leader
                  </p>
                  <h2 className="mt-1.5 text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[20px]">
                    {winner.name}
                  </h2>
                  <p className="mt-1 text-[9.5px] text-muted">
                    Score{' '}
                    <span className="font-semibold text-primary">{winner.score.toFixed(3)}</span> ·
                    leads by <span className="font-semibold text-ink">{margin.toFixed(1)} pts</span>
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[8px] font-bold',
                    leadChanged
                      ? 'bg-[#fdf2f2] text-[#b91c1c]'
                      : 'bg-[#e9f8ef] text-[#15803d]'
                  )}
                >
                  {leadChanged ? 'Leader changed' : 'Leader unchanged'}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {results.map((item, index) => {
                  const baseRank = rankOf(item.name, baseline)
                  const rankDelta = baseRank - (index + 1)
                  const baseScore =
                    baseline.find((entry) => entry.name === item.name)?.score ?? item.score
                  const scoreDelta = item.score - baseScore

                  return (
                    <div
                      key={item.name}
                      className={cn(
                        'rounded-xl border px-3 py-2.5',
                        index === 0 ? 'border-[#c4a9f7] bg-[#faf7ff]' : 'border-line bg-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold',
                            index === 0 ? 'bg-primary text-white' : 'bg-[#f1ebfa] text-muted'
                          )}
                        >
                          {index + 1}
                        </span>
                        <p className="min-w-0 flex-1 truncate text-[10px] font-semibold text-ink">
                          {item.name}
                        </p>
                        <span
                          className={cn(
                            'flex items-center gap-0.5 text-[8px] font-bold',
                            rankDelta > 0
                              ? 'text-[#15803d]'
                              : rankDelta < 0
                                ? 'text-[#b91c1c]'
                                : 'text-muted'
                          )}
                        >
                          {rankDelta > 0 ? (
                            <ArrowUpRight className="h-2.5 w-2.5" />
                          ) : rankDelta < 0 ? (
                            <ArrowDownRight className="h-2.5 w-2.5" />
                          ) : (
                            <Minus className="h-2.5 w-2.5" />
                          )}
                          {rankDelta === 0 ? 'stable' : Math.abs(rankDelta)}
                        </span>
                        <span className="w-11 text-right text-[11px] font-extrabold text-primary">
                          {item.score.toFixed(3)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#f1ebfa]">
                          <div
                            className={cn(
                              'h-1 rounded-full transition-all duration-300',
                              index === 0 ? 'bg-primary' : 'bg-[#b18cf0]'
                            )}
                            style={{ width: `${item.score * 100}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            'w-14 text-right text-[8px] font-semibold',
                            scoreDelta > 0.0005
                              ? 'text-[#15803d]'
                              : scoreDelta < -0.0005
                                ? 'text-[#b91c1c]'
                                : 'text-muted'
                          )}
                        >
                          {scoreDelta > 0 ? '+' : ''}
                          {scoreDelta.toFixed(3)} vs base
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Chobby insight */}
            <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
              <p className="flex items-center gap-1.5 text-[7.5px] font-bold uppercase tracking-[0.16em] text-primary">
                <Zap className="h-2.5 w-2.5" />
                Live insight
              </p>
              <div className="mt-2.5 flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-[#eadcff]">
                  <img src={chobbyMascot} alt="Chobby" className="h-full w-full object-cover" />
                </div>
                <p className="text-[10px] leading-[1.85] text-muted">
                  {leadChanged ? (
                    <>
                      Raising <span className="font-semibold text-ink">{shortName(heaviest)}</span>{' '}
                      flips the outcome: {winner.name} now overtakes {baselineWinner.name} by{' '}
                      {margin.toFixed(1)} points. The ranking is genuinely sensitive to this
                      criterion, so confirm how much it matters before deciding.
                    </>
                  ) : changed ? (
                    <>
                      {winner.name} keeps the lead, but the margin moves to {margin.toFixed(1)} points
                      because <span className="font-semibold text-ink">{shortName(heaviest)}</span>{' '}
                      now carries {weights[heaviest.id] ?? 0}% of the decision. A margin under 3
                      points means the top two are effectively tied.
                    </>
                  ) : (
                    <>
                      This is the balanced baseline. {winner.name} leads on price, storage and battery
                      while {results[1].name} stays close on display. Nudge the price or camera slider
                      to test how fragile that lead is.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[11px] font-bold text-ink">Next step</h3>
                  <p className="mt-0.5 text-[9px] text-muted">
                    Lock in the weights you trust, then review the full ranking.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/dashboard/ai-criteria"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[9.5px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    AI Criteria
                  </Link>
                  <Link
                    to="/dashboard/comparison"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[9.5px] font-semibold text-white transition-colors hover:bg-primary-deep"
                  >
                    Compare matrix
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
