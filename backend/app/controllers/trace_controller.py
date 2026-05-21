from sqlalchemy.orm import Session

from app.schemas import TraceCreate, TraceResponse
from app.services import ingest_trace


def create_trace_controller(db: Session, trace_data: TraceCreate) -> TraceResponse:
    trace = ingest_trace(db, trace_data)
    return TraceResponse.model_validate(trace)