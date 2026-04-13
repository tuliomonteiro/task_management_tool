import { Task, TaskFormValues } from "../types/task";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isSaving: boolean;
  onUpdate: (taskId: number, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

export function TaskList({ tasks, isLoading, isSaving, onUpdate, onDelete }: TaskListProps) {
  if (isLoading) {
    return <p className="empty-state">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found for this view.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard isSaving={isSaving} key={task.id} onDelete={onDelete} onUpdate={onUpdate} task={task} />
      ))}
    </div>
  );
}
