from sqlalchemy.orm import Session

from app.models import Trace
from app.schemas import TraceCreate


def create_trace(db: Session, trace_data: TraceCreate) -> Trace:
    trace = Trace(**trace_data.model_dump())

    db.add(trace)
    db.commit()
    db.refresh(trace)

    return trace


def list_traces(db: Session, limit: int = 25) -> list[Trace]:
    return (
        db.query(Trace)
        .order_by(Trace.created_at.desc())
        .limit(limit)
        .all()
    )


def get_trace_by_id(db: Session, trace_id: str) -> Trace | None:
    return db.query(Trace).filter(Trace.id == trace_id).first()
