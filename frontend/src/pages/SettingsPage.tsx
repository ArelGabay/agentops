import {
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  Copy,
  Moon,
  Monitor,
  Plus,
  Slack,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react'

import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CheckboxRow } from '../components/ui/CheckboxRow'
import { FilterSelect } from '../components/ui/FilterSelect'
import { IconButton } from '../components/ui/IconButton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Tabs } from '../components/ui/Tabs'
import { Toggle } from '../components/ui/Toggle'

const accentColors = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-amber-400',
  'bg-red-400',
  'bg-fuchsia-500',
]

const integrations = [
  ['OpenAI', 'connected'],
  ['Anthropic', 'connected'],
  ['LangChain', 'connected'],
  ['OpenTelemetry', 'connected'],
  ['Slack', 'connected'],
  ['Sentry', 'disconnected'],
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function StaticInput({ value }: { value: string }) {
  return (
    <div className="flex h-11 items-center rounded-lg border border-app-border bg-white/[0.02] px-3 text-sm text-slate-100">
      {value}
    </div>
  )
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  const connected = status === 'connected'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-app-border py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-xs font-semibold text-slate-200">
          {name.slice(0, 2)}
        </span>
        <span className="truncate text-sm font-medium text-slate-100">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={connected ? 'success' : 'error'} label={connected ? 'Connected' : 'Disconnected'} />
        <IconButton label={`Open ${name} integration`}>
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  )
}

function ApiKeyCard({ name, value, createdAt }: { name: string; value: string; createdAt: string }) {
  return (
    <div className="rounded-lg border border-app-border bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-100">{name}</p>
          <p className="mt-1 font-mono text-sm text-slate-300">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{createdAt}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button className="h-8 px-3 text-xs" variant="danger">
            Revoke
          </Button>
          <IconButton label={`Copy ${name}`}>
            <Copy className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export function SettingsPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Settings"
          description="Manage your workspace, integrations, and platform preferences."
        />

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <BookOpen className="h-4 w-4" />
            Documentation
          </Button>
          <div className="flex h-10 overflow-hidden rounded-lg border border-app-border bg-white/[0.03]">
            <button className="px-4 text-sm text-slate-300" type="button">
              Light
            </button>
            <button className="bg-violet-600/25 px-4 text-sm font-medium text-white" type="button">
              Dark
            </button>
          </div>
        </div>
      </div>

      <Tabs
        items={[
          { label: 'General', active: true },
          { label: 'Evaluations' },
          { label: 'Alerts' },
          { label: 'Integrations' },
          { label: 'API Keys' },
          { label: 'Team' },
          { label: 'Billing' },
        ]}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.85fr_0.85fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Workspace Settings</h2>
                <p className="mt-1 text-sm text-slate-400">Update your workspace details and preferences.</p>
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
              <div className="space-y-4">
                <Field label="Workspace Name">
                  <StaticInput value="Default Workspace" />
                </Field>
                <Field label="Environment">
                  <FilterSelect label="Environment" value="Production" />
                </Field>
                <Field label="Timezone">
                  <FilterSelect label="Timezone" value="(UTC-07:00) Pacific Time (US & Canada)" />
                </Field>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-app-border bg-white/[0.02] p-4 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Building2 className="h-10 w-10" />
                </div>
                <Button variant="secondary">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-slate-500">PNG, JPG or SVG. Max size 2MB</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Appearance</h2>
            <p className="mt-1 text-sm text-slate-400">Customize the look and feel of AgentOps.</p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">Theme</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button variant="secondary">
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button variant="secondary">
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color, index) => (
                    <span className={['grid h-7 w-7 place-items-center rounded-full', color].join(' ')} key={color}>
                      {index === 0 && <Check className="h-4 w-4 text-white" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-sm text-slate-400">Configure how and when you want to be notified.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive email alerts for important events.</p>
                  </div>
                  <Toggle checked />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">Slack Notifications</p>
                    <p className="text-xs text-slate-500">Receive alerts and updates in Slack.</p>
                  </div>
                  <Button className="h-9 px-3" variant="secondary">
                    <Slack className="h-4 w-4" />
                    Connect Slack
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">Daily Summary</p>
                    <p className="text-xs text-slate-500">Receive a daily summary of key metrics.</p>
                  </div>
                  <Toggle checked />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-200">Notify me about</p>
                <CheckboxRow title="Trace failures" />
                <CheckboxRow title="Evaluation score drops" />
                <CheckboxRow title="High latency alerts" />
                <CheckboxRow title="Cost budget alerts" />
                <CheckboxRow checked={false} title="New integrations & updates" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Evaluation Settings</h2>
            <p className="mt-1 text-sm text-slate-400">Configure how evaluations are run and scored.</p>

            <div className="mt-5 space-y-4">
              <Field label="Default Evaluation Model">
                <FilterSelect label="Model" value="gpt-4o" />
              </Field>
              <Field label="Evaluation Frequency">
                <FilterSelect label="Frequency" value="Every Trace" />
              </Field>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">Score Thresholds</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StaticInput value="0.70" />
                  <StaticInput value="0.40" />
                  <StaticInput value="0.40" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Evaluation Dimensions</h2>
            <p className="mt-1 text-sm text-slate-400">Select the dimensions to include in evaluations.</p>

            <div className="mt-5 space-y-5">
              <CheckboxRow description="Measure factual accuracy" title="Correctness" />
              <CheckboxRow description="Measure relevance to query" title="Relevance" />
              <CheckboxRow description="Measure completeness" title="Completeness" />
              <CheckboxRow description="Detect hallucinations" title="Hallucination" />
              <CheckboxRow description="Check content safety" title="Safety" />
              <CheckboxRow description="Measure response coherence" title="Coherence" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Integrations</h2>
            <p className="mt-1 text-sm text-slate-400">Manage your connected services.</p>

            <div className="mt-4">
              {integrations.map(([name, status]) => (
                <IntegrationRow key={name} name={name} status={status} />
              ))}
            </div>

            <Button className="mt-4 w-full" variant="secondary">
              Browse all integrations
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">API Keys</h2>
                <p className="mt-1 text-sm text-slate-400">Manage API keys for accessing AgentOps API.</p>
              </div>
              <Button variant="primary">
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </div>

            <div className="space-y-3">
              <ApiKeyCard createdAt="Created May 10, 2025" name="Production Key" value="••••••••••••a1b2" />
              <ApiKeyCard createdAt="Created Apr 22, 2025" name="Development Key" value="••••••••••••c3d4" />
            </div>

            <Button className="mt-4 w-full" variant="secondary">
              View all API keys
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Danger Zone</h2>
            <p className="mt-1 text-sm text-slate-400">Irreversible and destructive actions.</p>

            <Button className="mt-5 w-full" variant="danger">
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">This action cannot be undone.</p>
          </Card>
        </div>
      </div>
    </>
  )
}
