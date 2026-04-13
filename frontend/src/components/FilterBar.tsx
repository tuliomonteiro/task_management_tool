import { TaskFilter } from "../types/task";

interface FilterBarProps {
  selectedFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  disabled?: boolean;
}

const FILTER_OPTIONS: Array<{ value: TaskFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function FilterBar({ selectedFilter, onFilterChange, disabled = false }: FilterBarProps) {
  return (
    <div className="filter-bar" aria-label="Task status filters">
      {FILTER_OPTIONS.map((option) => (
        <button
          className={`filter-button${selectedFilter === option.value ? " filter-button--active" : ""}`}
          disabled={disabled}
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
