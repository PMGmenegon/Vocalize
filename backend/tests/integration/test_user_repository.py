import uuid
from datetime import UTC, datetime

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import UserRepository

pytestmark = pytest.mark.integration


async def test_create_and_get_by_id_and_email(db_session: AsyncSession) -> None:
    repo = UserRepository(db_session)
    user_id = uuid.uuid4()

    created = await repo.create(user_id=user_id, email="ana@example.com")
    assert created.accent == "en-US"
    assert created.onboarded is False
    assert created.level is None
    assert created.created_at.tzinfo is not None

    db_session.expunge_all()  # força leitura real do banco
    by_id = await repo.get_by_id(user_id)
    by_email = await repo.get_by_email("ana@example.com")
    assert by_id is not None
    assert by_email is not None
    assert by_id.email == "ana@example.com"
    assert by_email.id == user_id


async def test_get_missing_returns_none(db_session: AsyncSession) -> None:
    repo = UserRepository(db_session)
    assert await repo.get_by_id(uuid.uuid4()) is None
    assert await repo.get_by_email("ninguem@example.com") is None


async def test_update_level_accent_and_onboarding(db_session: AsyncSession) -> None:
    repo = UserRepository(db_session)
    user = await repo.create(user_id=uuid.uuid4(), email="bia@example.com")
    taken = datetime(2026, 11, 1, 12, 0, tzinfo=UTC)

    updated = await repo.update(
        user,
        level="B1",
        level_source="placement",
        placement_taken_at=taken,
        accent="en-GB",
        onboarded=True,
    )
    assert (updated.level, updated.level_source) == ("B1", "placement")
    assert updated.accent == "en-GB"
    assert updated.onboarded is True
    assert updated.placement_taken_at == taken
    assert updated.updated_at >= updated.created_at

    # atualização parcial não apaga o resto
    again = await repo.update(user, level="B2", level_source="manual")
    assert (again.level, again.accent, again.onboarded) == ("B2", "en-GB", True)


async def test_duplicate_email_fails(db_session: AsyncSession) -> None:
    repo = UserRepository(db_session)
    await repo.create(user_id=uuid.uuid4(), email="dup@example.com")
    with pytest.raises(IntegrityError):
        await repo.create(user_id=uuid.uuid4(), email="dup@example.com")
