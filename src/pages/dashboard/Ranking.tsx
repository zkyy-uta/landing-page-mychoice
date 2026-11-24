import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Footer } from '@/components/footer/Footer'
import { StudioBar } from '@/components/dashboard/StudioBar'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'
import { runSaw, smartphoneCriteria, studioCandidates } from '@/data/sawStudio'

export function Ranking() {
  const results = useMemo(() => runSaw(smartphoneCriteria, studioCandidates), [])
  const winner = results[0]
  const runnerUp = results[1]
  const third = results[2]
  const margin = (winner.score - runnerUp.score) * 100
  const totalWeight = smartphoneCriteria.reduce((sum, item) => sum + item.weight, 0)

  const podium = [runnerUp, winner, third]

  return (
    <div className="min-h-screen bg-[#faf7ff] antialiased">
      <StudioBar active="ranking" />

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-8 md:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f2ecfd]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              SAW Decision Leaderboard
            </p>
            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">
              Decision Ranking
            </h1>
            <p className="mt-2.5 max-w-[480px] text-[11px] leading-[1.85] text-muted">
              Transparent confidence ranking based on Simple Additive Weighting (SAW). Find the best
              alternative with the highest aggregate score, free of bias.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              <Plus className="h-3 w-3" />
              New Decision
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                  SAW Confidence
                </p>
                <p className="mt-1 text-[24px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                  {(winner.score * 100).toFixed(1)}%
                </p>
              </div>
              <ShieldCheck className="h-4 w-4 text-[#15803d]" />
            </div>
            <span className="mt-2 inline-flex rounded bg-[#e9f8ef] px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide text-[#15803d]">
              Bias shield active
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                  Ranking Stability
                </p>
                <p className="mt-1 text-[24px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                  Robust
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="mt-2 inline-flex rounded bg-[#f2ecfd] px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide text-primary">
              Δ Margin {margin.toFixed(1)}%
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                  Total Criteria Weight
                </p>
                <p className="mt-1 text-[24px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                  {totalWeight}%
                </p>
              </div>
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <span className="mt-2 inline-flex rounded bg-[#f4eefb] px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide text-muted">
              {smartphoneCriteria.length} Criteria Valid
            </span>
          </div>
        </div>

        {/* Podium */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-ink">SAW Champion Podium</h2>
          <span className="text-[8.5px] text-muted">Engine v4.2 · Evaluated</span>
        </div>

        <div className="mt-3 grid items-stretch gap-3 md:grid-cols-3">
          {podium.map((item) => {
            const rank = results.findIndex((entry) => entry.name === item.name) + 1
            const isWinner = rank === 1
            return (
              <div
                key={item.name}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-4',
                  isWinner
                    ? 'border-transparent bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] text-white shadow-[0_30px_60px_-40px_rgba(91,33,182,0.9)] md:-mt-2'
                    : 'border-line bg-white'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide',
                      isWinner
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f4eefb] text-muted'
                    )}
                  >
                    <span className="font-extrabold">{rank}</span>
                    {isWinner ? 'Champion' : rank === 2 ? 'Runner Up' : 'Third Place'}
                  </span>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wide',
                      isWinner ? 'bg-[#22c55e]/25 text-white' : 'bg-[#f4eefb] text-muted'
                    )}
                  >
                    {isWinner ? `Δ +${margin.toFixed(1)}%` : item.highlight}
                  </span>
                </div>

                <p
                  className={cn(
                    'mt-3 text-[7.5px] font-bold uppercase tracking-[0.14em]',
                    isWinner ? 'text-white/65' : 'text-muted'
                  )}
                >
                  {isWinner ? 'Top Recommended' : rank === 2 ? 'Display Priority' : 'Value for Money'}
                </p>
                <h3
                  className={cn(
                    'mt-1 text-[17px] font-extrabold leading-tight tracking-[-0.02em]',
                    isWinner ? 'text-white' : 'text-ink'
                  )}
                >
                  {item.name}
                </h3>
                <p
                  className={cn(
                    'mt-1.5 flex-1 text-[9px] leading-[1.8]',
                    isWinner ? 'text-white/75' : 'text-muted'
                  )}
                >
                  {item.summary}
                </p>

                <div
                  className={cn(
                    'mt-3 rounded-xl px-3 py-2.5',
                    isWinner ? 'bg-white/10' : 'bg-[#faf7ff]'
                  )}
                >
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          'text-[7.5px]',
                          isWinner ? 'text-white/60' : 'text-muted'
                        )}
                      >
                        Aggregate score
                      </p>
                      <p
                        className={cn(
                          'text-[19px] font-extrabold leading-none tracking-[-0.02em]',
                          isWinner ? 'text-white' : 'text-ink'
                        )}
                      >
                        {item.score.toFixed(3)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[7.5px] font-bold',
                        isWinner ? 'bg-white/20 text-white' : 'bg-[#f2ecfd] text-primary'
                      )}
                    >
                      ({(item.score * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div
                    className={cn(
                      'mt-2 h-1 overflow-hidden rounded-full',
                      isWinner ? 'bg-white/25' : 'bg-[#f1ebfa]'
                    )}
                  >
                    <div
                      className={cn('h-1 rounded-full', isWinner ? 'bg-[#22c55e]' : 'bg-primary')}
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contribution distribution */}
        <div className="mt-4 rounded-2xl border border-line bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[13px] font-bold text-ink">Criteria Contribution Distribution (V)</h2>
              <p className="mt-0.5 text-[9px] text-muted">
                Transparent calculation of each normalised value (R) times its priority weight (W).
              </p>
            </div>
            <span className="rounded bg-[#faf7ff] px-2 py-1 text-[8px] font-medium text-muted">
              Formula: V = Σ (W · R)
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {results.map((item, index) => (
              <div key={item.name} className="rounded-xl border border-line px-3.5 py-3">
                <div className="flex flex-wrap items-center gap-2.5">
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
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide',
                          index === 0
                            ? 'bg-[#f2ecfd] text-primary'
                            : 'bg-[#f4eefb] text-muted'
                        )}
                      >
                        {index === 0 ? 'Top recommendation' : index === 1 ? 'Display priority' : 'Budget priority'}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[9px] text-muted">{item.specs.map((spec) => spec.value).join(' · ')}</p>
                  </div>
                  <span className="text-[15px] font-extrabold text-primary">
                    {item.score.toFixed(3)}
                    <span className="text-[8.5px] font-medium text-muted"> /1.000</span>
                  </span>
                </div>

                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#f1ebfa]">
                  <div
                    className={cn('h-1.5 rounded-full', index === 0 ? 'bg-primary' : 'bg-[#b18cf0]')}
                    style={{ width: `${item.score * 100}%` }}
                  />
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {smartphoneCriteria.map((criterion) => (
                    <span
                      key={criterion.id}
                      className="rounded-md bg-[#faf7ff] px-1.5 py-1 text-[8px] text-muted"
                    >
                      <span className="font-semibold text-ink">
                        {criterion.name.replace(/\s*\(.*\)$/, '').split(' ')[0]}
                      </span>
                      {criterion.type === 'cost' ? ' (Cost)' : ''}:{' '}
                      {(((item.norm[criterion.id] ?? 0) * criterion.weight) / 100).toFixed(3)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chobby summary */}
        <div className="mt-4 rounded-2xl border border-line bg-[#fbf8ff] p-4 md:p-5">
          <div className="flex items-start gap-3.5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#eadcff]">
              <img src={chobbyMascot} alt="Chobby" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[7.5px] font-bold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-2.5 w-2.5" />
                AI Advisor Analysis · Sensitivity check active
              </p>
              <h2 className="mt-1.5 text-[16px] font-extrabold tracking-[-0.02em] text-ink md:text-[19px]">
                Chobby&apos;s Champion Summary
              </h2>
              <p className="mt-1.5 max-w-[620px] text-[10px] leading-[1.85] text-muted">
                &ldquo;The aggregate SAW score shows {winner.name} is the most balanced option for your
                current need profile, holding the lowest purchase price with the largest memory tier.
                If your priority shifts toward display brightness and camera optics,{' '}
                {runnerUp.name} can close the {margin.toFixed(1)}% gap and take the top spot.&rdquo;
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/dashboard/what-if"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[9.5px] font-semibold text-white transition-colors hover:bg-primary-deep"
                >
                  <Target className="h-3 w-3" />
                  Test What-If Simulation
                </Link>
                <Link
                  to="/dashboard/ai-criteria"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[9.5px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
                >
                  Adjust Criteria Weights
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 rounded-2xl border border-line bg-white px-5 py-8 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5efff] text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="mt-3 text-[19px] font-extrabold tracking-[-0.02em] text-ink md:text-[22px]">
            Build your own decision ranking now
          </h2>
          <p className="mx-auto mt-2 max-w-[440px] text-[10px] leading-[1.85] text-muted">
            Use the proven SAW methodology to compare products, property options, campuses or strategic
            priorities with a transparent ranking.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              Open Dashboard (Try MyChoice)
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-[10px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
            >
              Learn the SAW Formula
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
