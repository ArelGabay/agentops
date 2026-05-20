type ProgressBarProps = {
  value: number
  tone?: 'violet' | 'red' | 'amber' | 'blue'
}

const toneStyles = {
  violet: 'bg-violet-400',
  red: 'bg-red-400',
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
}

export function ProgressBar({ value, tone = 'violet' }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-950">
      <div className={['h-full rounded-full', toneStyles[tone]].join(' ')} style={{ width: `${value}%` }} />
    </div>
  )
}
