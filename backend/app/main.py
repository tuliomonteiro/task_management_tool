"""FastAPI application bootstrap."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from app.api.v1.tasks import router as tasks_router
from app.core.config import settings
from app.core.handlers import register_exception_handlers
from app.db.base import Base
from app.db.session import engine
from app.models import task as task_models


def create_app(initialize_database: bool = True) -> FastAPI:
    """Application factory."""

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
        if initialize_database:
            # Ensure model metadata is loaded before creating tables.
            _ = task_models
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        yield

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
    )
    app.include_router(tasks_router)
    register_exception_handlers(app)
    return app


app = create_app()
