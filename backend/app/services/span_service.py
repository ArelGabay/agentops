from sqlalchemy.orm import Session

from app.models import Span
from app.repositories import create_span, get_trace_by_id
from app.schemas import SpanCreate
from app.services.errors import ResourceNotFoundError


def ingest_span(db: Session, span_data: SpanCreate) -> Span:
    trace = get_trace_by_id(db, span_data.trace_id)

    if trace is None:
        raise ResourceNotFoundError("Trace not found")

    return create_span(db, span_data)
