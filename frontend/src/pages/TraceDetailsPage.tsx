import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Sparkles, X } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { IconButton } from "../components/ui/IconButton";
import { KeyValueList } from "../components/ui/KeyValueList";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Tabs } from "../components/ui/Tabs";
import { TimelinePreview } from "../components/ui/TimelinePreview";
import { EmptyState } from "../components/ui/EmptyState";
import { NoticeCard } from "../components/ui/NoticeCard";
import { useTraceDetail } from "../hooks";
import { ApiError } from "../services/apiClient";

const spanTableColumns =
  "56px minmax(260px,1.5fr) 88px 116px 180px 104px 96px 96px";

function formatDateTime(value: string | null) {
  if (value === null) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
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

function formatNumber(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value: string | null) {
  if (value === null) {
    return "N/A";
  }

  return `$${Number(value).toFixed(2)}`;
}

export function TraceDetailsPage() {
  const { traceId = "" } = useParams();
  const traceQuery = useTraceDetail(traceId);
  const [selectedSpanId, setSelectedSpanId] = useState<
    string | null | undefined
  >(undefined);
  const trace = traceQuery.data;
  const isLoading = traceQuery.isLoading;
  const error = traceQuery.error;
  const isNotFound = error instanceof ApiError && error.status === 404;
  const isError = traceQuery.isError;

  if (isLoading) {
    return <NoticeCard>Loading trace details...</NoticeCard>;
  }

  if (isError || !trace) {
    return (
      <NoticeCard tone="error">
        {isNotFound ? "Trace not found." : "Trace details unavailable."}
      </NoticeCard>
    );
  }

  const timelineItems = trace.spans.map((span, index) => ({
    label: span.name,
    sublabel: span.span_type,
    duration: formatLatency(span.latency_ms),
    left: Math.min(index * 12, 88),
    width: 10,
    tone: "blue" as const,
    icon: <Sparkles className="h-4 w-4" />,
  }));

  const selectedSpan =
    selectedSpanId === null
      ? null
      : (trace.spans.find((span) => span.id === selectedSpanId) ??
        trace.spans[0] ??
        null);

  const summaryItems = selectedSpan
    ? [
        { label: "Span ID", value: selectedSpan.id },
        { label: "Trace ID", value: selectedSpan.trace_id },
        { label: "Name", value: selectedSpan.name },
        { label: "Type", value: selectedSpan.span_type },
        {
          label: "Status",
          value: (
            <StatusBadge
              status={
                selectedSpan.status as
                  | "success"
                  | "error"
                  | "timeout"
                  | "canceled"
              }
            />
          ),
        },
        { label: "Started", value: formatDateTime(selectedSpan.started_at) },
        { label: "Ended", value: formatDateTime(selectedSpan.ended_at) },
        { label: "Created", value: formatDateTime(selectedSpan.created_at) },
        { label: "Duration", value: formatLatency(selectedSpan.latency_ms) },
      ]
    : [];
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
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {trace.id}
            </h1>
            <StatusBadge
              status={
                trace.status as "success" | "error" | "timeout" | "canceled"
              }
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="text-slate-400">
              Agent{" "}
              <span className="ml-2 text-slate-100">{trace.agent_id}</span>
            </span>
            <span className="text-slate-400">
              Start Time{" "}
              <span className="ml-2 text-slate-100">
                {formatDateTime(trace.started_at)}
              </span>
            </span>
            <span className="text-slate-400">
              Duration{" "}
              <span className="ml-2 text-slate-100">
                {formatLatency(trace.latency_ms)}
              </span>
            </span>
            <span className="text-slate-400">
              Total Tokens{" "}
              <span className="ml-2 text-slate-100">
                {formatNumber(trace.total_tokens)}
              </span>
            </span>
            <span className="text-slate-400">
              Total Cost{" "}
              <span className="ml-2 text-slate-100">
                {formatCurrency(trace.total_cost)}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Card className="overflow-hidden">
            <Tabs
              items={[
                { label: "Timeline", active: true },
                { label: "Spans" },
                { label: "Logs" },
                { label: "Evaluations" },
                { label: "Metadata" },
              ]}
            />

            <div className="p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white">
                  Execution Timeline
                </h2>
              </div>

              {timelineItems.length > 0 ? (
                <TimelinePreview items={timelineItems} />
              ) : (
                <EmptyState title="No spans found for this trace." />
              )}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Spans ({trace.spans.length})
              </h2>
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

                {trace.spans.map((span, index) => {
                  const isSelected = selectedSpan?.id === span.id;

                  return (
                    <button
                      className={[
                        "grid w-full items-center gap-4 border-t border-app-border px-4 py-3 text-left text-sm transition",
                        isSelected
                          ? "bg-violet-500/10"
                          : "hover:bg-white/[0.03]",
                      ].join(" ")}
                      key={span.id}
                      onClick={() => setSelectedSpanId(span.id)}
                      style={{ gridTemplateColumns: spanTableColumns }}
                      type="button"
                    >
                      <span className="text-slate-500">{index + 1}</span>
                      <span className="truncate font-medium text-slate-100">
                        {span.name}
                      </span>
                      <span className="whitespace-nowrap text-slate-300">
                        {span.span_type}
                      </span>
                      <span>
                        <StatusBadge
                          status={
                            span.status as
                              | "success"
                              | "error"
                              | "timeout"
                              | "canceled"
                          }
                        />
                      </span>
                      <span className="whitespace-nowrap text-slate-300">
                        {formatDateTime(span.started_at)}
                      </span>
                      <span className="whitespace-nowrap text-slate-300">
                        {formatLatency(span.latency_ms)}
                      </span>
                      <span className="whitespace-nowrap text-slate-300">
                        N/A
                      </span>
                      <span className="whitespace-nowrap text-slate-300">
                        N/A
                      </span>
                    </button>
                  );
                })}
                {trace.spans.length === 0 && (
                  <div className="border-t border-app-border p-4">
                    <EmptyState title="No spans found for this trace." />
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Evaluations ({trace.evaluations.length})
              </h2>
            </div>

            {trace.evaluations.length > 0 ? (
              <div className="space-y-3">
                {trace.evaluations.map((evaluation) => (
                  <div
                    className="rounded-lg border border-app-border bg-white/[0.03] p-4"
                    key={evaluation.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {evaluation.evaluator_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDateTime(evaluation.created_at)}
                        </p>
                      </div>
                      <StatusBadge
                        label={evaluation.result}
                        status={
                          evaluation.result === "pass" ? "success" : "error"
                        }
                      />
                    </div>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <span className="text-slate-400">
                        Score{" "}
                        <span className="ml-2 text-slate-100">
                          {evaluation.score}/100
                        </span>
                      </span>
                      <span className="text-slate-400">
                        Hallucination{" "}
                        <span className="ml-2 text-slate-100">
                          {evaluation.hallucination_score ?? "N/A"}
                        </span>
                      </span>
                      <span className="text-slate-400">
                        Result{" "}
                        <span className="ml-2 text-slate-100">
                          {evaluation.result}
                        </span>
                      </span>
                    </div>

                    {evaluation.feedback && (
                      <p className="mt-3 text-sm text-slate-300">
                        {evaluation.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No evaluations found for this trace." />
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-slate-300" />
                  <h2 className="truncate text-sm font-semibold text-white">
                    {selectedSpan ? selectedSpan.name : "No span selected"}
                  </h2>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {selectedSpan && (
                    <StatusBadge
                      status={
                        selectedSpan.status as
                          | "success"
                          | "error"
                          | "timeout"
                          | "canceled"
                      }
                    />
                  )}
                  {selectedSpan && (
                    <IconButton
                      label="Close span details"
                      onClick={() => setSelectedSpanId(null)}
                    >
                      <X className="h-4 w-4" />
                    </IconButton>
                  )}
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
            {summaryItems.length > 0 ? (
              <KeyValueList items={summaryItems} />
            ) : (
              <EmptyState title="No span summary available." />
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Input</h2>
            {selectedSpan?.input_text ? (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-app-border bg-white/[0.03] p-4 text-sm text-slate-300">
                {selectedSpan.input_text}
              </pre>
            ) : (
              <EmptyState title="No span input available." />
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Output</h2>
            {selectedSpan?.output_text ? (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-app-border bg-white/[0.03] p-4 text-sm text-slate-300">
                {selectedSpan.output_text}
              </pre>
            ) : (
              <EmptyState title="No span output available." />
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Latency Breakdown
            </h2>
            <EmptyState title="Latency breakdown is not available yet." />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Model Parameters
            </h2>
            <EmptyState title="Model parameters are not available yet." />
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Tags</h2>
            <EmptyState title="Tags are not available yet." />
          </Card>
        </aside>
      </div>
    </>
  );
}
