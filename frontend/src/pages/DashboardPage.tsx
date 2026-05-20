import {
  Activity,
  Bot,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  DollarSign,
  Download,
  FileSearch,
  PenTool,
} from 'lucide-react'

import { PageHeader } from '../components/layout/PageHeader'
import { MetricCard } from '../components/metrics/MetricCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ChartCard } from '../components/ui/ChartCard'
import { StatList } from '../components/ui/StatList'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TablePreview } from '../components/ui/TablePreview'

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
    icon: <CheckCircle2 className="h-5 w-5" />,
    sparkline: [42, 40, 38, 41, 39, 44, 48, 57, 51, 55, 62, 58],
  },
  {
    title: 'Avg. Latency',
    value: '1.42s',
    trendLabel: '8.4% vs last 7 days',
    trend: 'down' as const,
    tone: 'amber' as const,
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

const topAgents = [
  {
    label: 'Customer Support Agent',
    value: '4,321',
    meta: '15.3%',
    trend: 'up' as const,
    icon: <Bot className="h-4 w-4 text-violet-300" />,
  },
  {
    label: 'Research Assistant',
    value: '3,214',
    meta: '8.7%',
    trend: 'up' as const,
    icon: <FileSearch className="h-4 w-4 text-blue-300" />,
  },
  {
    label: 'Data Analyst Agent',
    value: '2,107',
    meta: '12.1%',
    trend: 'up' as const,
    icon: <Activity className="h-4 w-4 text-red-300" />,
  },
  {
    label: 'Content Writer',
    value: '1,876',
    meta: '2.1%',
    trend: 'down' as const,
    icon: <PenTool className="h-4 w-4 text-cyan-300" />,
  },
  {
    label: 'Code Assistant',
    value: '1,329',
    meta: '6.3%',
    trend: 'up' as const,
    icon: <BrainCircuit className="h-4 w-4 text-amber-300" />,
  },
]

const recentTraceRows = [
  ['trc_8f3a7b2c4d1e', 'Customer Support Agent', 'success', '1.23s', '1,234', '$0.042'],
  ['trc_7a2b6c1d9e3f', 'Research Assistant', 'success', '2.14s', '2,341', '$0.081'],
  ['trc_6b1c5d9e2f8a', 'Data Analyst Agent', 'error', '4.32s', '3,214', '$0.113'],
  ['trc_9e2f8a1b5c7d', 'Content Writer', 'success', '1.08s', '987', '$0.034'],
  ['trc_3c7d9e2f1a5b', 'Code Assistant', 'timeout', '10.00s', '2,111', '$0.074'],
]

function StaticLineChart({ tone = 'violet' }: { tone?: 'violet' | 'blue' | 'red' }) {
  const strokeStyles = {
    violet: 'stroke-violet-400',
    blue: 'stroke-blue-400',
    red: 'stroke-red-400',
  }

  const fillStyles = {
    violet: 'fill-violet-500/15',
    blue: 'fill-blue-500/15',
    red: 'fill-red-500/15',
  }

  return (
    <div className="h-56">
      <svg className="h-full w-full" viewBox="0 0 640 220" role="img" aria-label="Static chart preview">
        <path
          className="stroke-slate-700/60"
          d="M20 40H620 M20 85H620 M20 130H620 M20 175H620"
          fill="none"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
        <path
          className={fillStyles[tone]}
          d="M20 136 L108 98 L196 126 L284 132 L372 98 L460 156 L548 126 L620 92 L620 220 L20 220 Z"
        />
        <path
          className={strokeStyles[tone]}
          d="M20 136 L108 98 L196 126 L284 132 L372 98 L460 156 L548 126 L620 92"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {[20, 108, 196, 284, 372, 460, 548, 620].map((x, index) => (
          <circle
            className={['fill-white', strokeStyles[tone]].join(' ')}
            cx={x}
            cy={[136, 98, 126, 132, 98, 156, 126, 92][index]}
            key={x}
            r="4"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  )
}

function StatusDonut() {
  return (
    <div className="flex min-h-[220px] flex-col gap-6 sm:flex-row sm:items-center">
      <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full bg-[conic-gradient(#34d399_0_86%,#f87171_86%_95%,#fbbf24_95%_98%,#94a3b8_98%_100%)] shadow-2xl shadow-black/20">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-app-surface text-center">
          <div>
            <p className="text-xl font-semibold text-white">12,847</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-3 text-sm">
        {[
          ['Success', '12,658 (98.6%)', 'bg-emerald-400'],
          ['Error', '149 (1.2%)', 'bg-red-400'],
          ['Timeout', '26 (0.2%)', 'bg-amber-400'],
          ['Canceled', '14 (0.1%)', 'bg-slate-400'],
        ].map(([label, value, color]) => (
          <div className="flex items-center justify-between gap-4" key={label}>
            <span className="flex items-center gap-2 whitespace-nowrap text-slate-300">
              <span className={['h-2 w-2 rounded-full', color].join(' ')} />
              {label}
            </span>
            <span className="whitespace-nowrap text-slate-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Overview of your AI agents and system performance."
        />

        <div className="flex flex-wrap gap-3">
          <Button className="min-w-0" variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">May 12 - May 19</span>
          </Button>
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

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Traces Over Time" action={<Button variant="secondary">Traces</Button>}>
          <StaticLineChart tone="violet" />
        </ChartCard>

        <ChartCard
          title="Latency (p95) Over Time"
          action={<Button variant="secondary">p95 Latency</Button>}
        >
          <StaticLineChart tone="blue" />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr_1.2fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Traces by Status</h2>
            <Button variant="ghost">View all</Button>
          </div>
          <StatusDonut />
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top Agents</h2>
            <Button variant="ghost">View all</Button>
          </div>
          <StatList items={topAgents} />
        </Card>

        <ChartCard title="Error Rate Over Time" action={<Button variant="secondary">Error Rate</Button>}>
          <StaticLineChart tone="red" />
        </ChartCard>
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Traces</h2>
            <p className="mt-1 text-sm text-slate-400">Static preview data for dashboard layout.</p>
          </div>
          <Button variant="secondary">View all traces</Button>
        </div>

        <TablePreview
          columns={['Trace ID', 'Agent', 'Status', 'Latency', 'Tokens', 'Cost']}
          minWidth="920px"
          rows={recentTraceRows.map(([traceId, agent, status, latency, tokens, cost]) => [
            <span className="truncate font-medium text-violet-300">{traceId}</span>,
            <span className="truncate text-slate-200">{agent}</span>,
            <StatusBadge status={status as 'success' | 'error' | 'timeout'} />,
            <span className="whitespace-nowrap text-slate-300">{latency}</span>,
            <span className="whitespace-nowrap text-slate-300">{tokens}</span>,
            <span className="whitespace-nowrap text-slate-300">{cost}</span>,
          ])}
        />
      </Card>
    </>
  )
}
