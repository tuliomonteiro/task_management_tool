import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "../types/api";
import { CreateTaskPayload, Task, TaskFilter, TaskStatus, UpdateTaskPayload } from "../types/task";
import * as taskService from "../services/taskService";

interface UseTasksResult {
  tasks: Task[];
  filter: TaskFilter;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  setFilter: (filter: TaskFilter) => void;
  clearMessages: () => void;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (taskId: number, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function toApiStatus(filter: TaskFilter): TaskStatus | undefined {
  return filter === "all" ? undefined : filter;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeStatus = useMemo(() => toApiStatus(filter), [filter]);

  const clearMessages = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const refreshTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextTasks = await taskService.getTasks(activeStatus);
      setTasks(nextTasks);
    } catch (error) {
      setErrorMessage(toUserMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const createTask = useCallback(
    async (payload: CreateTaskPayload) => {
      setIsSaving(true);
      clearMessages();

      try {
        await taskService.createTask(payload);
        setSuccessMessage("Task created.");
        await refreshTasks();
      } catch (error) {
        setErrorMessage(toUserMessage(error));
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [clearMessages, refreshTasks],
  );

  const updateTask = useCallback(
    async (taskId: number, payload: UpdateTaskPayload) => {
      setIsSaving(true);
      clearMessages();

      try {
        await taskService.updateTask(taskId, payload);
        setSuccessMessage("Task updated.");
        await refreshTasks();
      } catch (error) {
        setErrorMessage(toUserMessage(error));
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [clearMessages, refreshTasks],
  );

  const deleteTask = useCallback(
    async (taskId: number) => {
      setIsSaving(true);
      clearMessages();

      try {
        await taskService.deleteTask(taskId);
        setSuccessMessage("Task deleted.");
        await refreshTasks();
      } catch (error) {
        setErrorMessage(toUserMessage(error));
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [clearMessages, refreshTasks],
  );

  return {
    tasks,
    filter,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    setFilter,
    clearMessages,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
}
