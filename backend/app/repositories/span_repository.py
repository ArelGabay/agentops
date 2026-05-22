from sqlalchemy.orm import Session

from app.models import Span
from app.schemas import SpanCreate


def create_span(db: Session, span_data: SpanCreate) -> Span:
    span = Span(**span_data.model_dump())

    db.add(span)
    db.commit()
    db.refresh(span)

    return span
