from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.controllers import create_trace_controller
from app.database import get_db_session
from app.schemas import TraceCreate, TraceResponse

router = APIRouter(prefix="/traces", tags=["Traces"])


@router.post("", response_model=TraceResponse, status_code=status.HTTP_201_CREATED)
def create_trace(
    trace_data: TraceCreate,
    db: Session = Depends(get_db_session),
) -> TraceResponse:
    return create_trace_controller(db, trace_data)