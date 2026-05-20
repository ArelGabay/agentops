import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Columns3,
  Database,
  Download,
  Eye,
  Filter,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { PageHeader } from '../components/layout/PageHeader'
import { MetricCard } from '../components/metrics/MetricCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ChartCard } from '../components/ui/ChartCard'
import { DistributionBars } from '../components/ui/DistributionBars'
import { IconButton } from '../components/ui/IconButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { RadarPreview } from '../components/ui/RadarPreview'
import { ResultBadge } from '../components/ui/ResultBadge'
import { ScoreStars } from '../components/ui/ScoreStars'
import { SearchInput } from '../components/ui/SearchInput'

const metricCards = [
  {
    title: 'Total Evaluations',
    value: '3,214',
    trendLabel: '18.7% vs last 7 days',
    trend: 'up' as const,
    tone: 'violet' as const,
    icon: <BarChart3 className="h-5 w-5" />,
    sparkline: [56, 49, 44, 50, 39, 48, 42, 45, 51, 43, 57, 62],
  },
  {
    title: 'Avg. Score',
    value: '86 /100',
    trendLabel: '6.3% vs last 7 days',
    trend: 'up' as const,
    tone: 'emerald' as const,
    icon: <CheckCircle2 className="h-5 w-5" />,
    sparkline: [44, 50, 47, 55, 45, 44, 49, 46, 52, 48, 55, 58],
  },
  {
    title: 'Pass Rate',
    value: '92.4%',
    trendLabel: '7.6% vs last 7 days',
    trend: 'up' as const,
    tone: 'blue' as const,
    icon: <ShieldCheck className="h-5 w-5" />,
    sparkline: [42, 51, 37, 56, 49, 45, 42, 37, 44, 40, 62, 50],
  },
  {
    title: 'Fail Rate',
    value: '7.6%',
    trendLabel: '7.6% vs last 7 days',
    trend: 'down' as const,
    tone: 'red' as const,
    icon: <ShieldAlert className="h-5 w-5" />,
    sparkline: [42, 39, 34, 46, 31, 49, 30, 43, 31, 44, 37, 35],
  },
  {
    title: 'Hallucination Rate',
    value: '4.3%',
    trendLabel: '2.1% vs last 7 days',
    trend: 'down' as const,
    tone: 'amber' as const,
    icon: <Sparkles className="h-5 w-5" />,
    sparkline: [35, 31, 26, 33, 22, 24, 62, 28, 42, 25, 35, 31],
  },
  {
    title: 'Evaluated Tokens',
    value: '1.2M',
    trendLabel: '16.4% vs last 7 days',
    trend: 'up' as const,
    tone: 'violet' as const,
    icon: <Database className="h-5 w-5" />,
    sparkline: [39, 45, 50, 41, 47, 35, 52, 31, 38, 48, 43, 46],
  },
]

const distribution = [
  { label: '0 - 0.2', value: '2.1%', height: 8 },
  { label: '0.2 - 0.4', value: '5.3%', height: 16 },
  { label: '0.4 - 0.6', value: '18.7%', height: 48 },
  { label: '0.6 - 0.8', value: '35.6%', height: 82 },
  { label: '0.8 - 1.0', value: '38.3%', height: 88 },
]

const failingDimensions: Array<{
  label: string
  rate: string
  value: number
  tone: 'red' | 'amber' | 'blue'
}> = [
  { label: 'Hallucination', rate: '4.3%', value: 78, tone: 'red' },
  { label: 'Safety', rate: '2.1%', value: 44, tone: 'red' },
  { label: 'Completeness', rate: '1.7%', value: 34, tone: 'amber' },
  { label: 'Relevance', rate: '1.3%', value: 28, tone: 'amber' },
  { label: 'Correctness', rate: '0.9%', value: 20, tone: 'blue' },
]

