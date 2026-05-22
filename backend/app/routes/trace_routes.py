from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.controllers import (
    create_trace_controller,
    get_trace_detail_controller,
    list_traces_controller,
)
from app.database import get_db_session
from app.schemas import (
    TraceCreate,
    TraceDetailResponse,
    TraceListResponse,
    TraceResponse,
)

router = APIRouter(prefix="/traces", tags=["Traces"])

LimitQuery = Annotated[int, Query(ge=1, le=100)]


@router.get("", response_model=list[TraceListResponse])
def list_traces(
    db: Session = Depends(get_db_session),
    limit: LimitQuery = 25,
) -> list[TraceListResponse]:
    return list_traces_controller(db, limit=limit)


@router.get("/{trace_id}", response_model=TraceDetailResponse)
def get_trace_detail(
    trace_id: str,
    db: Session = Depends(get_db_session),
) -> TraceDetailResponse:
    return get_trace_detail_controller(db, trace_id)


@router.post("", response_model=TraceResponse, status_code=status.HTTP_201_CREATED)
def create_trace(
    trace_data: TraceCreate,
    db: Session = Depends(get_db_session),
) -> TraceResponse:
    return create_trace_controller(db, trace_data)
