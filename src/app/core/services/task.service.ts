import { Task, TaskPriority, TaskStatus, User, UserRole } from '../models/task.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  getTasks() {
    // Simulate API delay
    return new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        resolve(this.generateMockTasks());
      }, 1000);
    });
  }

  updateTaskStatus(taskId: string, status: TaskStatus) {
    console.log(`Updating task ${taskId} to status: ${status}`);
    // In a real app, this would make an HTTP call
    return Promise.resolve();
  }

  deleteTask(taskId: string) {
    console.log(`Deleting task ${taskId}`);
    return Promise.resolve();
  }

  private generateMockTasks(): Task[] {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.DEVELOPER,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: UserRole.DEVELOPER,
      },
    ];

    return [
      {
        id: 'task-001',
        title: 'Implement user authentication',
        description: 'Set up JWT-based authentication system with login and registration',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: '1',
        assignee: mockUsers[0],
        projectId: 'project-1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        dueDate: new Date('2024-02-01'),
        tags: ['authentication', 'security', 'backend'],
        estimatedHours: 16,
        actualHours: 12,
      },
      {
        id: 'task-002',
        title: 'Design task board component',
        description: 'Create responsive kanban board with drag & drop functionality',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: '2',
        assignee: mockUsers[1],
        projectId: 'project-1',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        dueDate: new Date('2024-01-30'),
        tags: ['ui', 'frontend', 'angular'],
        estimatedHours: 8,
      },
      {
        id: 'task-003',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        assigneeId: '1',
        assignee: mockUsers[0],
        projectId: 'project-1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        dueDate: new Date('2024-01-25'),
        tags: ['devops', 'automation'],
        estimatedHours: 6,
        actualHours: 8,
      },
      {
        id: 'task-004',
        title: 'Database schema optimization',
        description: 'Optimize database queries and add proper indexing',
        status: TaskStatus.IN_REVIEW,
        priority: TaskPriority.URGENT,
        projectId: 'project-1',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
        dueDate: new Date('2024-01-22'),
        tags: ['database', 'performance'],
        estimatedHours: 12,
      },
    ];
  }
}
