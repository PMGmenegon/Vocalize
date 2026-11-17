"""initial schema

Revision ID: 2a184b564ed6
Revises:
Create Date: 2026-11-17 16:31:51.526796

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "2a184b564ed6"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("accent", sa.String(length=5), server_default="en-US", nullable=False),
        sa.Column("level", sa.String(length=2), nullable=True),
        sa.Column("level_source", sa.String(length=10), nullable=True),
        sa.Column("placement_taken_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("onboarded", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint("accent IN ('en-US', 'en-GB')", name=op.f("ck_users_accent_valid")),
        sa.CheckConstraint("level IN ('A2', 'B1', 'B2', 'C1')", name=op.f("ck_users_level_valid")),
        sa.CheckConstraint(
            "level_source IN ('placement', 'manual')", name=op.f("ck_users_level_source_valid")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_users")),
        sa.UniqueConstraint("email", name=op.f("uq_users_email")),
    )
    op.create_table(
        "level_history",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("from_level", sa.String(length=2), nullable=True),
        sa.Column("to_level", sa.String(length=2), nullable=False),
        sa.Column("reason", sa.String(length=20), nullable=False),
        sa.Column(
            "changed_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "from_level IN ('A2', 'B1', 'B2', 'C1')", name=op.f("ck_level_history_from_level_valid")
        ),
        sa.CheckConstraint(
            "reason IN ('placement', 'manual', 'promotion', 'review')",
            name=op.f("ck_level_history_reason_valid"),
        ),
        sa.CheckConstraint(
            "to_level IN ('A2', 'B1', 'B2', 'C1')", name=op.f("ck_level_history_to_level_valid")
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_level_history_user_id_users"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_level_history")),
    )
    op.create_index(
        "ix_level_history_user_id_changed_at",
        "level_history",
        ["user_id", sa.text("changed_at DESC")],
        unique=False,
    )
    op.create_table(
        "missed_words",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("word", sa.String(length=100), nullable=False),
        sa.Column("times_missed", sa.Integer(), server_default=sa.text("1"), nullable=False),
        sa.Column(
            "last_missed_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("ease", sa.Numeric(), server_default=sa.text("2.5"), nullable=False),
        sa.Column("interval_days", sa.Integer(), server_default=sa.text("0"), nullable=False),
        sa.Column("repetitions", sa.Integer(), server_default=sa.text("0"), nullable=False),
        sa.Column(
            "due_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.CheckConstraint(
            "interval_days >= 0", name=op.f("ck_missed_words_interval_days_non_negative")
        ),
        sa.CheckConstraint(
            "repetitions >= 0", name=op.f("ck_missed_words_repetitions_non_negative")
        ),
        sa.CheckConstraint("times_missed >= 1", name=op.f("ck_missed_words_times_missed_positive")),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_missed_words_user_id_users"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("user_id", "word", name=op.f("pk_missed_words")),
    )
    op.create_index(
        "ix_missed_words_user_id_due_at", "missed_words", ["user_id", "due_at"], unique=False
    )
    op.create_table(
        "placement_attempts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("answers", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("result_level", sa.String(length=2), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "result_level IN ('A2', 'B1', 'B2', 'C1')",
            name=op.f("ck_placement_attempts_result_level_valid"),
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_placement_attempts_user_id_users"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_placement_attempts")),
    )
    op.create_index(
        "ix_placement_attempts_user_id_created_at",
        "placement_attempts",
        ["user_id", sa.text("created_at DESC")],
        unique=False,
    )
    op.create_table(
        "sessions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("situation_id", sa.String(length=50), nullable=False),
        sa.Column("interlocutor_id", sa.String(length=50), nullable=False),
        sa.Column("scene", sa.Text(), nullable=False),
        sa.Column("level", sa.String(length=2), nullable=False),
        sa.Column("accent", sa.String(length=5), nullable=False),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("accent IN ('en-US', 'en-GB')", name=op.f("ck_sessions_accent_valid")),
        sa.CheckConstraint(
            "level IN ('A2', 'B1', 'B2', 'C1')", name=op.f("ck_sessions_level_valid")
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], name=op.f("fk_sessions_user_id_users"), ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_sessions")),
    )
    op.create_index(
        "ix_sessions_user_id_started_at",
        "sessions",
        ["user_id", sa.text("started_at DESC")],
        unique=False,
    )
    op.create_table(
        "turns",
        sa.Column("id", sa.BigInteger(), sa.Identity(always=False), nullable=False),
        sa.Column("session_id", sa.UUID(), nullable=False),
        sa.Column("turn_index", sa.Integer(), nullable=False),
        sa.Column("ai_line", sa.Text(), nullable=False),
        sa.Column("user_transcription", sa.Text(), nullable=True),
        sa.Column("accuracy", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("replays", sa.Integer(), server_default=sa.text("0"), nullable=False),
        sa.Column("hints_used", sa.Integer(), server_default=sa.text("0"), nullable=False),
        sa.Column("user_reply", sa.Text(), nullable=True),
        sa.Column("reply_feedback", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "accuracy >= 0 AND accuracy <= 100", name=op.f("ck_turns_accuracy_range")
        ),
        sa.CheckConstraint("hints_used >= 0", name=op.f("ck_turns_hints_used_non_negative")),
        sa.CheckConstraint("replays >= 0", name=op.f("ck_turns_replays_non_negative")),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["sessions.id"],
            name=op.f("fk_turns_session_id_sessions"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_turns")),
        sa.UniqueConstraint(
            "session_id", "turn_index", name=op.f("uq_turns_session_id_turn_index")
        ),
    )
    op.create_index("ix_turns_session_id", "turns", ["session_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_turns_session_id", table_name="turns")
    op.drop_table("turns")
    op.drop_index("ix_sessions_user_id_started_at", table_name="sessions")
    op.drop_table("sessions")
    op.drop_index("ix_placement_attempts_user_id_created_at", table_name="placement_attempts")
    op.drop_table("placement_attempts")
    op.drop_index("ix_missed_words_user_id_due_at", table_name="missed_words")
    op.drop_table("missed_words")
    op.drop_index("ix_level_history_user_id_changed_at", table_name="level_history")
    op.drop_table("level_history")
    op.drop_table("users")
