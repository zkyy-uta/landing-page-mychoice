import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Compass,
  Filter,
  LayoutGrid,
  Lightbulb,
  Sigma,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Target,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'

/* ─── Hero ───────────────────────────────────────────────────── */
const heroStats = [
  { value: '100%', label: 'User Controlled' },
  { value: 'SAW', label: 'Decision Science' },
  { value: 'Zero', label: 'Biased Clutter' },
]

/* ─── Story mockup ───────────────────────────────────────────── */
const dilemmaOptions = [
  { name: 'Tech Corp Internship', score: '0.89', best: true },
  { name: 'Early-Stage Startup Lead', score: '0.74', best: false },
  { name: 'Academic Research Fellowship', score: '0.68', best: false },
]

/* ─── Mission ────────────────────────────────────────────────── */
const mission = [
  {
    icon: Filter,
    title: 'Simplify Decision-Making',
    desc: 'Make complex choices easier to organize and evaluate.',
    meta: '01 / Foundation',
  },
  {
    icon: LayoutGrid,
    title: 'Empower Personal Priorities',
    desc: 'Help users identify and prioritize what matters most to them.',
    meta: '02 / Ownership',
  },
  {
    icon: Lightbulb,
    title: 'Provide Structured Insights',
    desc: 'Combine AI assistance with systematic decision analysis.',
    meta: '03 / Rigor',
  },
  {
    icon: Award,
    title: 'Encourage Informed Choices',
    desc: 'Help users understand their alternatives and make more confident decisions.',
    meta: '04 / Confidence',
  },
]

/* ─── Methodology ────────────────────────────────────────────── */
const foundations = [
  {
    icon: Sparkles,
    label: 'Foundation 01',
    title: 'AI Assistance',
    desc: 'Helping users identify relevant decision criteria. Our model parses your situation to expose blind spots and hidden trade-offs.',
    chip: 'Auto-populates weighted criteria',
  },
  {
    icon: Sigma,
    label: 'Foundation 02',
    title: 'Decision Science',
    desc: 'Using the Simple Additive Weighting (SAW) method to evaluate and rank alternatives through transparent, mathematical matrices.',
    chip: 'Transparent scoring algorithm',
  },
  {
    icon: Smile,
    label: 'Foundation 03',
    title: 'User-Centered Design',
    desc: 'Providing a simple and understandable experience that keeps users in control without algorithm fatigue or opaque decisions.',
    chip: 'Clarity over complexity',
  },
]

/* ─── Chobby stages ──────────────────────────────────────────── */
const chobbyStages = [
  {
    icon: Lightbulb,
    title: 'Chobby Thinking',
    stage: 'Stage 01 · Ideation',
    desc: 'Pondering criteria and priorities, Chobby helps brainstorm parameters you might have overlooked, asking: “What matters to you in 2 years?”',
    chip: 'Criteria formulation',
  },
  {
    icon: SlidersHorizontal,
    title: 'Chobby Guiding',
    stage: 'Stage 02 · Evaluation',
    desc: 'Assisting with weighting & comparison, Chobby checks trade-offs, helping you balance budget versus growth with clear visual sliders.',
    chip: 'Dynamic SAW matrices',
  },
  {
    icon: CheckCircle2,
    title: 'Chobby Waving',
    stage: 'Stage 03 · Resolution',
    desc: 'Celebrating confident choices. The sunglasses are on, the alternatives are crystal clear, and you can proceed with total conviction.',
    chip: 'Decision finalized',
  },
]

