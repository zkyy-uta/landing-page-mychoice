import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, ChevronDown, Headset, Mail, Send, Sparkles, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import chobbyMascot from '@/assets/chobby-mascot.png'

const OPEN_EVENT = 'chobby:open'

/** Open the Chobby support chat from anywhere in the app. */
export function openChobby() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}
export function closeChobby() {
  window.dispatchEvent(new Event('chobby:close'))
}

type Message = { id: number; from: 'bot' | 'user'; text: string }

type Profile = { name: string; topic: string }
type ContactForm = { name: string; contact: string; topic: string }
type FormErrors = { name?: string; contact?: string }

type KnowledgeEntry = {
  keywords: string[]
  answer: string
  chips?: string[]
}

const welcome =
  "Hi, I'm Chobby 👋 Your Choice Buddy. I can help you get started, explain how the scoring works, or talk through plans and features. What do you need?"

const fallbackChips = ['How does MyChoice work?', 'Is it free?', 'What can you help with?']

const topics = [
  { label: 'Getting started with MyChoice', question: 'How do I start a decision?' },
  { label: 'Plans, pricing & billing', question: 'Is it free and what is in Premium?' },
  { label: 'Criteria, weights & SAW scoring', question: 'How does the scoring work?' },
  { label: 'Account, data & privacy', question: 'How is my privacy data handled?' },
  { label: 'Something else', question: 'What can you help with?' },
]

