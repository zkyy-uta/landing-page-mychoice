import { Link } from 'react-router-dom'
import { Laptop, Target, Shield, ArrowRight, BarChart3, Rocket } from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: '01',
    title: 'Define What You Need to Decide',
    category: 'Intention',
    desc: 'Name your dilemma and assign a category to anchor relevant criteria and benchmarks immediately.',
    example: '“Choosing a programming laptop”',
    tech: 'Technology',
  },
  {
    number: '02',
    title: 'Let AI Help You Identify What Matters',
    category: 'AI Criteria',
    desc: 'Choby scans your category and generates criteria, then gives you full control to add, edit, or prune.',
    example: 'Price · Value · RAM & Multitasking · Display Quality',
    tech: 'AI Assistance',
  },
  {
    number: '03',
    title: 'Give Each Criterion Its Importance',
    category: 'Weights',
    desc: 'Adjust response weight sliders with real-time recalibration, totaling 100% total weight validation.',
    example: 'Price Priority · 30%',
    tech: 'Weighting',
  },
  {
    number: '04',
    title: 'Add Candidates Together',
    category: 'Candidates',
    desc: 'Enter your options with accurate attribute values; free supports up to 3 options, 10 with Premium.',
    example: 'MacBook Air M3 · $1,099',
    tech: 'Options',
  },
  {
    number: '05',
    title: 'Calculation',
    category: 'Calculation',
    desc: 'See how your options compare using algorithms that normalize scores for rigorous mathematical comparison.',
    example: 'Rank #1: MacBook Air M3 · 92.4 pts',
    tech: 'SAW Math',
  },
  {
    number: '06',
    title: 'Understand Your Results Before Deciding',
    category: 'Synthesis',
    desc: 'Understand your results before deciding: audit trails, run sensitivity simulations, and review the plain-language executive rationale.',
    example: 'View Comparison · What-If Simulation',
    tech: 'Insights',
  },
]

const benefits = [
  {
    icon: Target,
    title: 'Clear Priorities',
    desc: 'Forces upright alignment on what matters before individual options bias your perspective.',
  },
  {
    icon: BarChart3,
    title: 'Organized Comparisons',
    desc: 'Consolidates scattered specs, side-by-side alternatives, and opinions into one standardized matrix.',
  },
  {
    icon: Shield,
    title: 'Transparent Calculations',
    desc: 'Zero black-box AI sorcery — every score is verifiable through the academic SAW formula.',
  },
  {
    icon: Rocket,
    title: 'More Informed Decisions',
    desc: 'Gives executive clarity on exactly what to choose, decisively without post-purchase remorse.',
  },
]

const walkthroughSteps = [
  { step: '1', title: 'Category Selected', desc: 'The user picks "Technology & Hardware" and enters the intent: "Selecting primary machine for full-stack engineering and local containers."' },
  { step: '2', title: 'AI Criteria', desc: 'Choby suggests: Price, Performance (CPU), RAM & Multitasking, Display Quality, Battery Life, Portability.' },
  { step: '3', title: 'Weights', desc: 'User assigns: Performance 30%, Price 25%, RAM 20%, Display 15%, Battery 10%.' },
  { step: '4', title: 'Options', desc: 'MacBook Air M3, ThinkPad T14 Gen 4, Dell XPS 13 Plus.' },
  { step: '5', title: 'Calculation', desc: 'MacBook Air M3 scores 92.4 pts — Best Match.' },
  { step: '6', title: 'Ranked', desc: 'Confident purchase with a shareable rationale.' },
]

const comparisonOptions = [
  {
    name: 'MacBook Air M3',
    price: '$1,099',
    score: '92.4',
    badge: 'Best Match',
    specs: ['M3 chip, 8-core CPU', '8GB RAM, 256GB SSD', '13.6" Liquid Retina', '18 hours'],
  },
  {
    name: 'ThinkPad T14 Gen 4',
    price: '$1,450',
    score: '84.1',
    badge: 'Balanced Alternative',
    specs: ['Ryzen 7 Pro, 8-core', '16GB RAM, 512GB SSD', '14" WUXGA IPS', '12 hours'],
  },
  {
    name: 'Dell XPS 13 Plus',
    price: '$1,299',
    score: '79.8',
    badge: 'Rising Star',
    specs: ['Intel Core i7', '16GB RAM, 512GB SSD', '13.4" OLED', '11 hours'],
  },
]

