import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Eye,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { MetricCard } from "../components/metrics/MetricCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChartCard } from "../components/ui/ChartCard";
import { FilterSelect } from "../components/ui/FilterSelect";
import { ResultBadge } from "../components/ui/ResultBadge";
import { ScoreStars } from "../components/ui/ScoreStars";
import { SearchInput } from "../components/ui/SearchInput";
import { useEvaluations } from "../hooks";
import {
  formatDateTime,
  formatNumber,
  formatPercent,
  formatScore,
} from "../utils/formatters";

const metricCardTemplates = [
  {
    title: "Total Evaluations",
    trend: "up" as const,
    tone: "violet" as const,
    icon: <BarChart3 className="h-5 w-5" />,
    sparkline: [56, 49, 44, 50, 39, 48, 42, 45, 51, 43, 57, 62],
  },
  {
    title: "Avg. Score",
    trend: "up" as const,
    tone: "emerald" as const,
    icon: <CheckCircle2 className="h-5 w-5" />,
    sparkline: [44, 50, 47, 55, 45, 44, 49, 46, 52, 48, 55, 58],
  },
  {
    title: "Pass Rate",
    trend: "up" as const,
    tone: "blue" as const,
    icon: <ShieldCheck className="h-5 w-5" />,
    sparkline: [42, 51, 37, 56, 49, 45, 42, 37, 44, 40, 62, 50],
  },
  {
    title: "Fail Rate",
    trend: "down" as const,
    tone: "red" as const,
    icon: <ShieldAlert className="h-5 w-5" />,
    sparkline: [42, 39, 34, 46, 31, 49, 30, 43, 31, 44, 37, 35],
  },
  {
    title: "Hallucination Rate",
    trend: "down" as const,
    tone: "amber" as const,
    icon: <Sparkles className="h-5 w-5" />,
    sparkline: [35, 31, 26, 33, 22, 24, 62, 28, 42, 25, 35, 31],
  },
];

const evaluationTableColumns =
  "minmax(160px,1.05fr) minmax(150px,1fr) minmax(120px,0.8fr) minmax(190px,1.2fr) 140px 132px 140px 190px 96px";

type EvaluationResult = "pass" | "partial" | "fail";

function EmptyAnalyticsState({ message }: { message: string }) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-lg border border-app-border bg-white/[0.03] px-4 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

function normalizeResult(result: string): EvaluationResult {
  if (result === "pass" || result === "partial" || result === "fail") {
    return result;
  }

  return "partial";
}

function scoreTone(score: string) {
  const value = Number(score);

  if (value >= 85) return "green";
  if (value >= 70) return "amber";
  return "red";
}

function scoreStarCount(score: string) {
  const value = Number(score);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(value / 20)));
}

