import { Search } from 'lucide-react'

type SearchInputProps = {
  placeholder: string
  shortcut?: string
}

export function SearchInput({ placeholder, shortcut }: SearchInputProps) {
  return (
    <div className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-app-border bg-white/[0.03] px-3 text-slate-400">
      <Search className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm">{placeholder}</span>
      {shortcut && (
        <span className="shrink-0 rounded-md border border-app-border bg-white/[0.04] px-1.5 py-0.5 text-xs text-slate-400">
          {shortcut}
        </span>
      )}
    </div>
  )
}
