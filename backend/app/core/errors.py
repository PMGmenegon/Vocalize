"""Formato padrão de erro: {"error": {"code": "...", "message": "..."}}."""

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

_HTTP_CODES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
    422: "validation_error",
    429: "too_many_requests",
}


def error_response(
    status_code: int, code: str, message: str, details: Any | None = None
) -> JSONResponse:
    body: dict[str, Any] = {"code": code, "message": message}
    if details is not None:
        body["details"] = details
    return JSONResponse(status_code=status_code, content={"error": body})


async def http_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, StarletteHTTPException)
    code = _HTTP_CODES.get(exc.status_code, "http_error")
    message = "Recurso não encontrado." if exc.status_code == 404 else str(exc.detail)
    return error_response(exc.status_code, code, message)


async def validation_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, RequestValidationError)
    details = jsonable_encoder(
        [{"loc": e["loc"], "msg": e["msg"], "type": e["type"]} for e in exc.errors()]
    )
    return error_response(422, "validation_error", "Dados inválidos.", details)


async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.error("Erro inesperado", exc_info=exc)
    return error_response(500, "internal_error", "Erro interno do servidor.")


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
