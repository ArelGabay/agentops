import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <section
      className={[
        'rounded-lg border border-app-border bg-app-surface/80 shadow-2xl shadow-black/10',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </section>
  )
}
