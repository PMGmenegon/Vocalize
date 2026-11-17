"""Schemas de metadados da API."""

from pydantic import BaseModel


class ApiInfo(BaseModel):
    name: str
    version: str


class Health(BaseModel):
    status: str


class Ready(BaseModel):
    status: str
