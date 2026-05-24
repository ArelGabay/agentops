from collections import Counter, defaultdict
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models import Trace
from app.repositories import list_dashboard_traces_since, list_recent_dashboard_traces
from app.schemas import (
    DashboardMetricsResponse,
    DashboardStatusCountsResponse,
    DashboardSummaryResponse,
    DashboardTimeSeriesPointResponse,
    DashboardTopAgentResponse,
    TraceListResponse,
)


DASHBOARD_DAYS = 7


def get_dashboard_summary(db: Session) -> DashboardSummaryResponse:
    since = datetime.now(UTC) - timedelta(days=DASHBOARD_DAYS)

    traces = list_dashboard_traces_since(db, started_at=since)
    recent_traces = list_recent_dashboard_traces(db, started_at=since, limit=5)

    total_traces = len(traces)
    successful_traces = sum(1 for trace in traces if trace.status == "success")
    success_rate = (
        (successful_traces / total_traces) * 100 if total_traces > 0 else 0
    )

    traces_with_latency = [
        trace for trace in traces if trace.latency_ms is not None
    ]
    average_latency_ms = (
        sum(trace.latency_ms or 0 for trace in traces_with_latency)
        / len(traces_with_latency)
        if traces_with_latency
        else None
    )

    total_tokens = sum(trace.total_tokens or 0 for trace in traces)
    total_cost = sum(
        Decimal(trace.total_cost or 0)
        for trace in traces
    )

    status_counter = Counter(trace.status for trace in traces)
    agent_counter = Counter(trace.agent_id for trace in traces)

    return DashboardSummaryResponse(
        metrics=DashboardMetricsResponse(
            total_traces=total_traces,
            success_rate=success_rate,
            average_latency_ms=average_latency_ms,
            total_tokens=total_tokens,
            total_cost=total_cost,
        ),
        status_counts=DashboardStatusCountsResponse(
            success=status_counter.get("success", 0),
            error=status_counter.get("error", 0),
            timeout=status_counter.get("timeout", 0),
            canceled=status_counter.get("canceled", 0),
            in_progress=status_counter.get("in-progress", 0),
        ),
        top_agents=[
            DashboardTopAgentResponse(agent_id=agent_id, trace_count=count)
            for agent_id, count in agent_counter.most_common(5)
        ],
        recent_traces=[
            TraceListResponse.model_validate(trace) for trace in recent_traces
        ],
        time_series=build_time_series(traces),
    )


def build_time_series(traces: list[Trace]) -> list[DashboardTimeSeriesPointResponse]:
    today = datetime.now(UTC).date()
    days = [today - timedelta(days=offset) for offset in reversed(range(DASHBOARD_DAYS))]

    traces_by_day: dict[date, list[Trace]] = defaultdict(list)
    for trace in traces:
        traces_by_day[trace.started_at.date()].append(trace)

    points: list[DashboardTimeSeriesPointResponse] = []

    for day in days:
        day_traces = traces_by_day[day]
        day_traces_with_latency = [
            trace for trace in day_traces if trace.latency_ms is not None
        ]
        average_latency_ms = (
            sum(trace.latency_ms or 0 for trace in day_traces_with_latency)
            / len(day_traces_with_latency)
            if day_traces_with_latency
            else None
        )

        points.append(
            DashboardTimeSeriesPointResponse(
                date=day,
                trace_count=len(day_traces),
                error_count=sum(1 for trace in day_traces if trace.status == "error"),
                average_latency_ms=average_latency_ms,
            )
        )

    return points