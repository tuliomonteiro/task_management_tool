import { AppHeader } from "../components/AppHeader";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { FilterBar } from "../components/FilterBar";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";
import { TaskFormValues } from "../types/task";

export function TaskDashboard() {
  const {
    tasks,
    filter,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  async function handleCreate(values: TaskFormValues) {
    await createTask({
      title: values.title,
      description: values.description || null,
      status: values.status,
    });
  }

  async function handleUpdate(taskId: number, values: TaskFormValues) {
    await updateTask(taskId, {
      title: values.title,
      description: values.description || null,
      status: values.status,
    });
  }

  return (
    <main className="app-shell">
      <AppHeader />

      <section className="layout-grid" aria-label="Task workspace">
        <aside className="panel create-panel">
          <div className="section-heading">
            <p className="eyebrow">New task</p>
            <h2>Create a task</h2>
          </div>
          <TaskForm isSubmitting={isSaving} onSubmit={handleCreate} submitLabel="Create task" />
        </aside>

        <section className="tasks-panel">
          <div className="tasks-panel__header">
            <div className="section-heading">
              <p className="eyebrow">Task list</p>
              <h2>Current work</h2>
            </div>
            <FilterBar disabled={isLoading || isSaving} onFilterChange={setFilter} selectedFilter={filter} />
          </div>

          {errorMessage ? <FeedbackMessage message={errorMessage} tone="error" /> : null}
          {successMessage ? <FeedbackMessage message={successMessage} tone="success" /> : null}

          <TaskList
            isLoading={isLoading}
            isSaving={isSaving}
            onDelete={deleteTask}
            onUpdate={handleUpdate}
            tasks={tasks}
          />
        </section>
      </section>
    </main>
  );
}
