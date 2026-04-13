import { TASK_STATUSES, TaskFormErrors, TaskFormValues } from "../types/task";

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const normalizedTitle = values.title.trim();

  if (!normalizedTitle) {
    errors.title = "Title is required.";
  }

  if (!TASK_STATUSES.includes(values.status)) {
    errors.status = "Status must be pending or completed.";
  }

  return errors;
}

export function hasValidationErrors(errors: TaskFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
