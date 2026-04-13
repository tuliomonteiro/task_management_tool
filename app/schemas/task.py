"""Pydantic schemas for task resources."""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class TaskStatusSchema(str, Enum):
    """Allowed task statuses in API contracts."""

    PENDING = "pending"
    COMPLETED = "completed"


class TaskBase(BaseModel):
    """Shared task fields."""

    title: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: TaskStatusSchema = TaskStatusSchema.PENDING


class TaskCreate(TaskBase):
    """Payload for creating a task."""


class TaskUpdate(BaseModel):
    """Payload for updating a task."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[TaskStatusSchema] = None

    @model_validator(mode="after")
    def validate_at_least_one_field(self) -> "TaskUpdate":
        """Ensure updates have at least one field."""
        if self.title is None and self.description is None and self.status is None:
            raise ValueError("At least one field must be provided for update.")
        return self


class TaskResponse(BaseModel):
    """Response model for a task."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str]
    status: TaskStatusSchema
    creation_date: datetime


class ErrorResponse(BaseModel):
    """Standardized API error structure."""

    error: Dict[str, Any]
