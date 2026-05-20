import {
  Activity,
  BarChart3,
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  Download,
  Eye,
  FileSearch,
  Filter,
  RefreshCw,
  Save,
} from 'lucide-react'

import { PageHeader } from '../components/layout/PageHeader'
import { MetricCard } from '../components/metrics/MetricCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { FilterSelect } from '../components/ui/FilterSelect'
import { IconButton } from '../components/ui/IconButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { SearchInput } from '../components/ui/SearchInput'
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
    icon: <BarChart3 className="h-5 w-5" />,
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
    title: 'Error Rate',
    value: '1.38%',
    trendLabel: '6.3% vs last 7 days',
    trend: 'down' as const,
    tone: 'red' as const,
    icon: <FileSearch className="h-5 w-5" />,
    sparkline: [48, 44, 35, 49, 41, 31, 43, 36, 42, 33, 40, 41],
  },
]

const traceRows = [
  {
    id: 'trc_8f3a7b2c4d1e',
    agent: 'Customer Support Agent',
    status: 'success' as const,
    duration: '12.34s',
    progress: 58,
    tokens: '2,341',
    cost: '$0.081',
    startTime: 'May 19, 2025 10:24 AM',
    environment: 'Production',
    user: 'user_1234',
    icon: <Bot className="h-4 w-4" />,
  },
  {
    id: 'trc_7a2b6c1d9e3f',
    agent: 'Research Assistant',
    status: 'success' as const,
    duration: '8.21s',
    progress: 45,
    tokens: '1,872',
    cost: '$0.054',
    startTime: 'May 19, 2025 10:21 AM',
    environment: 'Production',
    user: 'user_5678',
    icon: <FileSearch className="h-4 w-4" />,
  },
  {
    id: 'trc_6b1c5d9e2f8a',
    agent: 'Data Analyst Agent',
    status: 'error' as const,
    duration: '22.14s',
    progress: 76,
    tokens: '3,214',
    cost: '$0.113',
    startTime: 'May 19, 2025 10:18 AM',
    environment: 'Production',
    user: 'user_4321',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: 'trc_9e2f8a1b5c7d',
    agent: 'Content Writer',
    status: 'success' as const,
    duration: '6.45s',
    progress: 38,
    tokens: '987',
    cost: '$0.034',
    startTime: 'May 19, 2025 10:15 AM',
    environment: 'Staging',
    user: 'user_9876',
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: 'trc_3c7d9e2f1a5b',
    agent: 'Code Assistant',
    status: 'timeout' as const,
    duration: '30.02s',
    progress: 92,
    tokens: '2,111',
    cost: '$0.074',
    startTime: 'May 19, 2025 10:11 AM',
    environment: 'Production',
    user: 'user_2468',
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 'trc_1a2b3c4d5e6f',
    agent: 'Customer Support Agent',
    status: 'success' as const,
    duration: '9.18s',
    progress: 49,
    tokens: '1,543',
    cost: '$0.045',
    startTime: 'May 19, 2025 10:08 AM',
    environment: 'Production',
    user: 'user_1357',
    icon: <Bot className="h-4 w-4" />,
  },
  {
    id: 'trc_5d6e7f8a9b0c',
    agent: 'Research Assistant',
    status: 'success' as const,
    duration: '11.07s',
    progress: 55,
    tokens: '2,876',
    cost: '$0.096',
    startTime: 'May 19, 2025 10:05 AM',
    environment: 'Production',
    user: 'user_8642',
    icon: <FileSearch className="h-4 w-4" />,
  },
  {
    id: 'trc_2b3c4d5e6f7a',
    agent: 'Data Analyst Agent',
    status: 'success' as const,
    duration: '7.63s',
    progress: 42,
    tokens: '1,234',
    cost: '$0.039',
    startTime: 'May 19, 2025 10:02 AM',
    environment: 'Staging',
    user: 'user_9753',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: 'trc_8b9c0d1e2f3a',
    agent: 'Content Writer',
    status: 'error' as const,
    duration: '15.45s',
    progress: 62,
    tokens: '2,002',
    cost: '$0.067',
    startTime: 'May 19, 2025 9:59 AM',
    environment: 'Production',
    user: 'user_7531',
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: 'trc_0c1d2e3f4a5b',
    agent: 'Code Assistant',
    status: 'success' as const,
    duration: '5.32s',
    progress: 34,
    tokens: '876',
    cost: '$0.028',
    startTime: 'May 19, 2025 9:55 AM',
    environment: 'Production',
    user: 'user_1597',
    icon: <Database className="h-4 w-4" />,
  },
]

