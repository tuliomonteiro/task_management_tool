"""Shared test fixtures."""

from collections.abc import Generator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_session
from app.main import create_app

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_task_management.db"

test_engine = create_async_engine(TEST_DATABASE_URL, future=True, echo=False)
TestingSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)
test_app = create_app(initialize_database=False)


@pytest_asyncio.fixture(autouse=True)
async def reset_database() -> None:
    """Reset database schema before each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    """Create a test client with an overridden DB dependency."""

    async def override_get_session():
        async with TestingSessionLocal() as session:
            yield session

    test_app.dependency_overrides[get_session] = override_get_session

    with TestClient(test_app) as test_client:
        yield test_client

    test_app.dependency_overrides.clear()
