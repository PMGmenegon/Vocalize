"""Base declarativa, convenção de nomes e tipos comuns."""

from datetime import datetime

from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Nomes previsíveis para constraints: sem isso o Alembic não consegue removê-las depois.
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

LEVELS = ("A2", "B1", "B2", "C1")


def in_list(column: str, values: tuple[str, ...]) -> str:
    """Texto de um CHECK `coluna IN ('a', 'b')` (valores são constantes do código)."""
    quoted = ", ".join(f"'{v}'" for v in values)
    return f"{column} IN ({quoted})"


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


def timestamptz() -> DateTime:
    return DateTime(timezone=True)


class CreatedAtMixin:
    created_at: Mapped[datetime] = mapped_column(
        timestamptz(), server_default=func.now(), nullable=False
    )
