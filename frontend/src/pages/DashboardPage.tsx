import {
  Activity,
  Bot,
  Calendar,
  CheckCircle2,
  Clock3,
  Database,
  DollarSign,
  Download,
} from "lucide-react";

import { useEvaluations, useTraces } from "../hooks";
import { PageHeader } from "../components/layout/PageHeader";
import { MetricCard } from "../components/metrics/MetricCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChartCard } from "../components/ui/ChartCard";
import { StatList } from "../components/ui/StatList";
import { StatusBadge } from "../components/ui/StatusBadge";
import { TablePreview } from "../components/ui/TablePreview";

const metricCardTemplates = [
  {
    title: "Total Traces",
    trend: "up" as const,
    tone: "violet" as const,
    icon: <Activity className="h-5 w-5" />,
    sparkline: [32, 45, 31, 49, 38, 34, 42, 41, 44, 48, 61, 50],
  },
  {
    title: "Success Rate",
    trend: "up" as const,
    tone: "emerald" as const,
    icon: <CheckCircle2 className="h-5 w-5" />,
    sparkline: [42, 40, 38, 41, 39, 44, 48, 57, 51, 55, 62, 58],
  },
  {
    title: "Avg. Latency",
    trend: "down" as const,
    tone: "amber" as const,
    icon: <Clock3 className="h-5 w-5" />,
    sparkline: [56, 52, 44, 50, 46, 39, 35, 42, 33, 31, 29, 28],
  },
  {
    title: "Total Tokens",
    trend: "up" as const,
    tone: "blue" as const,
    icon: <Database className="h-5 w-5" />,
    sparkline: [35, 42, 33, 49, 37, 41, 39, 45, 44, 50, 63, 68],
  },
  {
    title: "Total Cost",
    trend: "up" as const,
    tone: "amber" as const,
    icon: <DollarSign className="h-5 w-5" />,
    sparkline: [44, 41, 35, 49, 55, 42, 39, 47, 37, 50, 58, 66],
  },
];

function ChartEmptyState() {
  return (
    <div className="grid h-56 place-items-center rounded-lg border border-app-border bg-white/[0.03] px-4 text-center text-sm text-slate-400">
      Time-series chart data is not available yet.
    </div>
  );
}

type StatusDonutItem = {
  label: string;
  value: string;
  color: string;
};

