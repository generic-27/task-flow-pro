import {
  PriorityOptionData,
  StatusOptionData,
  TaskPriority,
  TaskStatus,
} from '@core/models/task.model';

export const TASK_CONSTANTS = {
  STATUS_OPTIONS: [
    { taskStatus: TaskStatus.TODO, label: 'To Do' },
    { taskStatus: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { taskStatus: TaskStatus.IN_REVIEW, label: 'In Review' },
    { taskStatus: TaskStatus.DONE, label: 'Done' },
  ] as const as StatusOptionData[],

  PRIORITY_OPTIONS: [
    { taskPriority: TaskPriority.LOW, label: 'Low' },
    { taskPriority: TaskPriority.MEDIUM, label: 'Medium' },
    { taskPriority: TaskPriority.HIGH, label: 'High' },
    { taskPriority: TaskPriority.URGENT, label: 'Urgent' },
  ] as const as PriorityOptionData[],

  // Add other task-related constants
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const { STATUS_OPTIONS, PRIORITY_OPTIONS } = TASK_CONSTANTS;
