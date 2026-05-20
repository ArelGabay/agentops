import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  label: string
}

export function IconButton({ children, className = '', label, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={[
        'grid h-8 w-8 place-items-center rounded-lg border border-app-border bg-white/[0.03] text-slate-300 transition hover:border-slate-600 hover:bg-white/[0.06] hover:text-white',
        className,
      ].join(' ')}
      title={label}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
