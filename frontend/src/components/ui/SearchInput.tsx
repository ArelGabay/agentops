import { Search } from "lucide-react";

type SearchInputProps = {
  ariaLabel?: string;
  placeholder: string;
  shortcut?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({
  ariaLabel = "Search",
  placeholder,
  shortcut,
  value = "",
  onChange,
}: SearchInputProps) {
  return (
    <div className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-app-border bg-white/[0.03] px-3 text-slate-400">
      <Search className="h-4 w-4 shrink-0" />
      <input
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {shortcut && (
        <span className="shrink-0 rounded-md border border-app-border bg-white/[0.04] px-1.5 py-0.5 text-xs text-slate-400">
          {shortcut}
        </span>
      )}
    </div>
  );
}
