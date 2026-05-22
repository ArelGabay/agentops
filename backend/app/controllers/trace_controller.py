from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas import (
    TraceCreate,
    TraceDetailResponse,
    TraceListResponse,
    TraceResponse,
)
from app.services import (
    get_recent_traces,
    get_trace_detail,
    ingest_trace,
)


def create_trace_controller(db: Session, trace_data: TraceCreate) -> TraceResponse:
    trace = ingest_trace(db, trace_data)
    return TraceResponse.model_validate(trace)


def list_traces_controller(db: Session, limit: int = 25) -> list[TraceListResponse]:
    traces = get_recent_traces(db, limit=limit)
    return [TraceListResponse.model_validate(trace) for trace in traces]


def get_trace_detail_controller(db: Session, trace_id: str) -> TraceDetailResponse:
    trace, spans, evaluations = get_trace_detail(db, trace_id)

    if trace is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trace not found",
        )

    trace_response = TraceListResponse.model_validate(trace)

    return TraceDetailResponse(
        **trace_response.model_dump(),
        spans=spans,
        evaluations=evaluations,
    )
