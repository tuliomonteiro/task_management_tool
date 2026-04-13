import { useMemo, useState } from "react";

import { Task, TaskFormValues } from "../types/task";
import { formatTaskDate } from "../utils/date";
import { StatusBadge } from "./StatusBadge";
import { TaskForm } from "./TaskForm";

interface TaskCardProps {
  task: Task;
  isSaving: boolean;
  onUpdate: (taskId: number, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export function TaskCard({ task, isSaving, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const displayTitle = task.title.trim() || "Untitled task";

  const initialValues = useMemo<TaskFormValues>(
    () => ({
      title: task.title,
      description: task.description ?? "",
      status: task.status,
    }),
    [task.description, task.status, task.title],
  );

  async function handleUpdate(values: TaskFormValues) {
    await onUpdate(task.id, values);
    setIsEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${displayTitle}"?`);

    if (!confirmed) {
      return;
    }

    await onDelete(task.id);
  }

  if (isEditing) {
    return (
      <article className="task-card">
        <TaskForm
          initialValues={initialValues}
          isSubmitting={isSaving}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleUpdate}
          submitLabel="Update task"
        />
      </article>
    );
  }

  return (
    <article className="task-card">
      <div className="task-card__content">
        <div className="task-card__title-row">
          <h3>{displayTitle}</h3>
          <StatusBadge status={task.status} />
        </div>

        <p className="task-card__description">{task.description || "No description provided."}</p>

        <p className="task-card__date">
          Created <time dateTime={task.creation_date}>{formatTaskDate(task.creation_date)}</time>
        </p>
      </div>

      <div className="task-card__actions">
        <button className="button button--secondary" disabled={isSaving} onClick={() => setIsEditing(true)} type="button">
          Edit
        </button>
        <button className="button button--danger" disabled={isSaving} onClick={handleDelete} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}
