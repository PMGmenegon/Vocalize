import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Index, Numeric, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, timestamptz


class MissedWord(Base):
    """Palavra errada no ditado, com o estado de repetição espaçada (ease/interval/repetitions)."""

    __tablename__ = "missed_words"
    __table_args__ = (
        CheckConstraint("times_missed >= 1", name="times_missed_positive"),
        CheckConstraint("interval_days >= 0", name="interval_days_non_negative"),
        CheckConstraint("repetitions >= 0", name="repetitions_non_negative"),
        Index("ix_missed_words_user_id_due_at", "user_id", "due_at"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    word: Mapped[str] = mapped_column(String(100), primary_key=True)
    times_missed: Mapped[int] = mapped_column(nullable=False, server_default=text("1"))
    last_missed_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
    ease: Mapped[Decimal] = mapped_column(Numeric, nullable=False, server_default=text("2.5"))
    interval_days: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))
    repetitions: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))
    due_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
