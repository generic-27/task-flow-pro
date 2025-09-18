// src/app/store/tasks/task.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TaskService } from '@core/services/task.service';
import { TaskActions } from '@app/store';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectTaskById } from '@app/store';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private taskService = inject(TaskService);

  // Load all tasks
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) => {
            console.error('Failed to load tasks:', error);
            return of(
              TaskActions.loadTasksFailure({
                error: error.message || 'Failed to load tasks',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Create new task
  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      switchMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError((error) => {
            console.error('Failed to create task:', error);
            return of(
              TaskActions.createTaskFailure({
                error: error.message || 'Failed to create task',
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Update task status with optimistic updates
  updateTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTaskStatus),
      switchMap(({ taskId, status }) =>
        // Get current task to store original status for potential rollback
        this.store.select(selectTaskById(taskId)).pipe(
          take(1),
          switchMap((currentTask) => {
            if (!currentTask) {
              return of(
                TaskActions.updateTaskStatusFailure({
                  error: 'Task not found',
                  taskId,
                  originalStatus: status, // fallback
                }),
              );
            }

            const originalStatus = currentTask.status;

            return this.taskService.updateTaskStatus(taskId, status).pipe(
              map((updatedTask) => TaskActions.updateTaskStatusSuccess({ task: updatedTask })),
              catchError((error) => {
                console.error('Failed to update task status:', error);
                return of(
                  TaskActions.updateTaskStatusFailure({
                    error: error.message || 'Failed to update task status',
                    taskId,
                    originalStatus,
                  }),
                );
              }),
            );
          }),
        ),
      ),
    ),
  );

  // General task update
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ taskId, changes }) =>
        this.taskService.updateTask(taskId, changes).pipe(
          map((updatedTask) => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError((error) => {
            console.error('Failed to update task:', error);
            return of(
              TaskActions.updateTaskFailure({
                error: error.message || 'Failed to update task',
                taskId,
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Delete task
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ taskId }) =>
        this.taskService.deleteTask(taskId).pipe(
          map(() => TaskActions.deleteTaskSuccess({ taskId })),
          catchError((error) => {
            console.error('Failed to delete task:', error);
            return of(
              TaskActions.deleteTaskFailure({
                error: error.message || 'Failed to delete task',
                taskId,
              }),
            );
          }),
        ),
      ),
    ),
  );

  // Log successful operations for debugging
  logSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TaskActions.loadTasksSuccess,
          TaskActions.createTaskSuccess,
          TaskActions.updateTaskSuccess,
          TaskActions.updateTaskStatusSuccess,
          TaskActions.deleteTaskSuccess,
        ),
        tap((action) => {
          console.log('✅ Task operation successful:', action.type, action);
        }),
      ),
    { dispatch: false },
  );

  // Log errors for debugging
  logErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TaskActions.loadTasksFailure,
          TaskActions.createTaskFailure,
          TaskActions.updateTaskFailure,
          TaskActions.updateTaskStatusFailure,
          TaskActions.deleteTaskFailure,
        ),
        tap((action) => {
          console.error('❌ Task operation failed:', action.type, action);
        }),
      ),
    { dispatch: false },
  );
}

// Note: You'll need to add this import to the effects file
import { take } from 'rxjs/operators';
