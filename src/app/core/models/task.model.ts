export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User | null; // Changed from User to User | null for consistency
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  owner: User;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project-manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

// Helper types
export type TaskStatusType = keyof typeof TaskStatus;
export type TaskPriorityType = keyof typeof TaskPriority;
export type UserRoleType = keyof typeof UserRole;
