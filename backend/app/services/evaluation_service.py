from sqlalchemy.orm import Session

from app.models import Evaluation
from app.repositories import create_evaluation, list_evaluations
from app.schemas import EvaluationCreate


def ingest_evaluation(db: Session, evaluation_data: EvaluationCreate) -> Evaluation:
    return create_evaluation(db, evaluation_data)


def get_recent_evaluations(db: Session, limit: int = 25) -> list[Evaluation]:
    return list_evaluations(db, limit=limit)
