from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SpanCreate(BaseModel):
    trace_id: str
    name: str
    span_type: str
    status: str
    started_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    ended_at: datetime | None = None


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
