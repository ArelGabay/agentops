from datetime import datetime

from sqlalchemy.orm import Session

from app.models import Trace


def list_dashboard_traces_since(
    db: Session,
    started_at: datetime,
) -> list[Trace]:
    return (
        db.query(Trace)
        .filter(Trace.started_at >= started_at)
        .order_by(Trace.started_at.desc())
        .all()
    )


def list_recent_dashboard_traces(
    db: Session,
    started_at: datetime,
    limit: int = 5,
) -> list[Trace]:
    return (
        db.query(Trace)
        .filter(Trace.started_at >= started_at)
        .order_by(Trace.started_at.desc())
        .limit(limit)
        .all()
    )
