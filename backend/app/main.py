"""Ponto de entrada: factory da aplicação FastAPI."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import router as v1_router
from app.core.config import Settings, get_settings
from app.core.database import DbSession, create_engine, create_session_factory
from app.core.errors import error_response, register_error_handlers
from app.core.logging import setup_logging
from app.schemas.meta import Health, Ready

logger = logging.getLogger(__name__)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    setup_logging(settings.log_level)

    engine = create_engine(settings)

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        yield
        await engine.dispose()  # fecha o pool de conexões no encerramento

    app = FastAPI(
        lifespan=lifespan,
        title="Vocalize API",
        description=(
            "API do Vocalize: app para aprender inglês ouvindo e conversando. "
            "Fundação do backend; as funcionalidades chegam nas próximas fases."
        ),
        version="0.1.0",
    )

    app.state.engine = engine
    app.state.session_factory = create_session_factory(engine)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(app)

    @app.get("/health", response_model=Health, tags=["monitoramento"])
    async def health() -> Health:
        return Health(status="ok")

    @app.get(
        "/health/ready",
        response_model=Ready,
        tags=["monitoramento"],
        responses={503: {"description": "Banco de dados indisponível."}},
    )
    async def ready(db: DbSession) -> Ready | JSONResponse:
        try:
            await db.execute(text("SELECT 1"))
        except (SQLAlchemyError, OSError):
            logger.warning("Readiness falhou: banco indisponível", exc_info=True)
            return error_response(503, "service_unavailable", "Banco de dados indisponível.")
        return Ready(status="ready")

    app.include_router(v1_router)
    return app


app = create_app()
