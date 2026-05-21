from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TraceCreate(BaseModel):
    agent_id: str
    status: str
    started_at: datetime

    input_text: str | None = None
    output_text: str | None = None
    latency_ms: int | None = None
    total_tokens: int | None = None
    total_cost: Decimal | None = None
    ended_at: datetime | None = None


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
