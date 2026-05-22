from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.controllers import create_span_controller
from app.database import get_db_session
from app.schemas import SpanCreate, SpanResponse

router = APIRouter(prefix="/spans", tags=["Spans"])


@router.post("", response_model=SpanResponse, status_code=status.HTTP_201_CREATED)
def create_span(
    span_data: SpanCreate,
    db: Session = Depends(get_db_session),
) -> SpanResponse:
    return create_span_controller(db, span_data)