export function About() {
  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#f4ecfe] via-[#f8f3ff] to-[#fbf8ff] pb-16 pt-8 md:pb-20">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted/40" />
            <span className="font-medium text-primary">About</span>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                About MyChoice
              </span>
              <h1 className="mt-4 max-w-[480px] text-[32px] font-extrabold leading-[1.14] tracking-[-0.035em] text-ink md:text-[44px]">
                Making Every Choice{' '}
                <span className="text-primary">More Meaningful.</span>
              </h1>
              <p className="mt-4 max-w-[450px] text-[12.5px] leading-[1.8] text-muted">
                MyChoice was created to help people navigate difficult decisions through structured
                comparisons, personalized priorities, and AI-assisted insights.
              </p>

              <div className="mt-7 grid max-w-[460px] grid-cols-3 gap-2.5">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-line bg-white px-3 py-3 shadow-[0_12px_30px_-26px_rgba(76,29,149,0.6)]"
                  >
                    <p className="text-[14px] font-bold leading-none text-ink">{stat.value}</p>
                    <p className="mt-1.5 text-[9px] leading-tight text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot showcase */}
            <div className="relative mx-auto w-full max-w-[400px]">
              <span className="absolute -top-2 left-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[9px] font-semibold text-primary shadow-sm">
                <Compass className="h-2.5 w-2.5" />
                Guided Clarity
              </span>

              <div className="rounded-[26px] border border-line bg-white p-3.5 shadow-[0_30px_70px_-45px_rgba(76,29,149,0.55)]">
                <div className="flex items-center justify-center rounded-2xl bg-[#f6efff] px-4 py-7">
                  <div className="flex h-[236px] w-[236px] items-center justify-center rounded-full bg-[#ece0ff]">
                    <img
                      src={chobbyMascot}
                      alt="Chobby mascot"
                      className="h-[200px] w-[200px] rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between px-1.5">
                  <span className="flex items-center gap-1.5 text-[9px] font-medium text-muted">
                    <Target className="h-2.5 w-2.5 text-primary" />
                    Priorities Aligned
                  </span>
                  <span className="text-[9px] font-semibold text-primary">SAW Matrix Active</span>
                </div>
              </div>

              <span className="absolute -bottom-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#0f9d58] px-2.5 py-1.5 text-[9px] font-semibold text-white shadow-md">
                <SlidersHorizontal className="h-2.5 w-2.5" />
                Dynamic Weighting
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ──────────────────────────────────────────────── */}
      <section className="py-14 md:py-16">
        <div className="mx-auto grid w-full max-w-[1180px] items-start gap-10 px-6 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* Mockup */}
          <div className="rounded-2xl border border-line bg-[#f6f0fe] p-4 md:p-5">
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1e7ff] text-primary">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[12.5px] font-bold text-ink">Internship Dilemma</h3>
                    <p className="text-[9px] text-muted">3 alternatives evaluated</p>
                  </div>
                </div>
                <span className="rounded-md bg-[#f1e7ff] px-2 py-0.5 text-[8.5px] font-semibold text-primary">
                  SAW Active
                </span>
              </div>

              <div className="mt-3.5 space-y-1.5">
                {dilemmaOptions.map((option, index) => (
                  <div
                    key={option.name}
                    className="flex items-center gap-2 rounded-lg bg-[#faf7ff] px-2.5 py-2"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f1e7ff] text-[8px] font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-[10.5px] font-medium text-ink">{option.name}</span>
                    <span className="ml-auto flex items-center gap-1 text-[9.5px] text-muted">
                      Score: <span className="font-semibold text-ink">{option.score}</span>
                      {option.best && <CheckCircle2 className="h-3 w-3 text-[#16a34a]" />}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2 rounded-lg bg-[#f3ecfe] px-2.5 py-2">
                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                <p className="text-[9px] leading-[1.65] text-muted">
                  <span className="font-semibold text-ink">AI Critique Suggestion:</span> Added
                  ‘Mentorship Quality’ and ‘Commute Time’ based on academic workload profile.
                </p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary">Our Story</p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Why We Created MyChoice.
            </h2>
            <div className="mt-4 space-y-3.5 text-[11.5px] leading-[1.85] text-muted">
              <p>
                Every day, students face decisions that can influence their academic journey and
                personal development. From choosing the right technology to exploring internship
                opportunities, each decision involves different needs, priorities, and
                considerations.
              </p>
              <p>
                However, comparing multiple alternatives is not always easy. Information is
                scattered across different sources, priorities are often unclear, and evaluating
                options manually can take considerable time.
              </p>
              <p>
                MyChoice was developed to make this process more structured and accessible by
                combining AI-assisted suggestions with a systematic decision-making method. Our goal
                is to help users understand their options, evaluate what matters most, and make
                decisions with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision ─────────────────────────────────────────────── */}
      <section className="pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 md:p-9">
            {/* Compass decoration */}
            <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-[300px] w-[300px] -translate-y-1/2 items-center justify-center md:flex">
              <div className="absolute h-[300px] w-[300px] rounded-full border border-dashed border-[#e4d7f7]" />
              <div className="absolute h-[210px] w-[210px] rounded-full border border-dashed border-[#e4d7f7]" />
              <svg viewBox="0 0 100 100" className="relative h-[120px] w-[120px]" aria-hidden="true">
                <polygon points="50,10 58,50 50,90 42,50" fill="#e9dcff" />
                <polygon points="50,10 58,50 50,58 42,50" fill="#c9aef3" />
              </svg>
            </div>

            <div className="relative max-w-[560px]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1e7ff] text-primary">
                <Compass className="h-4 w-4" />
              </span>
              <p className="mt-3 text-[8.5px] font-bold uppercase tracking-[0.18em] text-muted">
                North Star
              </p>
              <h2 className="mt-1.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[28px]">
                Our Vision.
              </h2>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink md:text-[15px]">
                “To make informed and structured decision-making more accessible for everyone.”
              </p>
              <p className="mt-2.5 text-[11px] leading-[1.85] text-muted">
                We envision a world where significant career, academic, and life crossroads are met
                with calm clarity rather than overwhelming anxiety. By democratizing multi-attribute
                decision science, every individual can align their daily choices with their authentic
                values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section className="bg-[#f8f4ff] py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Purpose Driven
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Our Mission.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[520px] text-[11px] leading-[1.8] text-muted">
              Four tenets that guide every algorithm, interface update, and interaction within
              MyChoice.
            </p>
          </div>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {mission.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-[0_18px_45px_-42px_rgba(76,29,149,0.55)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1e7ff] text-primary">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <h3 className="mt-4 text-[12.5px] font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-1.5 flex-1 text-[10.5px] leading-[1.75] text-muted">{item.desc}</p>
                <p className="mt-4 text-[8.5px] font-medium text-muted/70">{item.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ────────────────────────────────────────── */}
      <section className="py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Our Methodology
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Technology with a Purpose.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[520px] text-[11px] leading-[1.8] text-muted">
              We integrate contemporary AI guidance with proven multi-criteria decision mathematics.
            </p>
          </div>

          <div className="mt-8 grid gap-3.5 md:grid-cols-3">
            {foundations.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_18px_45px_-42px_rgba(76,29,149,0.55)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1e7ff] text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </p>
                <h3 className="mt-1.5 text-[13.5px] font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 flex-1 text-[10.5px] leading-[1.8] text-muted">{item.desc}</p>
                <span className="mt-4 inline-flex rounded-lg border border-line bg-[#faf7ff] px-2.5 py-1.5 text-[9px] font-medium text-muted">
                  {item.chip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chobby ─────────────────────────────────────────────── */}
      <section className="bg-[#f8f4ff] py-14 md:py-16">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="text-center">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.2em] text-primary">
              Your Decision Companion
            </p>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[30px]">
              Meet Chobby – Your Choice Buddy.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[540px] text-[11px] leading-[1.8] text-muted">
              Chobby is the friendly mascot of MyChoice, representing a supportive companion that
              helps users navigate their decision-making journey with cheer and composure.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-line bg-[#f3ecfe] p-4 md:p-5">
            <div className="grid items-center gap-5 md:grid-cols-[0.75fr_1fr]">
              <div className="flex justify-center rounded-2xl bg-white p-4">
                <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[#ece0ff] md:h-[220px] md:w-[220px]">
                  <img
                    src={chobbyMascot}
                    alt="Chobby mascot"
                    className="h-[168px] w-[168px] rounded-full object-cover md:h-[196px] md:w-[196px]"
                  />
                </div>
              </div>

              <div className="px-1 md:pr-4">
                <span className="inline-flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Official Mascot
                </span>
                <h3 className="mt-2 text-[17px] font-bold tracking-[-0.01em] text-ink md:text-[19px]">
                  Always here to celebrate clarity.
                </h3>
                <p className="mt-2 max-w-[420px] text-[10.5px] leading-[1.85] text-muted">
                  When analysis paralysis strikes, Chobby brings a reassuring perspective. Never
                  prescriptive, never overwhelming—just an upbeat friend reminding you that making
                  thoughtful choices can be fulfilling and fun.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <span className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-2 text-[9.5px] font-medium text-muted">
                    <CheckCircle2 className="h-3 w-3 text-[#16a34a]" />
                    Stress-Free Guidance
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-2 text-[9.5px] font-medium text-muted">
                    <Lightbulb className="h-3 w-3 text-primary" />
                    Intuitive Insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 grid gap-3.5 md:grid-cols-3">
            {chobbyStages.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1e7ff] text-primary">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <h3 className="mt-4 text-[12.5px] font-bold text-ink">{item.title}</h3>
                <p className="mt-0.5 text-[8.5px] text-muted">{item.stage}</p>
                <p className="mt-2 flex-1 text-[10.5px] leading-[1.8] text-muted">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 self-start rounded-lg bg-[#faf7ff] px-2 py-1 text-[8.5px] font-medium text-muted">
                  <item.icon className="h-2.5 w-2.5 text-primary" />
                  {item.chip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-6 py-9 md:px-9 md:py-11">
            <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="relative grid items-center gap-7 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <Sparkles className="h-2.5 w-2.5" />
                  Start Deciding Smarter
                </span>
                <h2 className="mt-3 max-w-[520px] text-[24px] font-extrabold leading-[1.18] tracking-[-0.03em] text-white md:text-[31px]">
                  Let's Make Better Choices Together.
                </h2>
                <p className="mt-2.5 max-w-[480px] text-[11px] leading-[1.8] text-white/80">
                  Turn confusion into conviction. Experience how effortless choices feel when AI
                  assistance pairs with transparent multi-criteria decision science.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[10.5px] font-bold text-primary transition-colors hover:bg-white/90"
                  >
                    Explore MyChoice
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-white/25"
                  >
                    View Decision Matrix
                  </Link>
                </div>
              </div>

              <div className="flex justify-start md:justify-end">
                <div className="flex h-[112px] w-[112px] items-center justify-center rounded-2xl bg-white/10 md:h-[128px] md:w-[128px]">
                  <img
                    src={chobbyMascot}
                    alt="Chobby mascot"
                    className="h-[100px] w-[100px] rounded-full object-cover md:h-[114px] md:w-[114px]"
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
