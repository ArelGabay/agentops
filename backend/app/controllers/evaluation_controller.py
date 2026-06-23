from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas import EvaluationCreate, EvaluationReadResponse, EvaluationResponse
from app.services import get_recent_evaluations, ingest_evaluation, ResourceNotFoundError


def create_evaluation_controller(
    db: Session,
    evaluation_data: EvaluationCreate,
) -> EvaluationResponse:
    try:
        evaluation = ingest_evaluation(db, evaluation_data)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error.detail,
        ) from error

    return EvaluationResponse.model_validate(evaluation)


def list_evaluations_controller(
    db: Session,
    limit: int = 25,
) -> list[EvaluationReadResponse]:
    evaluations = get_recent_evaluations(db, limit=limit)
    return [
        EvaluationReadResponse.model_validate(evaluation)
        for evaluation in evaluations
    ]