export function HowItWorks() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-brand-100/30 rounded-full blur-[120px] -z-10" />
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">How It Works</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-text-h leading-tight text-balance">
                From Confusion to<br />
                <span className="text-brand-600">Confidence in Every Decision.</span>
              </h1>
              <p className="text-lg text-text/80 max-w-lg leading-relaxed">
                Making decisions doesn't have to be complicated. Follow a simple process to compare alternatives and understand which option best matches your priorities.
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <Link to="#" className="btn-primary">
                  Start Your First Decision <span aria-hidden="true">→</span>
                </Link>
                <Link to="/#features" className="btn-secondary">
                  See Interactive Example
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-50 border border-brand-100">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-brand-700">Live Weighting</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-50 border border-brand-100">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-xs font-medium text-brand-700">SAW Model Sync</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mask mask-squish opacity-50" />
                <div className="relative z-10 w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-36 h-36 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Laptop className="w-10 h-10 text-yellow-600" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-brand-600 text-white rounded-lg px-3 py-1 shadow-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-bold">94.6%</span>
                  </div>
                  <div className="text-[10px] text-brand-100/80 mt-0.5">MacBook Pro 14</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Steps */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/30 -z-10" />
        <div className="container-max relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              The Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              Simple Steps to Unbiased Clarity
            </h2>
            <p className="text-text/60 text-sm max-w-xl mx-auto uppercase tracking-wider font-medium">
              Six structured checkpoints engineered to truncate hesitation into objective evaluation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <span className="text-sm font-bold">{step.number}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{step.category}</span>
                </div>
                <h3 className="text-lg font-bold text-text-h mb-3">{step.title}</h3>
                <p className="text-sm text-text/70 leading-relaxed mb-4">{step.desc}</p>
                <div className="pt-3 border-t border-brand-50">
                  <span className="text-[10px] font-bold text-text/40 uppercase tracking-wider block mb-1">{step.tech}</span>
                  <span className="text-xs text-brand-600 font-medium">{step.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realistic Walkthrough */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container-max relative">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
                Realistic Walkthrough
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
                Choosing the Best Laptop for Programming
              </h2>
            </div>
            <Link to="#" className="btn-ghost">
              Interactive Example <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-6">
              {walkthroughSteps.map((step, i) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    i < 3 ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-600'
                  )}>
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-h">{step.title}</h4>
                    <p className="text-xs text-text/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-white to-brand-50 rounded-[3rem] border border-brand-100 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100/50 rounded-full blur-[60px] -z-10" />
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Category</span>
                    <span className="text-xs text-text/60">Technology & Hardware</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Intent Statement</span>
                    <span className="text-xs text-text/60 max-w-xs">"Selecting primary machine for full-stack engineering with 20GB+ RAM"</span>
                  </div>
                  <div className="h-px bg-brand-100 my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-green-600 uppercase">Completed</span>
                      </div>
                      <span className="text-sm text-text-h">6 Alternatives</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-brand-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span className="text-[10px] font-bold text-brand-600 uppercase">In Progress</span>
                      </div>
                      <span className="text-sm text-text-h">View Details →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-brand-50 relative overflow-hidden">
        <div className="container-max relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              Objective Value
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              A More Structured Way to Decide.
            </h2>
            <p className="text-text/60 text-sm max-w-xl mx-auto uppercase tracking-wider font-medium">
              Decision fatigue stems from unstructured thoughts. MyChoice untangles emotional paralysis through verified cognitive support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-text-h mb-3">{benefit.title}</h3>
                <p className="text-sm text-text/70 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 rounded-xl bg-brand-50 border border-brand-100 flex items-start gap-3">
            <Shield className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-text/60 leading-relaxed max-w-xs">
              You Stay in Control: MyChoice is engineered as a cognitive support framework, not an autonomous agent. Algorithms calculate and suggest alignment based on your weights — the final judgment always remains entirely yours.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Example */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container-max relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              See the Math
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              Compare Your Options Side by Side.
            </h2>
            <p className="text-text/60 text-sm max-w-xl mx-auto uppercase tracking-wider font-medium">
              Organize multiple alternatives into one structured comparison you can evaluate with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {comparisonOptions.map((opt) => (
              <div key={opt.name} className={cn(
                'card relative group',
                opt.badge === 'Best Match' ? 'border-brand-300 shadow-xl shadow-brand-200/50' : ''
              )}>
                {opt.badge === 'Best Match' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Best Match</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Laptop className="w-5 h-5 text-text/40 group-hover:text-brand-600 transition-colors" />
                  <h3 className="text-lg font-bold text-text-h">{opt.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xl font-bold text-text-h">{opt.price}</span>
                </div>
                <div className="space-y-2 mb-6 text-sm text-text/70">
                  {opt.specs.map((spec) => (
                    <div key={spec} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text/60">SAW Score</span>
                  <span className="text-2xl font-bold text-brand-600">{opt.score} pts</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="btn-ghost">
              Run What-If Simulation <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-brand-900/30" />
          <div className="relative container-max py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium mb-4">
                  Free · No Credit Card Required
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Ready to Make Better Decisions?<br />
                  <span className="text-brand-300">Start Here.</span>
                </h2>
                <p className="text-brand-100 text-lg leading-relaxed mb-8 max-w-lg">
                  Stop cycling through second thoughts. Map out your priorities in minutes and discover clarity with Choby by your side.
                </p>
                <Link to="/pricing" className="btn-primary">
                  Try MyChoice Now <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="relative hidden lg:block">
                <div className="w-48 h-48 rounded-full bg-brand-500/20 flex items-center justify-center border border-white/10 shadow-2xl shadow-brand-500/20">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
                    <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
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
