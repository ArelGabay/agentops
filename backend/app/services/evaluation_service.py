from sqlalchemy.orm import Session

from app.models import Evaluation
from app.repositories import create_evaluation, list_evaluations, get_trace_by_id
from app.schemas import EvaluationCreate
from app.services.errors import ResourceNotFoundError


def ingest_evaluation(db: Session, evaluation_data: EvaluationCreate) -> Evaluation:
    trace = get_trace_by_id(db, evaluation_data.trace_id)

    if trace is None:
        raise ResourceNotFoundError("Trace not found")

    return create_evaluation(db, evaluation_data)


def get_recent_evaluations(db: Session, limit: int = 25) -> list[Evaluation]:
    return list_evaluations(db, limit=limit)
