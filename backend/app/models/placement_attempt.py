import uuid
from typing import Any

from sqlalchemy import CheckConstraint, ForeignKey, Index, String, desc
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import LEVELS, Base, CreatedAtMixin, in_list


class PlacementAttempt(CreatedAtMixin, Base):
    __tablename__ = "placement_attempts"
    __table_args__ = (
        CheckConstraint(in_list("result_level", LEVELS), name="result_level_valid"),
        Index("ix_placement_attempts_user_id_created_at", "user_id", desc("created_at")),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    # id da pergunta -> alternativa escolhida
    answers: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    result_level: Mapped[str] = mapped_column(String(2), nullable=False)
