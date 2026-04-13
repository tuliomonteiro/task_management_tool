import { ApiError, ApiErrorPayload } from "../types/api";
import { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from "../types/task";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return new ApiError(
      payload.error?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      payload.error?.details,
    );
  } catch {
    return new ApiError(`Request failed with status ${response.status}.`, response.status);
  }
}

async function request<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new ApiError("Unable to connect to the task API. Check that the backend is running.");
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<Task[]>(`/tasks${query}`);
}

export async function getTaskById(taskId: number): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`);
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(taskId: number, payload: UpdateTaskPayload): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(taskId: number): Promise<void> {
  await request<void>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
