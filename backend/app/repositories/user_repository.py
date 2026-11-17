"""Acesso a dados de usuários.

O repository só fala com o banco (flush), sem commit: quem controla a transação é o service.
"""

import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self._session.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        result = await self._session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, *, user_id: uuid.UUID, email: str, accent: str = "en-US") -> User:
        """Cria o usuário. E-mail duplicado levanta IntegrityError (no flush)."""
        user = User(id=user_id, email=email, accent=accent)
        self._session.add(user)
        await self._session.flush()
        return user

    async def update(
        self,
        user: User,
        *,
        level: str | None = None,
        level_source: str | None = None,
        placement_taken_at: datetime | None = None,
        accent: str | None = None,
        onboarded: bool | None = None,
    ) -> User:
        """Atualiza só os campos informados (None = não mexer)."""
        changes = {
            "level": level,
            "level_source": level_source,
            "placement_taken_at": placement_taken_at,
            "accent": accent,
            "onboarded": onboarded,
        }
        for field, value in changes.items():
            if value is not None:
                setattr(user, field, value)
        await self._session.flush()
        await self._session.refresh(user)  # traz updated_at calculado pelo banco
        return user
