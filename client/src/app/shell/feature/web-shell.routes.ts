import { Routes } from '@angular/router';
import { PKLayout } from './layout/layout';

export const webShellRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: PKLayout,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@auth/feature').then((mod) => mod.AuthShellRoutes),
  },
];