function StatusDonut({
  total,
  items,
}: {
  total: string;
  items: StatusDonutItem[];
}) {
  return (
    <div className="flex min-h-[220px] flex-col gap-6 sm:flex-row sm:items-center">
      <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full bg-[conic-gradient(#34d399_0_86%,#f87171_86%_95%,#fbbf24_95%_98%,#94a3b8_98%_100%)] shadow-2xl shadow-black/20">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-app-surface text-center">
          <div>
            <p className="text-xl font-semibold text-white">{total}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-3 text-sm">
        {items.map(({ label, value, color }) => (
          <div className="flex items-center justify-between gap-4" key={label}>
            <span className="flex items-center gap-2 whitespace-nowrap text-slate-300">
              <span className={["h-2 w-2 rounded-full", color].join(" ")} />
              {label}
            </span>
            <span className="whitespace-nowrap text-slate-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatLatency(milliseconds: number) {
  if (milliseconds >= 1000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }

  return `${Math.round(milliseconds)}ms`;
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function DashboardPage() {
  const tracesQuery = useTraces(100);
  const evaluationsQuery = useEvaluations(100);

  const traces = tracesQuery.data ?? [];
  const evaluations = evaluationsQuery.data ?? [];

  const isLoading = tracesQuery.isLoading || evaluationsQuery.isLoading;
  const isError = tracesQuery.isError || evaluationsQuery.isError;

  const hasData = traces.length > 0 || evaluations.length > 0;

  const totalTraces = traces.length;
  const successfulTraces = traces.filter(
    (trace) => trace.status === "success",
  ).length;
  const tracesWithLatency = traces.filter((trace) => trace.latency_ms !== null);

  const successRate =
    totalTraces > 0 ? (successfulTraces / totalTraces) * 100 : 0;

  const averageLatency =
    tracesWithLatency.length > 0
      ? tracesWithLatency.reduce(
          (sum, trace) => sum + (trace.latency_ms ?? 0),
          0,
        ) / tracesWithLatency.length
      : 0;

  const totalTokens = traces.reduce(
    (sum, trace) => sum + (trace.total_tokens ?? 0),
    0,
  );

  const totalCost = traces.reduce(
    (sum, trace) => sum + Number(trace.total_cost ?? 0),
    0,
  );

  const dashboardMetricCards = metricCardTemplates.map((metric) => {
    if (metric.title === "Total Traces") {
      return {
        ...metric,
        value: isLoading ? "..." : formatNumber(totalTraces),
        trendLabel: "From latest 100 traces",
      };
    }

    if (metric.title === "Success Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(successRate),
        trendLabel: "Successful traces",
      };
    }

    if (metric.title === "Avg. Latency") {
      return {
        ...metric,
        value: isLoading ? "..." : formatLatency(averageLatency),
        trendLabel: "Average response time",
      };
    }

    if (metric.title === "Total Tokens") {
      return {
        ...metric,
        value: isLoading ? "..." : formatNumber(totalTokens),
        trendLabel: "Tokens in latest traces",
      };
    }

    if (metric.title === "Total Cost") {
      return {
        ...metric,
        value: isLoading ? "..." : formatCurrency(totalCost),
        trendLabel: "Estimated latest trace cost",
      };
    }

    return {
      ...metric,
      value: isLoading ? "..." : "0",
      trendLabel: "No data available",
    };
  });

  const dashboardTraceRows = traces
    .slice(0, 5)
    .map((trace) => [
      trace.id,
      trace.agent_id,
      trace.status,
      trace.latency_ms === null ? "N/A" : formatLatency(trace.latency_ms),
      trace.total_tokens === null ? "N/A" : formatNumber(trace.total_tokens),
      trace.total_cost === null
        ? "N/A"
        : formatCurrency(Number(trace.total_cost)),
    ]);

  const statusCounts = {
    success: traces.filter((trace) => trace.status === "success").length,
    error: traces.filter((trace) => trace.status === "error").length,
    timeout: traces.filter((trace) => trace.status === "timeout").length,
    canceled: traces.filter((trace) => trace.status === "canceled").length,
  };

  const formatStatusValue = (count: number) => {
    const percent = totalTraces > 0 ? (count / totalTraces) * 100 : 0;
    return `${formatNumber(count)} (${formatPercent(percent)})`;
  };

  const statusDonutItems = [
    {
      label: "Success",
      value: formatStatusValue(statusCounts.success),
      color: "bg-emerald-400",
    },
    {
      label: "Error",
      value: formatStatusValue(statusCounts.error),
      color: "bg-red-400",
    },
    {
      label: "Timeout",
      value: formatStatusValue(statusCounts.timeout),
      color: "bg-amber-400",
    },
    {
      label: "Canceled",
      value: formatStatusValue(statusCounts.canceled),
      color: "bg-slate-400",
    },
  ];

  const agentCounts = traces.reduce<Record<string, number>>((counts, trace) => {
    counts[trace.agent_id] = (counts[trace.agent_id] ?? 0) + 1;
    return counts;
  }, {});

  const dashboardTopAgents = Object.entries(agentCounts)
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .slice(0, 5)
    .map(([agentId, count]) => ({
      label: agentId,
      value: formatNumber(count),
      meta:
        totalTraces > 0 ? formatPercent((count / totalTraces) * 100) : "0.0%",
      trend: "neutral" as const,
      icon: <Bot className="h-4 w-4 text-violet-300" />,
    }));

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

      {isLoading && (
        <Card className="mt-4 border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
          Loading dashboard data...
        </Card>
      )}

      {isError && (
        <Card className="mt-4 border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          Dashboard data is unavailable. Showing the last static layout.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardMetricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Traces Over Time"
          action={<Button variant="secondary">Traces</Button>}
        >
          <ChartEmptyState />
        </ChartCard>

        <ChartCard
          title="Latency (p95) Over Time"
          action={<Button variant="secondary">p95 Latency</Button>}
        >
          <ChartEmptyState />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr_1.2fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Traces by Status
            </h2>
            <Button variant="ghost">View all</Button>
          </div>
          <StatusDonut
            total={formatNumber(totalTraces)}
            items={statusDonutItems}
          />
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top Agents</h2>
            <Button variant="ghost">View all</Button>
          </div>
          {dashboardTopAgents.length > 0 ? (
            <StatList items={dashboardTopAgents} />
          ) : (
            <div className="rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
              No agent activity yet.
            </div>
          )}
        </Card>

        <ChartCard
          title="Error Rate Over Time"
          action={<Button variant="secondary">Error Rate</Button>}
        >
          <ChartEmptyState />
        </ChartCard>
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Traces</h2>
            <p className="mt-1 text-sm text-slate-400">
              {hasData
                ? "Live API-backed trace data for dashboard metrics."
                : "No backend data found yet."}
            </p>
          </div>
          <Button variant="secondary">View all traces</Button>
        </div>

        {dashboardTraceRows.length > 0 ? (
          <TablePreview
            columns={[
              "Trace ID",
              "Agent",
              "Status",
              "Latency",
              "Tokens",
              "Cost",
            ]}
            minWidth="1120px"
            rows={dashboardTraceRows.map(
              ([traceId, agent, status, latency, tokens, cost]) => [
                <span className="block max-w-[220px] truncate font-medium text-violet-300">
                  {traceId}
                </span>,
                <span className="truncate text-slate-200">{agent}</span>,
                <StatusBadge
                  status={status as "success" | "error" | "timeout"}
                />,
                <span className="whitespace-nowrap text-slate-300">
                  {latency}
                </span>,
                <span className="whitespace-nowrap text-slate-300">
                  {tokens}
                </span>,
                <span className="whitespace-nowrap text-slate-300">
                  {cost}
                </span>,
              ],
            )}
          />
        ) : (
          <div className="rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
            No traces found yet.
          </div>
        )}
      </Card>
    </>
  );
}
