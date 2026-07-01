import { useState } from "react";
import { Link } from "react-router-dom";
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
  FileSearch,
  Filter,
  Save,
} from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { MetricCard } from "../components/metrics/MetricCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FilterSelect } from "../components/ui/FilterSelect";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SearchInput } from "../components/ui/SearchInput";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { NoticeCard } from "../components/ui/NoticeCard";
import { RefreshButton } from "../components/ui/RefreshButton";
import { useTraces } from "../hooks";

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
    icon: <BarChart3 className="h-5 w-5" />,
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
    title: "Error Rate",
    trend: "down" as const,
    tone: "red" as const,
    icon: <FileSearch className="h-5 w-5" />,
    sparkline: [48, 44, 35, 49, 41, 31, 43, 36, 42, 33, 40, 41],
  },
];

const traceTableColumns =
  "44px minmax(150px,1.15fr) minmax(210px,1.55fr) 112px 140px 116px 92px 190px 128px 110px";

function EnvironmentBadge({ value }: { value: string }) {
  const isProduction = value === "Production";

  return (
    <span
      className={[
        "inline-flex rounded-md px-2 py-1 text-xs font-medium",
        isProduction
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-violet-500/10 text-violet-300",
      ].join(" ")}
    >
      {value}
    </span>
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

export function TracesPage() {
  const tracesQuery = useTraces(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("All");
  const [latencyFilter, setLatencyFilter] = useState("All");
  const rowsPerPage = 10;

  const traces = tracesQuery.data ?? [];
  const isLoading = tracesQuery.isLoading;
  const isError = tracesQuery.isError;

  const totalTraces = traces.length;
  const successfulTraces = traces.filter(
    (trace) => trace.status === "success",
  ).length;
  const errorTraces = traces.filter((trace) => trace.status === "error").length;
  const tracesWithLatency = traces.filter((trace) => trace.latency_ms !== null);

  const successRate =
    totalTraces > 0 ? (successfulTraces / totalTraces) * 100 : 0;

  const errorRate = totalTraces > 0 ? (errorTraces / totalTraces) * 100 : 0;

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

  const tracesMetricCards = metricCardTemplates.map((metric) => {
    if (metric.title === "Total Traces") {
      return {
        ...metric,
        value: isLoading ? "..." : formatNumber(totalTraces),
        trendLabel: "From latest 100 traces",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Success Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(successRate),
        trendLabel: "Successful traces",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Avg. Latency") {
      return {
        ...metric,
        value: isLoading ? "..." : formatLatency(averageLatency),
        trendLabel: "Average response time",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Total Tokens") {
      return {
        ...metric,
        value: isLoading ? "..." : formatNumber(totalTokens),
        trendLabel: "Tokens in latest traces",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Error Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(errorRate),
        trendLabel: "Failed traces",
        trend: "neutral" as const,
      };
    }

    return {
      ...metric,
      value: isLoading ? "..." : "0",
      trendLabel: "No trace data available",
      trend: "neutral" as const,
    };
  });

  const traceTableRows = traces.map((trace) => ({
    id: trace.id,
    agent: trace.agent_id,
    status: trace.status as
      | "success"
      | "error"
      | "timeout"
      | "in-progress"
      | "canceled",
    latencyMs: trace.latency_ms,
    duration: formatLatency(trace.latency_ms),
    progress:
      trace.latency_ms === null
        ? 0
        : Math.min((trace.latency_ms / 10000) * 100, 100),
    tokens:
      trace.total_tokens === null ? "N/A" : formatNumber(trace.total_tokens),
    cost:
      trace.total_cost === null
        ? "N/A"
        : `$${Number(trace.total_cost).toFixed(2)}`,
    startTime: new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(trace.started_at)),
    environment: "N/A",
    user: "N/A",
    icon: <Bot className="h-4 w-4" />,
    iconTone: "bg-violet-500/15 text-violet-300",
  }));

  const agentOptions = [
    { label: "All", value: "All" },
    ...Array.from(new Set(traceTableRows.map((trace) => trace.agent))).map(
      (agent) => ({
        label: agent,
        value: agent,
      }),
    ),
  ];

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredTraceRows = traceTableRows.filter((trace) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      [trace.id, trace.agent, trace.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchQuery);

    const matchesStatus =
      statusFilter === "All" || trace.status === statusFilter;

    const matchesAgent = agentFilter === "All" || trace.agent === agentFilter;

    const matchesLatency =
      latencyFilter === "All" ||
      (latencyFilter === "<1s" &&
        trace.latencyMs !== null &&
        trace.latencyMs < 1000) ||
      (latencyFilter === "1s-5s" &&
        trace.latencyMs !== null &&
        trace.latencyMs >= 1000 &&
        trace.latencyMs <= 5000) ||
      (latencyFilter === ">5s" &&
        trace.latencyMs !== null &&
        trace.latencyMs > 5000) ||
      (latencyFilter === "N/A" && trace.latencyMs === null);

    return matchesSearch && matchesStatus && matchesAgent && matchesLatency;
  });

  const totalPages = Math.max(
    Math.ceil(filteredTraceRows.length / rowsPerPage),
    1,
  );
  const paginatedTraceRows = filteredTraceRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const hasTraces = filteredTraceRows.length > 0;
  const firstVisibleRow = hasTraces ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const lastVisibleRow = Math.min(
    currentPage * rowsPerPage,
    filteredTraceRows.length,
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Traces"
          description="Search, filter, and analyze your agent traces."
        />

        <div className="flex flex-wrap gap-3">
          <Button className="min-w-0" disabled variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">Latest 100 traces</span>
          </Button>
          <RefreshButton
            isRefreshing={tracesQuery.isFetching}
            onRefresh={() => {
              void tracesQuery.refetch();
            }}
          />
          <Button disabled variant="primary">
            <Download className="h-4 w-4" />
            Export unavailable
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tracesMetricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {isError && (
        <NoticeCard className="mt-4" tone="error">
          Traces data is unavailable. Check that the backend is running.
        </NoticeCard>
      )}

      <Card className="mt-4 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 flex-1">
            <SearchInput
              onChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              placeholder="Search by trace ID, agent, or status..."
              shortcut="⌘K"
              value={searchQuery}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Status"
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Success", value: "success" },
                { label: "Error", value: "error" },
                { label: "Timeout", value: "timeout" },
                { label: "Canceled", value: "canceled" },
                { label: "In Progress", value: "in-progress" },
              ]}
              value={statusFilter}
            />
            <FilterSelect
              label="Agent"
              onChange={(value) => {
                setAgentFilter(value);
                setCurrentPage(1);
              }}
              options={agentOptions}
              value={agentFilter}
            />
            <FilterSelect
              label="Environment"
              options={[{ label: "N/A", value: "N/A" }]}
              value="N/A"
            />
            <FilterSelect
              label="Latency"
              onChange={(value) => {
                setLatencyFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "<1s", value: "<1s" },
                { label: "1s-5s", value: "1s-5s" },
                { label: ">5s", value: ">5s" },
                { label: "N/A", value: "N/A" },
              ]}
              value={latencyFilter}
            />
            <Button disabled variant="secondary">
              <Filter className="h-4 w-4" />
              More filters unavailable
            </Button>
            <Button disabled variant="secondary">
              <Save className="h-4 w-4" />
              Save view unavailable
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div
          aria-label="Traces table"
          className="overflow-x-auto ..."
          role="region"
        >
          <div className="min-w-[1240px]">
            <div
              className="grid items-center gap-4 bg-white/[0.03] px-4 py-4 text-sm text-slate-400"
              style={{ gridTemplateColumns: traceTableColumns }}
            >
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
            </div>

            {paginatedTraceRows.map((trace) => (
              <div
                className="grid items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                key={trace.id}
                style={{ gridTemplateColumns: traceTableColumns }}
              >
                <span className="h-4 w-4 rounded border border-slate-600" />
                <Link
                  className="truncate font-medium text-violet-300 underline decoration-violet-500/40 underline-offset-4"
                  to={`/traces/${trace.id}`}
                >
                  {trace.id}
                </Link>
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                      trace.iconTone,
                    ].join(" ")}
                  >
                    {trace.icon}
                  </span>
                  <span className="truncate text-slate-100">{trace.agent}</span>
                </span>
                <span>
                  <StatusBadge status={trace.status} />
                </span>
                <span className="flex items-center gap-3 whitespace-nowrap text-slate-200">
                  {trace.duration}
                  <ProgressBar
                    tone={
                      trace.status === "error"
                        ? "red"
                        : trace.status === "timeout"
                          ? "amber"
                          : "violet"
                    }
                    value={trace.progress}
                  />
                </span>
                <span className="whitespace-nowrap text-slate-300">
                  {trace.tokens}
                </span>
                <span className="whitespace-nowrap text-slate-300">
                  {trace.cost}
                </span>
                <span className="whitespace-nowrap text-slate-300">
                  {trace.startTime}
                </span>
                <span className="whitespace-nowrap">
                  <EnvironmentBadge value={trace.environment} />
                </span>
                <span className="whitespace-nowrap text-slate-300">
                  {trace.user}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="border-t border-app-border p-4">
                <EmptyState title="Loading traces..." />
              </div>
            )}

            {!isLoading && !isError && traces.length === 0 && (
              <div className="border-t border-app-border p-4">
                <EmptyState title="No traces found yet." />
              </div>
            )}

            {!isLoading && !isError && traces.length > 0 && !hasTraces && (
              <div className="border-t border-app-border p-4">
                <EmptyState title="No traces match the current filters." />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-app-border px-4 py-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <span>
            Showing {firstVisibleRow} to {lastVisibleRow} of{" "}
            {filteredTraceRows.length} traces
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              aria-label="Previous page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-app-border text-slate-400 transition hover:border-slate-600 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-sm font-medium text-white">
              {currentPage}
            </span>
            <button
              aria-label="Next page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-app-border text-slate-400 transition hover:border-slate-600 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span>Rows per page</span>
            <span className="inline-flex h-10 items-center rounded-lg border border-app-border bg-white/[0.04] px-4 text-sm text-slate-300">
              10
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}
