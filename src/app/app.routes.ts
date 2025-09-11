import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/main-content/main-content').then((c) => c.MainContent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/components/task-list/task-list').then((c) => c.TaskList),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/user-profile/user-profile').then((c) => c.UserProfile),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
