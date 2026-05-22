from sqlalchemy.orm import Session

from app.models import Evaluation
from app.schemas import EvaluationCreate


def create_evaluation(db: Session, evaluation_data: EvaluationCreate) -> Evaluation:
    evaluation = Evaluation(**evaluation_data.model_dump())

    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    return evaluation
