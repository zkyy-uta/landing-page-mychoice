import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  EyeOff,
  LayoutList,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Footer } from '@/components/footer/Footer'
import { StudioBar } from '@/components/dashboard/StudioBar'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'
import { sawProfiles } from '@/data/sawStudio'

const segmentColors = ['#ef7a7a', '#7c3aed', '#a855f7', '#22c55e', '#38bdf8', '#8b5cf6']

const weightMapOf = (criteria: { id: string; weight: number }[]) =>
  criteria.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = item.weight
    return acc
  }, {})

export function AiCriteria() {
  const [profileKey, setProfileKey] = useState(sawProfiles[0].key)
  const [prompt, setPrompt] = useState(sawProfiles[0].prompt)
  const [weights, setWeights] = useState<Record<string, number>>(
    weightMapOf(sawProfiles[0].criteria)
  )
  const [status, setStatus] = useState('Recommended from the flagship smartphone benchmark set.')

  const profile = sawProfiles.find((item) => item.key === profileKey) ?? sawProfiles[0]
  const criteria = profile.criteria
  const total = criteria.reduce((sum, item) => sum + (weights[item.id] ?? 0), 0)
  const costCriteria = criteria.filter((item) => item.type === 'cost')
  const benefitCriteria = criteria.filter((item) => item.type === 'benefit')

  const segments = useMemo(
    () =>
      criteria.map((item, index) => ({
        id: item.id,
        width: (weights[item.id] ?? 0) / (total || 1) * 100,
        color: segmentColors[index % segmentColors.length],
      })),
    [criteria, weights, total]
  )

  const selectProfile = (key: string) => {
    const next = sawProfiles.find((item) => item.key === key) ?? sawProfiles[0]
    setProfileKey(key)
    setPrompt(next.prompt)
    setWeights(weightMapOf(next.criteria))
    setStatus(`Criteria set for ${next.label.toLowerCase()} loaded from the SAW preset library.`)
  }

  const analyze = () => {
    setWeights(weightMapOf(profile.criteria))
    setStatus(
      prompt.trim().length > 0
        ? `Analysed "${prompt.trim()}" — ${criteria.length} criteria weighted with ${costCriteria.length} cost and ${benefitCriteria.length} benefit drivers.`
        : 'Add a decision context first so Chobby can weight the criteria.'
    )
  }

  return (
    <div className="min-h-screen bg-[#faf7ff] antialiased">
      <StudioBar active="criteria" />

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-9 md:px-8">
        {/* Hero */}
        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
          <Sparkles className="h-3 w-3 text-primary" />
          AI Criteria Intelligence
        </p>
        <h1 className="mt-3 text-[32px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink md:text-[40px]">
          AI Criteria Suggestions
        </h1>
        <p className="mt-3 max-w-[560px] text-[11.5px] leading-[1.85] text-muted">
          Let Chobby&apos;s AI Copilot read your decision context and recommend an objective weighting
          built on Simple Additive Weighting (SAW) — no emotional bias, only measurable criteria.
        </p>

        {/* Category & prompt */}
        <div className="mt-8 rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-56px_rgba(76,29,149,0.55)] md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-muted">
              Choose your decision category
            </p>
            <button
              type="button"
              onClick={() => setWeights(weightMapOf(profile.criteria))}
              className="flex items-center gap-1.5 text-[9.5px] font-medium text-primary transition-opacity hover:opacity-80"
            >
              <SlidersHorizontal className="h-2.5 w-2.5" />
              Preset: Detail-Attribute
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sawProfiles.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => selectProfile(item.key)}
                className={cn(
                  'truncate rounded-lg border px-3 py-2 text-[10.5px] font-semibold transition-colors',
                  item.key === profileKey
                    ? 'border-transparent bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white'
                    : 'border-line bg-white text-muted hover:bg-[#faf7ff] hover:text-ink'
                )}
              >
                {item.chip}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary/70" />
              <input
                type="text"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                aria-label="Decision context"
                className="w-full rounded-lg border border-line bg-[#faf8ff] py-2.5 pl-9 pr-3 text-[11px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-[#c4a9f7] focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={analyze}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              Analyze Criteria
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Copilot + distribution */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[290px_1fr]">
          {/* Chobby copilot */}
          <div className="rounded-2xl border border-line bg-white p-5 text-center">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-full ring-1 ring-[#eadcff]">
              <img src={chobbyMascot} alt="Chobby" className="h-full w-full object-cover" />
            </div>
            <p className="mt-2.5 flex items-center justify-center gap-1 text-[11.5px] font-bold text-ink">
              Chobby Copilot
              <span className="flex h-3 w-3 items-center justify-center rounded-full border border-[#c4a9f7] text-[6px] font-bold text-primary">
                i
              </span>
            </p>
            <p className="text-[9px] text-muted">SAW Analysis · {profile.label}</p>

            <div className="mt-3 rounded-xl bg-[#faf7ff] px-3 py-2.5 text-left text-[10px] leading-[1.85] text-muted">
              &ldquo;I recommend {criteria.length} criteria with {costCriteria.length} cost driver and{' '}
              {benefitCriteria.length} benefit drivers. This split keeps the ranking measurable instead
              of brand-driven.&rdquo;
            </div>

            <div className="mt-4 text-left">
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                Criteria classification
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between rounded-lg bg-[#fdf4f4] px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-medium text-[#b91c1c]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ef7a7a]" />
                    Cost (Minimum Price)
                  </span>
                  <span className="text-[9px] font-semibold text-[#b91c1c]">
                    {costCriteria.length} Criteria
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#f2fbf6] px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-medium text-[#15803d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                    Benefit (Maximum Benefit)
                  </span>
                  <span className="text-[9px] font-semibold text-[#15803d]">
                    {benefitCriteria.length} Criteria
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2 rounded-xl bg-[#faf7ff] px-2.5 py-2 text-left text-[9px] leading-[1.7] text-muted">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#d8c9ee] text-[7px] font-bold text-primary">
                i
              </span>
              The higher a criterion weight, the more it shifts the final normalised ranking.
            </div>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-ink">
                  Recommended Criteria Distribution
                  <span className="rounded bg-[#f2ecfd] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-primary">
                    SAW Normalized
                  </span>
                </h2>
                <p className="mt-1 text-[9.5px] text-muted">
                  Every weight is normalised to exactly 100% so the SAW matrix stays valid.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5">
                <span className="text-[9px] text-muted">Total Weight:</span>
                <span
                  className={cn(
                    'text-[11px] font-bold',
                    total === 100 ? 'text-[#15803d]' : 'text-[#b91c1c]'
                  )}
                >
                  {total}%
                </span>
                {total === 100 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e9f8ef] text-[#15803d]">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#f4eefb]">
              {segments.map((segment) => (
                <span key={segment.id} style={{ width: `${segment.width}%`, background: segment.color }} />
              ))}
            </div>

            <div className="mt-4 space-y-1.5">
              {criteria.map((item) => {
                const Icon = item.icon
                const isCost = item.type === 'cost'
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-colors hover:border-line hover:bg-[#fdfbff]"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        isCost ? 'bg-[#fdecec] text-[#b91c1c]' : 'bg-[#f2ecfd] text-primary'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <div className="min-w-[140px] flex-1">
                      <p className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-semibold text-ink">
                        {item.name}
                        <span
                          className={cn(
                            'rounded px-1 py-0.5 text-[6.5px] font-bold uppercase tracking-wide',
                            isCost ? 'bg-[#fdecec] text-[#b91c1c]' : 'bg-[#e9f8ef] text-[#15803d]'
                          )}
                        >
                          {item.type}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[9px] leading-[1.65] text-muted">{item.desc}</p>
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
                      className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[#efe7f8] accent-primary md:w-32"
                    />

                    <span className="w-8 shrink-0 text-right text-[11px] font-bold text-primary">
                      {weights[item.id] ?? 0}%
                    </span>
                  </div>
                )
              })}
            </div>

            <p className="mt-2 text-[8.5px] text-muted">{status}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f4eefb] pt-3.5">
              <button
                type="button"
                onClick={() => {
                  setWeights(weightMapOf(profile.criteria))
                  setStatus('Chobby re-ran the benchmark model and restored the recommended split.')
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[9.5px] font-semibold text-muted transition-colors hover:text-primary"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate AI
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeights(weightMapOf(profile.criteria))
                  setStatus('Weights reset to the preset distribution.')
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[9.5px] font-semibold text-muted transition-colors hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Weights
              </button>
              <Link
                to="/dashboard"
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[9.5px] font-semibold text-white transition-colors hover:bg-primary-deep"
              >
                Apply Criteria to Dashboard
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why section */}
        <div className="mt-10">
          <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-muted">SAW smart algorithm</p>
          <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-ink md:text-[26px]">
            Why do AI criteria recommendations differ?
          </h2>
          <p className="mt-2 max-w-[520px] text-[10.5px] leading-[1.8] text-muted">
            Every recommendation combines your need profile with industry-standard calculation, so two
            people can get different weights for the same product.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: EyeOff,
                title: 'Emotional bias elimination',
                body: 'Weighting is driven by functional needs instead of brand attachment or momentary mood.',
              },
              {
                icon: LayoutList,
                title: 'Standard SAW format',
                body: 'Each criterion is classified strictly as Cost (minimised) or Benefit (maximised) before normalisation.',
              },
              {
                icon: SlidersHorizontal,
                title: 'Full flexibility',
                body: 'The AI split is a starting point. You keep full control to tune every weight to your own priorities.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5efff] text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-2.5 text-[11.5px] font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-[9.5px] leading-[1.75] text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#8b5cf6] px-6 py-7 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.18em] text-white/70">
                <Sparkles className="h-2.5 w-2.5" />
                Objective &amp; rational decision
              </p>
              <h2 className="mt-2 max-w-[420px] text-[20px] font-extrabold leading-[1.25] tracking-[-0.02em] text-white md:text-[24px]">
                Ready to make your best decision today?
              </h2>
              <p className="mt-1.5 max-w-[420px] text-[10px] leading-[1.8] text-white/75">
                Use the comparison matrix to rank alternatives automatically, or review the full
                decision board.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[10.5px] font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Open Dashboard (Try MyChoice)
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
