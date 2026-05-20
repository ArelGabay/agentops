import type { ReactNode } from 'react'

import { Card } from './Card'

type ChartCardProps = {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, action, children, className = '' }: ChartCardProps) {
  return (
    <Card className={['p-5', className].join(' ')}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action}
      </div>

      <div className="mt-5">{children}</div>
    </Card>
  )
}
