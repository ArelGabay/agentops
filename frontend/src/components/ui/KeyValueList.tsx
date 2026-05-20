import type { ReactNode } from 'react'

type KeyValueItem = {
  label: string
  value: ReactNode
}

type KeyValueListProps = {
  items: KeyValueItem[]
}

export function KeyValueList({ items }: KeyValueListProps) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div className="grid grid-cols-[120px_1fr] gap-4 text-sm" key={item.label}>
          <dt className="text-slate-400">{item.label}</dt>
          <dd className="min-w-0 text-slate-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
