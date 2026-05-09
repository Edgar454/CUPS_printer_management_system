import os
# create required directories
os.environ.setdefault("LOG_FILE", "/tmp/test_api.log")
os.environ.setdefault("FILE_FOLDER", "/tmp/test_files")
os.environ.setdefault("CUPS_SERVER_URL", "localhost:631")
os.environ.setdefault("CUPS_USER", "admin")
os.environ.setdefault("CUPS_PASSWORD", "admin")
os.environ.setdefault("OTEL_SDK_DISABLED", "true")

os.makedirs("/tmp/test_files", exist_ok=True)

import pytest
import asyncpg
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from testcontainers.postgres import PostgresContainer
from contextlib import asynccontextmanager
from fastapi import FastAPI
from unittest.mock import patch,MagicMock, AsyncMock

from api.settings import Settings


# ─── spin up a real postgres container ───────────────────────────────────────

@pytest.fixture(scope="session")
def postgres_container():
    container = PostgresContainer(
        image="ghcr.io/edgar454/cups-database:latest",
        username="postgres",
        password="password",
        dbname="postgres"
    )
    container.with_env("API_PASSWORD", "test_password")
    container.with_env("WORKER_PASSWORD", "test_password")
    container.with_env("POSTGRES_EXPORTER_PASSWORD", "test_password")
    container.with_env("GRAFANA_USER_PASSWORD", "test_password")
    container.with_command(
        "postgres -c config_file=/etc/postgresql/postgresql.conf "
    )
    with container as pg:
        yield pg

@pytest_asyncio.fixture(scope="session")
async def db_pool(postgres_container):
    pool = await asyncpg.create_pool(
        host=postgres_container.get_container_host_ip(),
        port=postgres_container.get_exposed_port(5432),
        database="postgres",
        user="postgres",
        password="password",
    )
    yield pool
    await pool.close()

# ─── override lifespan to inject test DB and mock CUPS ───────────────────────
@pytest_asyncio.fixture(scope="session")
async def test_app(db_pool):
    from api.main import app

    mock_cups = MagicMock()
    mock_cups.deletePrinter = MagicMock(return_value=None)
    mock_cups.addPrinter = MagicMock(return_value=None)
    mock_cups.enablePrinter = MagicMock(return_value=None)
    mock_cups.acceptJobs = MagicMock(return_value=None)

    app.state.pool = db_pool
    app.state.cups_conn = mock_cups
    app.state.settings = Settings()

    with patch('api.routes.printers.create_cups_connection') as mock_connection:
        mock_connection.return_value = mock_cups
        yield app

@pytest_asyncio.fixture
async def client(test_app):
    async with AsyncClient(
        transport=ASGITransport(app=test_app),
        base_url="http://test"
    ) as c:
        yield c