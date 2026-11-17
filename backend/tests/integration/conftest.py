"""Fixtures de integração: PostgreSQL 16 real em container temporário (Docker Desktop aberto)."""

from collections.abc import AsyncIterator, Iterator
from pathlib import Path

import pytest
from alembic.config import Config
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from testcontainers.community.postgres import PostgresContainer

from alembic import command

BACKEND_DIR = Path(__file__).resolve().parents[2]


def alembic_config(database_url: str) -> Config:
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    config.set_main_option("sqlalchemy.url", database_url.replace("%", "%%"))
    return config


@pytest.fixture(scope="session")
def postgres_server() -> Iterator[PostgresContainer]:
    """Sobe o container uma única vez por sessão de testes."""
    with PostgresContainer("postgres:16", driver="asyncpg") as container:
        yield container


@pytest.fixture(scope="session")
def database_url(postgres_server: PostgresContainer) -> str:
    """URL do banco já migrado (alembic upgrade head), compartilhado pelos testes."""
    url = postgres_server.get_connection_url()
    command.upgrade(alembic_config(url), "head")
    return url


@pytest.fixture
async def empty_database_url(postgres_server: PostgresContainer) -> AsyncIterator[str]:
    """Um banco novo e vazio (para testar as migrations do zero)."""
    base_url = postgres_server.get_connection_url()
    name = "migration_test"
    admin = create_async_engine(base_url, isolation_level="AUTOCOMMIT", poolclass=NullPool)
    async with admin.connect() as conn:
        await conn.execute(text(f"DROP DATABASE IF EXISTS {name}"))
        await conn.execute(text(f"CREATE DATABASE {name}"))
    yield base_url.rsplit("/", 1)[0] + f"/{name}"
    async with admin.connect() as conn:
        await conn.execute(text(f"DROP DATABASE IF EXISTS {name} WITH (FORCE)"))
    await admin.dispose()


@pytest.fixture
async def db_session(database_url: str) -> AsyncIterator[AsyncSession]:
    """Sessão isolada: tudo roda numa transação externa que sofre rollback no fim do teste.

    Com `create_savepoint`, commits/rollbacks feitos dentro do teste ficam em savepoints
    e nada vaza para os outros testes.
    """
    engine = create_async_engine(database_url, poolclass=NullPool)
    async with engine.connect() as connection:
        outer = await connection.begin()
        session = AsyncSession(
            bind=connection, join_transaction_mode="create_savepoint", expire_on_commit=False
        )
        try:
            yield session
        finally:
            await session.close()
            await outer.rollback()
    await engine.dispose()
