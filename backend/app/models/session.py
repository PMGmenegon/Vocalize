import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, ForeignKey, Index, String, Text, desc, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import LEVELS, Base, in_list, timestamptz
from app.models.user import ACCENTS


class Session(Base):
    """Sessão de prática. Situação e interlocutor são ids de dados no código (ADR 0009)."""

    __tablename__ = "sessions"
    __table_args__ = (
        CheckConstraint(in_list("level", LEVELS), name="level_valid"),
        CheckConstraint(in_list("accent", ACCENTS), name="accent_valid"),
        Index("ix_sessions_user_id_started_at", "user_id", desc("started_at")),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    situation_id: Mapped[str] = mapped_column(String(50), nullable=False)
    interlocutor_id: Mapped[str] = mapped_column(String(50), nullable=False)
    scene: Mapped[str] = mapped_column(Text, nullable=False)
    level: Mapped[str] = mapped_column(String(2), nullable=False)
    accent: Mapped[str] = mapped_column(String(5), nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
    ended_at: Mapped[datetime | None] = mapped_column(timestamptz())
