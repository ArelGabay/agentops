import { Check } from 'lucide-react'

type CheckboxRowProps = {
  title: string
  description?: string
  checked?: boolean
}

export function CheckboxRow({ title, description, checked = true }: CheckboxRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={[
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border',
          checked ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-600 bg-white/[0.02]',
        ].join(' ')}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-100">{title}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
    </div>
  )
}
