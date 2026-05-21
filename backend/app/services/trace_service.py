from sqlalchemy.orm import Session

from app.models import Trace
from app.repositories import create_trace
from app.schemas import TraceCreate


def ingest_trace(db: Session, trace_data: TraceCreate) -> Trace:
    return create_trace(db, trace_data)