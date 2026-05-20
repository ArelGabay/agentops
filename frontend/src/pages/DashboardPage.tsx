import {
  Activity,
  Clock3,
  Database,
  DollarSign,
  Download,
  ShieldCheck,
} from 'lucide-react'

import { PageHeader } from '../components/layout/PageHeader'
import { MetricCard } from '../components/metrics/MetricCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

const metricCards = [
  {
    title: 'Total Traces',
    value: '12,847',
    trendLabel: '12.5% vs last 7 days',
    trend: 'up' as const,
    tone: 'violet' as const,
    icon: <Activity className="h-5 w-5" />,
    sparkline: [32, 45, 31, 49, 38, 34, 42, 41, 44, 48, 61, 50],
  },
  {
    title: 'Success Rate',
    value: '98.6%',
    trendLabel: '2.1% vs last 7 days',
    trend: 'up' as const,
    tone: 'emerald' as const,
    icon: <ShieldCheck className="h-5 w-5" />,
    sparkline: [42, 40, 38, 41, 39, 44, 48, 57, 51, 55, 62, 58],
  },
  {
    title: 'Avg. Latency',
    value: '1.42s',
    trendLabel: '8.4% vs last 7 days',
    trend: 'down' as const,
    tone: 'violet' as const,
    icon: <Clock3 className="h-5 w-5" />,
    sparkline: [56, 52, 44, 50, 46, 39, 35, 42, 33, 31, 29, 28],
  },
  {
    title: 'Total Tokens',
    value: '3.2M',
    trendLabel: '18.7% vs last 7 days',
    trend: 'up' as const,
    tone: 'blue' as const,
    icon: <Database className="h-5 w-5" />,
    sparkline: [35, 42, 33, 49, 37, 41, 39, 45, 44, 50, 63, 68],
  },
  {
    title: 'Total Cost',
    value: '$168.42',
    trendLabel: '15.3% vs last 7 days',
    trend: 'up' as const,
    tone: 'amber' as const,
    icon: <DollarSign className="h-5 w-5" />,
    sparkline: [44, 41, 35, 49, 55, 42, 39, 47, 37, 50, 58, 66],
  },
]

export function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Overview of your AI agents and system performance."
        />

        <div className="flex gap-3">
          <Button variant="secondary">May 12 - May 19</Button>
          <Button variant="primary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Trace Preview</h2>
              <p className="mt-1 text-sm text-slate-400">
                Static visual sample for table spacing and badge styling.
              </p>
            </div>
            <Button variant="ghost">View all</Button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-lg border border-app-border">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.3fr_1fr_140px_96px] items-center gap-4 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase text-slate-500">
                <span>Trace ID</span>
                <span>Agent</span>
                <span>Status</span>
                <span>Latency</span>
              </div>
              {[
                ['trc_8f3a7b2c4d1e', 'Customer Support', 'success', '1.23s'],
                ['trc_7a2b6c1d9e3f', 'Research Assistant', 'success', '2.14s'],
                ['trc_6b1c5d9e2f8a', 'Data Analyst', 'error', '4.32s'],
              ].map(([traceId, agent, status, latency]) => (
                <div
                  className="grid grid-cols-[1.3fr_1fr_140px_96px] items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                  key={traceId}
                >
                  <span className="font-medium text-violet-300">{traceId}</span>
                  <span className="text-slate-200">{agent}</span>
                  <span>
                    <StatusBadge status={status === 'error' ? 'error' : 'success'} />
                  </span>
                  <span className="text-slate-300">{latency}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white">Status Badge Preview</h2>
          <p className="mt-1 text-sm text-slate-400">
            Presentational states only. You will wire real trace status logic later.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <StatusBadge status="success" />
            <StatusBadge status="error" />
            <StatusBadge status="timeout" />
            <StatusBadge status="in-progress" />
            <StatusBadge status="canceled" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
