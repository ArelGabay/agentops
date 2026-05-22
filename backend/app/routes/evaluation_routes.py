from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.controllers import create_evaluation_controller, list_evaluations_controller
from app.database import get_db_session
from app.schemas import (
    EvaluationCreate,
    EvaluationReadResponse,
    EvaluationResponse,
)

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])

LimitQuery = Annotated[int, Query(ge=1, le=100)]


@router.get("", response_model=list[EvaluationReadResponse])
def list_evaluations(
    db: Session = Depends(get_db_session),
    limit: LimitQuery = 25,
) -> list[EvaluationReadResponse]:
    return list_evaluations_controller(db, limit=limit)


@router.post("", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_evaluation(
    evaluation_data: EvaluationCreate,
    db: Session = Depends(get_db_session),
) -> EvaluationResponse:
    return create_evaluation_controller(db, evaluation_data)
