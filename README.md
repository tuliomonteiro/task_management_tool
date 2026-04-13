# Task Management Tool

## Overview
This repository contains a full-stack Task Management Tool with a FastAPI backend and a React frontend.

The backend provides a REST API for creating, listing, updating, deleting, and filtering tasks. The frontend consumes that API and provides a clean user interface for managing task records.

Each project has its own README with deeper setup, architecture, and implementation details:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Project Structure
```text
task_management_tool/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
└── README.md
```

## Backend
The backend is built with FastAPI, SQLAlchemy, Pydantic, and PyTest.

Main capabilities:
- Create tasks
- List all tasks
- Get a task by ID
- Update tasks
- Delete tasks
- Filter tasks by `pending` or `completed` status

Run locally:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at:
```text
http://127.0.0.1:8000
```

OpenAPI docs:
```text
http://127.0.0.1:8000/docs
```

For more details, see [backend/README.md](backend/README.md).

## Frontend
The frontend is built with React, TypeScript, Vite, and the Fetch API.

Main capabilities:
- List tasks
- Create tasks
- Edit tasks
- Delete tasks
- Filter by status
- Display task status and creation date
- Handle loading, empty, success, and error states

Run locally:
```bash
cd frontend
npm install
npm run dev
```

The frontend usually runs at:
```text
http://127.0.0.1:5173
```

During local development, Vite proxies `/tasks` requests to the FastAPI backend at `http://127.0.0.1:8000`.

For more details, see [frontend/README.md](frontend/README.md).

## Running the Full Application
Start the backend first:
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

In a second terminal, start the frontend:
```bash
cd frontend
npm install
npm run dev
```

Then open:
```text
http://127.0.0.1:5173
```

## Testing and Verification
Backend tests:
```bash
cd backend
pytest -q
```

Frontend build and lint checks:
```bash
cd frontend
npm run lint
npm run build
```

## Documentation
This root README is a general entry point for the full-stack project. Use the project-specific READMEs for more complete information:
- [backend/README.md](backend/README.md) for backend architecture, setup, API examples, and tests
- [frontend/README.md](frontend/README.md) for frontend architecture, setup, environment variables, and UI implementation notes