const knowledge: KnowledgeEntry[] = [
  {
    keywords: ['hello', 'hey', 'halo', 'hai', 'morning', 'evening', 'good afternoon'],
    answer:
      'Hey there 👋 Great to see you. Ask me anything about MyChoice — starting a decision, setting weights, reading your ranking, or which plan fits you.',
    chips: fallbackChips,
  },
  {
    keywords: ['what is mychoice', 'what does mychoice', 'mychoice do', 'this app', 'your app'],
    answer:
      'MyChoice is a decision-support app. You describe a decision, get criteria that actually matter, set how important each one is, and it ranks your options with the SAW (Simple Additive Weighting) method — so the winner is explainable instead of a gut feeling.',
    chips: ['How does it work?', 'What are the features?', 'Is it free?'],
  },
  {
    keywords: ['start', 'get started', 'begin', 'sign up', 'signup', 'try', 'create a decision', 'first decision'],
    answer:
      'Getting started takes about a minute: open Try MyChoice, describe your decision in one sentence (for example “best laptop for programming”), review the suggested criteria, set your weights, then add your options. Basic is free and needs no credit card.',
    chips: ['How do weights work?', 'What is SAW?', 'Is it free?'],
  },
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'expensive', 'harga', 'biaya'],
    answer:
      'Basic is free forever. Premium adds unlimited decisions, up to 10 alternatives, advanced analysis, What-If Simulation and lifetime history — it is still marked “coming soon”, so its price is not published yet. The Pricing page has the full side-by-side comparison.',
    chips: ['What do I get for free?', 'What is in Premium?', 'Where is the pricing page?'],
  },
  {
    keywords: ['free', 'basic plan', 'no credit card', 'gratis'],
    answer:
      'The free Basic plan includes up to 5 decisions per month, 3 alternatives per decision, AI criteria suggestions, weighting up to 100%, side-by-side comparison, SAW ranking and 30-day decision history. No credit card required.',
    chips: ['What is in Premium?', 'How does it work?'],
  },
  {
    keywords: ['premium', 'upgrade', 'paid', 'subscription', 'pro plan'],
    answer:
      'Premium is the planned upgrade: unlimited decisions, up to 10 alternatives per decision, advanced AI criteria suggestions, trade-off metrics, What-If Simulation, lifetime decision history and personal decision insights. It is marked coming soon, so there is nothing to pay yet.',
    chips: ['Is it free?', 'What is What-If Simulation?'],
  },
  {
    keywords: ['feature', 'features', 'capabilities', 'what can you do', 'help me with', 'help'],
    answer:
      'Here is what I can walk you through: AI criteria suggestions, weighted criteria that must total 100%, alternative comparison, SAW-based ranking, What-If Simulation, and decision history. Ask about any of them.',
    chips: ['How do weights work?', 'What is SAW?', 'What is What-If Simulation?'],
  },
  {
    keywords: ['how does it work', 'how it works', 'step', 'steps', 'process', 'workflow'],
    answer:
      'Four steps: 1) Create your decision and describe the scope, 2) Review the criteria and set your weights, 3) Add alternatives and score them against each criterion, 4) Get a ranked best match with the trade-off explanation.',
    chips: ['How do weights work?', 'What is SAW?', 'Can I change criteria?'],
  },
  {
    keywords: ['criteri', 'suggestion', 'suggest', 'edit criteria', 'add criteria', 'remove criteria'],
    answer:
      'When you describe your decision, Chobby proposes criteria that fit that category — price, performance, battery life for a laptop, for example. You stay in control: add, rename or remove any criterion before continuing.',
    chips: ['How do weights work?', 'What is SAW?'],
  },
  {
    keywords: ['weight', 'importance', 'percentage', '100%', 'priorit'],
    answer:
      'Each criterion gets a weight and the total has to add up to 100%. A criterion at 35% moves the final score much more than one at 15%. MyChoice validates the total before it runs the calculation, which is the “Total Weight: 100% Validated” line you may have seen.',
    chips: ['What is SAW?', 'What is What-If Simulation?'],
  },
  {
    keywords: ['saw', 'simple additive', 'score', 'scoring', 'ranking', 'rank', 'calculation', 'algorithm', 'normaliz'],
    answer:
      'SAW (Simple Additive Weighting) normalizes each criterion to a comparable scale, multiplies it by its weight, then sums everything into one score per option. The highest score is your best match for the priorities you set — and the breakdown shows exactly where each option gained or lost points.',
    chips: ['How do weights work?', 'What is What-If Simulation?'],
  },
  {
    keywords: ['what-if', 'what if', 'simulat', 'scenario', 'change the weight', 'try different'],
    answer:
      'What-If Simulation lets you change weights or scores and instantly see how the ranking shifts — useful for checking whether your #1 really is robust or only winning by a narrow margin.',
    chips: ['What is SAW?', 'Is What-If in the free plan?'],
  },
  {
    keywords: ['history', 'saved', 'save', 'previous decision', 'archive', 'revisit'],
    answer:
      'Every decision is saved with its criteria, weights and ranking, so you can reopen it later. Basic keeps 30 days of history; Premium is planned to keep it for life.',
    chips: ['What is in Premium?', 'How does it work?'],
  },
  {
    keywords: ['categor', 'laptop', 'phone', 'course', 'internship', 'job offer', 'vendor', 'house', 'car'],
    answer:
      'You can model any multi-criteria choice — laptops, phones, courses, internships, job offers, vendors, even housing. The category mainly changes the criteria Chobby suggests; the weighting and scoring work the same way.',
    chips: ['How do weights work?', 'Show me an example'],
  },
  {
    keywords: ['example', 'demo', 'sample', 'show me'],
    answer:
      'A typical run: decide on a programming laptop. Price 35%, performance 30%, RAM 20%, battery 15%. The MacBook Air M3 lands at 92.4, the ThinkPad T14s at 84.1, the Dell XPS 13 Plus at 79.8 — with an explanation of the trade-off behind each number.',
    chips: ['What is SAW?', 'How do weights work?'],
  },
  {
    keywords: ['ai decide', 'decide for me', 'automatic', 'automatically', 'is it accurate', 'trust'],
    answer:
      'Chobby suggests and explains; you decide. It never locks in a winner without your weights, and the full ranking stays visible and adjustable, so the reasoning is always yours to check.',
    chips: ['What is SAW?', 'How do weights work?'],
  },
  {
    keywords: ['privacy', 'data', 'secure', 'security', 'account', 'delete my', 'private'],
    answer:
      'Your decisions belong to your account and are used to generate your own results and history. For the specifics on data and account handling, the FAQ & Contact page has the privacy answers — or ask me and I will point you to the right section.',
    chips: ['Who can I contact?', 'What can you help with?'],
  },
  {
    keywords: ['contact', 'support', 'human', 'agent', 'email', 'faq', 'talk to someone', 'admin', 'complain'],
    answer:
      'I can handle most product questions right here. For anything account-specific, open the FAQ & Contact page (/faq) and use the contact form — a human picks it up from there.',
    chips: ['Where is the pricing page?', 'What can you help with?'],
  },
  {
    keywords: ['who are you', 'what is chobby', 'chobby', 'choby', 'your name', 'bot'],
    answer:
      "I'm Chobby, the Choice Buddy built into MyChoice. I suggest criteria, explain trade-offs, and answer questions about the product. I don't have access to your personal account details.",
    chips: ['How does it work?', 'Is it free?'],
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'makasih', 'terima kasih'],
    answer:
      'Anytime 🙌 Good luck with the decision — and if you are still torn, run a What-If Simulation before you commit.',
    chips: ['What is What-If Simulation?', 'How do I start?'],
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later'],
    answer: 'See you! I will be right here in the corner whenever another decision shows up 👋',
    chips: fallbackChips,
  },
]

