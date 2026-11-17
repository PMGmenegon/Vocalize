import uuid
from decimal import Decimal

import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Session, Turn, User

pytestmark = pytest.mark.integration


async def _user(db: AsyncSession, **kwargs: object) -> User:
    user = User(id=uuid.uuid4(), email=f"{uuid.uuid4()}@example.com", **kwargs)
    db.add(user)
    await db.flush()
    return user


async def _session(db: AsyncSession, user: User) -> Session:
    s = Session(
        user_id=user.id,
        situation_id="hotel",
        interlocutor_id="receptionist",
        scene="Check-in at a hotel.",
        level="B1",
        accent="en-US",
    )
    db.add(s)
    await db.flush()
    return s


async def test_invalid_level_rejected(db_session: AsyncSession) -> None:
    db_session.add(User(id=uuid.uuid4(), email="a@example.com", level="Z9"))
    with pytest.raises(IntegrityError, match="ck_users_level_valid"):
        await db_session.flush()


async def test_invalid_accent_rejected(db_session: AsyncSession) -> None:
    db_session.add(User(id=uuid.uuid4(), email="b@example.com", accent="pt-BR"))
    with pytest.raises(IntegrityError, match="ck_users_accent_valid"):
        await db_session.flush()


@pytest.mark.parametrize("accuracy", [Decimal("-0.01"), Decimal("100.01")])
async def test_accuracy_out_of_range_rejected(db_session: AsyncSession, accuracy: Decimal) -> None:
    user = await _user(db_session)
    session = await _session(db_session, user)
    db_session.add(Turn(session_id=session.id, turn_index=0, ai_line="Hello", accuracy=accuracy))
    with pytest.raises(IntegrityError, match="ck_turns_accuracy_range"):
        await db_session.flush()


@pytest.mark.parametrize("accuracy", [Decimal(0), Decimal("100.00"), None])
async def test_accuracy_boundaries_accepted(
    db_session: AsyncSession, accuracy: Decimal | None
) -> None:
    user = await _user(db_session)
    session = await _session(db_session, user)
    db_session.add(Turn(session_id=session.id, turn_index=0, ai_line="Hello", accuracy=accuracy))
    await db_session.flush()


async def test_turn_index_unique_per_session(db_session: AsyncSession) -> None:
    user = await _user(db_session)
    session = await _session(db_session, user)
    db_session.add(Turn(session_id=session.id, turn_index=0, ai_line="Hello"))
    await db_session.flush()
    db_session.add(Turn(session_id=session.id, turn_index=0, ai_line="Again"))
    with pytest.raises(IntegrityError, match="uq_turns_session_id_turn_index"):
        await db_session.flush()


async def test_deleting_user_cascades_to_sessions_and_turns(db_session: AsyncSession) -> None:
    user = await _user(db_session)
    session = await _session(db_session, user)
    db_session.add_all(
        [
            Turn(session_id=session.id, turn_index=0, ai_line="Hello", reply_feedback={"a": 1}),
            Turn(session_id=session.id, turn_index=1, ai_line="How are you?"),
        ]
    )
    await db_session.flush()

    await db_session.delete(user)
    await db_session.flush()
    db_session.expunge_all()

    assert (await db_session.execute(select(Session))).scalars().all() == []
    assert (await db_session.execute(select(Turn))).scalars().all() == []
