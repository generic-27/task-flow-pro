import { Component, computed, input, output } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '@core/models/task.model';
import { UserAvatar } from '@app/shared';

@Component({
  selector: 'app-task-item',
  imports: [UserAvatar],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  task = input.required<Task>();

  statusChange = output<{ taskId: string; status: TaskStatus }>();
  edit = output<string>();
  delete = output<string>();

  // Constants
  readonly taskStatus = TaskStatus;

  readonly statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.IN_REVIEW, label: 'In Review' },
    { value: TaskStatus.DONE, label: 'Done' },
  ];

  // Computed signals for derived values
  taskIdShort = computed(() => this.task().id.substring(0, 8));

  priorityLabel = computed(() => {
    switch (this.task().priority) {
      case TaskPriority.LOW:
        return 'Low';
      case TaskPriority.MEDIUM:
        return 'Med';
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.URGENT:
        return 'Urgent';
      default:
        return '';
    }
  });

  formattedDueDate = computed(() => {
    const dueDate = this.task().dueDate;
    if (!dueDate) return '';

    return new Date(dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  });

  // Event handlers
  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as TaskStatus;
    this.statusChange.emit({ taskId: this.task().id, status: newStatus });
  }

  onEdit(): void {
    this.edit.emit(this.task().id);
  }

  onDelete(): void {
    this.delete.emit(this.task().id);
  }

  isOverdue(): boolean {
    const currentTask = this.task();
    if (!currentTask.dueDate) return false;
    return new Date(currentTask.dueDate) < new Date() && currentTask.status !== TaskStatus.DONE;
  }
}
