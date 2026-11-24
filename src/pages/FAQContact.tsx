import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Info,
  LayoutList,
  Mail,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import chobbyMascot from '@/assets/chobby-mascot.png'
import { cn } from '@/lib/utils'

type Category = 'general' | 'ai' | 'saw' | 'plans'

const sections: {
  id: Category
  title: string
  nav: string
  desc: string
  icon: typeof LayoutList
}[] = [
  {
    id: 'general',
    title: 'General Questions',
    nav: 'General',
    desc: 'Core concepts, applicability, and getting started',
    icon: LayoutList,
  },
  {
    id: 'ai',
    title: 'AI Assistance',
    nav: 'AI Assistant',
    desc: 'How our algorithms guide and expand your thinking',
    icon: Sparkles,
  },
  {
    id: 'saw',
    title: 'Decision Process & SAW Method',
    nav: 'Decision & SAW',
    desc: 'The rigorous science powering your evaluations',
    icon: SlidersHorizontal,
  },
  {
    id: 'plans',
    title: 'Account & Plans',
    nav: 'Account & Plans',
    desc: 'Subscriptions, limits, and historical project retention',
    icon: CreditCard,
  },
]

const faqs: { id: number; category: Category; question: string; answer: string; hint?: string }[] = [
  {
    id: 1,
    category: 'general',
    question: 'What is MyChoice?',
    answer:
      'MyChoice is a structured decision-support tool. You describe a dilemma, set the criteria that matter, weight them, and compare alternatives through Simple Additive Weighting (SAW) so the trade-offs are visible instead of intuitive.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Who can use MyChoice?',
    answer:
      'Anyone facing a choice with more than one factor: students comparing courses or internships, professionals weighing job offers, teams choosing vendors, or individuals deciding on a purchase. No decision-science background is required.',
  },
  {
    id: 3,
    category: 'general',
    question: 'What types of decisions can I create?',
    answer:
      'Any multi-criteria decision — technology purchases, education and career moves, vendor selection, travel planning, or personal investments. You define the category, criteria, and candidates.',
  },
  {
    id: 4,
    category: 'ai',
    question: 'How does AI suggest criteria?',
    answer:
      'When you describe your decision and pick a category, Chobby proposes criteria commonly used for similar dilemmas — for example price, performance, and battery life for a laptop. Suggestions are a starting point; they are not locked in.',
  },
  {
    id: 5,
    category: 'ai',
    question: 'Can I edit the suggested criteria?',
    answer:
      'Yes. Every suggested criterion can be renamed, re-typed (benefit or cost), re-weighted, or removed. You can also add criteria the assistant did not suggest.',
  },
  {
    id: 6,
    category: 'ai',
    question: 'Does AI automatically decide for me?',
    answer:
      'No. MyChoice calculates weighted scores and ranks alternatives, then explains the trade-offs. The final decision always stays with you.',
    hint: 'Scores are calculated from your own criteria and weights.',
  },
  {
    id: 7,
    category: 'saw',
    question: 'What is the SAW method?',
    answer:
      'Simple Additive Weighting normalizes each criterion value to a comparable scale, multiplies it by the criterion weight, and sums the results into one score per alternative. The highest weighted score ranks first.',
  },
  {
    id: 8,
    category: 'saw',
    question: 'How does criteria weighting work?',
    answer:
      'Each criterion receives a weight that represents its importance. Cost criteria are inverted so a cheaper option scores higher, benefit criteria scale so a better value scores higher, and every weighted value contributes to the final score.',
  },
  {
    id: 9,
    category: 'saw',
    question: 'Why must the total weight equal 100%?',
    answer:
      'A total of 100% keeps the comparison mathematically consistent. If the weights did not add up, scores could not be compared fairly between alternatives or between decision matrices.',
  },
  {
    id: 10,
    category: 'saw',
    question: 'What is What-If Simulation?',
    answer:
      'It recalculates your rankings under different weights without touching your saved configuration. You can see instantly whether a leading option still wins when your priorities shift.',
  },
  {
    id: 11,
    category: 'plans',
    question: 'What is included in Basic?',
    answer:
      'Basic is free forever: up to 5 decisions per month, up to 3 alternatives per decision, AI-assisted criteria suggestions, criteria weighting, alternative comparison, SAW ranking, basic result explanation, and 30-day decision history.',
  },
  {
    id: 12,
    category: 'plans',
    question: 'What is included in Premium?',
    answer:
      'Premium is coming soon: unlimited decisions, up to 10 alternatives per decision, advanced AI models, trade-off matrices, What-If simulation with dynamic weight sweeps, lifetime decision history, personal insight reports, and priority support.',
  },
  {
    id: 13,
    category: 'plans',
    question: 'Can I view my previous decisions?',
    answer:
      'Yes. Basic keeps 30 days of decision history. Premium keeps a lifetime cloud archive so any earlier analysis can be reopened at any time.',
  },
]

