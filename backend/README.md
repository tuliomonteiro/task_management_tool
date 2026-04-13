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
└── backend/
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
1. Move into backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
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

## AI Prompt History

### Initial Project Generation Prompt

```text
You are a senior backend engineer. Build a production-style backend project for a Task Management Tool using Python and FastAPI.

## Main goal
Create a professional backend API with clean architecture, strong typing, SQLAlchemy ORM, validation, global error handling, unit tests with PyTest, and clear documentation.

## Functional requirements
The system manages tasks with the following fields:
- id
- title
- description
- status (pending or completed)
- creation_date

Implement full CRUD for tasks:
- Create task
- Get all tasks
- Get task by id
- Update task
- Delete task

Also implement:
- Filter tasks by status
- Data validation
- Global error handling
- Unit tests with PyTest
- Good project documentation in README.md

## Technical requirements
Use:
- Python 3.12+
- FastAPI
- SQLAlchemy ORM
- Pydantic
- PyTest

Prefer:
- SQLAlchemy 2.x style
- SQLite for local development
- Dependency injection through FastAPI
- Layered / clean architecture
- Type hints everywhere
- Separation of concerns
- Professional code organization

## Architecture requirements
Use clean architecture principles and organize the code into layers such as:
- api / routers
- schemas
- domain or entities
- services / business logic
- repositories / data access
- db / database configuration
- core / shared config, exceptions, handlers
- tests

The business logic should not be mixed directly into the route handlers.
Route handlers should stay thin.
Repository layer should handle database access.
Service layer should contain business rules.

## Data model
Task fields:
- id: integer primary key
- title: string, required, not empty, reasonable max length
- description: string, optional or required depending on best practice, but validate properly
- status: enum with only "pending" and "completed"
- creation_date: datetime set automatically when created

## Validation rules
At minimum:
- title must not be empty
- title should have a max length
- status must only accept allowed enum values
- invalid payloads should return proper HTTP errors
- non-existent task IDs should return 404

## Error handling
Implement professional global error handling for:
- validation errors
- not found errors
- database-related errors
- unexpected internal errors

Return consistent JSON error responses.

## API requirements
Create RESTful endpoints such as:
- POST /tasks
- GET /tasks
- GET /tasks/{task_id}
- PUT /tasks/{task_id}
- DELETE /tasks/{task_id}
- GET /tasks?status=pending
- GET /tasks?status=completed

Use response models and proper status codes.

## Testing requirements
Create PyTest unit tests for:
- task creation
- get all tasks
- get task by id
- update task
- delete task
- filter by status
- validation failures
- task not found behavior

Keep tests clean and professional.
Use a test database setup isolated from production.

## Documentation requirements
Generate a high-quality README.md that includes:
- project overview
- architecture explanation
- tech stack
- setup instructions
- how to run locally
- how to run tests
- API endpoint summary
- example requests/responses
- explanation of design decisions
- future improvements

## Code quality requirements
- Strong typing everywhere
- Use docstrings where helpful
- Keep functions small and readable
- Avoid god files
- Use professional naming
- Keep imports clean
- Follow clean code and maintainability best practices

## Deliverables
Please generate:
1. Full project structure
2. All source files
3. Database setup
4. Models
5. Schemas
6. Repository layer
7. Service layer
8. Routes
9. Exception handling
10. Tests
11. requirements.txt
12. README.md

## Output format
First show the proposed folder structure.
Then generate each file with its full content.
Make sure the project runs correctly.

If needed, choose sensible defaults and explain them briefly in the README.
Favor clarity, maintainability, and backend professionalism over unnecessary complexity.
```

### Bug Confirmation Prompt

```text
I founded an edge case/bug can you confirm?

At the @app/schemas/task.py line 20 and 32 title have a min_length=1 rule but on the service @app/services/task_service.py line 19 and 38 it strips the titile, removing the spaces, so if I add a title in the payload of the POST AS for example "title": "  " it will accepts it in the task rule and then it will remove the spaces, saving it as a empty string, which I think we should do right? which was I asking it to confirm that this bug was really happening
```
