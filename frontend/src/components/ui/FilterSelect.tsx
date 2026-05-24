import { ChevronDown } from "lucide-react";

type FilterSelectOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options?: FilterSelectOption[];
  onChange?: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-4 top-2 block text-xs text-slate-500">
        {label}
      </span>
      <select
        className="h-14 min-w-[116px] appearance-none rounded-lg border border-app-border bg-app-surface px-4 pb-2 pt-6 text-sm font-medium text-slate-100 outline-none transition hover:border-slate-600 hover:bg-white/[0.05]"
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
      >
        {(options ?? [{ label: value, value }]).map((option) => (
          <option
            className="bg-app-surface text-slate-100"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-5 h-4 w-4 text-slate-500" />
    </label>
  );
}
