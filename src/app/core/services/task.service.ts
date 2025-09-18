// src/app/core/services/task.service.ts (Updated for NgRx)
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '@core/models/task.model';
import { User } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private mockTasks: Task[] = [];

  constructor() {
    this.initializeMockData();
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    console.log('🔄 TaskService.getTasks() called');
    return of([...this.mockTasks]).pipe(
      delay(800), // Simulate network delay
    );
  }

  // Get task by ID
  getTaskById(id: string): Observable<Task | undefined> {
    const task = this.mockTasks.find((t) => t.id === id);
    return of(task).pipe(delay(300));
  }

  // Create new task
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`, // Simple ID generation
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockTasks.push(newTask);
    console.log('✅ Task created:', newTask);

    return of(newTask).pipe(delay(500));
  }

  // Update task status - returns the updated task
  updateTaskStatus(taskId: string, status: TaskStatus): Observable<Task> {
    const taskIndex = this.mockTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return throwError(() => new Error(`Task with ID ${taskId} not found`));
    }

    // Update the task
    const updatedTask: Task = {
      ...this.mockTasks[taskIndex],
      status,
      updatedAt: new Date(),
    };

    this.mockTasks[taskIndex] = updatedTask;
    console.log(`✅ Task status updated: ${taskId} -> ${status}`);

    return of(updatedTask).pipe(delay(300));
  }

  // Update task - returns the updated task
  updateTask(taskId: string, changes: Partial<Task>): Observable<Task> {
    const taskIndex = this.mockTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return throwError(() => new Error(`Task with ID ${taskId} not found`));
    }

    // Update the task
    const updatedTask: Task = {
      ...this.mockTasks[taskIndex],
      ...changes,
      updatedAt: new Date(),
    };

    this.mockTasks[taskIndex] = updatedTask;
    console.log('✅ Task updated:', updatedTask);

    return of(updatedTask).pipe(delay(400));
  }

  // Delete task
  deleteTask(taskId: string): Observable<void> {
    const taskIndex = this.mockTasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return throwError(() => new Error(`Task with ID ${taskId} not found`));
    }

    this.mockTasks.splice(taskIndex, 1);
    console.log(`✅ Task deleted: ${taskId}`);

    return of(void 0).pipe(delay(300));
  }

  private initializeMockData(): void {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/40?img=1',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/40?img=2',
      },
    ];

    this.mockTasks = [
      {
        id: 'task-001',
        title: 'Implement user authentication',
        description: 'Set up JWT-based auth with login and registration',
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
        assigneeId: '',
        assignee: null,
        projectId: 'project-1',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
        dueDate: new Date('2024-01-22'),
        tags: ['database', 'performance'],
        estimatedHours: 12,
      },
      {
        id: 'task-005',
        title: 'Mobile responsive design',
        description: 'Ensure the application works perfectly on mobile devices',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: '2',
        assignee: mockUsers[1],
        projectId: 'project-1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        dueDate: new Date('2024-02-15'),
        tags: ['mobile', 'responsive', 'css'],
        estimatedHours: 10,
      },
      {
        id: 'task-006',
        title: 'Performance optimization',
        description: 'Optimize bundle size and improve loading times',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assigneeId: '1',
        assignee: mockUsers[0],
        projectId: 'project-1',
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21'),
        dueDate: new Date('2024-02-10'),
        tags: ['performance', 'optimization', 'webpack'],
        estimatedHours: 14,
      },
    ];

    console.log('📊 Mock tasks initialized:', this.mockTasks.length);
  }
}
