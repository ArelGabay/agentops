import { useNavigate } from "react-router-dom";

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

import { useDashboardSummary } from "../hooks";
import { PageHeader } from "../components/layout/PageHeader";
import { SimpleLineChart } from "../components/charts/SimpleLineChart";
import { MetricCard } from "../components/metrics/MetricCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChartCard } from "../components/ui/ChartCard";
import { EmptyState } from "../components/ui/EmptyState";
import { NoticeCard } from "../components/ui/NoticeCard";
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

function formatLatency(milliseconds: number | null) {
  if (milliseconds === null) {
    return "N/A";
  }

  if (milliseconds >= 1000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }

  return `${Math.round(milliseconds)}ms`;
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const summaryQuery = useDashboardSummary();

  const summary = summaryQuery.data;
  const isLoading = summaryQuery.isLoading;
  const isError = summaryQuery.isError;
  const hasData = (summary?.metrics.total_traces ?? 0) > 0;

  const totalTraces = summary?.metrics.total_traces ?? 0;
  const successRate = summary?.metrics.success_rate ?? 0;
  const averageLatency = summary?.metrics.average_latency_ms ?? null;
  const totalTokens = summary?.metrics.total_tokens ?? 0;
  const totalCost = Number(summary?.metrics.total_cost ?? 0);

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

  const dashboardTraceRows =
    summary?.recent_traces.map((trace) => [
      trace.id,
      trace.agent_id,
      trace.status,
      trace.latency_ms === null ? "N/A" : formatLatency(trace.latency_ms),
      trace.total_tokens === null ? "N/A" : formatNumber(trace.total_tokens),
      trace.total_cost === null
        ? "N/A"
        : formatCurrency(Number(trace.total_cost)),
    ]) ?? [];

  const statusCounts = {
    success: summary?.status_counts.success ?? 0,
    error: summary?.status_counts.error ?? 0,
    timeout: summary?.status_counts.timeout ?? 0,
    canceled: summary?.status_counts.canceled ?? 0,

    inProgress: summary?.status_counts.in_progress ?? 0,
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
    {
      label: "In Progress",
      value: formatStatusValue(statusCounts.inProgress),
      color: "bg-blue-400",
    },
  ];

  const dashboardTopAgents =
    summary?.top_agents.map((agent) => ({
      label: agent.agent_id,
      value: formatNumber(agent.trace_count),
      meta:
        totalTraces > 0
          ? formatPercent((agent.trace_count / totalTraces) * 100)
          : "0.0%",
      trend: "neutral" as const,
      icon: <Bot className="h-4 w-4 text-violet-300" />,
    })) ?? [];
  const timeSeries = summary?.time_series ?? [];

  const traceChartPoints = timeSeries.map((point) => ({
    label: point.date,
    value: point.trace_count,
  }));

  const latencyChartPoints = timeSeries.map((point) => ({
    label: point.date,
    value: point.average_latency_ms,
  }));

  const errorRateChartPoints = timeSeries.map((point) => ({
    label: point.date,
    value:
      point.trace_count > 0 ? (point.error_count / point.trace_count) * 100 : 0,
  }));
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Overview of your AI agents and system performance."
        />

        <div className="flex flex-wrap gap-3">
          <Button className="min-w-0" disabled variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">Last 7 days</span>
          </Button>
          <Button disabled variant="primary">
            <Download className="h-4 w-4" />
            Export unavailable
          </Button>
        </div>
      </div>

      {isLoading && (
        <NoticeCard className="mt-4">Loading dashboard data...</NoticeCard>
      )}

      {isError && (
        <NoticeCard className="mt-4" tone="error">
          Dashboard data is unavailable. Check that the backend is running.
        </NoticeCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardMetricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Traces Over Time"
          action={
            <Button
              onClick={() => {
                navigate("/traces");
              }}
              variant="secondary"
            >
              Traces
            </Button>
          }
        >
          <SimpleLineChart
            ariaLabel="Traces over time"
            points={traceChartPoints}
            tone="violet"
          />
        </ChartCard>

        <ChartCard
          title="Avg. Latency Over Time"
          action={
            <Button disabled variant="secondary">
              Avg. Latency
            </Button>
          }
        >
          <SimpleLineChart
            ariaLabel="Average latency over time"
            points={latencyChartPoints}
            tone="blue"
          />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr_1.2fr]">
        <Card aria-label="Traces by status" className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Traces by Status
            </h2>
            <Button
              onClick={() => {
                navigate("/traces");
              }}
              variant="ghost"
            >
              View all
            </Button>
          </div>
          <StatusDonut
            total={formatNumber(totalTraces)}
            items={statusDonutItems}
          />
        </Card>

        <Card aria-label="Top agents" className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top Agents</h2>
            <Button disabled variant="ghost">
              View all
            </Button>
          </div>
          {dashboardTopAgents.length > 0 ? (
            <StatList items={dashboardTopAgents} />
          ) : (
            <EmptyState title="No agent activity yet." />
          )}
        </Card>

        <ChartCard
          title="Error Rate Over Time"
          action={
            <Button disabled variant="secondary">
              Error Rate
            </Button>
          }
        >
          <SimpleLineChart
            ariaLabel="Error rate over time"
            points={errorRateChartPoints}
            tone="red"
          />
        </ChartCard>
      </div>

      <Card aria-label="Recent traces" className="mt-4 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Traces</h2>
            <p className="mt-1 text-sm text-slate-400">
              {hasData
                ? "Live API-backed trace data for dashboard metrics."
                : "No backend data found yet."}
            </p>
          </div>
          <Button
            onClick={() => {
              navigate("/traces");
            }}
            variant="secondary"
          >
            View all traces
          </Button>
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
                  status={
                    status as
                      | "success"
                      | "error"
                      | "timeout"
                      | "in-progress"
                      | "canceled"
                  }
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
          <EmptyState title="No traces found yet." />
        )}
      </Card>
    </>
  );
}
