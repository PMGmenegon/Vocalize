"""Conexão com o PostgreSQL: engine assíncrono, fábrica de sessões e dependência do FastAPI."""

from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import Settings


def create_engine(settings: Settings) -> AsyncEngine:
    """Engine com pool de conexões. `pool_pre_ping` descarta conexões mortas antes de usar."""
    return create_async_engine(
        settings.database_url,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_pre_ping=True,
    )


def create_session_factory(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    # expire_on_commit=False: objetos continuam legíveis depois do commit (sem I/O implícito).
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_db(request: Request) -> AsyncIterator[AsyncSession]:
    """Uma sessão por requisição, sempre fechada no fim.

    Não faz commit nem rollback: isso é responsabilidade dos services.
    Sem commit, o fechamento da sessão desfaz a transação pendente.
    """
    factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    async with factory() as session:
        yield session


# Uso nas rotas: `db: DbSession`.
DbSession = Annotated[AsyncSession, Depends(get_db)]
