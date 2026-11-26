import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Boxes, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useAdminAuth } from '../AdminAuth'
import { Button, ErrorNote, Field, TextInput } from '../ui'

export function AdminLogin() {
  const { profile, isAdmin, loading, signIn, signInWithGoogle } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (!loading && profile && isAdmin) return <Navigate to={from} replace />

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await signIn(email.trim(), password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    const result = await signInWithGoogle()
    if (result.error) {
      setError(result.error)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-[#fbf8fe] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] p-10 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)',
            backgroundSize: '42px 42px, 58px 58px',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <img src="/favicon.png" alt="" className="h-9 w-9 rounded-[11px] bg-white/10 p-1" />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold text-white">MyChoice</span>
            <span className="block text-[8.5px] font-bold uppercase tracking-[0.24em] text-white/60">
              Admin Core
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/60">Decision intelligence</p>
          <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            One console for every decision your platform makes.
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-white/70">
            Manage accounts, tune SAW criteria weights, and moderate user feedback — all connected to your live Supabase
            database.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Boxes, text: 'Criteria weights and candidate catalogues in one place' },
              { icon: ShieldCheck, text: 'Row-level security keeps non-admins out' },
              { icon: Sparkles, text: 'Feedback moderation with full moderation trail' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5 text-[12px] text-white/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10.5px] text-white/50">© {new Date().getFullYear()} MyChoice · SAW Engine v2.4</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[380px]">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#8d84a0] hover:text-[#6d34d9]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to mychoice.app
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <img src="/favicon.png" alt="" className="h-8 w-8 rounded-[10px]" />
            <span className="text-[13px] font-semibold text-[#171021]">MyChoice Admin</span>
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.02em] text-[#171021] lg:mt-0">Sign in to the console</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#79708a]">
            Administrator accounts only. Access is verified against your Supabase profile role.
          </p>

          {!isSupabaseConfigured ? (
            <div className="mt-5 rounded-[12px] border border-[#f7e3bd] bg-[#fef9ee] px-3.5 py-3 text-[11.5px] leading-relaxed text-[#8a6212]">
              <p className="font-semibold">Supabase is not connected yet</p>
              <p className="mt-1">
                Add <code className="rounded bg-white/70 px-1">VITE_SUPABASE_URL</code> and{' '}
                <code className="rounded bg-white/70 px-1">VITE_SUPABASE_ANON_KEY</code> to a <code>.env</code> file, run{' '}
                <code className="rounded bg-white/70 px-1">supabase/schema.sql</code> in the SQL editor, then restart the
                dev server.
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <Field label="Email address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a99fbb]" />
                <TextInput
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@mychoice.app"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a99fbb]" />
                <TextInput
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>

            {error ? <ErrorNote>{error}</ErrorNote> : null}

            <Button type="submit" variant="primary" className="w-full" disabled={submitting || !isSupabaseConfigured}>
              {submitting ? 'Signing in…' : 'Sign in'}
              {!submitting ? <ArrowRight className="h-3.5 w-3.5" /> : null}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#eee7f7]" />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#b3aac2]">or</span>
            <span className="h-px flex-1 bg-[#eee7f7]" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => void handleGoogle()}
            disabled={googleLoading || !isSupabaseConfigured}
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting to Google…' : 'Sign in with Google'}
          </Button>
          <p className="mt-2 text-center text-[10.5px] leading-relaxed text-[#a39aae]">
            Use the Google account linked to your administrator profile.
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}
