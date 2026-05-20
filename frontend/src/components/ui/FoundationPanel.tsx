import type { ReactNode } from 'react'

type FoundationPanelProps = {
  title: string
  children: ReactNode
}

export function FoundationPanel({ title, children }: FoundationPanelProps) {
  return (
    <section className="rounded-lg border border-app-border bg-app-surface/70 p-5 shadow-2xl shadow-black/10">
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-slate-400">{children}</div>
    </section>
  )
}
