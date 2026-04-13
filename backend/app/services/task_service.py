"""Business logic layer for task operations."""

from typing import List, Optional

from app.core.exceptions import TaskNotFoundException
from app.models.task import Task, TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    """Task business service."""

    def __init__(self, repository: TaskRepository) -> None:
        self._repository = repository

    async def create_task(self, payload: TaskCreate) -> Task:
        task = Task(
            title=payload.title.strip(),
            description=payload.description,
            status=TaskStatus(payload.status.value),
        )
        return await self._repository.create(task)

    async def list_tasks(self, status: Optional[TaskStatus] = None) -> List[Task]:
        return await self._repository.list(status=status)

    async def get_task(self, task_id: int) -> Task:
        task = await self._repository.get_by_id(task_id)
        if task is None:
            raise TaskNotFoundException(f"Task with id {task_id} was not found.")
        return task

    async def update_task(self, task_id: int, payload: TaskUpdate) -> Task:
        task = await self.get_task(task_id)

        if payload.title is not None:
            task.title = payload.title.strip()
        if payload.description is not None:
            task.description = payload.description
        if payload.status is not None:
            task.status = TaskStatus(payload.status.value)

        return await self._repository.update(task)

    async def delete_task(self, task_id: int) -> None:
        task = await self.get_task(task_id)
        await self._repository.delete(task)
