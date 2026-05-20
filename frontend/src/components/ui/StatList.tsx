import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

type StatTrend = 'up' | 'down' | 'neutral'

type StatListItem = {
  label: string
  value: string
  meta?: string
  trend?: StatTrend
  icon?: ReactNode
}

type StatListProps = {
  items: StatListItem[]
}

const trendStyles: Record<StatTrend, string> = {
  up: 'text-emerald-300',
  down: 'text-red-300',
  neutral: 'text-slate-400',
}

export function StatList({ items }: StatListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const TrendIcon = item.trend === 'down' ? ArrowDownRight : ArrowUpRight

        return (
          <div className="flex items-center justify-between gap-4" key={item.label}>
            <div className="flex min-w-0 items-center gap-3">
              {item.icon}
              <span className="truncate text-sm text-slate-100">{item.label}</span>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-sm">
              <span className="text-slate-200">{item.value}</span>
              {item.meta && (
                <span
                  className={[
                    'flex min-w-[68px] items-center justify-end gap-1',
                    trendStyles[item.trend ?? 'neutral'],
                  ].join(' ')}
                >
                  {item.trend && item.trend !== 'neutral' && <TrendIcon className="h-3.5 w-3.5" />}
                  {item.meta}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