const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'ai', label: 'AI Assistant' },
  { id: 'saw', label: 'SAW Method' },
  { id: 'plans', label: 'Plans' },
]

function FAQItem({
  question,
  answer,
  hint,
  open,
  onToggle,
}: {
  question: string
  answer: string
  hint?: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#fbf8ff]"
      >
        <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink">
          {question}
          {hint && <Info className="h-3 w-3 shrink-0 text-muted/50" />}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted/70 transition-transform',
            open && 'rotate-180 text-primary'
          )}
        />
      </button>
      {open && (
        <div className="border-t border-line px-4 py-3">
          <p className="text-[10.5px] leading-[1.85] text-muted">{answer}</p>
          {hint && <p className="mt-1.5 text-[9.5px] italic text-muted/70">{hint}</p>}
        </div>
      )}
    </div>
  )
}

export function FAQContact() {
  const [active, setActive] = useState<'all' | Category>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const term = query.trim().toLowerCase()

  const visibleSections = sections
    .filter((section) => active === 'all' || section.id === active)
    .map((section) => ({
      ...section,
      items: faqs.filter(
        (faq) =>
          faq.category === section.id &&
          (!term ||
            faq.question.toLowerCase().includes(term) ||
            faq.answer.toLowerCase().includes(term))
      ),
    }))
    .filter((section) => section.items.length > 0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = encodeURIComponent(`[${form.subject}] ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:support@mychoice.app?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="bg-white">
      <Navbar />

      <div className="mx-auto w-full max-w-[1180px] px-6 pt-6 md:px-8">
        <nav className="flex items-center gap-1.5 text-[11px] text-muted">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-muted/40" />
          <span className="font-medium text-primary">FAQ &amp; Contact</span>
        </nav>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1180px] px-6 pt-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f4ecfe] via-[#f0e4ff] to-[#f7f0ff] px-6 py-10 md:px-10 md:py-12">
          <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#c4a9f7]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#c4a9f7]/25 blur-3xl" />

          <div className="relative mx-auto max-w-[600px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
              <LayoutList className="h-3 w-3" />
              Support &amp; Resources
            </span>
            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.14] tracking-[-0.035em] text-ink md:text-[40px]">
              How Can We Help You?
            </h1>
            <p className="mx-auto mt-3 max-w-[480px] text-[11.5px] leading-[1.8] text-muted">
              Find answers about MyChoice, its features, and how our structured decision-support
              system empowers your clarity.
            </p>

            <div className="relative mx-auto mt-6 max-w-[470px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a question or keyword (e.g. SAW, weights, AI)..."
                aria-label="Search questions"
                className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-4 text-[11px] text-ink shadow-[0_14px_35px_-28px_rgba(76,29,149,0.6)] placeholder:text-muted/60 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActive(category.id)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[10px] font-medium transition-colors',
                    active === category.id
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-ink'
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Questions ──────────────────────────────────────────── */}
      <section className="py-10 md:py-12">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-6 md:px-8 lg:grid-cols-[220px_1fr]">
          {/* Quick navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-[86px] rounded-2xl border border-line bg-white p-3">
              <p className="px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-muted">
                Quick Navigation
              </p>
              <div className="mt-2 space-y-1">
                {sections.map((section) => {
                  const count = faqs.filter((faq) => faq.category === section.id).length
                  const isActive = active === section.id
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActive(isActive ? 'all' : section.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10.5px] transition-colors',
                        isActive
                          ? 'bg-[#f3ecfe] font-semibold text-primary'
                          : 'text-muted hover:bg-[#fbf8ff] hover:text-ink'
                      )}
                    >
                      <section.icon className="h-3 w-3 shrink-0" />
                      {section.nav}
                      <span className="ml-auto text-[9px] text-muted/60">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-8">
            {visibleSections.length === 0 && (
              <div className="rounded-2xl border border-line bg-[#fbf8ff] px-5 py-8 text-center">
                <p className="text-[11.5px] font-medium text-ink">No questions match “{query}”.</p>
                <p className="mt-1 text-[10.5px] text-muted">
                  Try another keyword, or send us a message below.
                </p>
              </div>
            )}

            {visibleSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3ecfe] text-primary">
                    <section.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h2 className="text-[14px] font-bold text-ink">{section.title}</h2>
                    <p className="mt-0.5 text-[9.5px] text-muted">{section.desc}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {section.items.map((faq) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      hint={faq.hint}
                      open={openId === faq.id}
                      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="bg-[#fbf8ff] py-12 md:py-14">
        <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-6 md:px-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#15803d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              Chobby &amp; The Team are Online
            </span>
            <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] text-ink md:text-[28px]">
              Still Have Questions?
            </h2>
            <p className="mt-2.5 max-w-[430px] text-[11px] leading-[1.85] text-muted">
              We'd love to hear from you. Reach out to the MyChoice team whether you have questions
              about methodology, need enterprise onboarding, or have feedback for our AI assistant.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { icon: Clock, label: 'Support Hours', value: 'Monday – Friday, 9:00 AM – 6:00 PM EST' },
                { icon: Zap, label: 'Response Commitment', value: 'Average response in under 2 hours' },
                { icon: Mail, label: 'Direct Email', value: 'support@mychoice.app', mail: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f6f0fe] text-primary">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                      {item.label}
                    </p>
                    {item.mail ? (
                      <a
                        href="mailto:support@mychoice.app"
                        className="text-[10.5px] font-medium text-primary hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[10.5px] font-medium text-ink">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border-l-2 border-primary bg-[#f3ecfe] px-4 py-3">
              <p className="text-[10px] italic leading-[1.8] text-muted">
                “The SAW framework turned our 3-week executive stalemate over office resolution into
                an objective 40-minute decision meeting.”
              </p>
              <p className="mt-1.5 text-[9px] font-medium text-muted">— Elena Rossi, VP Operations</p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_-50px_rgba(76,29,149,0.5)] md:p-6">
            <h3 className="text-[14px] font-bold text-ink">Send Us a Message</h3>
            <p className="mt-1 text-[10px] leading-[1.7] text-muted">
              Fill out the form and our specialist team will review your inquiry immediately.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="contact-name" className="text-[9.5px] font-semibold text-ink">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="contact-name"
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="h-9 w-full rounded-lg border border-line bg-[#fdfbff] px-3 text-[11px] text-ink placeholder:text-muted/50 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="text-[9.5px] font-semibold text-ink">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="alex@company.com"
                  className="mt-1 h-9 w-full rounded-lg border border-line bg-[#fdfbff] px-3 text-[11px] text-ink placeholder:text-muted/50 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-[9.5px] font-semibold text-ink">
                  Subject <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1">
                  <select
                    id="contact-subject"
                    required
                    value={form.subject}
                    onChange={(event) => setForm({ ...form, subject: event.target.value })}
                    className="h-9 w-full appearance-none rounded-lg border border-line bg-[#fdfbff] px-3 pr-8 text-[11px] text-ink focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                  >
                    <option value="">Select an inquiry topic...</option>
                    <option value="General Question">General Question</option>
                    <option value="Pricing & Plans">Pricing &amp; Plans</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Enterprise Onboarding">Enterprise Onboarding</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="text-[9.5px] font-semibold text-ink">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Describe your question or decision scenario in detail..."
                  className="mt-1 w-full resize-none rounded-lg border border-line bg-[#fdfbff] px-3 py-2 text-[11px] leading-[1.7] text-ink placeholder:text-muted/50 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-primary-deep"
              >
                Send Message
                <Send className="h-3 w-3" />
              </button>

              <p className="text-center text-[8.5px] leading-[1.7] text-muted/70">
                {sent
                  ? 'Your email app should open with the message pre-filled — send it to reach our team.'
                  : 'By submitting this form, you acknowledge our Privacy Policy.'}
              </p>
            </form>
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
                  Start Deciding with Confidence
                </span>
                <h2 className="mt-3 max-w-[420px] text-[26px] font-extrabold leading-[1.16] tracking-[-0.03em] text-white md:text-[33px]">
                  Ready to Experience MyChoice?
                </h2>
                <p className="mt-2.5 max-w-[420px] text-[11px] leading-[1.8] text-white/80">
                  Eliminate decision paralysis. Build your first structured comparison matrix in
                  less than 3 minutes with Chobby's smart criteria builder.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-[10.5px] font-bold text-primary transition-colors hover:bg-white/90"
                  >
                    Get Started for Free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-white/25"
                  >
                    Explore Demo Decision
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
