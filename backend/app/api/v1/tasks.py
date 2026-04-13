"""Task API routes."""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.models.task import TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskResponse, TaskStatusSchema, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_service(session: AsyncSession = Depends(get_session)) -> TaskService:
    """Build a task service instance using request scoped dependencies."""
    repository = TaskRepository(session)
    return TaskService(repository)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    service: TaskService = Depends(get_task_service),
) -> TaskResponse:
    task = await service.create_task(payload)
    return TaskResponse.model_validate(task)


@router.get("", response_model=list[TaskResponse], status_code=status.HTTP_200_OK)
async def list_tasks(
    status_filter: Optional[TaskStatusSchema] = Query(default=None, alias="status"),
    service: TaskService = Depends(get_task_service),
) -> List[TaskResponse]:
    status = TaskStatus(status_filter.value) if status_filter else None
    tasks = await service.list_tasks(status=status)
    return [TaskResponse.model_validate(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def get_task(task_id: int, service: TaskService = Depends(get_task_service)) -> TaskResponse:
    task = await service.get_task(task_id)
    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def update_task(
    task_id: int,
    payload: TaskUpdate,
    service: TaskService = Depends(get_task_service),
) -> TaskResponse:
    task = await service.update_task(task_id, payload)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_task(task_id: int, service: TaskService = Depends(get_task_service)) -> Response:
    await service.delete_task(task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
