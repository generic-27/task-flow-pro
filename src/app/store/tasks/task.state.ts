// src/app/store/tasks/task.state.ts
import { EntityState } from '@ngrx/entity';
import { Task, TaskStatus, TaskPriority } from '@core/models/task.model';

export interface TaskState extends EntityState<Task> {
  // Loading states
  loading: boolean;
  error: string | null;

  // Individual task operations
  loadingTasks: Set<string>; // Track which tasks are being updated

  // Filters
  filters: {
    status: TaskStatus | '';
    priority: TaskPriority | '';
    searchTerm: string;
  };

  // UI state
  selectedTaskId: string | null;

  // Statistics (computed in selectors)
  lastUpdated: number | null;
}

export interface AppState {
  tasks: TaskState;
  // Add other feature states here as we build them
  // projects: ProjectState;
  // users: UserState;
}
