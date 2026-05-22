from sqlalchemy.orm import Session

from app.models import Evaluation
from app.schemas import EvaluationCreate


def create_evaluation(db: Session, evaluation_data: EvaluationCreate) -> Evaluation:
    evaluation = Evaluation(**evaluation_data.model_dump())

    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    return evaluation


def list_evaluations(db: Session, limit: int = 25) -> list[Evaluation]:
    return (
        db.query(Evaluation)
        .order_by(Evaluation.created_at.desc())
        .limit(limit)
        .all()
    )


def list_evaluations_by_trace_id(db: Session, trace_id: str) -> list[Evaluation]:
    return (
        db.query(Evaluation)
        .filter(Evaluation.trace_id == trace_id)
        .order_by(Evaluation.created_at.desc())
        .all()
    )
