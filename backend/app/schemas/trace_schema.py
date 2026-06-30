from datetime import datetime
from decimal import Decimal

from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.evaluation_schema import EvaluationReadResponse
from app.schemas.span_schema import SpanReadResponse

def normalize_status(value: str) -> str:
    return value.strip().lower().replace("_", "-").replace(" ", "-")


class TraceCreate(BaseModel):
    agent_id: str
    status: Literal["success", "error", "timeout", "canceled", "in-progress"]
    started_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    total_tokens: int | None = None
    total_cost: Decimal | None = None
    ended_at: datetime | None = None

    @field_validator("status", mode="before")
    @classmethod
    def normalize_trace_status(cls, value: str) -> str:
        if isinstance(value, str):
            return normalize_status(value)
        return value


class TraceResponse(BaseModel):
    id: str
    agent_id: str
    status: str
    started_at: datetime
    created_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    total_tokens: int | None = None
    total_cost: Decimal | None = None
    ended_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class TraceListResponse(BaseModel):
    id: str
    agent_id: str
    status: str
    started_at: datetime
    created_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    total_tokens: int | None = None
    total_cost: Decimal | None = None
    ended_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class TraceDetailResponse(TraceListResponse):
    spans: list[SpanReadResponse]
    evaluations: list[EvaluationReadResponse]
