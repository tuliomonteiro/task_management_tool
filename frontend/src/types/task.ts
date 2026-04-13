export const TASK_STATUSES = ["pending", "completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskFilter = TaskStatus | "all";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  creation_date: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  status: TaskStatus;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface TaskFormErrors {
  title?: string;
  status?: string;
}
