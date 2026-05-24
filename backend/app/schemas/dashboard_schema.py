from datetime import date
from decimal import Decimal

from pydantic import BaseModel

from app.schemas.trace_schema import TraceListResponse


class DashboardMetricsResponse(BaseModel):
    total_traces: int
    success_rate: float
    average_latency_ms: float | None
    total_tokens: int
    total_cost: Decimal


class DashboardStatusCountsResponse(BaseModel):
    success: int
    error: int
    timeout: int
    canceled: int
    in_progress: int


class DashboardTopAgentResponse(BaseModel):
    agent_id: str
    trace_count: int


class DashboardTimeSeriesPointResponse(BaseModel):
    date: date
    trace_count: int
    error_count: int
    average_latency_ms: float | None


class DashboardSummaryResponse(BaseModel):
    metrics: DashboardMetricsResponse
    status_counts: DashboardStatusCountsResponse
    top_agents: list[DashboardTopAgentResponse]
    recent_traces: list[TraceListResponse]
    time_series: list[DashboardTimeSeriesPointResponse]
