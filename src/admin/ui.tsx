import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const cardClass =
  'rounded-[18px] border border-[#f0eaf9] bg-white shadow-[0_1px_2px_rgba(16,8,30,0.04)]'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn(cardClass, className)}>{children}</div>
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#a99fbb]">
      {children}
    </p>
  )
}

export function PageHeader({
  label,
  title,
  description,
  actions,
}: {
  label: ReactNode
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#171021]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[#79708a]">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2.5">{actions}</div> : null}
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'outline', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'h-9 px-3 text-[12px]' : 'h-10 px-4 text-[12.5px]',
        variant === 'primary' &&
          'bg-[#6d34d9] text-white shadow-[0_8px_18px_-10px_rgba(109,52,217,0.9)] hover:bg-[#5b26bd]',
        variant === 'outline' && 'border border-[#eae2f7] bg-white text-[#4d445c] hover:bg-[#faf7ff]',
        variant === 'ghost' && 'text-[#6b6279] hover:bg-[#f7f2ff]',
        variant === 'danger' && 'border border-[#f6d5d8] bg-[#fdf3f4] text-[#bf2b38] hover:bg-[#fbe9eb]',
        className
      )}
    >
      {children}
    </button>
  )
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[#857b96] transition-colors hover:bg-[#f5efff] hover:text-[#6d34d9]',
        className
      )}
    >
      {children}
    </button>
  )
}

type Tone = 'violet' | 'green' | 'amber' | 'rose' | 'neutral'

const toneClasses: Record<Tone, string> = {
  violet: 'bg-[#f1e9fe] text-[#6b28d9]',
  green: 'bg-[#e4f8ee] text-[#137a4c]',
  amber: 'bg-[#fdf3e2] text-[#9a6508]',
  rose: 'bg-[#fdecef] text-[#bd2c45]',
  neutral: 'bg-[#f4f1f8] text-[#6f677e]',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: {
  children: ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold whitespace-nowrap',
        toneClasses[tone],
        className
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'violet',
  accent = false,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon: ReactNode
  tone?: Tone
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        cardClass,
        'p-5',
        accent && 'border-transparent bg-gradient-to-br from-[#7b3fe4] to-[#5f22c4] text-white shadow-[0_18px_40px_-24px_rgba(95,34,196,0.9)]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            'text-[9.5px] font-bold uppercase tracking-[0.15em]',
            accent ? 'text-white/70' : 'text-[#a99fbb]'
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]',
            accent ? 'bg-white/15 text-white' : toneClasses[tone]
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        <span className={cn('text-[27px] font-semibold leading-none tracking-[-0.03em]', accent ? 'text-white' : 'text-[#171021]')}>
          {value}
        </span>
      </div>
      {hint ? (
        <div className={cn('mt-3 flex flex-wrap items-center gap-2 text-[11px]', accent ? 'text-white/80' : 'text-[#8b8298]')}>
          {hint}
        </div>
      ) : null}
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[11px] font-semibold text-[#5c5368]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[10.5px] text-[#a39aae]">{hint}</span> : null}
    </label>
  )
}

export const inputClass =
  'h-10 w-full rounded-[10px] border border-[#ece4f8] bg-white px-3 text-[12.5px] text-[#2b2138] placeholder:text-[#b0a7bf] focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/15'

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, className)} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputClass, 'cursor-pointer pr-8', className)}>
      {children}
    </select>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'Toggle'}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors',
        checked ? 'bg-[#6d34d9]' : 'bg-[#e5dff0]'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-all',
          checked ? 'left-[19px]' : 'left-[3px]'
        )}
      />
    </button>
  )
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  footer,
  children,
  width = 'max-w-3xl',
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: ReactNode
  footer?: ReactNode
  children: ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#251a38]/40 p-4 backdrop-blur-sm sm:p-8">
      <div
        className={cn(
          'my-auto w-full overflow-hidden rounded-[20px] border border-[#efe8f9] bg-white shadow-[0_32px_70px_-30px_rgba(28,15,46,0.55)]',
          width
        )}
      >
        <div className="flex items-start gap-3 border-b border-[#f3eefb] px-5 py-4">
          {icon ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#f2eafe] text-[#6b28d9]">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-[15.5px] font-semibold tracking-[-0.01em] text-[#171021]">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-[11.5px] text-[#857b96]">{subtitle}</p> : null}
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="max-h-[68vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[#f3eefb] bg-[#fdfbff] px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#f8d9dc] bg-[#fdf4f5] px-4 py-3 text-[12px] text-[#a82a39]">
      {children}
    </div>
  )
}

export function LoadingRow({ label = 'Loading data…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-1 py-8 text-[12px] text-[#8d84a0]">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#ded3f2] border-t-[#6d34d9]" />
      {label}
    </div>
  )
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return <div className="px-1 py-10 text-center text-[12.5px] text-[#8d84a0]">{children}</div>
}

export function Rating({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= value ? '#7c3aed' : 'none'}
          stroke={star <= value ? '#7c3aed' : '#d7cfe6'}
          strokeWidth="1.8"
        >
          <path d="M12 3.5l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.8z" />
        </svg>
      ))}
    </span>
  )
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const letter = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-[#f0e7fe] font-semibold text-[#6b28d9]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {letter}
    </span>
  )
}
