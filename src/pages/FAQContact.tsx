import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, HelpCircle, Mail, ChevronDown, Brain, ShieldCheck, Clock } from 'lucide-react'
import { Navbar } from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/Footer'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', label: 'All', count: 13 },
  { id: 'general', label: 'General', count: 3 },
  { id: 'ai', label: 'AI Assistant', count: 3 },
  { id: 'saw', label: 'SAW Method', count: 4 },
  { id: 'plans', label: 'Plans', count: 3 },
]

const faqs = [
  {
    id: 1,
    category: 'general',
    question: 'What is MyChoice?',
    answer: 'MyChoice is your personal decision-support assistant, helping you make informed choices through AI-powered insights and structured comparisons.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Who can use MyChoice?',
    answer: 'Anyone facing decisions — students choosing courses, professionals comparing job offers, teams selecting vendors, or individuals making life choices.',
  },
  {
    id: 3,
    category: 'general',
    question: 'What types of decisions can I create?',
    answer: 'You can create decisions for career moves, purchases, education, relationships, investments, and any multi-criteria choice you face.',
  },
  {
    id: 4,
    category: 'ai',
    question: 'How does AI suggest criteria?',
    answer: 'Our AI analyzes your decision context and suggests relevant evaluation criteria based on similar decisions and best practices.',
  },
  {
    id: 5,
    category: 'ai',
    question: 'Can I edit the suggested criteria?',
    answer: 'Yes, you have full control to add, edit, or remove any criteria suggested by the AI assistant.',
  },
  {
    id: 6,
    category: 'ai',
    question: 'Does AI automatically decide for me?',
    answer: 'No. MyChoice provides analysis and recommendations, but you always make the final decision.',
  },
  {
    id: 7,
    category: 'saw',
    question: 'What is the SAW method?',
    answer: 'SAW (Simple Additive Weighting) is a decision-making method that evaluates alternatives by weighting criteria and calculating scores.',
  },
  {
    id: 8,
    category: 'saw',
    question: 'How does criteria weighting work?',
    answer: 'You assign importance percentages to each criterion. The total must equal 100%, and the weights determine how much each criterion influences the final score.',
  },
  {
    id: 9,
    category: 'saw',
    question: 'Why must the total weight equal 100%?',
    answer: 'This ensures fair comparison across all alternatives by normalizing the relative importance of each criterion.',
  },
  {
    id: 10,
    category: 'saw',
    question: 'What is What-If Simulation?',
    answer: 'What-If Simulation lets you explore how changing criteria weights or alternative scores would affect your final decision ranking.',
  },
  {
    id: 11,
    category: 'plans',
    question: 'What is included in Basic?',
    answer: 'Basic includes up to 5 decisions per month, 3 alternatives per decision, AI-assisted suggestions, and 30-day decision history.',
  },
  {
    id: 12,
    category: 'plans',
    question: 'What is included in Premium?',
    answer: 'Premium includes unlimited decisions, 10 alternatives per decision, advanced AI models, What-If Simulation, lifetime history, and priority support.',
  },
  {
    id: 13,
    category: 'plans',
    question: 'Can I view my previous decisions?',
    answer: 'Yes, Basic users can view decisions from the last 30 days, while Premium users have lifetime access to their decision history.',
  },
]

const quickNav = [
  { id: 'general', label: 'General', count: 3, icon: HelpCircle },
  { id: 'ai', label: 'AI Assistance', count: 3, icon: ShieldCheck },
  { id: 'saw', label: 'Decision & SAW', count: 4, icon: Brain },
  { id: 'plans', label: 'Account & Plans', count: 3, icon: Mail },
]

