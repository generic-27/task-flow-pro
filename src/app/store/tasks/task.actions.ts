// src/app/store/tasks/task.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task, TaskStatus, TaskPriority } from '@core/models/task.model';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    // Load Tasks
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    // Create Task
    'Create Task': props<{ task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    // Update Task
    'Update Task': props<{ taskId: string; changes: Partial<Task> }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string; taskId: string }>(),

    // Update Task Status (optimistic update)
    'Update Task Status': props<{ taskId: string; status: TaskStatus }>(),
    'Update Task Status Success': props<{ task: Task }>(),
    'Update Task Status Failure': props<{
      error: string;
      taskId: string;
      originalStatus: TaskStatus;
    }>(),

    // Delete Task
    'Delete Task': props<{ taskId: string }>(),
    'Delete Task Success': props<{ taskId: string }>(),
    'Delete Task Failure': props<{ error: string; taskId: string }>(),

    // Filters
    'Set Status Filter': props<{ status: TaskStatus | '' }>(),
    'Set Priority Filter': props<{ priority: TaskPriority | '' }>(),
    'Set Search Term': props<{ searchTerm: string }>(),
    'Clear Filters': emptyProps(),

    // UI State
    'Set Loading Task': props<{ taskId: string; isLoading: boolean }>(),
    'Clear UI State': emptyProps(),
  },
});
