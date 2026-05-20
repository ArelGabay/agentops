import {
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Database,
  MessageSquare,
  Search,
  Sparkles,
  TableProperties,
  Wrench,
  X,
  ZoomIn,
} from 'lucide-react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { IconButton } from '../components/ui/IconButton'
import { KeyValueList } from '../components/ui/KeyValueList'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Tabs } from '../components/ui/Tabs'
import { TagList } from '../components/ui/TagList'
import { TimelinePreview } from '../components/ui/TimelinePreview'

const timelineItems = [
  {
    label: 'User Request',
    duration: '320ms',
    left: 3,
    width: 6,
    tone: 'violet' as const,
    icon: <CircleUserRound className="h-4 w-4" />,
  },
  {
    label: 'LLM Call',
    sublabel: 'gpt-4o',
    duration: '3.21s',
    left: 8,
    width: 36,
    tone: 'blue' as const,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    label: 'Retriever',
    sublabel: 'vector_search',
    duration: '1.42s',
    left: 32,
    width: 18,
    tone: 'emerald' as const,
    icon: <Database className="h-4 w-4" />,
  },
  {
    label: 'Tool Call',
    sublabel: 'get_order_status',
    duration: '2.11s',
    left: 52,
    width: 22,
    tone: 'amber' as const,
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    label: 'Database Query',
    sublabel: 'orders_db',
    duration: '890ms',
    left: 72,
    width: 12,
    tone: 'violet' as const,
    icon: <TableProperties className="h-4 w-4" />,
  },
  {
    label: 'LLM Call',
    sublabel: 'gpt-4o (final)',
    duration: '3.76s',
    left: 78,
    width: 26,
    tone: 'blue' as const,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    label: 'Response',
    duration: '610ms',
    left: 94,
    width: 6,
    tone: 'cyan' as const,
    icon: <MessageSquare className="h-4 w-4" />,
  },
]

const spanRows = [
  ['1', 'User Request', '-', 'success', '10:24:12.123 AM', '320ms', '-', '-'],
  ['2', 'LLM Call (gpt-4o)', 'LLM', 'success', '10:24:12.443 AM', '3.21s', '812', '$0.028'],
  ['3', 'Retriever (vector_search)', 'Tool', 'success', '10:24:13.001 AM', '1.42s', '-', '$0.000'],
  ['4', 'Tool Call (get_order_status)', 'Tool', 'success', '10:24:14.421 AM', '2.11s', '-', '$0.002'],
  ['5', 'Database Query (orders_db)', 'DB', 'success', '10:24:14.632 AM', '890ms', '-', '$0.000'],
  ['6', 'LLM Call (gpt-4o final)', 'LLM', 'success', '10:24:15.522 AM', '3.76s', '1,529', '$0.049'],
  ['7', 'Response', '-', 'success', '10:24:19.282 AM', '610ms', '-', '-'],
]

const spanTableColumns = '56px minmax(260px,1.5fr) 88px 116px 180px 104px 96px 96px'

const summaryItems = [
  { label: 'Span Type', value: 'LLM' },
  { label: 'Model', value: 'gpt-4o' },
  { label: 'Start Time', value: 'May 19, 2025 10:24:12.443 AM' },
  { label: 'Duration', value: '3.21s' },
  { label: 'Status', value: <StatusBadge status="success" /> },
  { label: 'Tokens', value: '812 prompt / 160 completion' },
  { label: 'Total Tokens', value: '972' },
  { label: 'Cost', value: '$0.028' },
]

const parameterItems = [
  { label: 'Temperature', value: '0.2' },
  { label: 'Max Tokens', value: '1024' },
  { label: 'Top P', value: '1' },
  { label: 'Frequency Penalty', value: '0' },
  { label: 'Presence Penalty', value: '0' },
]

