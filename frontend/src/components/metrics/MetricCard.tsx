import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Card } from '../ui/Card'

type MetricTone = 'violet' | 'emerald' | 'blue' | 'amber' | 'red'
type MetricTrend = 'up' | 'down' | 'neutral'

type MetricCardProps = {
  title: string
  value: string
  trendLabel: string
  trend?: MetricTrend
  tone?: MetricTone
  icon: ReactNode
  sparkline?: number[]
}

const toneStyles: Record<MetricTone, { icon: string; bar: string; glow: string }> = {
  violet: {
    icon: 'bg-violet-500/15 text-violet-300',
    bar: 'bg-violet-400',
    glow: 'shadow-violet-950/40',
  },
  emerald: {
    icon: 'bg-emerald-500/15 text-emerald-300',
    bar: 'bg-emerald-400',
    glow: 'shadow-emerald-950/30',
  },
  blue: {
    icon: 'bg-blue-500/15 text-blue-300',
    bar: 'bg-blue-400',
    glow: 'shadow-blue-950/30',
  },
  amber: {
    icon: 'bg-amber-500/15 text-amber-300',
    bar: 'bg-amber-400',
    glow: 'shadow-amber-950/30',
  },
  red: {
    icon: 'bg-red-500/15 text-red-300',
    bar: 'bg-red-400',
    glow: 'shadow-red-950/30',
  },
}

const trendStyles: Record<MetricTrend, string> = {
  up: 'text-emerald-300',
  down: 'text-amber-300',
  neutral: 'text-slate-400',
}

export function MetricCard({
  title,
  value,
  trendLabel,
  trend = 'neutral',
  tone = 'violet',
  icon,
  sparkline = [34, 48, 36, 54, 41, 45, 58, 49, 43, 51, 62, 68],
}: MetricCardProps) {
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight

  return (
    <Card className={['p-4 shadow-2xl', toneStyles[tone].glow].join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
          <p className={['mt-2 flex items-center gap-1 text-xs', trendStyles[trend]].join(' ')}>
            {trend !== 'neutral' && <TrendIcon className="h-3.5 w-3.5" />}
            <span>{trendLabel}</span>
          </p>
        </div>

        <div className={['grid h-10 w-10 place-items-center rounded-lg', toneStyles[tone].icon].join(' ')}>
          {icon}
        </div>
      </div>

      <div className="mt-5 flex h-8 items-end gap-1 overflow-hidden">
        {sparkline.map((height, index) => (
          <span
            className={[
              'block flex-1 rounded-t opacity-80 shadow-sm',
              toneStyles[tone].bar,
            ].join(' ')}
            key={`${title}-${index}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Card>
  )
}
