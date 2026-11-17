import asyncio

import pytest
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

from alembic import command
from tests.integration.conftest import alembic_config

pytestmark = pytest.mark.integration

TABLES = {"users", "placement_attempts", "sessions", "turns", "missed_words", "level_history"}


async def _tables(url: str) -> set[str]:
    engine = create_async_engine(url, poolclass=NullPool)
    async with engine.connect() as conn:
        names = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    await engine.dispose()
    return names - {"alembic_version"}


async def _indexes(url: str) -> set[str]:
    engine = create_async_engine(url, poolclass=NullPool)
    async with engine.connect() as conn:
        result = await conn.execute(
            text("SELECT indexname FROM pg_indexes WHERE schemaname='public'")
        )
        names = {row[0] for row in result}
    await engine.dispose()
    return names


async def test_upgrade_and_downgrade_full_cycle(empty_database_url: str) -> None:
    config: Config = alembic_config(empty_database_url)

    # Alembic usa asyncio.run por dentro: rodamos em thread para não colidir com o loop do pytest
    await asyncio.to_thread(command.upgrade, config, "head")
    assert await _tables(empty_database_url) == TABLES
    assert {
        "ix_sessions_user_id_started_at",
        "ix_turns_session_id",
        "ix_missed_words_user_id_due_at",
        "ix_level_history_user_id_changed_at",
        "ix_placement_attempts_user_id_created_at",
    } <= await _indexes(empty_database_url)

    await asyncio.to_thread(command.downgrade, config, "base")
    assert await _tables(empty_database_url) == set()

    # e sobe de novo: o ciclo é repetível
    await asyncio.to_thread(command.upgrade, config, "head")
    assert await _tables(empty_database_url) == TABLES


async def test_models_and_migrations_are_in_sync(empty_database_url: str) -> None:
    """Se um model mudar sem migration, `alembic check` falha."""
    config = alembic_config(empty_database_url)
    await asyncio.to_thread(command.upgrade, config, "head")
    await asyncio.to_thread(command.check, config)


def test_single_migration_head() -> None:
    script = ScriptDirectory.from_config(alembic_config("postgresql+asyncpg://x/y"))
    assert len(script.get_heads()) == 1
