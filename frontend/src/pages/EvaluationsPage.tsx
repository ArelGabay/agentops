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
  Filter,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { SimpleLineChart } from "../components/charts/SimpleLineChart";
import { MetricCard } from "../components/metrics/MetricCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChartCard } from "../components/ui/ChartCard";
import { FilterSelect } from "../components/ui/FilterSelect";
import { ResultBadge } from "../components/ui/ResultBadge";
import { ScoreStars } from "../components/ui/ScoreStars";
import { SearchInput } from "../components/ui/SearchInput";
import { EmptyState } from "../components/ui/EmptyState";
import { NoticeCard } from "../components/ui/NoticeCard";
import { StatList } from "../components/ui/StatList";
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
  "minmax(160px,1.05fr) minmax(150px,1fr) minmax(120px,0.8fr) minmax(190px,1.2fr) 140px 132px 140px 190px";

type EvaluationResult = "pass" | "partial" | "fail";

function EmptyAnalyticsState({ message }: { message: string }) {
  return (
    <EmptyState
      className="grid min-h-[220px] place-items-center"
      title={message}
    />
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
  const normalizedResults = evaluations.map((evaluation) =>
    normalizeResult(evaluation.result),
  );

  const scoreValues = evaluations
    .map((evaluation) => Number(evaluation.score))
    .filter((score) => Number.isFinite(score));

  const averageScore =
    scoreValues.length > 0
      ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
      : 0;

  const passedEvaluations = normalizedResults.filter(
    (result) => result === "pass",
  ).length;

  const failedEvaluations = normalizedResults.filter(
    (result) => result === "fail",
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

  const scoreOverTimeMap = new Map<
    string,
    { totalScore: number; count: number; createdAt: number }
  >();

  for (const evaluation of evaluations) {
    const score = Number(evaluation.score);

    if (!Number.isFinite(score) || evaluation.created_at === null) {
      continue;
    }

    const created_at = new Date(evaluation.created_at);
    const dateKey = created_at.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existingPoint = scoreOverTimeMap.get(dateKey);

    if (existingPoint) {
      existingPoint.totalScore += score;
      existingPoint.count += 1;
      continue;
    }

    scoreOverTimeMap.set(dateKey, {
      totalScore: score,
      count: 1,
      createdAt: created_at.getTime(),
    });
  }

  const scoreOverTimePoints = Array.from(scoreOverTimeMap.entries())
    .map(([label, point]) => ({
      label,
      value: point.totalScore / point.count,
      createdAt: point.createdAt,
    }))
    .sort(
      (firstPoint, secondPoint) => firstPoint.createdAt - secondPoint.createdAt,
    )
    .map(({ label, value }) => ({
      label,
      value,
    }));

  const scoreDistributionBuckets = [
    { label: "0-59", min: 0, max: 59, count: 0 },
    { label: "60-69", min: 60, max: 69, count: 0 },
    { label: "70-79", min: 70, max: 79, count: 0 },
    { label: "80-89", min: 80, max: 89, count: 0 },
    { label: "90-100", min: 90, max: 100, count: 0 },
  ];

  for (const score of scoreValues) {
    const matchingBucket = scoreDistributionBuckets.find(
      (bucket) => score >= bucket.min && score <= bucket.max,
    );

    if (matchingBucket) {
      matchingBucket.count += 1;
    }
  }

  const scoreDistributionItems = scoreDistributionBuckets.map((bucket) => {
    const percent =
      totalEvaluations > 0 ? (bucket.count / totalEvaluations) * 100 : 0;

    return {
      label: bucket.label,
      value: formatNumber(bucket.count),
      meta: formatPercent(percent),
      trend: "neutral" as const,
    };
  });

  const evaluationResultCounts = {
    pass: normalizedResults.filter((result) => result === "pass").length,
    partial: normalizedResults.filter((result) => result === "partial").length,
    fail: normalizedResults.filter((result) => result === "fail").length,
  };

  const evaluationResultItems = [
    {
      label: "Pass",
      value: formatNumber(evaluationResultCounts.pass),
      meta:
        totalEvaluations > 0
          ? formatPercent(
              (evaluationResultCounts.pass / totalEvaluations) * 100,
            )
          : formatPercent(0),
      trend: "up" as const,
    },
    {
      label: "Partial",
      value: formatNumber(evaluationResultCounts.partial),
      meta:
        totalEvaluations > 0
          ? formatPercent(
              (evaluationResultCounts.partial / totalEvaluations) * 100,
            )
          : formatPercent(0),
      trend: "neutral" as const,
    },
    {
      label: "Fail",
      value: formatNumber(evaluationResultCounts.fail),
      meta:
        totalEvaluations > 0
          ? formatPercent(
              (evaluationResultCounts.fail / totalEvaluations) * 100,
            )
          : formatPercent(0),
      trend: "down" as const,
    },
  ];

  const evaluatorCountsMap = new Map<string, number>();

  for (const evaluation of evaluations) {
    const evaluatorName = evaluation.evaluator_name.trim();

    evaluatorCountsMap.set(
      evaluatorName,
      (evaluatorCountsMap.get(evaluatorName) ?? 0) + 1,
    );
  }

  const evaluationsByTaskItems = Array.from(evaluatorCountsMap.entries())
    .sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1])
    .map(([label, count]) => {
      const percent =
        totalEvaluations > 0 ? (count / totalEvaluations) * 100 : 0;

      return {
        label,
        value: formatNumber(count),
        meta: formatPercent(percent),
        trend: "neutral" as const,
      };
    });

  const highHallucinationCount = hallucinationScores.filter(
    (score) => score > 10,
  ).length;

  const hallucinationSummaryItems = [
    {
      label: "Average Score",
      value: formatPercent(hallucinationRate),
      meta: `${formatNumber(hallucinationScores.length)} scored`,
      trend: "neutral" as const,
    },
    {
      label: "High Hallucination",
      value: formatNumber(highHallucinationCount),
      meta:
        hallucinationScores.length > 0
          ? formatPercent(
              (highHallucinationCount / hallucinationScores.length) * 100,
            )
          : formatPercent(0),
      trend:
        highHallucinationCount > 0 ? ("down" as const) : ("neutral" as const),
    },
  ];

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
      [evaluation.id, evaluation.traceId, evaluation.task, evaluation.result]
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
          <Button className="min-w-0" disabled variant="secondary">
            <Calendar className="h-4 w-4" />
            <span className="truncate">Latest 100 evaluations</span>
          </Button>
          <Button disabled variant="secondary">
            <Filter className="h-4 w-4" />
            Advanced filters unavailable
          </Button>
          <Button disabled variant="primary">
            <Download className="h-4 w-4" />
            Export unavailable
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {evaluationMetricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {isError && (
        <NoticeCard className="mt-4" tone="error">
          Evaluations data is unavailable. Check that the backend is running.
        </NoticeCard>
      )}

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.9fr_1fr]">
        <ChartCard
          title="Score Over Time"
          action={
            <Button disabled variant="secondary">
              Daily
            </Button>
          }
        >
          {scoreOverTimePoints.length > 0 ? (
            <SimpleLineChart
              ariaLabel="Evaluation score over time"
              points={scoreOverTimePoints}
              tone="emerald"
            />
          ) : (
            <EmptyAnalyticsState message="No score time-series data is available yet." />
          )}
        </ChartCard>

        <ChartCard
          title="Score Distribution"
          action={
            <Button disabled variant="secondary">
              All Time
            </Button>
          }
        >
          {scoreDistributionItems.some((item) => item.value !== "0") ? (
            <StatList items={scoreDistributionItems} />
          ) : (
            <EmptyAnalyticsState message="No score distribution data is available yet." />
          )}
        </ChartCard>

        <ChartCard
          title="Hallucination Summary"
          action={
            <Button disabled variant="secondary">
              Latest 100
            </Button>
          }
        >
          {hallucinationScores.length > 0 ? (
            <StatList items={hallucinationSummaryItems} />
          ) : (
            <EmptyAnalyticsState message="No hallucination scoring data is available yet." />
          )}
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.2fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-5 text-sm font-semibold text-white">
            Evaluation Results
          </h2>
          {totalEvaluations > 0 ? (
            <StatList items={evaluationResultItems} />
          ) : (
            <EmptyAnalyticsState message="No evaluation result data is available yet." />
          )}
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
            <Button disabled variant="secondary">
              All Time
            </Button>
          </div>

          {evaluationsByTaskItems.length > 0 ? (
            <StatList items={evaluationsByTaskItems} />
          ) : (
            <EmptyAnalyticsState message="No dataset or task aggregation is available yet." />
          )}
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
            <Button disabled variant="secondary">
              <Columns3 className="h-4 w-4" />
              Columns unavailable
            </Button>
          </div>
        </div>

        <div
          className="overflow-x-auto rounded-lg border border-app-border"
          aria-label="Evaluations table"
          role="region"
        >
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
                </div>
              );
            })}

            {isLoading && (
              <div className="border-t border-app-border p-4">
                <EmptyState title="Loading evaluations..." />
              </div>
            )}

            {!isLoading && !isError && evaluations.length === 0 && (
              <div className="border-t border-app-border p-4">
                <EmptyState title="No evaluations found yet." />
              </div>
            )}

            {!isLoading &&
              !isError &&
              evaluations.length > 0 &&
              !hasEvaluations && (
                <div className="border-t border-app-border p-4">
                  <EmptyState title="No evaluations match the current filters." />
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
            <span className="inline-flex h-10 items-center rounded-lg border border-app-border bg-white/[0.04] px-4 text-sm text-slate-300">
              10
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}
