// src/app/core/models/user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Optional avatar URL
  role?: UserRole; // Optional role for future authorization
  department?: string; // Optional department
  isActive?: boolean; // Optional status flag
  createdAt?: Date; // Optional creation timestamp
  lastLoginAt?: Date; // Optional last login tracking
}

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  QA_TESTER = 'qa_tester',
  VIEWER = 'viewer',
}

// User creation interface (for registration/creation forms)
export interface CreateUserRequest {
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  department?: string;
}

// User update interface (for profile updates)
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  department?: string;
  isActive?: boolean;
}

// User profile interface (extended user info)
export interface UserProfile extends User {
  bio?: string;
  timezone?: string;
  preferences?: UserPreferences;
  skills?: string[];
  workingHours?: WorkingHours;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weekStartsOn: 'sunday' | 'monday';
}

export interface WorkingHours {
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "17:00"
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  timezone: string;
}
