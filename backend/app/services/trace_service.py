from sqlalchemy.orm import Session

from app.models import Evaluation, Span, Trace
from app.repositories import (
    create_trace,
    get_trace_by_id,
    list_evaluations_by_trace_id,
    list_spans_by_trace_id,
    list_traces,
)
from app.schemas import TraceCreate


def ingest_trace(db: Session, trace_data: TraceCreate) -> Trace:
    return create_trace(db, trace_data)


def get_recent_traces(db: Session, limit: int = 25) -> list[Trace]:
    return list_traces(db, limit=limit)


def get_trace_detail(
    db: Session,
    trace_id: str,
) -> tuple[Trace | None, list[Span], list[Evaluation]]:
    trace = get_trace_by_id(db, trace_id)
    if trace is None:
        return None, [], []

    spans = list_spans_by_trace_id(db, trace_id)
    evaluations = list_evaluations_by_trace_id(db, trace_id)

    return trace, spans, evaluations
