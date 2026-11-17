import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, String, false, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import LEVELS, Base, CreatedAtMixin, in_list, timestamptz

ACCENTS = ("en-US", "en-GB")
LEVEL_SOURCES = ("placement", "manual")


class User(CreatedAtMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(in_list("accent", ACCENTS), name="accent_valid"),
        CheckConstraint(in_list("level", LEVELS), name="level_valid"),
        CheckConstraint(in_list("level_source", LEVEL_SOURCES), name="level_source_valid"),
    )

    # Será o "sub" do token do Supabase (Fase 8); sem FK para auth.users.
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    accent: Mapped[str] = mapped_column(String(5), nullable=False, server_default="en-US")
    level: Mapped[str | None] = mapped_column(String(2))
    level_source: Mapped[str | None] = mapped_column(String(10))
    placement_taken_at: Mapped[datetime | None] = mapped_column(timestamptz())
    onboarded: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=false())
    updated_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), onupdate=func.now(), nullable=False
    )