const datasets = [
  ['Help Desk QA', '91', 91],
  ['Web Search QA', '87', 87],
  ['Data Analysis', '82', 82],
  ['Code Generation', '88', 88],
  ['Blog Generation', '79', 79],
]

const evaluationRows = [
  ['eval_01JZ8X7Y4G2K', 'trc_8f3a7b2c4d1e', 'Customer Support Agent', 'Help Desk QA', '92', 'pass', '2.1%', 'May 19, 2025 10:24 AM'],
  ['eval_01JZ8X6W2H1K', 'trc_7a2b6c1d9e3f', 'Research Assistant', 'Web Search QA', '78', 'partial', '6.7%', 'May 19, 2025 10:21 AM'],
  ['eval_01JZ8X5V1E9M', 'trc_6b1c5d9e2f8a', 'Data Analyst Agent', 'Data Analysis', '45', 'fail', '18.3%', 'May 19, 2025 10:18 AM'],
  ['eval_01JZ8X4T7J6K', 'trc_9e2f8a1b5c7d', 'Content Writer', 'Blog Generation', '88', 'pass', '3.2%', 'May 19, 2025 10:15 AM'],
  ['eval_01JZ8X3S6H5L', 'trc_3c7d9e2f1a5b', 'Code Assistant', 'Code Generation', '93', 'pass', '1.8%', 'May 19, 2025 10:11 AM'],
]

const evaluationTableColumns =
  'minmax(160px,1.05fr) minmax(150px,1fr) minmax(210px,1.25fr) minmax(160px,1fr) 140px 132px 140px 190px 96px'

