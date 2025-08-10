import { Routes } from '@angular/router';

export const AuthShellRoutes: Routes = [
  {
    path: 'login',
    loadComponent: async () => (await import('@auth/feature')).PKLogin,
  },
  {
    path: 'register',
    loadComponent: async () => (await import('@auth/feature')).PKRegister,
  },
];
