type StatusVariant = 'success' | 'error' | 'timeout' | 'in-progress' | 'canceled'

type StatusBadgeProps = {
  status: StatusVariant
  label?: string
}

const statusStyles: Record<StatusVariant, string> = {
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  error: 'border-red-500/25 bg-red-500/10 text-red-300',
  timeout: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  'in-progress': 'border-blue-500/25 bg-blue-500/10 text-blue-300',
  canceled: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
}

const dotStyles: Record<StatusVariant, string> = {
  success: 'bg-emerald-400',
  error: 'bg-red-400',
  timeout: 'bg-amber-400',
  'in-progress': 'bg-blue-400',
  canceled: 'bg-slate-400',
}

const defaultLabels: Record<StatusVariant, string> = {
  success: 'Success',
  error: 'Error',
  timeout: 'Timeout',
  'in-progress': 'In Progress',
  canceled: 'Canceled',
}

export function StatusBadge({ status, label = defaultLabels[status] }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
        statusStyles[status],
      ].join(' ')}
    >
      <span className={['h-1.5 w-1.5 rounded-full', dotStyles[status]].join(' ')} />
      {label}
    </span>
  )
}
