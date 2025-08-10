import { Routes } from '@angular/router';

export const DashboardShellRoutes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('@dashboard/feature')).PKDashboard,
  },
];
