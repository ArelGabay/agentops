from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas import SpanCreate, SpanResponse
from app.services import ingest_span, ResourceNotFoundError


def create_span_controller(db: Session, span_data: SpanCreate) -> SpanResponse:
    try:
        span = ingest_span(db, span_data)
    except ResourceNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error.detail,
        ) from error

    return SpanResponse.model_validate(span)
