type ResultVariant = 'pass' | 'partial' | 'fail'

type ResultBadgeProps = {
  result: ResultVariant
}

const resultStyles: Record<ResultVariant, string> = {
  pass: 'bg-emerald-500/10 text-emerald-300',
  partial: 'bg-blue-500/10 text-blue-300',
  fail: 'bg-red-500/10 text-red-300',
}

const resultLabels: Record<ResultVariant, string> = {
  pass: 'Pass',
  partial: 'Partial Pass',
  fail: 'Fail',
}

export function ResultBadge({ result }: ResultBadgeProps) {
  return (
    <span className={['inline-flex rounded-md px-2 py-1 text-xs font-medium', resultStyles[result]].join(' ')}>
      {resultLabels[result]}
    </span>
  )
}