function LatencyBreakdown() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start 2xl:flex-row 2xl:items-center">
      <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#8b5cf6_0_4%,#3b82f6_4%_10%,#22c55e_10%_87%,#f59e0b_87%_100%)]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-app-surface text-center">
          <div>
            <p className="text-xl font-semibold text-white">3.21s</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 text-sm">
        {[
          ['Queue Time', '120ms (3.7%)', 'bg-violet-400'],
          ['Prompt Processing', '180ms (5.6%)', 'bg-blue-400'],
          ['Model Inference', '2.47s (76.9%)', 'bg-emerald-400'],
          ['Response Transfer', '440ms (13.7%)', 'bg-amber-400'],
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

export function TraceDetailsPage() {
  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
            <span>Traces</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-200">Trace Details</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">trace_8f3a7b2c4d1e</h1>
            <StatusBadge status="success" />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="text-slate-400">
              Agent <span className="ml-2 text-slate-100">Customer Support Agent</span>
            </span>
            <span className="text-slate-400">
              Start Time <span className="ml-2 text-slate-100">May 19, 2025 10:24:12 AM</span>
            </span>
            <span className="text-slate-400">
              Duration <span className="ml-2 text-slate-100">12.34s</span>
            </span>
            <span className="text-slate-400">
              Total Tokens <span className="ml-2 text-slate-100">2,341</span>
            </span>
            <span className="text-slate-400">
              Total Cost <span className="ml-2 text-slate-100">$0.081</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <MessageSquare className="h-4 w-4" />
            Give Feedback
          </Button>
          <Button variant="primary">
            <Bot className="h-4 w-4" />
            View in Playground
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary">
          <ChevronLeft className="h-4 w-4" />
          Previous Trace
        </Button>
        <Button variant="secondary">
          Next Trace
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Card className="overflow-hidden">
            <Tabs
              items={[
                { label: 'Timeline', active: true },
                { label: 'Spans' },
                { label: 'Logs' },
                { label: 'Evaluations' },
                { label: 'Metadata' },
              ]}
            />

            <div className="p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white">Execution Timeline</h2>
                <div className="flex items-center gap-2">
                  <Button variant="secondary">Fit to view</Button>
                  <IconButton label="Zoom in">
                    <ZoomIn className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Search timeline">
                    <Search className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <TimelinePreview items={timelineItems} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Spans (7)</h2>
              <Button variant="secondary">View all spans</Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-app-border">
              <div className="min-w-[1120px]">
                <div
                  className="grid items-center gap-4 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase text-slate-500"
                  style={{ gridTemplateColumns: spanTableColumns }}
                >
                  <span>#</span>
                  <span>Name</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Start Time</span>
                  <span>Duration</span>
                  <span>Tokens</span>
                  <span>Cost</span>
                </div>

                {spanRows.map(([index, name, type, status, startTime, duration, tokens, cost]) => (
                  <div
                    className="grid items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                    key={index}
                    style={{ gridTemplateColumns: spanTableColumns }}
                  >
                    <span className="text-slate-500">{index}</span>
                    <span className="truncate font-medium text-slate-100">{name}</span>
                    <span className="whitespace-nowrap text-slate-300">{type}</span>
                    <span>
                      <StatusBadge status={status as 'success'} />
                    </span>
                    <span className="whitespace-nowrap text-slate-300">{startTime}</span>
                    <span className="whitespace-nowrap text-slate-300">{duration}</span>
                    <span className="whitespace-nowrap text-slate-300">{tokens}</span>
                    <span className="whitespace-nowrap text-slate-300">{cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-slate-300" />
                  <h2 className="truncate text-sm font-semibold text-white">LLM Call (gpt-4o)</h2>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status="success" />
                  <IconButton label="Close span details">
                    <X className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4 text-sm text-slate-400">
                <span className="text-violet-300">Overview</span>
                <span>Input</span>
                <span>Output</span>
                <span>Attributes</span>
              </div>
            </div>
            <div className="h-0.5 w-24 bg-violet-500" />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Summary</h2>
            <KeyValueList items={summaryItems} />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Latency Breakdown</h2>
            <LatencyBreakdown />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Model Parameters</h2>
            <KeyValueList items={parameterItems} />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Tags</h2>
            <TagList tags={['model:gpt-4o', 'provider:openai', 'region:us-east-1']} />
          </Card>
        </aside>
      </div>
    </>
  )
}
