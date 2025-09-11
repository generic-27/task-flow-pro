import { Routes } from '@angular/router';
import {MainContent} from './features/dashboard/main-content/main-content';
import {UserProfile} from './features/projects/user-profile/user-profile';

export const routes: Routes = [
  {
    path: '/', component: MainContent,
  },
  {
    path: 'user-profile', component: UserProfile,
  }
];
