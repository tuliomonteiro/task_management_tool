# Task Management Tool - FastAPI Backend

## Overview
This project is a production-style backend API for managing tasks.  
It provides full CRUD operations, task filtering by status, strong request validation, centralized error handling, and automated tests.

## Architecture
The project follows a clean, layered architecture:

- `app/api`: FastAPI routers (thin HTTP layer)
- `app/schemas`: Pydantic request/response contracts
- `app/models`: SQLAlchemy entities
- `app/repositories`: data access operations
- `app/services`: business rules and orchestration
- `app/db`: database base class, engine, and session dependency
- `app/core`: shared config, exceptions, and handlers
- `tests`: isolated API tests with a test database

### Request flow
`Router -> Service -> Repository -> Database`

This separation keeps route handlers lightweight and business logic testable.

## Tech Stack
- Python 3.12+
- FastAPI
- SQLAlchemy 2.x (async)
- SQLite (`aiosqlite`) for local development
- Pydantic v2
- PyTest

## Project Structure
```text
assuresoft_task_management_tool/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── tasks.py
│   ├── core/
│   │   ├── config.py
│   │   ├── exceptions.py
│   │   └── handlers.py
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   └── task.py
│   ├── repositories/
│   │   └── task_repository.py
│   ├── schemas/
│   │   └── task.py
│   ├── services/
│   │   └── task_service.py
│   └── main.py
├── tests/
│   ├── conftest.py
│   └── test_tasks.py
├── requirements.txt
└── README.md
```

## Setup
1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run Locally
Start the server:

```bash
uvicorn app.main:app --reload
```

API will be available at:
- `http://127.0.0.1:8000`
- OpenAPI docs: `http://127.0.0.1:8000/docs`

## Run Tests
```bash
pytest -q
```

The tests use a dedicated SQLite database file (`test_task_management.db`) with schema reset before every test.

## API Endpoints
- `POST /tasks` - Create task
- `GET /tasks` - List all tasks
- `GET /tasks/{task_id}` - Get task by ID
- `PUT /tasks/{task_id}` - Update task
- `DELETE /tasks/{task_id}` - Delete task
- `GET /tasks?status=pending` - Filter pending tasks
- `GET /tasks?status=completed` - Filter completed tasks

## Example Requests and Responses

### Create task
**Request**
```http
POST /tasks
Content-Type: application/json

{
  "title": "Write integration tests",
  "description": "Cover key API flows",
  "status": "pending"
}
```

**Response (201)**
```json
{
  "id": 1,
  "title": "Write integration tests",
  "description": "Cover key API flows",
  "status": "pending",
  "creation_date": "2026-04-13T18:12:00"
}
```

### Validation failure
**Response (422)**
```json
{
  "error": {
    "type": "validation_error",
    "message": "Request validation failed.",
    "details": [
      {
        "type": "string_too_short",
        "loc": ["body", "title"],
        "msg": "String should have at least 1 character",
        "input": ""
      }
    ]
  }
}
```

### Not found
**Response (404)**
```json
{
  "error": {
    "type": "not_found",
    "message": "Task with id 999 was not found.",
    "details": null
  }
}
```

## Design Decisions
- Async SQLAlchemy (`AsyncSession`) is used to align with FastAPI async execution.
- Repository + Service layers separate persistence from business behavior.
- Global exception handlers produce consistent error payloads.
- Pydantic schemas enforce input constraints and strong typing.
- SQLite is used for local simplicity; architecture supports easy migration to PostgreSQL.

## Future Improvements
- Add pagination and sorting for task list endpoints.
- Add Alembic migrations for schema evolution.
- Add authentication/authorization.
- Add structured logging and metrics.
- Add Docker and CI pipeline integration.
