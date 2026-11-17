import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    ForeignKey,
    Identity,
    Index,
    Numeric,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, timestamptz


class Turn(Base):
    __tablename__ = "turns"
    __table_args__ = (
        UniqueConstraint("session_id", "turn_index", name="uq_turns_session_id_turn_index"),
        CheckConstraint("accuracy >= 0 AND accuracy <= 100", name="accuracy_range"),
        CheckConstraint("replays >= 0", name="replays_non_negative"),
        CheckConstraint("hints_used >= 0", name="hints_used_non_negative"),
        Index("ix_turns_session_id", "session_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    turn_index: Mapped[int] = mapped_column(nullable=False)
    ai_line: Mapped[str] = mapped_column(Text, nullable=False)
    user_transcription: Mapped[str | None] = mapped_column(Text)
    accuracy: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    replays: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))
    hints_used: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))
    user_reply: Mapped[str | None] = mapped_column(Text)
    # Formato do ReplyFeedback do frontend: coherence, levelFit, correctedReply,
    # issues, suggestedReplies, comment.
    reply_feedback: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
