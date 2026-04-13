import { FormEvent, useEffect, useState } from "react";

import { TaskFormErrors, TaskFormValues } from "../types/task";
import { hasValidationErrors, validateTaskForm } from "../utils/taskValidation";

interface TaskFormProps {
  initialValues?: TaskFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const EMPTY_FORM_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "pending",
};

export function TaskForm({
  initialValues = EMPTY_FORM_VALUES,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateTaskForm(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });

    if (!onCancel) {
      setValues(EMPTY_FORM_VALUES);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="task-title">Title</label>
        <input
          aria-describedby={errors.title ? "task-title-error" : undefined}
          aria-invalid={Boolean(errors.title)}
          disabled={isSubmitting}
          id="task-title"
          maxLength={120}
          onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          placeholder="Write release notes"
          type="text"
          value={values.title}
        />
        {errors.title ? (
          <p className="field-error" id="task-title-error">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          disabled={isSubmitting}
          id="task-description"
          maxLength={1000}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          placeholder="Add the important details"
          rows={4}
          value={values.description}
        />
      </div>

      <div className="field-group">
        <label htmlFor="task-status">Status</label>
        <select
          aria-describedby={errors.status ? "task-status-error" : undefined}
          aria-invalid={Boolean(errors.status)}
          disabled={isSubmitting}
          id="task-status"
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              status: event.target.value === "completed" ? "completed" : "pending",
            }))
          }
          value={values.status}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status ? (
          <p className="field-error" id="task-status-error">
            {errors.status}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button className="button button--secondary" disabled={isSubmitting} onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
        <button className="button button--primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
