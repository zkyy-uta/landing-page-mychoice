import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Boxes, Lock, Mail, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useAdminAuth } from '../AdminAuth'
import { Button, ErrorNote, Field, TextInput } from '../ui'

export function AdminLogin() {
  const { profile, isAdmin, loading, deniedEmail, signIn } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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

          {deniedEmail ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-[12px] border border-[#f6d9de] bg-[#fdf4f5] px-3.5 py-3 text-[11.5px] leading-relaxed text-[#9c2436]">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <span className="font-semibold">Administrator account required.</span>{' '}
                <span className="break-all font-medium">{deniedEmail}</span> is a regular user, so it cannot sign in to
                this console. Ask an admin to grant the administrator role or use an admin account.
              </span>
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

          <p className="mt-4 text-center text-[10.5px] leading-relaxed text-[#a39aae]">
            Accounts without the administrator role cannot sign in.
          </p>
        </div>
      </div>
    </div>
  )
}
