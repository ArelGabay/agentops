from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    trace_id: Mapped[str] = mapped_column(ForeignKey("traces.id"), nullable=False)

    evaluator_name: Mapped[str] = mapped_column(String(255), nullable=False)
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    result: Mapped[str] = mapped_column(String(50), nullable=False)
    hallucination_score: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )