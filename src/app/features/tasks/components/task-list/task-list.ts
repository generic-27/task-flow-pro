import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  PriorityOptionData,
  StatusOptionData,
  Task,
  TaskPriority,
  TaskStatus,
} from '@app/core/models/task.model';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, TaskService } from '@app/core';
import { LoadingSpinner } from '@app/shared';
import { TaskItem } from '@features/tasks';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [LoadingSpinner, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit, OnDestroy {
  private taskService = inject(TaskService);

  // Signal state
  loading = signal(true);
  tasks = signal<Task[]>([]);
  selectedStatus = signal<TaskStatus | ''>('');
  selectedPriority = signal<TaskPriority | ''>('');
  searchTerm = signal('');

  // Loading states for individual operations
  updatingTaskId = signal<string | null>(null);
  deletingTaskId = signal<string | null>(null);

  private destroy$ = new Subject<void>();

  // Filter options
  readonly statusOptions: StatusOptionData[] = STATUS_OPTIONS;
  readonly priorityOptions: PriorityOptionData[] = PRIORITY_OPTIONS;

  // Computed signals for derived state
  filteredTasks = computed(() => {
    let filtered = this.tasks();

    if (this.selectedStatus()) {
      filtered = filtered.filter((task) => task.status === this.selectedStatus());
    }

    if (this.selectedPriority()) {
      filtered = filtered.filter((task) => task.priority === this.selectedPriority());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    return filtered;
  });

  taskStats = computed(() => {
    const allTasks = this.tasks();
    const now = new Date();

    return {
      total: allTasks.length,
      completed: allTasks.filter((task) => task.status === TaskStatus.DONE).length,
      inProgress: allTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
      overdue: allTasks.filter(
        (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== TaskStatus.DONE,
      ).length,
    };
  });

  emptyStateMessage = computed(() => {
    if (this.selectedStatus() || this.selectedPriority() || this.searchTerm()) {
      return 'Try adjusting your filters to see more tasks.';
    }
    return 'Create your first task to get started.';
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value as TaskStatus | '');
  }

  onPriorityFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPriority.set(select.value as TaskPriority | '');
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onTaskStatusChange(event: { taskId: string; status: TaskStatus }): void {
    this.updatingTaskId.set(event.taskId);

    this.taskService
      .updateTaskStatus(event.taskId, event.status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.updatingTaskId.set(null)),
      )
      .subscribe({
        next: () => {
          // Update local state on success
          this.tasks.update((tasks) =>
            tasks.map((task) =>
              task.id === event.taskId
                ? { ...task, status: event.status, updatedAt: new Date() }
                : task,
            ),
          );
        },
        error: (error) => {
          console.error('Failed to update task status:', error);
          // In a real app, you'd show an error notification
          // Could revert the UI change here if needed
        },
      });
  }

  onEditTask(taskId: string): void {
    console.log('Edit task:', taskId);
    // In a real app, this would open an edit dialog
    // You could use the taskService.getTaskById(taskId) to fetch details
  }

  onDeleteTask(taskId: string): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.deletingTaskId.set(taskId);

    this.taskService
      .deleteTask(taskId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.deletingTaskId.set(null)),
      )
      .subscribe({
        next: () => {
          // Update local state on success
          this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
        },
        error: (error) => {
          console.error('Failed to delete task:', error);
          // In a real app, you'd show an error notification
        },
      });
  }

  // Additional methods leveraging the new Observable API
  refreshTasks(): void {
    this.loadTasks();
  }

  loadTasksByStatus(status: TaskStatus): void {
    this.loading.set(true);

    this.taskService
      .getTasksByStatus(status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.selectedStatus.set(status);
        },
        error: (error) => {
          console.error('Failed to load tasks by status:', error);
        },
      });
  }

  loadTasksByPriority(priority: TaskPriority): void {
    this.loading.set(true);

    this.taskService
      .getTasksByPriority(priority)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.selectedPriority.set(priority);
        },
        error: (error) => {
          console.error('Failed to load tasks by priority:', error);
        },
      });
  }

  searchTasks(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.loadTasks();
      return;
    }

    this.loading.set(true);

    this.taskService
      .searchTasks(searchTerm)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.searchTerm.set(searchTerm);
        },
        error: (error) => {
          console.error('Failed to search tasks:', error);
        },
      });
  }

  private loadTasks(): void {
    this.loading.set(true);

    this.taskService
      .getTasks()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (tasks) => this.tasks.set(tasks),
        error: (error) => console.error('Failed to load tasks:', error),
      });
  }
}