export function FAQContact() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter((f) => f.category === activeCategory)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      alert('Thank you for your message! Our team will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <nav className="bg-brand-50 border-b border-brand-100">
        <div className="container-max section-padding">
          <ol className="flex items-center gap-2 text-xs text-text/50">
            <li><Link to="/" className="hover:text-brand-600 transition-colors">Home</Link></li>
            <li className="text-brand-600/50">/</li>
            <li><span className="text-text-h">FAQ &amp; Contact</span></li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-50/50 -z-10" />
        <div className="container-max relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-4">
              <HelpCircle className="w-3 h-3" />
              Support & Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-text-h leading-tight mb-6">
              How Can We Help You?
            </h1>
            <p className="text-lg text-text/80 mb-8 max-w-xl mx-auto">
              Find answers about MyChoice, its features, and how your structured decision-support system empowers your clarity.
            </p>

            <div className="relative mx-auto max-w-lg">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search for a question or keyword (e.g. SAW, weights, AI)..."
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-brand-200 text-text-h placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-medium transition-all',
                    activeCategory === cat.id
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                      : 'bg-white text-text/60 border border-brand-100 hover:bg-brand-50 hover:text-brand-600'
                  )}
                >
                  {cat.label} <span className="text-text/30">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container-max relative">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Quick Navigation */}
            <div className="lg:col-span-3 hidden lg:block">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Quick Navigation</span>
                </div>
                {quickNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveCategory(item.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all',
                        activeCategory === item.id
                          ? 'bg-brand-100 text-brand-700 font-medium shadow-sm'
                          : 'bg-white text-text/60 border border-brand-100 hover:bg-brand-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-text/30">{item.count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-9">
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openFaq === faq.id}
                    onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-28 bg-brand-50 relative overflow-hidden">
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Choby & the Team are Online</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-h leading-tight mb-4">Still Have Questions?</h2>
              <p className="text-lg text-text/80 leading-relaxed">
                We'd love to hear from you. Reach out to the MyChoice team whether you have questions about methodology, need enterprise onboarding, or have feedback for our AI assistant.
              </p>

              <div className="space-y-5 mt-8">
                <ContactInfo icon={Clock} title="Support Hours" value="Monday – Friday, 9:00 AM – 6:00 PM EST" />
                <ContactInfo icon={ShieldCheck} title="Response Commitment" value="Average response in under 2 hours" />
                <ContactInfo icon={Mail} title="Direct Email" value="support@mychoice.app" link />
              </div>

              <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6 mt-8">
                <p className="text-sm text-text/70 italic">
                  "The SAW framework turned our 3-week executive stalemate over office relocation into an objective 40-minute decision meeting."
                </p>
                <p className="text-xs text-text/50 mt-2 font-medium">— Elena Rossi, VP Operations</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-brand-100 shadow-sm p-8 md:p-12">
              <h3 className="text-lg font-bold text-text-h mb-6">Send Us a Message</h3>
              <p className="text-text/60 text-sm mb-8">
                Fill out the form and our specialist team will review your inquiry immediately.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-h uppercase tracking-wider">Full Name <span className="text-brand-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-h uppercase tracking-wider">Email Address <span className="text-brand-500">*</span></label>
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-h uppercase tracking-wider">Subject <span className="text-brand-500">*</span></label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select an inquiry topic...</option>
                    <option value="general">General Question</option>
                    <option value="pricing">Pricing & Plans</option>
                    <option value="technical">Technical Support</option>
                    <option value="enterprise">Enterprise Onboarding</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-h uppercase tracking-wider">Message <span className="text-brand-500">*</span></label>
                  <textarea
                    placeholder="Describe your question or decision scenario in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field h-32 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message <span aria-hidden="true">→</span>'}
                </button>
                <p className="text-xs text-text/40 text-center">
                  By submitting this form, you acknowledge our <Link to="#" className="text-brand-600 hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="relative bg-brand-600 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-brand-500/20" />
          <div className="relative container-max py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium mb-4">
                  Start Deciding with Confidence
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Ready to Experience<br />
                  <span className="text-brand-300">MyChoice?</span>
                </h2>
                <p className="text-brand-100 text-lg leading-relaxed mb-8 max-w-lg">
                  Eliminate decision paralysis. Build your first structured comparison matrix in less than 3 minutes with Choby's smart criteria builder.
                </p>
                <div className="flex gap-4">
                  <Link to="/pricing" className="btn-primary">
                    Get Started for Free <span aria-hidden="true">→</span>
                  </Link>
                  <button className="btn-secondary text-white border-white/20 hover:bg-white/10">
                    Explore Demo Decision
                  </button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="w-48 h-48 rounded-full bg-brand-500/30 flex items-center justify-center border border-white/10 shadow-2xl shadow-brand-500/20">
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

function FAQItem({ faq, isOpen, onToggle }: { faq: any; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-brand-100 overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-brand-50"
      >
        <span className="text-sm font-medium text-text-h">{faq.question}</span>
        <ChevronDown className={cn('w-4 h-4 text-text/40 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-brand-50/50">
          <p className="text-sm text-text/70 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

function ContactInfo({ icon: Icon, title, value, link }: { icon: any; title: string; value: string; link?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-h uppercase tracking-wider">{title}</p>
        {link ? (
          <Link to="#" className="text-brand-600 text-sm hover:underline transition-colors">{value}</Link>
        ) : (
          <p className="text-sm text-text/80">{value}</p>
        )}
      </div>
    </div>
  )
}
