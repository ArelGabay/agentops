from sqlalchemy.orm import Session

from app.schemas import EvaluationCreate, EvaluationResponse
from app.services import ingest_evaluation


def create_evaluation_controller(
    db: Session,
    evaluation_data: EvaluationCreate,
) -> EvaluationResponse:
    evaluation = ingest_evaluation(db, evaluation_data)
    return EvaluationResponse.model_validate(evaluation)