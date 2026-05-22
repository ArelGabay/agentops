from sqlalchemy.orm import Session

from app.schemas import SpanCreate, SpanResponse
from app.services import ingest_span


def create_span_controller(db: Session, span_data: SpanCreate) -> SpanResponse:
    span = ingest_span(db, span_data)
    return SpanResponse.model_validate(span)