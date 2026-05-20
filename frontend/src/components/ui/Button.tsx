import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border-violet-500/60 bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500',
  secondary:
    'border-app-border bg-white/[0.04] text-slate-100 hover:border-slate-600 hover:bg-white/[0.07]',
  ghost: 'border-transparent bg-transparent text-violet-300 hover:bg-violet-500/10 hover:text-violet-200',
  danger:
    'border-red-500/40 bg-red-500/10 text-red-300 hover:border-red-400/60 hover:bg-red-500/15',
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        className,
      ].join(' ')}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
