"""Roteador da versão 1 da API."""

from fastapi import APIRouter

from app.schemas.meta import ApiInfo

API_NAME = "Vocalize API"
API_VERSION = "v1"

router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.get("/", response_model=ApiInfo)
async def api_info() -> ApiInfo:
    return ApiInfo(name=API_NAME, version=API_VERSION)
