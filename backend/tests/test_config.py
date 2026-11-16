import pytest

from app.core.config import Settings


def test_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    for var in ("APP_ENV", "CORS_ORIGINS", "LOG_LEVEL"):
        monkeypatch.delenv(var, raising=False)
    settings = Settings(_env_file=None)
    assert settings.app_env == "development"
    assert settings.log_level == "INFO"
    assert settings.cors_origins == []
    assert settings.cors_origin_regex is not None


def test_cors_origins_from_comma_separated_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "https://a.com, https://b.com")
    assert Settings(_env_file=None).cors_origins == ["https://a.com", "https://b.com"]


def test_production_has_no_dev_regex(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "production")
    assert Settings(_env_file=None).cors_origin_regex is None
