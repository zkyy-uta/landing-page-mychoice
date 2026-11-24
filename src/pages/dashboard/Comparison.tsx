import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Info, Sparkles, Sprout, Users } from 'lucide-react'
import { Footer } from '@/components/footer/Footer'
import { StudioBar } from '@/components/dashboard/StudioBar'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'
import { formatSawValue, runSaw, smartphoneCriteria, studioCandidates } from '@/data/sawStudio'

const rupiah = (value: number) => `Rp ${value.toLocaleString('en-US')}`

export function Comparison() {
  const results = useMemo(() => runSaw(smartphoneCriteria, studioCandidates), [])
  const winner = results[0]
  const margin = ((results[0].score - results[1].score) * 100).toFixed(1)
  const costCount = smartphoneCriteria.filter((item) => item.type === 'cost').length

  return (
    <div className="min-h-screen bg-[#faf7ff] antialiased">
      <StudioBar active="comparison" />

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-8 md:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#f2ecfd]">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-primary" />
              </span>
              Multi Attribute Matrix
            </p>
            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">
              Decision Comparison
            </h1>
            <p className="mt-2.5 max-w-[480px] text-[11px] leading-[1.85] text-muted">
              Objective side-by-side comparison of candidate specs using the calculation of Simple
              Additive Weighting (SAW) normalisation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[10px] font-semibold text-ink transition-colors hover:bg-[#faf7ff]"
            >
              <Users className="h-3 w-3" />
              Change Candidates
            </Link>
            <Link
              to="/dashboard/what-if"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-primary-deep"
            >
              <Sparkles className="h-3 w-3" />
              What-If Simulation
            </Link>
          </div>
        </div>

        {/* Active criteria */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-muted">
              Active criteria:
            </span>
            {results.map((item, index) => (
              <span
                key={item.name}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-medium',
                  index === 0
                    ? 'border-[#c4a9f7] bg-white text-ink'
                    : 'border-line bg-white/70 text-muted'
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item.brand} {item.name.replace(item.brand, '').trim()}
                <span
                  className={cn(
                    'rounded px-1 text-[7.5px] font-bold',
                    index === 0 ? 'bg-[#f2ecfd] text-primary' : 'bg-[#f4eefb] text-muted'
                  )}
                >
                  Rank {index + 1}
                </span>
              </span>
            ))}
          </div>
          <span className="text-[8.5px] text-muted">
            {smartphoneCriteria.length} Criteria Analysed ({costCount} Cost, {smartphoneCriteria.length - costCount}{' '}
            Benefit)
          </span>
        </div>

        {/* Top recommendation */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-4 md:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_1.85fr]">
            <div>
              <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-primary">
                <Sprout className="h-2.5 w-2.5" />
                Top Recommendation (Rank 1)
              </p>
              <h2 className="mt-2 text-[19px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[23px]">
                {winner.name}
              </h2>
              <p className="mt-2 text-[10px] leading-[1.8] text-muted">{winner.summary}</p>
              <p className="mt-3 text-[9.5px] text-muted">
                Price <span className="font-semibold text-ink">{rupiah(winner.price)}</span>
                <span className="mx-1.5 text-muted/40">·</span>
                Final Score <span className="font-semibold text-primary">{winner.score.toFixed(3)}</span>
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {results.map((item, index) => (
                <div
                  key={item.name}
                  className={cn(
                    'rounded-xl border px-3 py-3',
                    index === 0 ? 'border-[#c4a9f7] bg-[#faf7ff]' : 'border-line bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[9px] font-semibold leading-tight text-ink">{item.name}</p>
                    <span className="shrink-0 text-[8.5px] font-bold text-muted">#{index + 1}</span>
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-[20px] font-extrabold leading-none tracking-[-0.02em]',
                      index === 0 ? 'text-primary' : 'text-ink'
                    )}
                  >
                    {item.score.toFixed(3)}
                  </p>
                  <p className="mt-1 text-[7.5px] text-muted">/ 1.000</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#f1ebfa]">
                    <div
                      className={cn('h-1 rounded-full', index === 0 ? 'bg-primary' : 'bg-[#b18cf0]')}
                      style={{ width: `${item.score * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[8px] leading-[1.6] text-muted">{item.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f4eefb] px-5 py-3.5">
            <div>
              <h2 className="text-[13px] font-bold text-ink">Specification &amp; Normalisation Matrix</h2>
              <p className="mt-0.5 text-[9px] text-muted">
                Normalised value (R) is mapped to the 0.000 – 1.000 scale against each criterion weight.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[8px] text-muted">
              <span className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm bg-[#d9f5e4]" /> Best value
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm bg-[#f4eefb]" /> Normal
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#fdfbff]">
                  <th className="px-5 py-2.5 text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                    Attribute &amp; Weight
                  </th>
                  {results.map((item) => (
                    <th
                      key={item.name}
                      className="px-4 py-2.5 text-center text-[8px] font-bold uppercase tracking-[0.14em] text-muted"
                    >
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {smartphoneCriteria.map((criterion) => {
                  const bestNorm = Math.max(...results.map((item) => item.norm[criterion.id]))

                  return (
                    <tr key={criterion.id} className="border-t border-[#f4eefb]">
                      <td className="px-5 py-3 align-top">
                        <p className="text-[10px] font-semibold text-ink">{criterion.name}</p>
                        <p className="mt-1 flex items-center gap-1.5">
                          <span
                            className={cn(
                              'rounded px-1 py-0.5 text-[6.5px] font-bold uppercase tracking-wide',
                              criterion.type === 'cost'
                                ? 'bg-[#fdecec] text-[#b91c1c]'
                                : 'bg-[#e9f8ef] text-[#15803d]'
                            )}
                          >
                            {criterion.type}
                          </span>
                          <span className="text-[8px] text-muted">Weight: {criterion.weight}%</span>
                        </p>
                      </td>

                      {results.map((item) => {
                        const norm = item.norm[criterion.id]
                        const isBest = norm >= bestNorm - 0.0001

                        return (
                          <td
                            key={item.name}
                            className={cn(
                              'px-4 py-3 align-top',
                              isBest && 'bg-[#f4fcf7]'
                            )}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <p className="text-[10px] font-semibold text-ink">
                                {formatSawValue(criterion, item.values[criterion.id])}
                              </p>
                              {isBest && (
                                <span className="shrink-0 rounded bg-[#d9f5e4] px-1 py-0.5 text-[6.5px] font-bold uppercase tracking-wide text-[#15803d]">
                                  Best
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[7.5px] text-muted">SAW score</span>
                              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#f1ebfa]">
                                <div
                                  className="h-1 rounded-full bg-primary"
                                  style={{ width: `${norm * 100}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-[8.5px] font-bold text-primary">
                                {norm.toFixed(3)}
                              </span>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                <tr className="border-t border-line bg-[#faf6ff]">
                  <td className="px-5 py-3">
                    <p className="text-[10px] font-bold text-ink">Total SAW Score (V)</p>
                    <p className="mt-0.5 text-[8px] text-muted">Weighted sum of normalised values</p>
                  </td>
                  {results.map((item, index) => (
                    <td key={item.name} className="px-4 py-3 text-center">
                      <p className="text-[13px] font-extrabold text-primary">{item.score.toFixed(3)}</p>
                      <p className="text-[7.5px] text-muted">Rank #{index + 1}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Chobby synthesis */}
        <div className="mt-4 rounded-2xl border border-line bg-white p-4 md:p-5">
          <p className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-primary">
            Chobby Analytic Synthesis
            <span className="ml-1.5 font-medium normal-case tracking-normal text-muted">
              Model: SAW Multi-Attribute
            </span>
          </p>
          <div className="mt-3 flex items-start gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-[#eadcff]">
              <img src={chobbyMascot} alt="Chobby" className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-[14px] font-extrabold tracking-[-0.02em] text-ink md:text-[16px]">
                Trade-offs &amp; Final Evaluation
              </h3>
              <p className="mt-1.5 max-w-[640px] text-[10px] leading-[1.85] text-muted">
                {winner.name} leads by {margin}% thanks to the lowest price with the largest memory
                tier, while {results[1].name} stays competitive on display brightness and camera
                optics. {results[2].name} wins raw compute and camera sharpness, but its smaller battery
                and storage hold it back on the weighted score.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="mt-4 rounded-2xl border border-line bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-[12px] font-bold text-ink">Next Decision Step</h3>
              <p className="mt-1 max-w-[420px] text-[9.5px] leading-[1.8] text-muted">
                Test the weight sensitivity in the What-If simulation, then continue to the final
                ranking of the same criteria set.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/dashboard/ranking"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-primary-deep"
              >
                Open Decision Ranking
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-[#f8f4ff] px-3.5 py-2.5 text-[9px] leading-[1.7] text-muted">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          Demo dataset: six criteria weighted 25 / 20 / 15 / 15 / 15 / 10 with one cost attribute. All
          calculations run in your browser with no server round-trip.
        </p>
      </main>

      <Footer />
    </div>
  )
}
