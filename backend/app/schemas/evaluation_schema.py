from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class EvaluationCreate(BaseModel):
    trace_id: str
    evaluator_name: str
    score: Decimal = Field(ge=0, le=100)
    result: str

    hallucination_score: Decimal | None = Field(default=None, ge=0, le=100)
    feedback: str | None = None


class EvaluationResponse(BaseModel):
    id: str
    trace_id: str
    evaluator_name: str
    score: Decimal
    result: str
    created_at: datetime

    hallucination_score: Decimal | None = None
    feedback: str | None = None

    model_config = ConfigDict(from_attributes=True)
