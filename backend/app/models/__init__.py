"""Models SQLAlchemy. Importar todos aqui garante que o Alembic os enxergue."""

from app.models.base import Base
from app.models.level_history import LevelHistory
from app.models.missed_word import MissedWord
from app.models.placement_attempt import PlacementAttempt
from app.models.session import Session
from app.models.turn import Turn
from app.models.user import User

__all__ = [
    "Base",
    "LevelHistory",
    "MissedWord",
    "PlacementAttempt",
    "Session",
    "Turn",
    "User",
]