const fallbackAnswer =
  "I didn't quite catch that. I'm best at questions about MyChoice — getting started, criteria, weights, SAW scoring, What-If Simulation, plans and history. For anything else, the FAQ & Contact page has a human on the other end."

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findReply(input: string): { answer: string; chips: string[] } {
  const text = input.toLowerCase()
  let best: KnowledgeEntry | null = null
  let bestScore = 0

  for (const entry of knowledge) {
    let score = 0
    for (const keyword of entry.keywords) {
      const pattern = new RegExp(`\\b${escapeRegExp(keyword)}`, 'i')
      if (pattern.test(text)) score += keyword.length
    }
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  if (!best) return { answer: fallbackAnswer, chips: fallbackChips }
  return { answer: best.answer, chips: best.chips ?? fallbackChips }
}

let nextId = 0

export function ChobbyChat() {
  const [open, setOpen] = useState(false)
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<ContactForm>({ name: '', contact: '', topic: topics[0].label })
  const [errors, setErrors] = useState<FormErrors>({})
  const [messages, setMessages] = useState<Message[]>([{ id: nextId++, from: 'bot', text: welcome }])
  const [chips, setChips] = useState<string[]>(fallbackChips)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)

  const started = profile !== null

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true)
      setBubbleOpen(false)
    }
    const handleClose = () => setOpen(false)
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener(OPEN_EVENT, handleOpen)
    window.addEventListener('chobby:close', handleClose)
    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener(OPEN_EVENT, handleOpen)
      window.removeEventListener('chobby:close', handleClose)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setBubbleOpen(true), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open || !started) return
    inputRef.current?.focus()
  }, [open, started])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, typing, chips, open])

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text || typing) return

      setMessages((prev) => [...prev, { id: nextId++, from: 'user', text }])
      setDraft('')
      setChips([])
      setTyping(true)

      const { answer, chips: nextChips } = findReply(text)
      const delay = 550 + Math.min(700, text.length * 12)

      timers.current.push(
        window.setTimeout(() => {
          setTyping(false)
          setMessages((prev) => [...prev, { id: nextId++, from: 'bot', text: answer }])
          setChips(nextChips)
        }, delay)
      )
    },
    [typing]
  )

  const handleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.contact.trim()) {
      nextErrors.contact = 'Please add an email or WhatsApp number.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.trim()) &&
      form.contact.replace(/\D/g, '').length < 8
    ) {
      nextErrors.contact = 'Enter a valid email or WhatsApp number.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const topic = topics.find((item) => item.label === form.topic) ?? topics[0]
    const { answer, chips: nextChips } = findReply(topic.question)
    const firstName = form.name.trim().split(/\s+/)[0]

    setProfile({ name: form.name.trim(), topic: topic.label })
    setMessages([
      {
        id: nextId++,
        from: 'bot',
        text: `Hi ${firstName} 👋 Thanks for reaching out about “${topic.label.toLowerCase()}”.`,
      },
      { id: nextId++, from: 'bot', text: answer },
    ])
    setChips(nextChips)
  }

  return (
    <>
      {/* Greeting bubble */}
      {!open && bubbleOpen && (
        <div className="fixed bottom-[88px] right-5 z-[55] w-[300px] max-w-[calc(100vw-2.5rem)] animate-fade-in rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-28px_rgba(76,29,149,0.55)]">
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Dismiss greeting"
            className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-muted/60 transition-colors hover:bg-primary-soft hover:text-primary"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={chobbyMascot}
              alt=""
              className="h-8 w-8 rounded-full border border-line object-cover"
            />
            <span className="flex items-center gap-1 text-[12px] font-bold text-ink">
              <Sparkles className="h-3 w-3 text-primary" />
              CS Chobby
            </span>
          </div>
          <p className="mt-2 pr-2 text-[11px] leading-[1.7] text-muted">
            Hi! Got a question or running into trouble? Chobby can help right away, or point you
            to a human.
          </p>
          <button
            type="button"
            onClick={openChobby}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-primary-deep"
          >
            <Headset className="h-3.5 w-3.5" />
            Start CS Chat
          </button>
        </div>
      )}
      {/* Launcher */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChobby())}
        aria-label={open ? 'Close Chobby chat' : 'Chat with Chobby, your MyChoice support assistant'}
        aria-expanded={open}
        className={cn(
          'fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-[0_18px_40px_-18px_rgba(76,29,149,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-18px_rgba(76,29,149,0.6)]',
          open && 'pointer-events-none translate-y-2 opacity-0'
        )}
      >
        <span className="relative">
          <img
            src={chobbyMascot}
            alt=""
            className="h-9 w-9 rounded-full border-2 border-white object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#16a34a]" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[11.5px] font-bold text-ink">Ask Chobby</span>
          <span className="block text-[9px] font-medium text-[#16a34a]">Online · replies instantly</span>
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chobby support chat"
          className="fixed bottom-5 right-4 z-[70] flex h-[min(560px,calc(100vh-2.5rem))] w-[calc(100vw-2rem)] max-w-[372px] animate-fade-in flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-24px_rgba(76,29,149,0.5)] sm:right-5"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] px-4 py-3.5 text-white">
            <span className="relative shrink-0">
              <img
                src={chobbyMascot}
                alt="Chobby"
                className="h-10 w-10 rounded-full border-2 border-white/80 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#7c3aed] bg-[#4ade80]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[13px] font-bold leading-tight">
                Customer Service Chobby
                <Sparkles className="h-3 w-3 text-white/70" />
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[9.5px] font-medium text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                Online 24/7 · Fast help
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {!started ? (
            <form onSubmit={handleStart} className="flex-1 overflow-y-auto bg-[#fbf9fe] px-4 py-5">
              <div className="flex justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Headset className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-3 text-center text-[14px] font-bold text-ink">
                Customer Service Help Form
              </h3>
              <p className="mx-auto mt-1 max-w-[268px] text-center text-[10.5px] leading-relaxed text-muted">
                Fill this in briefly so Chobby can point you to the right answer faster.
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <label htmlFor="chobby-name" className="text-[10px] font-semibold text-ink">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative mt-1">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
                    <input
                      id="chobby-name"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Enter your full name"
                      className="h-9 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-[11.5px] text-ink placeholder:text-muted/50 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-[9px] font-medium text-[#dc2626]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chobby-contact" className="text-[10px] font-semibold text-ink">
                    Email / WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
                    <input
                      id="chobby-contact"
                      value={form.contact}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, contact: event.target.value }))
                      }
                      placeholder="name@email.com / 0812xxxx"
                      className="h-9 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-[11.5px] text-ink placeholder:text-muted/50 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                    />
                  </div>
                  {errors.contact && (
                    <p className="mt-1 text-[9px] font-medium text-[#dc2626]">{errors.contact}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chobby-topic" className="text-[10px] font-semibold text-ink">
                    Help Topic <span className="text-primary">*</span>
                  </label>
                  <div className="relative mt-1">
                    <select
                      id="chobby-topic"
                      value={form.topic}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, topic: event.target.value }))
                      }
                      className="h-9 w-full appearance-none rounded-xl border border-line bg-white pl-3 pr-8 text-[11.5px] text-ink focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
                    >
                      {topics.map((topic) => (
                        <option key={topic.label} value={topic.label}>
                          {topic.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[11.5px] font-bold text-white transition-colors hover:bg-primary-deep"
              >
                Start CS Chat
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <p className="mt-2 text-center text-[8.5px] leading-relaxed text-muted/60">
                Chobby is an assistant, not a human agent. Account issues go to FAQ &amp; Contact.
              </p>
            </form>
          ) : (
            <>
          {/* Messages */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-[#fbf9fe] px-3.5 py-4"
          >
            {messages.map((message) =>
              message.from === 'bot' ? (
                <div key={message.id} className="flex items-end gap-2">
                  <img
                    src={chobbyMascot}
                    alt=""
                    className="mb-0.5 h-6 w-6 shrink-0 rounded-full border border-line object-cover"
                  />
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-white px-3 py-2.5 text-[11.5px] leading-[1.65] text-ink shadow-[0_1px_2px_rgba(60,20,120,0.04)]">
                    {message.text}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2.5 text-[11.5px] leading-[1.65] text-white">
                    {message.text}
                  </p>
                </div>
              )
            )}

            {typing && (
              <div className="flex items-end gap-2">
                <img
                  src={chobbyMascot}
                  alt=""
                  className="mb-0.5 h-6 w-6 shrink-0 rounded-full border border-line object-cover"
                />
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-3 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-[#f3edfb] bg-white px-3 py-2.5">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  className="rounded-full border border-primary-tint bg-primary-soft px-2.5 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary-tint"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              send(draft)
            }}
            className="flex items-center gap-2 border-t border-[#f3edfb] bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Chobby about MyChoice…"
              aria-label="Message Chobby"
              className="h-9 flex-1 rounded-xl border border-line bg-[#fbf9fe] px-3 text-[11.5px] text-ink placeholder:text-muted/60 focus:border-primary-tint focus:outline-none focus:ring-2 focus:ring-primary-tint"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <p className="bg-white px-3 pb-2 text-center text-[8.5px] text-muted/60">
            Chobby is an assistant, not a human. For account issues use FAQ &amp; Contact.
          </p>
            </>
          )}
        </div>
      )}
    </>
  )
}
