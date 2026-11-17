"""Configuração da aplicação, lida de variáveis de ambiente e de backend/.env."""

import json
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

# O frontend (Vite) usa a porta 5173 e sobe para a próxima livre: 5173 a 5199.
DEV_CORS_ORIGIN_REGEX = r"^http://localhost:(517[3-9]|518\d|519\d)$"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: Literal["development", "production", "test"] = "development"
    # Aceita lista separada por vírgulas (a,b) ou JSON.
    cors_origins: Annotated[list[str], NoDecode] = []
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    # Formato: postgresql+asyncpg://usuario:senha@host:porta/banco
    database_url: str = "postgresql+asyncpg://vocalize:vocalize_dev@localhost:5432/vocalize"
    db_pool_size: int = 5
    db_max_overflow: int = 10

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                return json.loads(text)
            return [item.strip() for item in text.split(",") if item.strip()]
        return value

    @field_validator("log_level", mode="before")
    @classmethod
    def _upper_level(cls, value: object) -> object:
        return value.upper() if isinstance(value, str) else value

    @property
    def cors_origin_regex(self) -> str | None:
        """Em desenvolvimento, aceita o frontend em http://localhost:5173-5199."""
        return DEV_CORS_ORIGIN_REGEX if self.app_env == "development" else None


@lru_cache
def get_settings() -> Settings:
    return Settings()
