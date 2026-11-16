from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(create_app(), raise_server_exceptions=False) as c:
        yield c


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_api_v1_root(client: TestClient) -> None:
    response = client.get("/api/v1/")
    assert response.status_code == 200
    assert response.json() == {"name": "Vocalize API", "version": "v1"}


def test_unknown_route_uses_error_format(client: TestClient) -> None:
    response = client.get("/nao-existe")
    assert response.status_code == 404
    assert response.json() == {"error": {"code": "not_found", "message": "Recurso não encontrado."}}


def test_unexpected_error_hides_details() -> None:
    app = create_app()

    @app.get("/boom")
    async def boom() -> None:
        raise RuntimeError("segredo interno")

    with TestClient(app, raise_server_exceptions=False) as c:
        response = c.get("/boom")
    assert response.status_code == 500
    assert "segredo" not in response.text
    assert response.json()["error"]["code"] == "internal_error"


def test_validation_error_format() -> None:
    app = create_app()

    @app.get("/num/{n}")
    async def num(n: int) -> int:
        return n

    with TestClient(app) as c:
        response = c.get("/num/abc")
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_docs_title(client: TestClient) -> None:
    assert client.get("/openapi.json").json()["info"]["title"] == "Vocalize API"


def test_cors_allows_dev_frontend_ports(client: TestClient) -> None:
    for origin in ("http://localhost:5173", "http://localhost:5199"):
        r = client.get("/health", headers={"Origin": origin})
        assert r.headers["access-control-allow-origin"] == origin
    r = client.get("/health", headers={"Origin": "http://localhost:5200"})
    assert "access-control-allow-origin" not in r.headers
