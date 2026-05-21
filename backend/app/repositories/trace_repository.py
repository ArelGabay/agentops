from sqlalchemy.orm import Session

from app.models import Trace
from app.schemas import TraceCreate


def create_trace(db: Session, trace_data: TraceCreate) -> Trace:
    trace = Trace(**trace_data.model_dump())

    db.add(trace)
    db.commit()
    db.refresh(trace)

    return trace
