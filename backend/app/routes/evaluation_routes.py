from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.controllers import create_evaluation_controller
from app.database import get_db_session
from app.schemas import EvaluationCreate, EvaluationResponse

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


@router.post("", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_evaluation(
    evaluation_data: EvaluationCreate,
    db: Session = Depends(get_db_session),
) -> EvaluationResponse:
    return create_evaluation_controller(db, evaluation_data)