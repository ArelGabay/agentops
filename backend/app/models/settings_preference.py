from datetime import UTC, datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class SettingsPreference(Base):
    __tablename__ = "settings_preferences"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    workspace_name: Mapped[str] = mapped_column(String(255), nullable=False)
    timezone: Mapped[str] = mapped_column(String(100), nullable=False, default="UTC")
    theme_preference: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="dark",
    )
    accent_color: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="violet",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )
