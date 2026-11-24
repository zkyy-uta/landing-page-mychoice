import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Lock, Loader2 } from 'lucide-react'
import { openChobby } from '@/components/chobby/ChobbyChat'
import { submitSignup, trackEvent } from '@/lib/metrics'
import chobbyMascot from '@/assets/chobby-mascot.png'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function SignupCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'loading') return

    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')
    const result = await submitSignup(value)
    if (result.ok) {
      setStatus('success')
      setMessage(
        result.duplicate
          ? 'You are already on the list — we will be in touch soon.'
          : `You're in! We'll email ${value} as soon as your invite is ready.`
      )
      setEmail('')
      void trackEvent('signup_submit', { source: 'landing-cta' })
    } else {
      setStatus('error')
      setMessage(result.error)
    }
  }

  return (
    <section id="signup" className="bg-canvas px-6 pb-16 md:px-8 md:pb-20">
      <div className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-7 py-10 md:px-12 md:py-12">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[9px] font-semibold text-white/85 ring-1 ring-white/20">
              <Lock className="h-2.5 w-2.5" />
              No Credit Card Required
            </span>
            <h2 className="mt-4 max-w-[440px] text-[30px] font-extrabold leading-[1.12] tracking-[-0.025em] text-white md:text-[40px]">
              Ready to Make Your Next Decision?
            </h2>
            <p className="mt-3 max-w-[460px] text-[12.5px] leading-[1.75] text-white/80">
              MyChoice is an AI-assisted decision assistant that turns a messy list of options into a
              clear ranking. Describe what you are deciding, set what matters most, and get a
              weighted recommendation you can actually explain.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 max-w-[440px]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') {
                      setStatus('idle')
                      setMessage('')
                    }
                  }}
                  placeholder="you@email.com"
                  autoComplete="email"
                  disabled={status === 'loading'}
                  className="h-11 flex-1 rounded-xl border border-white/25 bg-white/95 px-4 text-[13px] font-medium text-ink placeholder:text-muted/60 outline-none transition focus:border-white focus:ring-2 focus:ring-white/40 disabled:opacity-70"
                />
                <button
                  type="submit"
                  onClick={() => void trackEvent('cta_click', { label: 'Sign Up Now' })}
                  disabled={status === 'loading'}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-bold text-primary transition-colors hover:bg-[#f7f2ff] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    <>
                      Sign Up Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2.5 min-h-[18px] text-[10.5px]" role="status" aria-live="polite">
                {status === 'success' ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-white">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    {message}
                  </span>
                ) : status === 'error' ? (
                  <span className="font-medium text-[#ffe1e1]">{message}</span>
                ) : (
                  <span className="text-white/60">
                    Join the waitlist — free during beta, unsubscribe anytime.
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center gap-3 lg:items-end">
            <div className="relative flex h-[132px] w-[132px] items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
              <div className="absolute inset-3 rounded-full bg-white/10 ring-1 ring-white/20" />
              <img
                src={chobbyMascot}
                alt="Chobby"
                className="relative h-[96px] w-[96px] rounded-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={openChobby}
              className="rounded-full bg-white px-3.5 py-1.5 text-[10px] font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Say Hi to Chobby 👋
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
