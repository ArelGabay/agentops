from sqlalchemy.orm import Session

from app.models import Evaluation
from app.repositories import create_evaluation
from app.schemas import EvaluationCreate


def ingest_evaluation(db: Session, evaluation_data: EvaluationCreate) -> Evaluation:
    return create_evaluation(db, evaluation_data)