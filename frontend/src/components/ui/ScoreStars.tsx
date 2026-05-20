import { Star } from 'lucide-react'

type ScoreStarsProps = {
  count: number
  tone?: 'green' | 'amber' | 'red'
}

const toneStyles = {
  green: 'fill-emerald-400 text-emerald-400',
  amber: 'fill-amber-400 text-amber-400',
  red: 'fill-red-400 text-red-400',
}

export function ScoreStars({ count, tone = 'green' }: ScoreStarsProps) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          className={['h-3.5 w-3.5', index < count ? toneStyles[tone] : 'fill-slate-700 text-slate-700'].join(' ')}
          key={index}
        />
      ))}
    </span>
  )
}
