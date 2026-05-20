import { ChevronDown } from 'lucide-react'

type FilterSelectProps = {
  label: string
  value: string
}

export function FilterSelect({ label, value }: FilterSelectProps) {
  return (
    <button
      className="flex h-14 min-w-[116px] items-center justify-between gap-4 rounded-lg border border-app-border bg-white/[0.03] px-4 text-left transition hover:border-slate-600 hover:bg-white/[0.05]"
      type="button"
    >
      <span className="min-w-0">
        <span className="block text-xs text-slate-500">{label}</span>
        <span className="block truncate text-sm font-medium text-slate-100">{value}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
    </button>
  )
}
