import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '@app/core/models/task.model';
import { TaskService } from '@app/core';
import { LoadingSpinner } from '@app/shared';
import { TaskItem } from '@features/tasks';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [LoadingSpinner, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);

  // Signal state
  loading = signal(true);
  tasks = signal<Task[]>([]);
  selectedStatus = signal<TaskStatus | ''>('');
  selectedPriority = signal<TaskPriority | ''>('');
  searchTerm = signal('');

  private destroy$: Subject<void> = new Subject<void>();

  // Filter options
  readonly statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.IN_REVIEW, label: 'In Review' },
    { value: TaskStatus.DONE, label: 'Done' },
  ];

  readonly priorityOptions = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.URGENT, label: 'Urgent' },
  ];

  // Computed signals
  filteredTasks = computed(() => {
    let filtered = this.tasks();

    // Filter by status
    if (this.selectedStatus()) {
      filtered = filtered.filter((task) => task.status === this.selectedStatus());
    }

    // Filter by priority
    if (this.selectedPriority()) {
      filtered = filtered.filter((task) => task.priority === this.selectedPriority());
    }

    // Filter by search term
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

    // Optional: Log changes for debugging
    effect(() => {
      console.log('Filtered tasks count:', this.filteredTasks().length);
    });
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

  async onTaskStatusChange(event: { taskId: string; status: TaskStatus }): Promise<void> {
    try {
      await this.taskService.updateTaskStatus(event.taskId, event.status);

      // Update local state
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === event.taskId
            ? { ...task, status: event.status, updatedAt: new Date() }
            : task,
        ),
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
      // In a real app, you'd show an error message
    }
  }

  onEditTask(taskId: string): void {
    console.log('Edit task:', taskId);
    // In a real app, this would open an edit dialog
  }

  async onDeleteTask(taskId: string): Promise<void> {
    try {
      await this.taskService.deleteTask(taskId);

      // Update local state
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      // In a real app, you'd show an error message
    }
  }

  private loadTasks() {
    this.loading.set(true);
    this.taskService
      .getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load tasks:', error);
          this.loading.set(false);
        },
      });
  }
}