export function EvaluationsPage() {
  const evaluationsQuery = useEvaluations(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("All");
  const rowsPerPage = 10;

  const evaluations = evaluationsQuery.data ?? [];
  const isLoading = evaluationsQuery.isLoading;
  const isError = evaluationsQuery.isError;

  const totalEvaluations = evaluations.length;

  const scoreValues = evaluations
    .map((evaluation) => Number(evaluation.score))
    .filter((score) => Number.isFinite(score));

  const averageScore =
    scoreValues.length > 0
      ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
      : 0;

  const passedEvaluations = evaluations.filter(
    (evaluation) => evaluation.result === "pass",
  ).length;

  const failedEvaluations = evaluations.filter(
    (evaluation) => evaluation.result === "fail",
  ).length;

  const passRate =
    totalEvaluations > 0 ? (passedEvaluations / totalEvaluations) * 100 : 0;

  const failRate =
    totalEvaluations > 0 ? (failedEvaluations / totalEvaluations) * 100 : 0;

  const hallucinationScores = evaluations
    .map((evaluation) =>
      evaluation.hallucination_score === null
        ? null
        : Number(evaluation.hallucination_score),
    )
    .filter(
      (score): score is number => score !== null && Number.isFinite(score),
    );

  const hallucinationRate =
    hallucinationScores.length > 0
      ? hallucinationScores.reduce((sum, score) => sum + score, 0) /
        hallucinationScores.length
      : 0;

  const evaluationMetricCards = metricCardTemplates.map((metric) => {
    if (metric.title === "Total Evaluations") {
      return {
        ...metric,
        value: isLoading ? "..." : formatNumber(totalEvaluations),
        trendLabel: "From latest 100 evaluations",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Avg. Score") {
      return {
        ...metric,
        value: isLoading ? "..." : formatScore(averageScore),
        trendLabel: "Average evaluation score",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Pass Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(passRate),
        trendLabel: "Passing evaluations",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Fail Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(failRate),
        trendLabel: "Failed evaluations",
        trend: "neutral" as const,
      };
    }

    if (metric.title === "Hallucination Rate") {
      return {
        ...metric,
        value: isLoading ? "..." : formatPercent(hallucinationRate),
        trendLabel: "Average hallucination score",
        trend: "neutral" as const,
      };
    }

    return {
      ...metric,
      value: isLoading ? "..." : "0",
      trendLabel: "No evaluation data available",
      trend: "neutral" as const,
    };
  });

  const evaluationTableRows = evaluations.map((evaluation) => {
    const hallucinationScore =
      evaluation.hallucination_score === null
        ? null
        : Number(evaluation.hallucination_score);

    return {
      id: evaluation.id,
      traceId: evaluation.trace_id,
      agent: "N/A",
      task: evaluation.evaluator_name,
      score: evaluation.score,
      result: normalizeResult(evaluation.result),
      hallucination:
        hallucinationScore === null || !Number.isFinite(hallucinationScore)
          ? "N/A"
          : formatPercent(hallucinationScore),
      hallucinationScore,
      createdAt: formatDateTime(evaluation.created_at),
    };
  });

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredEvaluationRows = evaluationTableRows.filter((evaluation) => {
    const matchesSearch =
      normalizedSearchQuery.length === 0 ||
      [
        evaluation.id,
        evaluation.traceId,
        evaluation.task,
        evaluation.result,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchQuery);

    const matchesResult =
      resultFilter === "All" || evaluation.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  const totalPages = Math.max(
    Math.ceil(filteredEvaluationRows.length / rowsPerPage),
    1,
  );

  const paginatedEvaluationRows = filteredEvaluationRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const hasEvaluations = filteredEvaluationRows.length > 0;
  const firstVisibleRow = hasEvaluations
    ? (currentPage - 1) * rowsPerPage + 1
    : 0;
  const lastVisibleRow = Math.min(
    currentPage * rowsPerPage,
    filteredEvaluationRows.length,
  );

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
            <span className="truncate">Latest 100 evaluations</span>
          </Button>
          <Button className="opacity-60" variant="secondary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="opacity-60" variant="primary">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {evaluationMetricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {isError && (
        <Card className="mt-4 border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          Evaluations data is unavailable. Check that the backend is running.
        </Card>
      )}

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.9fr_1fr]">
        <ChartCard
          title="Score Over Time"
          action={<Button variant="secondary">Daily</Button>}
        >
          <EmptyAnalyticsState message="Score time-series data is not available yet." />
        </ChartCard>

        <ChartCard
          title="Score Distribution"
          action={<Button variant="secondary">All Time</Button>}
        >
          <EmptyAnalyticsState message="Score distribution data is not available yet." />
        </ChartCard>

        <ChartCard
          title="Evaluation Dimensions"
          action={<Button variant="secondary">All Time</Button>}
        >
          <EmptyAnalyticsState message="Evaluation dimension data is not available yet." />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.2fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-5 text-sm font-semibold text-white">
            Evaluation Results
          </h2>
          <EmptyAnalyticsState message="Evaluation result aggregation is not available yet." />
        </Card>

        <Card className="p-5">
          <h2 className="mb-5 text-sm font-semibold text-white">
            Top Failing Dimensions
          </h2>
          <EmptyAnalyticsState message="Failing dimension data is not available yet." />
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Evaluation by Dataset / Task
            </h2>
            <Button variant="secondary">All Time</Button>
          </div>

          <EmptyAnalyticsState message="Dataset and task aggregation is not available yet." />
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold text-white">
            Recent Evaluations
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              onChange={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              placeholder="Search evaluations..."
              value={searchQuery}
            />
            <FilterSelect
              label="Result"
              onChange={(value) => {
                setResultFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Pass", value: "pass" },
                { label: "Partial", value: "partial" },
                { label: "Fail", value: "fail" },
              ]}
              value={resultFilter}
            />
            <Button className="opacity-60" variant="secondary">
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

            {paginatedEvaluationRows.map((evaluation) => {
              const tone = scoreTone(evaluation.score);
              const isHighHallucination =
                evaluation.hallucinationScore !== null &&
                Number.isFinite(evaluation.hallucinationScore) &&
                evaluation.hallucinationScore > 10;

              return (
                <div
                  className="grid w-full items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
                  key={evaluation.id}
                  style={{ gridTemplateColumns: evaluationTableColumns }}
                >
                  <span className="truncate font-medium text-violet-300">
                    {evaluation.id}
                  </span>
                  <Link
                    className="truncate font-medium text-violet-300 underline decoration-violet-500/40 underline-offset-4"
                    to={`/traces/${evaluation.traceId}`}
                  >
                    {evaluation.traceId}
                  </Link>
                  <span className="truncate text-slate-200">
                    {evaluation.agent}
                  </span>
                  <span className="truncate text-slate-300">
                    {evaluation.task}
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span
                      className={
                        tone === "red"
                          ? "text-red-300"
                          : tone === "amber"
                            ? "text-amber-300"
                            : "text-emerald-300"
                      }
                    >
                      {evaluation.score}
                    </span>
                    <ScoreStars
                      count={scoreStarCount(evaluation.score)}
                      tone={tone}
                    />
                  </span>
                  <span>
                    <ResultBadge result={evaluation.result} />
                  </span>
                  <span
                    className={
                      isHighHallucination ? "text-red-300" : "text-slate-300"
                    }
                  >
                    {evaluation.hallucination}
                  </span>
                  <span className="whitespace-nowrap text-slate-300">
                    {evaluation.createdAt}
                  </span>
                  <span>
                    <button
                      aria-label={`View ${evaluation.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-app-border text-slate-400 transition hover:border-slate-600 hover:text-slate-100"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="border-t border-app-border px-4 py-8 text-center text-sm text-slate-400">
                Loading evaluations...
              </div>
            )}

            {!isLoading && !isError && evaluations.length === 0 && (
              <div className="border-t border-app-border px-4 py-8 text-center text-sm text-slate-400">
                No evaluations found yet.
              </div>
            )}

            {!isLoading &&
              !isError &&
              evaluations.length > 0 &&
              !hasEvaluations && (
                <div className="border-t border-app-border px-4 py-8 text-center text-sm text-slate-400">
                  No evaluations match the current filters.
                </div>
              )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <span>
            Showing {firstVisibleRow} to {lastVisibleRow} of{" "}
            {filteredEvaluationRows.length} evaluations
          </span>

          <div className="flex items-center gap-3">
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
            <Button variant="secondary">10</Button>
          </div>
        </div>
      </Card>
    </>
  );
}
