from sqlalchemy.orm import Session

from app.models import Span
from app.repositories import create_span
from app.schemas import SpanCreate


def ingest_span(db: Session, span_data: SpanCreate) -> Span:
    return create_span(db, span_data)