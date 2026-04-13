"""Application configuration."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_PATH = BASE_DIR / "task_management.db"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "Task Management Tool API"
    app_version: str = "1.0.0"
    database_url: str = f"sqlite+aiosqlite:///{DEFAULT_SQLITE_PATH}"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