function StaticScoreLine() {
  return (
    <div className="h-56">
      <svg className="h-full w-full" viewBox="0 0 640 220" role="img" aria-label="Static score over time chart">
        <path
          className="stroke-slate-700/60"
          d="M20 40H620 M20 85H620 M20 130H620 M20 175H620"
          fill="none"
          strokeDasharray="4 6"
        />
        <path
          className="fill-violet-500/15"
          d="M20 132 L108 104 L196 120 L284 114 L372 86 L460 120 L548 104 L620 76 L620 220 L20 220 Z"
        />
        <path
          className="stroke-violet-400"
          d="M20 132 L108 104 L196 120 L284 114 L372 86 L460 120 L548 104 L620 76"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {[20, 108, 196, 284, 372, 460, 548, 620].map((x, index) => (
          <circle
            className="fill-white stroke-violet-400"
            cx={x}
            cy={[132, 104, 120, 114, 86, 120, 104, 76][index]}
            key={x}
            r="4"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  )
}

function EvaluationResultsDonut() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full bg-[conic-gradient(#22c55e_0_92%,#3b82f6_92%_97%,#ef4444_97%_100%)]">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-app-surface text-center">
          <div>
            <p className="text-xl font-semibold text-white">3,214</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 text-sm">
        {[
          ['Pass', '2,970 (92.4%)', 'bg-emerald-400'],
          ['Partial Pass', '164 (5.1%)', 'bg-blue-400'],
          ['Fail', '80 (2.5%)', 'bg-red-400'],
        ].map(([label, value, color]) => (
          <div className="flex items-center justify-between gap-4" key={label}>
            <span className="flex items-center gap-2 text-slate-300">
              <span className={['h-2 w-2 rounded-full', color].join(' ')} />
              {label}
            </span>
            <span className="text-slate-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function scoreTone(score: string) {
  const value = Number(score)

  if (value >= 85) return 'green'
  if (value >= 70) return 'amber'
  return 'red'
}

export function EvaluationsPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Evaluations"
          description="Track and analyze the quality, accuracy, and reliability of your AI agents."
        />

        <div className="flex flex-wrap gap-3">
          <Button className="min-w-0" variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">May 12 - May 19, 2025</span>
          </Button>
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="primary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.9fr_1fr]">
        <ChartCard title="Score Over Time" action={<Button variant="secondary">Daily</Button>}>
          <StaticScoreLine />
        </ChartCard>

        <ChartCard title="Score Distribution" action={<Button variant="secondary">All Time</Button>}>
          <DistributionBars items={distribution} />
        </ChartCard>

        <ChartCard title="Evaluation Dimensions" action={<Button variant="secondary">All Time</Button>}>
          <RadarPreview />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.2fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-5 text-sm font-semibold text-white">Evaluation Results</h2>
          <EvaluationResultsDonut />
        </Card>

        <Card className="p-5">
          <div className="mb-5 grid grid-cols-[1fr_80px_120px] gap-4 text-xs font-medium uppercase text-slate-500">
            <span>Top Failing Dimensions</span>
            <span>Fail Rate</span>
            <span>Trend (7d)</span>
          </div>

          <div className="space-y-4">
            {failingDimensions.map((dimension) => (
              <div className="grid grid-cols-[1fr_80px_120px] items-center gap-4 text-sm" key={dimension.label}>
                <span className="text-slate-200">{dimension.label}</span>
                <span className="text-slate-300">{dimension.rate}</span>
                <ProgressBar tone={dimension.tone} value={dimension.value} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Evaluation by Dataset / Task</h2>
            <Button variant="secondary">All Time</Button>
          </div>

          <div className="space-y-4">
            {datasets.map(([label, score, value]) => (
              <div className="grid grid-cols-[112px_1fr_42px] items-center gap-3 text-sm" key={label}>
                <span className="truncate text-slate-300">{label}</span>
                <ProgressBar value={Number(value)} />
                <span className="text-right text-slate-200">{score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Evaluations</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput placeholder="Search evaluations..." />
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="secondary">
              <Columns3 className="h-4 w-4" />
              Columns
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-app-border">
          <div className="min-w-[1540px]">
            <div
              className="grid w-full items-center gap-4 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase text-slate-500"
              style={{ gridTemplateColumns: evaluationTableColumns }}
            >
              <span>Evaluation ID</span>
              <span>Trace ID</span>
              <span>Agent</span>
              <span>Dataset / Task</span>
              <span>Score</span>
              <span>Result</span>
              <span>Hallucination</span>
              <span>Created At</span>
              <span>Actions</span>
            </div>

            {evaluationRows.map(([evaluationId, traceId, agent, task, score, result, hallucination, createdAt]) => {
              const tone = scoreTone(score)

              return (
                <div
                  className="grid w-full items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                  key={evaluationId}
                  style={{ gridTemplateColumns: evaluationTableColumns }}
                >
                  <span className="truncate font-medium text-violet-300">{evaluationId}</span>
                  <span className="truncate font-medium text-violet-300">{traceId}</span>
                  <span className="truncate text-slate-200">{agent}</span>
                  <span className="truncate text-slate-300">{task}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={tone === 'red' ? 'text-red-300' : tone === 'amber' ? 'text-amber-300' : 'text-emerald-300'}
                    >
                      {score}
                    </span>
                    <ScoreStars count={tone === 'red' ? 2 : tone === 'amber' ? 3 : 5} tone={tone} />
                  </span>
                  <span>
                    <ResultBadge result={result as 'pass' | 'partial' | 'fail'} />
                  </span>
                  <span
                    className={Number(hallucination.replace('%', '')) > 10 ? 'text-red-300' : 'text-emerald-300'}
                  >
                    {hallucination}
                  </span>
                  <span className="whitespace-nowrap text-slate-300">{createdAt}</span>
                  <span>
                    <IconButton label={`View ${evaluationId}`}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <span>Showing 1 to 5 of 3,214 evaluations</span>
          <div className="flex items-center gap-3">
            <IconButton label="Previous page">
              <span>‹</span>
            </IconButton>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-sm font-medium text-white">
              1
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300">2</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-300">3</span>
            <span className="px-2 text-slate-500">...</span>
            <span className="grid h-8 w-10 place-items-center rounded-lg text-slate-300">643</span>
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
