"""Data access layer for tasks."""

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskStatus


class TaskRepository:
    """Repository for task persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, task: Task) -> Task:
        self._session.add(task)
        await self._session.commit()
        await self._session.refresh(task)
        return task

    async def list(self, status: Optional[TaskStatus] = None) -> List[Task]:
        stmt = select(Task)
        if status is not None:
            stmt = stmt.where(Task.status == status)
        result = await self._session.execute(stmt.order_by(Task.id))
        return list(result.scalars().all())

    async def get_by_id(self, task_id: int) -> Optional[Task]:
        return await self._session.get(Task, task_id)

    async def update(self, task: Task) -> Task:
        await self._session.commit()
        await self._session.refresh(task)
        return task

    async def delete(self, task: Task) -> None:
        await self._session.delete(task)
        await self._session.commit()
