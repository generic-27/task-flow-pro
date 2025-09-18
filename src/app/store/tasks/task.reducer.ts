// src/app/store/tasks/task.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Task } from '@core/models/task.model';
import { TaskActions } from './task.actions';
import { TaskState } from './task.state';

// Entity adapter for normalized state management
export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: (task: Task) => task.id,
  sortComparer: (a: Task, b: Task) => {
    // Sort by priority first (urgent > high > medium > low), then by creation date
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }

    // If same priority, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  },
});

// Initial state
export const initialTaskState: TaskState = taskAdapter.getInitialState({
  loading: false,
  error: null,
  loadingTasks: new Set<string>(),
  filters: {
    status: '',
    priority: '',
    searchTerm: '',
  },
  selectedTaskId: null,
  lastUpdated: null,
});

// Reducer
export const taskReducer = createReducer(
  initialTaskState,

  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    }),
  ),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.createTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    }),
  ),

  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Task (optimistic update for status changes)
  on(TaskActions.updateTaskStatus, (state, { taskId, status }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.add(taskId);

    return taskAdapter.updateOne(
      {
        id: taskId,
        changes: {
          status,
          updatedAt: new Date(),
        },
      },
      {
        ...state,
        loadingTasks: newLoadingTasks,
        error: null,
      },
    );
  }),

  on(TaskActions.updateTaskStatusSuccess, (state, { task }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(task.id);

    return taskAdapter.updateOne(
      { id: task.id, changes: task },
      {
        ...state,
        loadingTasks: newLoadingTasks,
        lastUpdated: Date.now(),
      },
    );
  }),

  on(TaskActions.updateTaskStatusFailure, (state, { taskId, originalStatus, error }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(taskId);

    // Revert optimistic update
    return taskAdapter.updateOne(
      {
        id: taskId,
        changes: { status: originalStatus },
      },
      {
        ...state,
        loadingTasks: newLoadingTasks,
        error,
      },
    );
  }),

  // General Update Task
  on(TaskActions.updateTask, (state, { taskId }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.add(taskId);

    return {
      ...state,
      loadingTasks: newLoadingTasks,
      error: null,
    };
  }),

  on(TaskActions.updateTaskSuccess, (state, { task }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(task.id);

    return taskAdapter.updateOne(
      { id: task.id, changes: task },
      {
        ...state,
        loadingTasks: newLoadingTasks,
        lastUpdated: Date.now(),
      },
    );
  }),

  on(TaskActions.updateTaskFailure, (state, { taskId, error }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(taskId);

    return {
      ...state,
      loadingTasks: newLoadingTasks,
      error,
    };
  }),

  // Delete Task
  on(TaskActions.deleteTask, (state, { taskId }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.add(taskId);

    return {
      ...state,
      loadingTasks: newLoadingTasks,
      error: null,
    };
  }),

  on(TaskActions.deleteTaskSuccess, (state, { taskId }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(taskId);

    return taskAdapter.removeOne(taskId, {
      ...state,
      loadingTasks: newLoadingTasks,
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
      lastUpdated: Date.now(),
    });
  }),

  on(TaskActions.deleteTaskFailure, (state, { taskId, error }) => {
    const newLoadingTasks = new Set(state.loadingTasks);
    newLoadingTasks.delete(taskId);

    return {
      ...state,
      loadingTasks: newLoadingTasks,
      error,
    };
  }),

  // Filters
  on(TaskActions.setStatusFilter, (state, { status }) => ({
    ...state,
    filters: {
      ...state.filters,
      status,
    },
  })),

  on(TaskActions.setPriorityFilter, (state, { priority }) => ({
    ...state,
    filters: {
      ...state.filters,
      priority,
    },
  })),

  on(TaskActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    filters: {
      ...state.filters,
      searchTerm,
    },
  })),

  on(TaskActions.clearFilters, (state) => ({
    ...state,
    filters: {
      status: '',
      priority: '',
      searchTerm: '',
    },
  })),

  // UI State
  on(TaskActions.clearUIState, (state) => ({
    ...state,
    error: null,
    loadingTasks: new Set<string>(),
    selectedTaskId: null,
  })),
);
