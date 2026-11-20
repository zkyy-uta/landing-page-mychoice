import { Link } from 'react-router-dom'
import { Compass, Target, Brain, Rocket, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import { cn } from '@/lib/utils'

const statItems = [
  { label: '100%', value: 'Clarity', sub: 'Decision Confidence' },
  { label: 'SAW', value: 'Method', sub: 'Decision Science' },
  { label: 'Zero', value: 'Bias', sub: 'Brand Clutter' },
]

const storyItems = [
  {
    number: '1',
    title: 'Internship Dilemma',
    sub: '3 Internships received',
    score: 'SAW Active',
    scoreValue: '0.89',
  },
  {
    number: '2',
    title: 'Early-Stage Startup Lead',
    sub: '',
    score: 'Score: 0.74',
    scoreValue: '',
  },
  {
    number: '3',
    title: 'Academic Research Fellowship',
    sub: '',
    score: 'Score: 0.68',
    scoreValue: '',
  },
]

const missionItems = [
  {
    icon: Target,
    title: 'Simplify Decision-Making',
    desc: 'Make complex choices easier to organize and exclude.',
    stat: '01 / Foundation',
  },
  {
    icon: Brain,
    title: 'Empower Personal Priorities',
    desc: 'Help users identify and clarify what matters most to them.',
    stat: '02 / Consistency',
  },
  {
    icon: Rocket,
    title: 'Provide Structured Insights',
    desc: 'Combine AI assistance with systematic decision analysis.',
    stat: '03 / Rigor',
  },
  {
    icon: ShieldCheck,
    title: 'Encourage Informed Choices',
    desc: 'Help users understand their options and make more confident decisions.',
    stat: '04 / Confidence',
  },
]

const techItems = [
  {
    number: 'FOUNDATION 01',
    title: 'AI Assistance',
    desc: 'Helping users identify relevant decision criteria and assist in navigating multi-criteria trade-offs.',
    badge: 'Auto-populates weighted criteria',
  },
  {
    number: 'FOUNDATION 02',
    title: 'Decision Science',
    desc: 'Using the Simple Additive Weighting method combined with pairwise comparisons to calculate weighted scores and transparency scoring across alternatives.',
    badge: 'Transparent scoring algorithms',
  },
  {
    number: 'FOUNDATION 03',
    title: 'User-Centered Design',
    desc: 'Providing a simple and understandable interface that reduces cognitive fatigue without algorithms fatigue or opaque decisions.',
    badge: 'Clarity over complexity',
  },
]

export function Home() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-100/30 rounded-full blur-[120px] -z-10" />

        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">About MyChoice</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-text-h leading-tight text-balance">
                Making Every Choice<br />
                <span className="text-brand-600">More Meaningful.</span>
              </h1>
              <p className="text-lg text-text/80 max-w-lg leading-relaxed">
                MyChoice was created to help people navigate difficult decisions through structured comparisons, personalized priorities, and AI-assisted insights.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/pricing"
                  className="btn-primary"
                >
                  Explore MyChoice <span aria-hidden="true">→</span>
                </Link>
                <Link to="/how-it-works" className="btn-secondary">
                  View Decision Matrix
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand-50 rounded-3xl p-[2px] mask mask-squish" />
              <div className="relative bg-white rounded-3xl border border-brand-100 shadow-2xl p-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-brand-100 flex items-center justify-center mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full mask mask-squish" />
                    <div className="relative z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center overflow-hidden">
                          <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    SAW Matrix Active
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-xs font-medium border border-brand-100">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Objective Weighting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-50 py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-6">
            {statItems.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-brand-100 p-6 text-center shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-text-h">{stat.label}</span>
                  <span className="text-sm font-medium text-brand-600">{stat.value}</span>
                  <span className="text-xs text-text/60 mt-1">{stat.sub}</span>
                </div>
                {i < statItems.length - 1 && (
                  <div className="w-px h-8 bg-brand-200 mx-auto mt-4 mb-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-brand-100/20 rounded-full blur-[100px] -z-10" />
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-6">
                Why We Created MyChoice.
              </h2>
              <div className="space-y-6 text-lg text-text/90 leading-relaxed max-w-lg">
                <p>
                  Every day, students face decisions that can influence their academic journey and personal development. From choosing electives to managing time, these choices shape their futures.
                </p>
                <p>
                  However, comparing multiple alternatives is not always easy. Information is scattered across different sources, priorities are often unclear, and evaluating options manually can take considerable time.
                </p>
                <p>
                  MyChoice was developed to make this process more structured and accessible by combining decision science with AI assistance. Our goal is to help users understand their options, evaluate what matters most, and make decisions with greater confidence.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="grid md:grid-cols-2 gap-4">
                {storyItems.map((item, i) => (
                  <div
                    key={item.number}
                    className={cn(
                      'bg-white rounded-2xl border border-brand-100 p-5 shadow-sm hover:shadow-md transition-all',
                      i === 0 ? 'col-span-2 md:col-span-1' : ''
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-medium">
                        {item.number}
                      </div>
                      <span className="text-xs text-text/50 uppercase tracking-wider font-medium">{item.score}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-h mb-1">{item.title}</h3>
                    {item.sub && <p className="text-xs text-text/60">{item.sub}</p>}
                    {item.scoreValue && (
                      <div className="mt-3 pt-3 border-t border-brand-50 flex justify-between items-end">
                        <span className="text-xs font-medium text-brand-600">{item.scoreValue}</span>
                        <span className="text-[10px] text-text/40 uppercase tracking-wider">SAW Score</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* North Star */}
      <section className="py-20 md:py-28 bg-brand-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] -z-10" />
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-1 lg:order-2">
              <div className="w-24 h-24 rounded-3xl bg-brand-100 flex items-center justify-center mb-6 relative">
                <Compass className="w-10 h-10 text-brand-600" />
                <div className="absolute inset-0 border border-brand-200/50 rounded-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-6">
                North Star.
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-text-h mb-6">Our Vision.</h3>
              <p className="text-lg text-text/90 leading-relaxed mb-8 max-w-lg">
                &ldquo;To make informed and structured decision-making more accessible for everyone.&rdquo;
              </p>
              <p className="text-text/70 leading-relaxed max-w-lg">
                We envision a world where significant career, academic, and life crossroads are met with calm clarity rather than overwhelming anxiety. By demonstrating multi-criteria decision science, we help individuals cut through ambiguity and make choices with authentic value.
              </p>
            </div>

            <div className="order-2 lg:order-1">
              <div className="relative w-full h-[400px]">
                <svg className="w-full h-full text-brand-200/30" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth={1} opacity={0.3} />
                  <path d="M200 20 L200 380 M20 200 L380 200" stroke="currentColor" strokeWidth={1} opacity={0.3} />
                  <path d="M56.6 56.6 L343.4 343.4 M56.6 343.4 L343.4 56.6" stroke="currentColor" strokeWidth={1} opacity={0.3} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container-max relative">
          <div className="section-header">
            <span className="badge">Purpose Driven</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">Our Mission.</h2>
            <p className="text-text/60 text-sm uppercase tracking-wider font-medium">
              Four tenets that guide every algorithm, interface update, and interaction within MyChoice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionItems.map((item) => (
              <div key={item.title} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{item.stat}</span>
                </div>
                <h3 className="text-lg font-bold text-text-h mb-3">{item.title}</h3>
                <p className="text-sm text-text/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 md:py-28 bg-brand-50 relative overflow-hidden">
        <div className="container-max relative">
          <div className="section-header">
            <span className="badge">Our Methodology</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
              Technology with a Purpose.
            </h2>
            <p className="text-text/60 text-sm uppercase tracking-wider font-medium">
              We integrate contemporary AI generation with proven multi-criteria decision mathematics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {techItems.map((item) => (
              <div key={item.title} className="card">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.number.split(' ')[1]}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider mt-0.5">{item.number.split(' ')[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-text-h mb-3">{item.title}</h3>
                <p className="text-sm text-text/70 leading-relaxed">{item.desc}</p>
                <div className="mt-4 pt-4 border-t border-brand-50">
                  <span className="text-[10px] font-bold text-text/40 uppercase tracking-wider block mb-1">{item.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choby Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Your Decision Companion</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">
                Meet Choby — Your Choice Buddy.
              </h2>
              <p className="text-lg text-text/80 leading-relaxed max-w-lg">
                Choby is the friendly mascot of MyChoice, representing a supportive companion that helps users navigate their decision-making journey with cheer and compose.
              </p>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative w-full h-[400px] bg-brand-50 rounded-3xl border border-brand-100 p-8 flex items-center justify-center overflow-hidden">
                <div className="w-48 h-48 rounded-full bg-white border-4 border-brand-200 flex items-center justify-center relative shadow-xl">
                  <div className="w-36 h-36 bg-yellow-200 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-brand-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center absolute shadow-xl">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Choby Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                  <span className="text-[10px] font-bold">🤔</span>
                </div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Stage 01 • Intention</span>
              </div>
              <h3 className="text-lg font-bold text-text-h mb-3">Choby Thinking</h3>
              <p className="text-sm text-text/70 leading-relaxed">
                Pondering criteria and priorities, Choby helps you identify what truly matters before you even begin comparing options.
              </p>
              <div className="mt-4 pt-4 border-t border-brand-50">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Criteria formation</span>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                  <span className="text-[10px] font-bold">📐</span>
                </div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Stage 02 • Evaluation</span>
              </div>
              <h3 className="text-lg font-bold text-text-h mb-3">Choby Guiding</h3>
              <p className="text-sm text-text/70 leading-relaxed">
                Assisting with weighting &amp; comparison, Choby gently surfaces the right balance between budget vs growth with clear visual sliders.
              </p>
              <div className="mt-4 pt-4 border-t border-brand-50">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Dynamic SAW weights</span>
              </div>
            </div>
            <div className="card">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                  <span className="text-[10px] font-bold">🕶️</span>
                </div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Stage 03 • Resolution</span>
              </div>
              <h3 className="text-lg font-bold text-text-h mb-3">Choby Waving</h3>
              <p className="text-sm text-text/70 leading-relaxed">
                Celebrating confident choices, The sunglasses come off when your decision matrix points to a clear path forward, and you can proceed with fullest conviction.
              </p>
              <div className="mt-4 pt-4 border-t border-brand-50">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Decision Finalized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-[3rem] overflow-hidden" />
          <div className="absolute inset-0 bg-brand-900/20" />
          <div className="relative container-max py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Start Deciding Smarter
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Let's Make Better Choices Together.
                </h2>
                <p className="text-brand-100 text-lg leading-relaxed mb-8 max-w-lg">
                  Turn confusion into conviction. Experience how effortless choices feel when AI assistance pairs with transparent multi-criteria decision science.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/pricing" className="btn-primary">
                    Explore MyChoice <span aria-hidden="true">→</span>
                  </Link>
                  <Link to="/how-it-works" className="btn-secondary text-white border-white/20 hover:bg-white/10">
                    View Decision Matrix
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-brand-500/20 flex items-center justify-center border border-white/10 relative z-10 shadow-2xl shadow-brand-500/20">
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
