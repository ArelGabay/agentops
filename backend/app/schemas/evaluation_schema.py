from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator

def normalize_result(value: str) -> str:
    return value.strip().lower().replace("_", "-").replace(" ", "-")


class EvaluationCreate(BaseModel):
    trace_id: str
    evaluator_name: str
    score: Decimal = Field(ge=0, le=100)
    result: Literal["pass", "partial", "fail"]

    hallucination_score: Decimal | None = Field(default=None, ge=0, le=100)
    feedback: str | None = None

    @field_validator("result", mode="before")
    @classmethod
    def normalize_evaluation_result(cls, value: str) -> str:
        if isinstance(value, str):
            return normalize_result(value)
        return value


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


class EvaluationReadResponse(BaseModel):
    id: str
    trace_id: str
    evaluator_name: str
    score: Decimal
    result: str
    created_at: datetime

    hallucination_score: Decimal | None = None
    feedback: str | None = None

    model_config = ConfigDict(from_attributes=True)
