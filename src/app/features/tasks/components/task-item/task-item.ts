import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← Add FormsModule for ngModel
import { Task, TaskPriority, TaskStatus } from '@core/models/task.model';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@app/core';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, UserAvatar], // ← Add FormsModule
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  // Modern Angular signal-based inputs and outputs
  task = input.required<Task>();

  // Signal-based outputs
  statusChange = output<{ taskId: string; status: TaskStatus }>();
  edit = output<string>();
  delete = output<string>();

  // Computed signals for safe data access
  assignee = computed(() => this.task().assignee || null);

  // Computed signal for formatted due date
  formattedDueDate = computed(() => {
    const dueDate = this.task().dueDate;
    return dueDate ? this.formatDate(dueDate) : null;
  });

  // Computed signal for overdue status
  isTaskOverdue = computed(() => {
    const dueDate = this.task().dueDate;
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && this.task().status !== TaskStatus.DONE;
  });

  // Constants
  readonly taskStatus = TaskStatus;

  readonly statusOptions = STATUS_OPTIONS;

  // ✅ FIXED: Handle ngModelChange instead of change event
  onStatusChange(newStatus: TaskStatus): void {
    console.log('🔄 Status changing from', this.task().status, 'to', newStatus);
    this.statusChange.emit({ taskId: this.task().id, status: newStatus });
  }

  onEdit(): void {
    this.edit.emit(this.task().id);
  }

  onDelete(): void {
    this.delete.emit(this.task().id);
  }

  getPriorityLabel(taskPriority: TaskPriority): string {
    return PRIORITY_OPTIONS.find((opt) => opt.taskPriority === taskPriority)?.label ?? '';
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
