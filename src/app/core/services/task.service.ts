import { Task, TaskPriority, TaskStatus, User, UserRole } from '../models/task.model';
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  getTasks(): Observable<Task[]> {
    // Simulate API delay for realistic loading experience
    return of(this.generateMockTasks()).pipe(delay(2000));
  }

  updateTaskStatus(taskId: string, status: TaskStatus): Observable<void> {
    console.log(taskId, status);
    // Simulate API call with some delay
    return of(void 0).pipe(
      delay(500), // Realistic API response time
    );
  }

  deleteTask(taskId: string): Observable<void> {
    console.log(taskId);
    // Simulate API call with shorter delay for delete
    return of(void 0).pipe(delay(300));
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.generateTaskId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return of(newTask).pipe(
      delay(800), // Simulate API creation time
    );
  }

  updateTask(taskId: string, updates: Partial<Task>): Observable<Task> {
    // Find the existing task (in a real app, this would be an API call)
    const existingTasks = this.generateMockTasks();
    const existingTask = existingTasks.find((t) => t.id === taskId);

    if (!existingTask) {
      return throwError(() => new Error(`Task with ID ${taskId} not found`));
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    return of(updatedTask).pipe(delay(600));
  }

  getTaskById(taskId: string): Observable<Task> {
    console.log(`TaskService: Fetching task ${taskId}`);

    const tasks = this.generateMockTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return throwError(() => new Error(`Task with ID ${taskId} not found`));
    }

    return of(task).pipe(delay(400));
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    console.log(`TaskService: Fetching tasks with status: ${status}`);

    const tasks = this.generateMockTasks();
    const filteredTasks = tasks.filter((t) => t.status === status);

    return of(filteredTasks).pipe(delay(600));
  }

  getTasksByPriority(priority: TaskPriority): Observable<Task[]> {
    console.log(`TaskService: Fetching tasks with priority: ${priority}`);

    const tasks = this.generateMockTasks();
    const filteredTasks = tasks.filter((t) => t.priority === priority);

    return of(filteredTasks).pipe(delay(600));
  }

  getTasksByAssignee(assigneeId: string): Observable<Task[]> {
    console.log(`TaskService: Fetching tasks for assignee: ${assigneeId}`);

    const tasks = this.generateMockTasks();
    const filteredTasks = tasks.filter((t) => t.assigneeId === assigneeId);

    return of(filteredTasks).pipe(delay(600));
  }

  searchTasks(searchTerm: string): Observable<Task[]> {
    console.log(`TaskService: Searching tasks for: "${searchTerm}"`);

    if (!searchTerm.trim()) {
      return this.getTasks();
    }

    const tasks = this.generateMockTasks();
    const searchLower = searchTerm.toLowerCase();

    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );

    return of(filteredTasks).pipe(delay(400));
  }

  private generateTaskId(): string {
    return 'task-' + Math.random().toString(36).substr(2, 9);
  }

  private generateMockTasks(): Task[] {
    console.log('TaskService: Generating mock tasks...');

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

    const tasks = [
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
        description: 'Ensure all components work well on mobile devices',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: '2',
        assignee: mockUsers[1],
        projectId: 'project-1',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
        dueDate: new Date('2024-02-05'),
        tags: ['mobile', 'responsive', 'css'],
        estimatedHours: 10,
      },
      {
        id: 'task-006',
        title: 'Security vulnerability assessment',
        description: 'Conduct thorough security audit and fix vulnerabilities',
        status: TaskStatus.TODO,
        priority: TaskPriority.URGENT,
        assigneeId: '1',
        assignee: mockUsers[0],
        projectId: 'project-1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        dueDate: new Date('2024-01-28'),
        tags: ['security', 'audit', 'urgent'],
        estimatedHours: 20,
      },
    ];

    console.log('TaskService: Generated', tasks.length, 'mock tasks');
    return tasks;
  }
}