function EnvironmentBadge({ value }: { value: string }) {
  const isProduction = value === 'Production'

  return (
    <span
      className={[
        'inline-flex rounded-md px-2 py-1 text-xs font-medium',
        isProduction ? 'bg-emerald-500/10 text-emerald-300' : 'bg-violet-500/10 text-violet-300',
      ].join(' ')}
    >
      {value}
    </span>
  )
}

export function TracesPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Traces" description="Search, filter, and analyze your agent traces." />

        <div className="flex flex-wrap gap-3">
          <Button className="min-w-0" variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">May 12 - May 19, 2025</span>
          </Button>
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4" />
            Refresh
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

      <Card className="mt-4 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <SearchInput placeholder="Search by trace ID, agent, user, or tags..." shortcut="⌘K" />
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterSelect label="Status" value="All" />
            <FilterSelect label="Agent" value="All" />
            <FilterSelect label="Environment" value="All" />
            <FilterSelect label="Latency" value="All" />
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              More filters
            </Button>
            <Button variant="secondary">
              <Save className="h-4 w-4" />
              Save view
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1260px]">
            <div className="grid grid-cols-[44px_1.15fr_1.45fr_100px_126px_110px_90px_178px_116px_104px_80px] items-center gap-4 bg-white/[0.03] px-4 py-4 text-sm text-slate-400">
              <span className="h-4 w-4 rounded border border-slate-600" />
              <span>Trace ID</span>
              <span>Agent</span>
              <span>Status</span>
              <span>Duration</span>
              <span>Total Tokens</span>
              <span>Cost</span>
              <span>Start Time</span>
              <span>Environment</span>
              <span>User</span>
              <span>Actions</span>
            </div>

            {traceRows.map((trace) => (
              <div
                className="grid grid-cols-[44px_1.15fr_1.45fr_100px_126px_110px_90px_178px_116px_104px_80px] items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                key={trace.id}
              >
                <span className="h-4 w-4 rounded border border-slate-600" />
                <span className="truncate font-medium text-violet-300 underline decoration-violet-500/40 underline-offset-4">
                  {trace.id}
                </span>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                    {trace.icon}
                  </span>
                  <span className="truncate text-slate-100">{trace.agent}</span>
                </span>
                <span>
                  <StatusBadge status={trace.status} />
                </span>
                <span className="flex items-center gap-3 text-slate-200">
                  {trace.duration}
                  <ProgressBar
                    tone={trace.status === 'error' ? 'red' : trace.status === 'timeout' ? 'amber' : 'violet'}
                    value={trace.progress}
                  />
                </span>
                <span className="text-slate-300">{trace.tokens}</span>
                <span className="text-slate-300">{trace.cost}</span>
                <span className="text-slate-300">{trace.startTime}</span>
                <EnvironmentBadge value={trace.environment} />
                <span className="text-slate-300">{trace.user}</span>
                <span className="flex items-center gap-2">
                  <IconButton label={`Preview ${trace.id}`}>
                    <Eye className="h-4 w-4" />
                  </IconButton>
                  <IconButton label={`Open ${trace.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-app-border px-4 py-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <span>Showing 1 to 10 of 12,847 traces</span>

          <div className="flex flex-wrap items-center gap-3">
            <IconButton label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-sm font-medium text-white">
              1
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300">2</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300">3</span>
            <span className="px-2 text-slate-500">...</span>
            <span className="grid h-8 w-12 place-items-center rounded-lg text-slate-300">1285</span>
            <IconButton label="Next page">
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>

          <div className="flex items-center gap-3">
            <span>Rows per page</span>
            <Button variant="secondary">10</Button>
          </div>
        </div>
      </Card>
    </>
  )
}
