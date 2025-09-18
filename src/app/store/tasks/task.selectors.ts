// src/app/store/tasks/task.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';
import { taskAdapter } from './task.reducer';
import { Task, TaskStatus } from '@core/models/task.model';

// Feature selector
export const selectTaskState = createFeatureSelector<TaskState>('tasks');

// Entity selectors
const { selectIds, selectEntities, selectAll, selectTotal } = taskAdapter.getSelectors();

// Basic selectors
export const selectAllTasks = createSelector(selectTaskState, selectAll);
export const selectTaskEntities = createSelector(selectTaskState, selectEntities);
export const selectTaskIds = createSelector(selectTaskState, selectIds);
export const selectTotalTasks = createSelector(selectTaskState, selectTotal);

// Loading and error selectors
export const selectTasksLoading = createSelector(selectTaskState, (state) => state.loading);

export const selectTasksError = createSelector(selectTaskState, (state) => state.error);

export const selectLoadingTasks = createSelector(selectTaskState, (state) => state.loadingTasks);

// Filter selectors
export const selectTaskFilters = createSelector(selectTaskState, (state) => state.filters);

export const selectStatusFilter = createSelector(selectTaskFilters, (filters) => filters.status);

export const selectPriorityFilter = createSelector(
  selectTaskFilters,
  (filters) => filters.priority,
);

export const selectSearchTerm = createSelector(selectTaskFilters, (filters) => filters.searchTerm);

// UI selectors
export const selectSelectedTaskId = createSelector(
  selectTaskState,
  (state) => state.selectedTaskId,
);

export const selectSelectedTask = createSelector(
  selectTaskEntities,
  selectSelectedTaskId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null),
);

export const selectLastUpdated = createSelector(selectTaskState, (state) => state.lastUpdated);

// Complex filtered selectors
export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => {
    let filtered = tasks;

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    return filtered;
  },
);

// Task statistics selectors
export const selectTaskStats = createSelector(selectAllTasks, (tasks) => {
  const now = new Date();

  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === TaskStatus.DONE).length,
    inProgress: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
    inReview: tasks.filter((task) => task.status === TaskStatus.IN_REVIEW).length,
    todo: tasks.filter((task) => task.status === TaskStatus.TODO).length,
    overdue: tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== TaskStatus.DONE,
    ).length,
  };
});

// Grouped tasks by status
export const selectTasksByStatus = createSelector(selectAllTasks, (tasks) => {
  return tasks.reduce(
    (acc, task) => {
      const status = task.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>,
  );
});

// Recent tasks (created in last 7 days)
export const selectRecentTasks = createSelector(selectAllTasks, (tasks) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return tasks.filter((task) => new Date(task.createdAt) >= sevenDaysAgo);
});

// Overdue tasks
export const selectOverdueTasks = createSelector(selectAllTasks, (tasks) => {
  const now = new Date();
  return tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== TaskStatus.DONE,
  );
});

// Tasks by assignee
export const selectTasksByAssignee = createSelector(selectAllTasks, (tasks) => {
  return tasks.reduce(
    (acc, task) => {
      const assigneeId = task.assigneeId || 'unassigned';
      if (!acc[assigneeId]) {
        acc[assigneeId] = [];
      }
      acc[assigneeId].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );
});

// Task loading state for specific task
export const selectTaskLoading = (taskId: string) =>
  createSelector(selectLoadingTasks, (loadingTasks) => loadingTasks.has(taskId));

// Check if any tasks are loading
export const selectAnyTasksLoading = createSelector(
  selectLoadingTasks,
  selectTasksLoading,
  (loadingTasks, globalLoading) => globalLoading || loadingTasks.size > 0,
);

// Task by ID selector factory
export const selectTaskById = (taskId: string) =>
  createSelector(selectTaskEntities, (entities) => entities[taskId]);
