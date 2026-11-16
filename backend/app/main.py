"""Ponto de entrada: factory da aplicação FastAPI."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.core.config import Settings, get_settings
from app.core.errors import register_error_handlers
from app.core.logging import setup_logging
from app.schemas.meta import Health


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    setup_logging(settings.log_level)

    app = FastAPI(
        title="Vocalize API",
        description=(
            "API do Vocalize: app para aprender inglês ouvindo e conversando. "
            "Fundação do backend; as funcionalidades chegam nas próximas fases."
        ),
        version="0.1.0",
    )

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

    app.include_router(v1_router)
    return app


app = create_app()
