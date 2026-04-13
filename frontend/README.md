# Task Management Tool Frontend

## Overview
This is a production-style React frontend for the Task Management Tool FastAPI backend. It supports listing, creating, editing, deleting, and filtering tasks by status with typed API integration, local form validation, loading states, empty states, and user-friendly error handling.

## Tech Stack
- React
- TypeScript
- Vite
- Fetch API
- CSS modules by folder convention through a single global stylesheet
- ESLint

## Setup
From the repository root:

```bash
cd frontend
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

The default value is empty, which makes the frontend call same-origin `/tasks` routes. During local Vite development, `vite.config.ts` proxies `/tasks` to the FastAPI backend at `http://127.0.0.1:8000`.

```bash
VITE_API_BASE_URL=
```

## Run Locally
Start the FastAPI backend first, from the backend directory:

```bash
uvicorn app.main:app --reload
```

Then start the frontend:

```bash
cd frontend
npm run dev
```

Vite will print the local frontend URL, usually `http://localhost:5173`.

## Build
```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL for the FastAPI backend. Leave empty for Vite's local `/tasks` proxy. | Empty |

The service layer strips a trailing slash from the base URL, so both `https://api.example.com` and `https://api.example.com/` work. If you set a full backend URL in the browser, the backend must allow that frontend origin through CORS.

## API Integration
API access is centralized in `src/services/taskService.ts`.

Supported service functions:
- `getTasks(status?)`
- `getTaskById(taskId)`
- `createTask(payload)`
- `updateTask(taskId, payload)`
- `deleteTask(taskId)`

Expected backend endpoints:
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `PUT /tasks/{task_id}`
- `DELETE /tasks/{task_id}`
- `GET /tasks?status=pending`
- `GET /tasks?status=completed`

The frontend expects task objects with:
- `id`
- `title`
- `description`
- `status`
- `creation_date`

## Project Structure
```text
frontend/
├── .env.example
├── .cursorrules
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── AppHeader.tsx
    │   ├── FeedbackMessage.tsx
    │   ├── FilterBar.tsx
    │   ├── StatusBadge.tsx
    │   ├── TaskCard.tsx
    │   ├── TaskForm.tsx
    │   └── TaskList.tsx
    ├── hooks/
    │   └── useTasks.ts
    ├── pages/
    │   └── TaskDashboard.tsx
    ├── services/
    │   └── taskService.ts
    ├── styles/
    │   └── global.css
    ├── types/
    │   ├── api.ts
    │   └── task.ts
    └── utils/
        ├── date.ts
        └── taskValidation.ts
```

## Design Notes
- Business logic and API orchestration live in `useTasks`.
- HTTP requests are centralized in `taskService`.
- Task and API contracts are typed in `src/types`.
- Form validation is isolated in `src/utils/taskValidation.ts`.
- Date formatting is isolated in `src/utils/date.ts`.
- UI components stay small and focused on rendering.

## Future Improvements
- Add pagination and sorting when the backend supports them.
- Add optimistic updates for faster perceived performance.
- Add automated component tests with React Testing Library.
- Add toast notifications if the product grows beyond one page.
- Add authentication-aware API handling if protected endpoints are introduced.

## Prompt History

### Initial Frontend Generation Prompt

```text
You are a senior frontend engineer. Build a production-style React frontend for a Task Management Tool that consumes an existing FastAPI backend API.

## Main goal
Create a professional frontend application using React that connects to a FastAPI backend for task management. The frontend must be clean, strongly typed, maintainable, and structured in a scalable way.

## Backend context
The backend already exposes a REST API for tasks with these capabilities:
- Create task
- Get all tasks
- Get task by id
- Update task
- Delete task
- Filter tasks by status

Task model:
- id
- title
- description
- status ("pending" or "completed")
- creation_date

Expected endpoints:
- POST /tasks
- GET /tasks
- GET /tasks/{task_id}
- PUT /tasks/{task_id}
- DELETE /tasks/{task_id}
- GET /tasks?status=pending
- GET /tasks?status=completed

## Technical requirements
Use:
- React
- TypeScript
- Vite
- Axios or fetch for API calls
- React hooks
- Clean folder structure
- Strong typing everywhere

Prefer:
- Functional components
- Custom hooks for data access when appropriate
- Reusable UI components
- Separation between UI, services, types, and state logic
- Simple but professional styling
- Good UX for loading, errors, and empty states

## Functional requirements
Build a frontend with these features:
1. List all tasks
2. Create a task
3. Edit a task
4. Delete a task
5. Filter tasks by status
6. View clear status for each task
7. Show creation date in a user-friendly way
8. Handle loading states
9. Handle API errors gracefully
10. Validate form inputs before submission

## UI requirements
Create a simple and professional UI with:
- A page header
- A task creation form
- A task list/table/cards section
- Filter controls for status
- Buttons/actions for edit and delete
- Feedback for success/error states
- Empty state when there are no tasks

The app does not need to be overly fancy, but it should look organized and professional.

## Architecture requirements
Use a scalable frontend structure such as:
- components
- pages
- services
- hooks
- types
- utils
- styles

Keep business logic out of presentational components as much as possible.
API access should be centralized in a service layer.
Types should be defined explicitly and reused consistently.

## Form requirements
The task form should support:
- title
- description
- status

Validation rules:
- title is required
- title must not be blank
- status must only allow pending/completed
- show clear validation messages

Support both create and edit flows.

## API integration requirements
Create a dedicated API service for task operations:
- getTasks
- getTaskById
- createTask
- updateTask
- deleteTask
- optionally getTasksByStatus or support filtering through query params

Use an environment variable for the API base URL.

## Error handling requirements
Handle:
- network errors
- validation errors
- unexpected API failures

Show user-friendly messages in the UI.
Do not crash the app on failed requests.

## State management
Use local React state and hooks unless a more advanced solution is truly necessary.
Do not introduce unnecessary complexity.
Keep the state logic clean and understandable.

## Code quality requirements
- Strong typing everywhere
- No use of any unless absolutely unavoidable
- Clean and small components
- Reusable patterns
- Descriptive names
- Professional folder organization
- Avoid overly large files
- Write code that is easy to extend later

## Deliverables
Please generate:
1. Full project structure
2. All source files
3. API service layer
4. Type definitions
5. Reusable components
6. Main page implementation
7. Styling
8. .env.example
9. README.md

## Documentation requirements
Generate a high-quality README.md that includes:
- project overview
- tech stack
- setup instructions
- how to run locally
- environment variables
- how the frontend connects to the API
- project structure
- possible future improvements

## Output format
First show the proposed folder structure.
Then generate each file with full content.
Ensure the project is internally consistent and runnable.

Important:
- Do not put everything in one file
- Do not skip TypeScript typing
- Do not skip error handling
- Do not skip README
- Make the project feel like a real professional frontend codebase
- Keep the design simple, clean, and portfolio-worthy
```
