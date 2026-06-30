from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, field_validator

def normalize_status(value: str) -> str:
    return value.strip().lower().replace("_", "-").replace(" ", "-")


class SpanCreate(BaseModel):
    trace_id: str
    name: str
    span_type: str
    status: Literal["success", "error", "timeout", "canceled", "in-progress"]
    started_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    ended_at: datetime | None = None

    @field_validator("status", mode="before")
    @classmethod
    def normalize_span_status(cls, value: str) -> str:
        if isinstance(value, str):
            return normalize_status(value)
        return value


class SpanResponse(BaseModel):
    id: str
    trace_id: str
    name: str
    span_type: str
    status: str
    started_at: datetime
    created_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    ended_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class SpanReadResponse(BaseModel):
    id: str
    trace_id: str
    name: str
    span_type: str
    status: str
    started_at: datetime
    created_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    ended_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
