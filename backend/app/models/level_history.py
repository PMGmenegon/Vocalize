import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, ForeignKey, Index, String, desc, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import LEVELS, Base, in_list, timestamptz

LEVEL_CHANGE_REASONS = ("placement", "manual", "promotion", "review")


class LevelHistory(Base):
    __tablename__ = "level_history"
    __table_args__ = (
        CheckConstraint(in_list("from_level", LEVELS), name="from_level_valid"),
        CheckConstraint(in_list("to_level", LEVELS), name="to_level_valid"),
        CheckConstraint(in_list("reason", LEVEL_CHANGE_REASONS), name="reason_valid"),
        Index("ix_level_history_user_id_changed_at", "user_id", desc("changed_at")),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    from_level: Mapped[str | None] = mapped_column(String(2))
    to_level: Mapped[str] = mapped_column(String(2), nullable=False)
    reason: Mapped[str] = mapped_column(String(20), nullable=False)
    changed_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
